import { expect, it } from "vitest";
import { submitMembership } from "../../src/services/membership";
import {
  emptyMembershipValues,
  emptyMembershipDocuments,
} from "../../src/domain/membership";
it("returns an explicit unavailable result from the unconnected production adapter", async () => {
  const result = await submitMembership({
    values: emptyMembershipValues,
    documents: emptyMembershipDocuments,
  });
  expect(result.status).toBe("unavailable");
  if (result.status !== "accepted")
    expect(result.message).toContain("has not been sent");
  expect(result).not.toHaveProperty("receipt");
});
