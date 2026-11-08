import { boundedRequest } from "./body.mjs";
export { boundedRequest } from "./body.mjs";
import { configuration, sameOrigin, clientAddress } from "./config.mjs";
import {
  database,
  hash,
  priorSubmission,
  persistSubmission,
  consumeLimit,
} from "./database.mjs";
import { storeUpload, removeUploads } from "./files.mjs";
import { verifyCaptcha } from "./captcha.mjs";
import {
  emptyMembershipValues,
  validateMembershipStep,
  membershipSteps,
  type MembershipValues,
  type MembershipDocuments,
} from "../domain/membership";
import {
  emptyRegistrationValues,
  validateRegistration,
  type RegistrationValues,
} from "../domain/registration";
import {
  emptyContactValues,
  validateContact,
  type ContactValues,
} from "../domain/contact";
export const submissionTypes = ["MEMBERSHIP", "CONF-REG", "ENQUIRY"] as const;
export type SubmissionType = (typeof submissionTypes)[number];
function json(value: unknown, status = 200) {
  return Response.json(value, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
function reject(
  message: string,
  status = 400,
  fieldErrors?: Record<string, string>,
) {
  return json({ status: "rejected", message, fieldErrors }, status);
}
function receipt(record: {
  reference: string;
  created_at: string;
  values_json: string;
}) {
  const values = JSON.parse(record.values_json);
  return {
    reference: record.reference,
    submittedAt: record.created_at,
    category: values.category,
    acknowledgementEmail: "pending",
  };
}
export async function handleSubmission(
  request: Request,
  type: string,
  dependencies: {
    config?: ReturnType<typeof configuration>;
    captcha?: typeof verifyCaptcha;
    scanner?: Parameters<typeof storeUpload>[4];
  } = {},
) {
  const config = dependencies.config ?? configuration();
  if (!submissionTypes.includes(type as SubmissionType))
    return json(
      {
        status: "unavailable",
        message: "This submission type is not yet available on this website.",
      },
      503,
    );
  if (!config.enabled || (type !== "ENQUIRY" && !config.scanner))
    return json(
      {
        status: "unavailable",
        message:
          "Your submission has not been sent. Online submission is awaiting configuration. Your entered details remain available.",
      },
      503,
    );
  if (!sameOrigin(request, config))
    return reject("This request could not be verified.", 403);
  const db = database(config.storage);
  const address = clientAddress(request, config);
  if (
    !consumeLimit(db, config.storage, `submit:${address}`, 10) ||
    !consumeLimit(db, config.storage, "submit:global", 200)
  )
    return reject("Too many attempts. Please try again later.", 429);
  let form: FormData;
  try {
    const bounded = await boundedRequest(
      request,
      type === "ENQUIRY" ? 20000 : 7 * 1048576,
    );
    form = await bounded.formData();
  } catch {
    return reject(
      "The submission is empty, too large or could not be read.",
      413,
    );
  }
  const requestId = form.get("requestId");
  const token = form.get("captchaToken");
  const honey = form.get("website");
  if (
    typeof requestId !== "string" ||
    !/^[a-f0-9-]{36}$/i.test(requestId) ||
    typeof token !== "string" ||
    honey !== "" ||
    [...form.keys()].length > 8
  )
    return reject("This request could not be verified.");
  const allowed = new Set([
    "requestId",
    "captchaToken",
    "website",
    "values",
    ...(type === "MEMBERSHIP"
      ? ["photo", "studentProof", "receipt"]
      : type === "CONF-REG"
        ? ["receipt"]
        : []),
  ]);
  if (
    [...form.keys()].some((key) => !allowed.has(key)) ||
    [...new Set(form.keys())].some((key) => form.getAll(key).length !== 1)
  )
    return reject("Unexpected or duplicate submission fields.");
  const template =
    type === "MEMBERSHIP"
      ? emptyMembershipValues
      : type === "CONF-REG"
        ? emptyRegistrationValues
        : emptyContactValues;
  let values: Record<string, string | boolean>;
  try {
    const raw = form.get("values");
    if (typeof raw !== "string" || raw.length > 15000) throw 0;
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      Array.isArray(parsed) ||
      typeof parsed !== "object" ||
      Object.keys(parsed).some((key) => !Object.hasOwn(template, key))
    )
      throw 0;
    values = { ...template };
    for (const [key, fallback] of Object.entries(template)) {
      const value = parsed[key] ?? fallback;
      if (typeof value !== typeof fallback) throw 0;
      if (typeof value === "string") {
        if (
          /[\u0000-\u0008\u000b-\u001f\u007f]/.test(value) ||
          (!["message", "address"].includes(key) && /[\r\n]/.test(value))
        )
          throw 0;
        if (
          value.length > (key === "message" || key === "address" ? 2000 : 500)
        )
          throw 0;
        values[key] = value.trim();
      } else values[key] = value;
    }
  } catch {
    return reject("Check the submitted fields and try again.");
  }
  const files: MembershipDocuments = {
    photo: null,
    studentProof: null,
    receipt: null,
  };
  for (const kind of ["photo", "studentProof", "receipt"] as const) {
    const value = form.get(kind);
    if (value instanceof File) files[kind] = value;
  }
  const errors =
    type === "MEMBERSHIP"
      ? Object.assign(
          {},
          ...membershipSteps.map((_, index) =>
            validateMembershipStep(index, values as MembershipValues, files),
          ),
        )
      : type === "CONF-REG"
        ? validateRegistration(values as RegistrationValues, files.receipt)
        : validateContact(values as ContactValues);
  if (Object.keys(errors).length)
    return reject("Please correct the highlighted fields.", 400, errors);
  if (
    type === "MEMBERSHIP" &&
    values.category !== "Student" &&
    files.studentProof
  )
    return reject("Student proof is not applicable to this category.");
  const signatures: Record<string, string> = {};
  for (const [kind, file] of Object.entries(files)) {
    if (file) signatures[kind] = hash(Buffer.from(await file.arrayBuffer()));
  }
  const fingerprint = hash(JSON.stringify({ type, values, files: signatures }));
  const prior = priorSubmission(db, requestId);
  if (prior) {
    if (prior.fingerprint !== fingerprint)
      return reject(
        "A previous attempt with this reference was saved with different details. Contact the Secretary before submitting another application.",
        409,
      );
    return json({ status: "accepted", receipt: receipt(prior) });
  }
  if (
    !(await (dependencies.captcha ?? verifyCaptcha)(token, requestId, config))
  )
    return reject(
      "The spam check expired or could not be verified. Please retry the check.",
    );
  const stored: Awaited<ReturnType<typeof storeUpload>>[] = [];
  try {
    for (const [kind, file] of Object.entries(files))
      if (file)
        stored.push(
          await storeUpload(
            config.storage,
            file,
            kind,
            config,
            dependencies.scanner,
          ),
        );
    const result = persistSubmission(db, {
      requestId,
      fingerprint,
      type,
      values,
      files: stored,
    });
    if (!result.created) await removeUploads(config.storage, stored);
    return json(
      { status: "accepted", receipt: receipt(result.record) },
      result.created ? 201 : 200,
    );
  } catch {
    await removeUploads(config.storage, stored).catch(() => {});
    return reject(
      "Your submission could not be confirmed. Check document formats and try again, or contact the Secretary.",
      503,
    );
  }
}
