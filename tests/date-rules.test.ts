import test from 'node:test';
import assert from 'node:assert/strict';
import { nthWeekdayOfMonth, resolveRuleDate, resolveHolidays, rruleFor } from '../src/date-rules.js';
import { holidays } from '../src/holidays.js';
import type { HolidayRule } from '../src/types.js';

const iso = (date: Date) => date.toISOString().slice(0, 10);

test('US Thanksgiving 2026 is the fourth Thursday in November', () => {
  assert.equal(iso(nthWeekdayOfMonth(2026, 11, 4, 4)), '2026-11-26');
});

test('Mothers Day 2027 is the second Sunday in May', () => {
  assert.equal(iso(nthWeekdayOfMonth(2027, 5, 0, 2)), '2027-05-09');
});

test('last Monday in May 2026 resolves correctly', () => {
  assert.equal(iso(nthWeekdayOfMonth(2026, 5, 1, -1)), '2026-05-25');
});

test('rejects invalid month, weekday, nth and missing fifth weekday', () => {
  assert.throws(() => nthWeekdayOfMonth(2026, 13, 0, 1), /month/);
  assert.throws(() => nthWeekdayOfMonth(2026, 5, 7, 1), /weekday/);
  assert.throws(() => nthWeekdayOfMonth(2026, 5, 1, 0), /nth/);
  assert.throws(() => nthWeekdayOfMonth(2021, 2, 1, 5), /There is no/);
});

test('programmers day is the 256th day in leap and non-leap years', () => {
  const rule: HolidayRule = { type: 'ordinal-day', day: 256 };
  assert.equal(iso(resolveRuleDate(rule, 2024)), '2024-09-12');
  assert.equal(iso(resolveRuleDate(rule, 2025)), '2025-09-13');
});

test('ordinal day 366 is rejected for a non-leap year', () => {
  const rule: HolidayRule = { type: 'ordinal-day', day: 366 };
  assert.throws(() => resolveRuleDate(rule, 2025), /has no day 366/);
  assert.equal(iso(resolveRuleDate(rule, 2024)), '2024-12-31');
});

test('fixed-date rule emits an open-ended yearly RRULE', () => {
  assert.equal(rruleFor({ type: 'fixed', month: 12, day: 25 }), 'FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=25');
});

test('leap-day recurrence starts at the next valid date', () => {
  const rule: HolidayRule = { type: 'fixed', month: 2, day: 29 };
  assert.throws(() => resolveRuleDate(rule, 2026), /Invalid fixed date/);
  const result = resolveHolidays([{ id: 'leap-day', name: 'Leap Day', category: 'technology', rule, enabled: true }], 2026, 2030);
  assert.equal(iso(result[0]!.date), '2028-02-29');
  assert.equal(result[0]!.rrule, 'FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=29');
});

test('lunar rules match known Chinese New Year and Laba dates', () => {
  assert.equal(iso(resolveRuleDate({ type: 'lunar', month: 1, day: 1 }, 2027)), '2027-02-06');
  assert.equal(iso(resolveRuleDate({ type: 'lunar', month: 1, day: 1 }, 2026)), '2026-02-17');
  assert.equal(iso(resolveRuleDate({ type: 'lunar', month: 12, day: 8 }, 2026)), '2027-01-15');
});

test('catalogue entries have unique IDs and resolution includes the requested Gregorian year range', () => {
  assert.equal(holidays.filter((holiday) => holiday.enabled).length, 26);
  assert.equal(new Set(holidays.map((holiday) => holiday.id)).size, holidays.length);
  const resolved = resolveHolidays(holidays, 2026, 2046);
  assert.ok(resolved.length >= 140, 'Expected a 21-year calendar, got ' + resolved.length + ' events');
  assert.ok(resolved.every((item) => item.date.getUTCFullYear() >= 2026 && item.date.getUTCFullYear() <= 2046));
});
