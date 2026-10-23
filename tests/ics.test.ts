import test from 'node:test';
import assert from 'node:assert/strict';
import { generateIcs, escapeText, foldLine } from '../src/ics.js';
import { resolveHolidays } from '../src/date-rules.js';
import { holidays } from '../src/holidays.js';
import { validateIcs, validateCatalogue } from '../src/validate.js';

const fixedStamp = new Date('2026-01-01T00:00:00Z');

test('escapes backslash, line breaks, commas and semicolons', () => {
  assert.equal(escapeText('a\\b, c; d\r\ne\rf\ng'), 'a\\\\b\\, c\\; d\\ne\\nf\\ng');
});

test('folds UTF-8 content lines below the RFC 5545 75-octet limit', () => {
  const folded = foldLine('SUMMARY:' + '节日'.repeat(50));
  for (const line of folded.split('\r\n')) assert.ok(Buffer.byteLength(line, 'utf8') <= 75);
  assert.ok(folded.split('\r\n').slice(1).every((line) => line.startsWith(' ')));
});

test('generated feed passes structural and semantic validation', () => {
  validateCatalogue();
  const occurrences = resolveHolidays(holidays, 2026, 2046);
  const ics = generateIcs(occurrences, fixedStamp);
  const result = validateIcs(ics);
  assert.equal(result.eventCount, occurrences.length);
  assert.equal(result.uids, occurrences.length);
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n'));
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
  assert.ok(ics.includes('RRULE:FREQ=YEARLY;BYMONTH=5;BYDAY=2SU'));
  assert.ok(ics.includes('SUMMARY:二月二·龙抬头'));
  assert.ok(ics.includes('SUMMARY:国际消费者权益日（3·15）'));
  assert.ok(ics.includes('SUMMARY:万圣夜'));
  assert.ok(ics.includes('SUMMARY:平安夜'));
  assert.ok(ics.includes('SUMMARY:世界读书日'));
  assert.ok(ics.includes('SUMMARY:世界地球日'));
  assert.ok(ics.includes('SUMMARY:程序员节'));
  assert.ok(!ics.includes('SUMMARY:五四青年节'));
  assert.ok(!ics.includes('SUMMARY:中国青年节'));
  assert.ok(ics.includes('SUMMARY:植树节'));
  assert.ok(!ics.includes('SUMMARY:π 日'));
});

test('generation is deterministic when the timestamp is fixed', () => {
  const occurrences = resolveHolidays(holidays, 2026, 2046);
  assert.equal(generateIcs(occurrences, fixedStamp), generateIcs(occurrences, fixedStamp));
});

test('validator rejects invalid line endings, duplicate UIDs and overlong lines', () => {
  assert.throws(() => validateIcs('BEGIN:VCALENDAR\nEND:VCALENDAR\n'), /CRLF/);
  const valid = generateIcs(resolveHolidays(holidays, 2026, 2046), fixedStamp);
  const duplicateUid = valid.replace(
    'UID:valentines-day@cn-holiday-calendar',
    'UID:christmas-day@cn-holiday-calendar',
  );
  assert.throws(() => validateIcs(duplicateUid), /Duplicate UID/);
  const overlong = valid.replace('VERSION:2.0', 'X-OVERLONG:' + 'x'.repeat(100));
  assert.throws(() => validateIcs(overlong), /maximum 75/);
});
