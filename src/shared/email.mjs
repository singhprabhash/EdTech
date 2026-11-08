/** A single plain mailbox, never an RFC display-name or recipient list. */
export function isPlainMailbox(value) {
  if (typeof value !== "string") return false;
  const email = value.trim();
  if (
    email.length > 254 ||
    /[\s<>,;:"\\]/.test(email) ||
    email.split("@").length !== 2
  )
    return false;
  const [local, domain] = email.split("@");
  return (
    local.length > 0 &&
    local.length <= 64 &&
    /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+$/.test(local) &&
    !local.startsWith(".") &&
    !local.endsWith(".") &&
    !local.includes("..") &&
    domain.includes(".") &&
    domain
      .split(".")
      .every(
        (label) =>
          label.length > 0 &&
          label.length <= 63 &&
          /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label),
      )
  );
}
