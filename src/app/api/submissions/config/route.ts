import { publicSubmissionConfiguration } from "../../../../server/config.mjs";
export const dynamic = "force-dynamic";
export function GET() {
  return Response.json(publicSubmissionConfiguration(), {
    headers: { "Cache-Control": "no-store" },
  });
}
