export type SubmissionSecurity = {
  enabled: boolean;
  token: string;
  honeypot: string;
  requestId: string;
};
export async function postSubmission(
  type: string,
  values: object,
  files: Record<string, File | null>,
  security: SubmissionSecurity,
) {
  if (!security.token)
    return {
      status: "rejected" as const,
      message: "The spam check is not ready. Please retry the check.",
    };
  const body = new FormData();
  body.set("values", JSON.stringify(values));
  body.set("requestId", security.requestId);
  body.set("captchaToken", security.token);
  body.set("website", security.honeypot);
  for (const [kind, file] of Object.entries(files))
    if (file) body.set(kind, file);
  const response = await fetch(`/api/submissions/${type}`, {
    method: "POST",
    body,
    credentials: "same-origin",
  });
  const result: unknown = await response.json();
  if (
    !result ||
    typeof result !== "object" ||
    !("status" in result) ||
    !["accepted", "rejected", "unavailable"].includes(String(result.status))
  )
    throw new Error("Invalid submission response");
  if (result.status === "accepted" && !response.ok)
    throw new Error("Receipt was not confirmed by the server.");
  return result;
}
