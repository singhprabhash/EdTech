import { randomUUID } from "node:crypto";
import nodemailer from "nodemailer";
import { readFile } from "node:fs/promises";
import { RECIPIENT } from "./config.mjs";
import { privateFilePath } from "./files.mjs";
export function smtpTransport(config) {
  if (!config.smtp) throw new Error("SMTP unavailable");
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    requireTLS: true,
    auth: { user: config.smtp.user, pass: config.smtp.password },
    connectionTimeout: 10000,
    socketTimeout: 20000,
    tls: { rejectUnauthorized: true },
  });
}
/** @param {any} db @param {any} config @param {{sendMail:(message:any)=>Promise<any>}} [transport] @param {number} [now] */
export async function deliverOutbox(
  db,
  config,
  transport = smtpTransport(config),
  now,
) {
  const currentTime = () => now ?? Date.now();
  const started = currentTime();
  const due = db
    .prepare(
      "SELECT * FROM outbox WHERE (status IN ('pending','failed') AND next_at<=? AND attempts<8) OR (status='processing' AND lease_at<?) ORDER BY next_at LIMIT 20",
    )
    .all(started, started - 120000);
  let sent = 0,
    failed = 0;
  for (const task of due) {
    const claimTime = currentTime(),
      owner = randomUUID();
    const claimed = db
      .prepare(
        "UPDATE outbox SET status='processing',lease_at=?,lease_token=?,attempts=attempts+1 WHERE id=? AND ((status IN ('pending','failed') AND next_at<=?) OR (status='processing' AND lease_at<?))",
      )
      .run(claimTime, owner, task.id, claimTime, claimTime - 120000);
    if (!claimed.changes) continue;
    try {
      const record = db
        .prepare("SELECT * FROM submissions WHERE id=?")
        .get(task.submission_id);
      if (!record) throw new Error("MISSING_RECORD");
      const values = JSON.parse(record.values_json);
      const email = values.email;
      const author =
        values.fullName ||
        values.nomineeName ||
        values.contactPerson ||
        "Applicant";
      const notification = task.kind === "notification";
      const files = db
        .prepare("SELECT * FROM files WHERE submission_id=?")
        .all(record.id);
      const total = files.reduce((n, file) => n + file.size, 0);
      const attach = notification && total <= 14 * 1048576;
      const attachments = attach
        ? await Promise.all(
            files.map(async (file) => ({
              filename: `${file.kind}.${file.storage_key.split(".").pop()}`,
              content: await readFile(
                privateFilePath(config.storage, file.storage_key),
              ),
              contentType: file.mime,
            })),
          )
        : [];
      const details = Object.entries(values)
        .map(([key, value]) => `${key}: ${String(value)}`)
        .join("\n");
      const secureLink = `${config.origin}/admin?submission=${record.id}`;
      const text = notification
        ? `Reference: ${record.reference}\nReceived: ${record.created_at}\n\n${details}\n\n${files.length ? (attach ? "Documents attached." : `Private documents require Secretary login: ${secureLink}`) : "No documents supplied."}`
        : `Dear ${author},\n\nThank you. We have received your ${record.type.toLowerCase()} submission. Your reference is ${record.reference}. Please quote it in all correspondence.\n\nThe Secretary's office will review your submission. For questions, reply to this email or write to ${RECIPIENT}. Receipt does not confirm payment, membership, acceptance of a paper or an award.\n\nAEETDS, Lucknow`;
      const result = await transport.sendMail({
        from: { name: "AEETDS", address: config.smtp.from },
        to: notification ? RECIPIENT : email,
        replyTo: notification ? email : RECIPIENT,
        subject: notification
          ? `[${record.type}] ${values.subject || values.category || values.fullName || record.type} — ${record.reference}`
          : `AEETDS – We have received your submission (Ref. ${record.reference})`,
        text,
        attachments,
        messageId: `<${task.id}@${new URL(config.origin).hostname}>`,
        disableFileAccess: true,
        disableUrlAccess: true,
      });
      if (
        !result.accepted?.some(
          (address) =>
            String(address).toLowerCase() ===
            (notification ? RECIPIENT : email).toLowerCase(),
        )
      )
        throw new Error("SMTP_NOT_ACCEPTED");
      db.prepare(
        "UPDATE outbox SET status='sent',last_code=NULL,lease_at=NULL,lease_token=NULL WHERE id=? AND lease_token=?",
      ).run(task.id, owner);
      sent++;
    } catch {
      db.prepare(
        "UPDATE outbox SET status='failed',last_code='DELIVERY_FAILED',next_at=?,lease_at=NULL,lease_token=NULL WHERE id=? AND lease_token=?",
      ).run(
        currentTime() + Math.min(3600000, 60000 * 2 ** task.attempts),
        task.id,
        owner,
      );
      failed++;
    }
  }
  return { sent, failed };
}
