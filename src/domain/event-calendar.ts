export type CalendarMonth = { year: number; month: number };
export type DatedConference = { startDate?: string; endDate?: string };
export function shiftMonth(
  value: CalendarMonth,
  offset: number,
): CalendarMonth {
  const date = new Date(Date.UTC(value.year, value.month + offset, 1));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() };
}
export function calendarCells(value: CalendarMonth): (number | null)[] {
  const first = new Date(Date.UTC(value.year, value.month, 1)).getUTCDay();
  const days = new Date(Date.UTC(value.year, value.month + 1, 0)).getUTCDate();
  return Array.from(
    { length: Math.ceil((first + days) / 7) * 7 },
    (_, index) =>
      index < first || index >= first + days ? null : index - first + 1,
  );
}
export function calendarDate(value: CalendarMonth, day: number): string {
  return `${value.year}-${String(value.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
export function conferencesOnDate<T extends DatedConference>(
  date: string,
  conferences: readonly T[],
): T[] {
  return conferences.filter(
    (item) =>
      item.startDate &&
      item.endDate &&
      date >= item.startDate &&
      date <= item.endDate,
  );
}
