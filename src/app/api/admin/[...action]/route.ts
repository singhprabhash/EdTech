import { boundedRequest } from "../../../../server/body.mjs";
import fs from "node:fs/promises";
import { configuration } from "../../../../server/config.mjs";
import { database } from "../../../../server/database.mjs";
import {
  AdminError,
  adminResponse,
  boundedJSON,
  login,
  logout,
  requireAdmin,
  requireOrigin,
} from "../../../../server/auth.mjs";
import {
  contentFields,
  getContent,
  saveContent,
} from "../../../../server/content.mjs";
import { contentDefaults } from "../../../../server/content-defaults";
import {
  privateFilePath,
  storeUpload,
  removeUploads,
} from "../../../../server/files.mjs";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ action: string[] }> };
async function handle(request: Request, context: Context) {
  const config = configuration();
  try {
    const { action } = await context.params;
    const route = action.join("/");
    if (request.method === "POST" && route === "login") {
      const body = await boundedJSON(request, 4096);
      return adminResponse({ ok: true }, 200, {
        "Set-Cookie": login(request, body.password, config),
      });
    }
    requireAdmin(request, config);
    if (request.method !== "GET") requireOrigin(request, config);
    if (request.method === "POST" && route === "logout")
      return adminResponse({ ok: true }, 200, {
        "Set-Cookie": logout(request, config),
      });
    const db = database(config.storage);
    if (
      action[0] === "content" &&
      action.length === 2 &&
      Object.hasOwn(contentFields, action[1])
    ) {
      const kind = action[1] as keyof typeof contentDefaults;
      if (request.method === "GET")
        return adminResponse(getContent(kind, contentDefaults[kind], config));
      if (request.method === "PUT") {
        const body = await boundedJSON(request);
        return adminResponse(
          saveContent(kind, body.items, body.version, config),
        );
      }
    }
    if (route === "submissions" && request.method === "GET") {
      const url = new URL(request.url);
      const offset = Math.max(
        0,
        Math.min(1000000, Number(url.searchParams.get("offset")) || 0),
      );
      return adminResponse({
        items: db
          .prepare(
            "SELECT id,reference,type,created_at FROM submissions ORDER BY created_at DESC LIMIT 50 OFFSET ?",
          )
          .all(offset),
        offset,
      });
    }
    if (
      action[0] === "submissions" &&
      action.length === 2 &&
      request.method === "GET"
    ) {
      const record = db
        .prepare(
          "SELECT id,reference,type,values_json,created_at FROM submissions WHERE id=?",
        )
        .get(action[1]) as { id: string; values_json: string } | undefined;
      if (!record) throw new AdminError("Submission not found.", 404);
      const { values_json, ...info } = record;
      return adminResponse({
        ...info,
        values: JSON.parse(values_json),
        files: db
          .prepare("SELECT id,kind,mime,size FROM files WHERE submission_id=?")
          .all(record.id),
        mail: db
          .prepare(
            "SELECT kind,status,attempts,next_at,last_code FROM outbox WHERE submission_id=?",
          )
          .all(record.id),
      });
    }
    if (
      action[0] === "submissions" &&
      action.length === 3 &&
      action[2] === "retry" &&
      request.method === "POST"
    ) {
      const changed = db
        .prepare(
          "UPDATE outbox SET status='pending',attempts=0,next_at=0,lease_at=NULL,lease_token=NULL WHERE submission_id=? AND status='failed'",
        )
        .run(action[1]);
      return adminResponse({ queued: Number(changed.changes) });
    }
    if (
      action[0] === "files" &&
      action.length === 2 &&
      request.method === "GET"
    ) {
      const file = db
        .prepare("SELECT storage_key,mime FROM files WHERE id=?")
        .get(action[1]) as { storage_key: string; mime: string } | undefined;
      if (!file) throw new AdminError("File not found.", 404);
      const bytes = await fs.readFile(
        privateFilePath(config.storage, file.storage_key),
      );
      db.prepare("INSERT INTO audit(event,created_at) VALUES(?,?)").run(
        "admin.private-file.download",
        new Date().toISOString(),
      );
      return new Response(bytes, {
        headers: {
          "Content-Type": file.mime,
          "Content-Disposition": `attachment; filename="attachment.${file.storage_key.split(".").pop()}"`,
          "Cache-Control": "private, no-store",
          "X-Robots-Tag": "noindex, nofollow",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
    if (route === "assets" && request.method === "POST") {
      if (
        !request.headers.get("content-type")?.startsWith("multipart/form-data;")
      )
        throw new AdminError("Choose a file upload.", 415);
      let form: FormData;
      try {
        form = await (await boundedRequest(request, 11 * 1048576)).formData();
      } catch {
        throw new AdminError("Upload is too large or could not be read.", 413);
      }
      const file = form.get("file");
      if (!(file instanceof File) || [...form.keys()].length !== 1)
        throw new AdminError("Choose one image, PDF or DOCX file.");
      const asset = await storeUpload(config.storage, file, "asset", config);
      try {
        db.prepare(
          "INSERT INTO assets(id,storage_key,mime,size,sha256) VALUES(?,?,?,?,?)",
        ).run(
          asset.id,
          asset.storage_key,
          asset.mime,
          asset.size,
          asset.sha256,
        );
      } catch (error) {
        await removeUploads(config.storage, [asset]);
        throw error;
      }
      db.prepare("INSERT INTO audit(event,created_at) VALUES(?,?)").run(
        "admin.asset.upload",
        new Date().toISOString(),
      );
      return adminResponse(
        { id: asset.id, href: `/media/${asset.id}`, mime: asset.mime },
        201,
      );
    }
    throw new AdminError("Not found.", 404);
  } catch (error) {
    return adminResponse(
      {
        error:
          error instanceof AdminError
            ? error.message
            : "Administration is temporarily unavailable.",
      },
      error instanceof AdminError ? error.status : 503,
    );
  }
}
export const GET = handle;
export const POST = handle;
export const PUT = handle;
