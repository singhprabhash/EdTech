import { expect, it } from "vitest";
import { isPlainMailbox } from "../../src/shared/email.mjs";
it("accepts a single plain mailbox and rejects display names, lists and header delimiters", () => {
  for (const value of ["person@example.test", "first.last+tag@example.test"])
    expect(isPlainMailbox(value)).toBe(true);
  for (const value of [
    '"Name"<user@example.com>',
    "victim@example.com,other",
    "person@example.com;victim@example.com",
    "person@example.com\nBcc: victim@example.com",
    ".first@example.com",
    "two..dots@example.com",
    "x@-invalid.test",
  ])
    expect(isPlainMailbox(value), value).toBe(false);
});
