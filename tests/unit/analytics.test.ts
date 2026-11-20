import { expect, it } from "vitest";
import { publicPageview } from "../../src/domain/analytics";
import { publicSocietyRoutes } from "../../src/config/seo";
const paths = new Set<string>(publicSocietyRoutes);
it("removes query and fragment data while retaining the public page identity", () => {
  const event = {
    type: "pageview" as const,
    url: "https://www.aeetds.com/events?email=person%40example.test&submission=private#reference",
  };
  expect(publicPageview(event, paths)).toEqual({
    type: "pageview",
    url: "https://www.aeetds.com/events",
  });
  expect(event.url).toContain("email=");
});
it("drops private, application, retired and unknown paths instead of reporting identifiers", () => {
  for (const path of [
    "/admin?submission=secret",
    "/api/submissions/MEMBERSHIP",
    "/membership/apply",
    "/membership/acknowledgement?reference=private",
    "/submit/registration",
    "/books",
    "/people/person@example.test",
  ])
    expect(
      publicPageview(
        { type: "pageview", url: `https://www.aeetds.com${path}` },
        paths,
      ),
    ).toBeNull();
});
it("rejects custom events, malformed URLs and credentials", () => {
  expect(
    publicPageview({ type: "event", url: "https://www.aeetds.com/" }, paths),
  ).toBeNull();
  for (const url of [
    "invalid",
    "javascript:alert(1)",
    "https://user:secret@www.aeetds.com/",
  ])
    expect(publicPageview({ type: "pageview", url }, paths)).toBeNull();
});
