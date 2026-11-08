import { expect, it } from "vitest";
import {
  shiftMonth,
  calendarCells,
  calendarDate,
  conferencesOnDate,
} from "../../src/domain/event-calendar";
it("rolls month and year correctly in both directions", () => {
  expect(shiftMonth({ year: 2026, month: 11 }, 1)).toEqual({
    year: 2027,
    month: 0,
  });
  expect(shiftMonth({ year: 2026, month: 0 }, -1)).toEqual({
    year: 2025,
    month: 11,
  });
  expect(shiftMonth({ year: 2026, month: 0 }, 25)).toEqual({
    year: 2028,
    month: 1,
  });
});
it("aligns Sunday-first weekdays and supports leap years", () => {
  const july = calendarCells({ year: 2026, month: 6 });
  expect(july.slice(0, 4)).toEqual([null, null, null, 1]);
  expect(july.filter(Boolean)).toHaveLength(31);
  expect(july.length % 7).toBe(0);
  expect(calendarCells({ year: 2024, month: 1 }).filter(Boolean)).toHaveLength(
    29,
  );
  expect(calendarCells({ year: 2025, month: 1 }).filter(Boolean)).toHaveLength(
    28,
  );
});
it("formats ISO date keys and matches confirmed inclusive ranges only", () => {
  expect(calendarDate({ year: 2026, month: 6 }, 5)).toBe("2026-07-05");
  const events = [
    { slug: "confirmed", startDate: "2026-07-15", endDate: "2026-07-16" },
    { slug: "upcoming" },
    { slug: "other", startDate: "2025-09-25", endDate: "2025-09-26" },
  ];
  expect(
    conferencesOnDate("2026-07-15", events).map((event) => event.slug),
  ).toEqual(["confirmed"]);
  expect(
    conferencesOnDate("2026-07-16", events).map((event) => event.slug),
  ).toEqual(["confirmed"]);
  expect(conferencesOnDate("2026-07-17", events)).toEqual([]);
  expect(conferencesOnDate("2026-11-07", events)).toEqual([]);
});
