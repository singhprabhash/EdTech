import { handleSubmission } from "../../../../server/submissions";
export const runtime = "nodejs";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  try {
    return await handleSubmission(request, (await params).type);
  } catch {
    return Response.json(
      {
        status: "unavailable",
        message:
          "Submission could not be confirmed. Your entered details remain available. Please try again later.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
