import { publicContent } from "../../../server/public-content";
export const dynamic = "force-dynamic";
export function GET() {
  try {
    return Response.json(publicContent(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      { message: "Content is temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
