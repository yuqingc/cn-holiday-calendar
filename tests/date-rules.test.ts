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
  assert.equal(holidays.filter((holiday) => holiday.enabled).length, 30);
  assert.equal(new Set(holidays.map((holiday) => holiday.id)).size, holidays.length);
  const resolved = resolveHolidays(holidays, 2026, 2046);
  assert.ok(resolved.length >= 140, 'Expected a 21-year calendar, got ' + resolved.length + ' events');
  assert.ok(resolved.every((item) => item.date.getUTCFullYear() >= 2026 && item.date.getUTCFullYear() <= 2046));
});


test('catalogue uses the requested holiday labels and excludes removed holidays', () => {
  const byId = new Map(holidays.map((holiday) => [holiday.id, holiday]));
  assert.equal(byId.get('consumer-rights-day')?.name, '国际消费者权益日（3·15）');
  assert.equal(byId.get('tree-planting-day-cn')?.name, '植树节');
  assert.equal(byId.get('world-book-day')?.name, '世界读书日');
  assert.equal(byId.get('earth-day')?.name, '世界地球日');
  assert.equal(byId.get('nurses-day')?.name, '国际护士节');
  assert.equal(byId.has('youth-day-cn'), false);
  assert.equal(byId.has('pi-day'), false);
  assert.equal(byId.get('halloween')?.name, '万圣夜');
  assert.equal(byId.get('christmas-eve')?.name, '平安夜');
  assert.equal(byId.get('programmers-day')?.name, '程序员节');
  assert.equal(byId.get('victory-of-resistance-war-day')?.name, '中国人民抗日战争胜利纪念日暨世界反法西斯战争胜利纪念日');
  assert.equal(byId.get('september-18-incident-day')?.name, '九一八事变纪念日');
  assert.equal(byId.get('world-oceans-day')?.name, '世界海洋日');
  assert.equal(byId.get('cpc-founding-anniversary')?.name, '中国共产党成立纪念日');
});

test('new March observances resolve to their correct Gregorian dates', () => {
  const consumerDay = holidays.find((holiday) => holiday.id === 'consumer-rights-day')!;
  const treeDay = holidays.find((holiday) => holiday.id === 'tree-planting-day-cn')!;
  assert.equal(iso(resolveRuleDate(consumerDay.rule, 2027)), '2027-03-15');
  assert.equal(iso(resolveRuleDate(treeDay.rule, 2027)), '2027-03-12');
});

test('new September, June and July observances resolve to their fixed Gregorian dates', () => {
  const byId = new Map(holidays.map((holiday) => [holiday.id, holiday]));
  assert.equal(iso(resolveRuleDate(byId.get('victory-of-resistance-war-day')!.rule, 2027)), '2027-09-03');
  assert.equal(iso(resolveRuleDate(byId.get('september-18-incident-day')!.rule, 2027)), '2027-09-18');
  assert.equal(iso(resolveRuleDate(byId.get('world-oceans-day')!.rule, 2027)), '2027-06-08');
  assert.equal(iso(resolveRuleDate(byId.get('cpc-founding-anniversary')!.rule, 2027)), '2027-07-01');
});
