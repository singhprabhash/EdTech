import { connection } from "next/server";
import { cookies } from "next/headers";
import { configuration } from "../../server/config.mjs";
import { COOKIE, adminConfigured, session } from "../../server/auth.mjs";
import AdminConsole from "../../components/admin/console";
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ submission?: string }>;
}) {
  await connection();
  const config = configuration();
  const jar = await cookies();
  const target = (await searchParams).submission;
  const initialSubmission =
    target && /^[a-f0-9-]{36}$/.test(target) ? target : undefined;
  const request = new Request(config.origin || "http://localhost", {
    headers: { cookie: `${COOKIE}=${jar.get(COOKIE)?.value || ""}` },
  });
  return (
    <main id="main" className="admin-console">
      <h1>Secretary administration</h1>
      {adminConfigured(config) ? (
        <AdminConsole
          signedIn={Boolean(session(request, config))}
          initialSubmission={initialSubmission}
        />
      ) : (
        <p>
          Administration is unavailable until the site operator configures
          secure storage, the site origin and the administrator password hash.
        </p>
      )}
    </main>
  );
}
