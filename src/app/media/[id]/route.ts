import fs from "node:fs/promises";
import { configuration } from "../../../server/config.mjs";
import { publishedAsset } from "../../../server/content.mjs";
import { privateFilePath } from "../../../server/files.mjs";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const config = configuration();
    const { id } = await context.params;
    const asset = publishedAsset(id, config);
    if (!asset)
      return new Response("Not found", {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      });
    const bytes = await fs.readFile(
      privateFilePath(config.storage, asset.storage_key),
    );
    return new Response(bytes, {
      headers: {
        "Content-Type": asset.mime,
        "Content-Length": String(bytes.length),
        "Content-Disposition": `${asset.mime.startsWith("image/") ? "inline" : "attachment"}; filename="society-document.${asset.storage_key.split(".").pop()}"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
      },
    });
  } catch {
    return new Response("Not found", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
