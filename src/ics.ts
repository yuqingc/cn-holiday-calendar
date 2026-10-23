import type { ResolvedOccurrence } from './date-rules.js';

function formatDate(date: Date): string {
  return String(date.getUTCFullYear()).padStart(4, '0')
    + String(date.getUTCMonth() + 1).padStart(2, '0')
    + String(date.getUTCDate()).padStart(2, '0');
}

export function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

/** RFC 5545 content-line folding; physical lines are kept below 75 UTF-8 octets. */
export function foldLine(line: string): string {
  const chunks: string[] = [];
  let current = '';
  let bytes = 0;
  for (const char of line) {
    const charBytes = Buffer.byteLength(char, 'utf8');
    if (bytes + charBytes > 73) {
      chunks.push(current);
      current = ' ' + char;
      bytes = 1 + charBytes;
    } else {
      current += char;
      bytes += charBytes;
    }
  }
  chunks.push(current);
  return chunks.join('\r\n');
}

function eventLines(occurrence: ResolvedOccurrence, stamp: string): string[] {
  const { holiday, date, recurring, rrule, occurrenceYear } = occurrence;
  const end = new Date(date.getTime() + 86_400_000);
  const uid = recurring
    ? holiday.id + '@cn-holiday-calendar'
    : holiday.id + '-' + occurrenceYear + '@cn-holiday-calendar';
  const lines = [
    'BEGIN:VEVENT',
    'UID:' + uid,
    'DTSTAMP:' + stamp,
    'DTSTART;VALUE=DATE:' + formatDate(date),
    'DTEND;VALUE=DATE:' + formatDate(end),
  ];
  if (rrule) lines.push('RRULE:' + rrule);
  lines.push('SUMMARY:' + escapeText(holiday.name));
  lines.push('CATEGORIES:' + holiday.category.toUpperCase());
  if (holiday.description) lines.push('DESCRIPTION:' + escapeText(holiday.description));
  lines.push('TRANSP:TRANSPARENT', 'END:VEVENT');
  return lines;
}

export function generateIcs(occurrences: ResolvedOccurrence[], now = new Date()): string {
  if (Number.isNaN(now.getTime())) throw new Error('Invalid DTSTAMP date');
  const stamp = formatDate(now) + 'T'
    + String(now.getUTCHours()).padStart(2, '0')
    + String(now.getUTCMinutes()).padStart(2, '0')
    + String(now.getUTCSeconds()).padStart(2, '0') + 'Z';
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//cn-holiday-calendar//Chinese and International Holidays//ZH',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:中国节日补充日历',
    'X-WR-CALDESC:中国传统民俗、社会纪念日及精选国际节日',
    ...occurrences.flatMap((occurrence) => eventLines(occurrence, stamp)),
    'END:VCALENDAR',
  ];
  return lines.map(foldLine).join('\r\n') + '\r\n';
}
