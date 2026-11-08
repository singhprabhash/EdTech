import { isPlainMailbox } from "../shared/email.mjs";
import path from "node:path";
export const RECIPIENT = "secretaryaeetds@gmail.com";
/** @param {Record<string, string | undefined>} [env] */
export function configuration(env = process.env) {
  const issues = [];
  let origin;
  try {
    const url = new URL(env.AEETDS_SITE_URL ?? "");
    if (
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      url.username ||
      url.password
    )
      throw 0;
    if (
      url.protocol !== "https:" &&
      !(
        env.AEETDS_ALLOW_LOCAL_HTTP === "true" &&
        ["localhost", "127.0.0.1"].includes(url.hostname) &&
        url.protocol === "http:"
      )
    )
      throw 0;
    origin = url.origin;
  } catch {
    issues.push("AEETDS_SITE_URL");
  }
  const directory = env.AEETDS_DATA_DIR;
  if (
    !directory ||
    !path.isAbsolute(directory) ||
    path.resolve(directory) === path.parse(directory).root ||
    path.resolve(directory) === path.resolve(process.cwd()) ||
    path.resolve(directory).startsWith(path.resolve(process.cwd()) + path.sep)
  )
    issues.push("AEETDS_DATA_DIR");
  const secret = env.AEETDS_APP_SECRET;
  if (!secret || secret.length < 32) issues.push("AEETDS_APP_SECRET");
  const storage =
    issues.includes("AEETDS_DATA_DIR") || issues.includes("AEETDS_APP_SECRET")
      ? null
      : { directory: path.resolve(directory), secret };
  const smtp = {
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    user: env.SMTP_USER,
    password: env.SMTP_PASSWORD,
    from: env.SMTP_FROM,
  };
  const smtpReady = Boolean(
    smtp.host &&
    [465, 587].includes(smtp.port) &&
    smtp.user &&
    smtp.password &&
    isPlainMailbox(smtp.from) &&
    !Object.values(smtp).some(
      (value) => typeof value === "string" && /[\r\n]/.test(value),
    ),
  );
  const captcha =
    env.TURNSTILE_SECRET_KEY && env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
      ? {
          secret: env.TURNSTILE_SECRET_KEY,
          siteKey: env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        }
      : null;
  const enabled =
    env.AEETDS_SUBMISSIONS_ENABLED === "true" &&
    Boolean(origin && storage && smtpReady && captcha);
  return {
    origin,
    storage,
    smtp: smtpReady ? smtp : null,
    captcha,
    enabled,
    scanner:
      env.AEETDS_CLAMDSCAN_PATH && path.isAbsolute(env.AEETDS_CLAMDSCAN_PATH)
        ? env.AEETDS_CLAMDSCAN_PATH
        : null,
    trustProxy: env.AEETDS_TRUST_PROXY === "true",
    adminHash: env.AEETDS_ADMIN_PASSWORD_HASH ?? "",
    localHttp: env.AEETDS_ALLOW_LOCAL_HTTP === "true",
    issues,
  };
}
export function publicSubmissionConfiguration(config = configuration()) {
  return {
    enabled: config.enabled,
    uploadsEnabled: config.enabled && Boolean(config.scanner),
    siteKey: config.enabled ? config.captcha.siteKey : null,
  };
}
export function sameOrigin(request, config) {
  return Boolean(
    config.origin && request.headers.get("origin") === config.origin,
  );
}
export function clientAddress(request, config) {
  return config.trustProxy
    ? request.headers
        .get("x-forwarded-for")
        ?.split(",")[0]
        ?.trim()
        .slice(0, 100) || "anonymous"
    : "anonymous";
}
