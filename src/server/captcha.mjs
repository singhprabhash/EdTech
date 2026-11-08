export async function verifyCaptcha(token, requestId, config, fetcher = fetch) {
  if (
    !config.captcha ||
    typeof token !== "string" ||
    !token ||
    token.length > 2048
  )
    return false;
  try {
    const response = await fetcher(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: config.captcha.secret,
          response: token,
          idempotency_key: requestId,
        }),
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) return false;
    const value = await response.json();
    return (
      value.success === true &&
      value.hostname === new URL(config.origin).hostname &&
      value.action === "aeetds_submit" &&
      value.cdata === requestId
    );
  } catch {
    return false;
  }
}
