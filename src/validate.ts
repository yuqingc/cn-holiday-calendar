import { holidays } from './holidays.js';
import { resolveRuleDate, rruleFor } from './date-rules.js';

export function validateCatalogue(): void {
  const ids = new Set<string>();
  for (const holiday of holidays) {
    if (!holiday.id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(holiday.id)) {
      throw new Error('Invalid holiday id: ' + holiday.id);
    }
    if (ids.has(holiday.id)) throw new Error('Duplicate holiday id: ' + holiday.id);
    ids.add(holiday.id);
    if (!holiday.name.trim()) throw new Error('Empty name for ' + holiday.id);
    if (!holiday.category.trim()) throw new Error('Empty category for ' + holiday.id);

    if (!holiday.enabled) continue;
    if (rruleFor(holiday.rule)) {
      // Some annual rules (e.g. February 29 or a fifth weekday) do not occur every year.
      let found = false;
      for (let year = 2024; year <= 2032; year += 1) {
        try {
          resolveRuleDate(holiday.rule, year);
          found = true;
          break;
        } catch {
          // Expected for years in which a valid annual occurrence does not exist.
        }
      }
      if (!found) throw new Error('No valid recurrence date found for ' + holiday.id);
    } else {
      for (let year = 2024; year <= 2032; year += 1) resolveRuleDate(holiday.rule, year);
    }
  }
}

/** Structural and semantic checks for the generated RFC 5545 feed. */
export function validateIcs(ics: string): { eventCount: number; uids: number } {
  if (!ics.startsWith('BEGIN:VCALENDAR\r\n')) throw new Error('ICS must begin with BEGIN:VCALENDAR and CRLF');
  if (!ics.endsWith('END:VCALENDAR\r\n')) throw new Error('ICS must end with END:VCALENDAR and CRLF');
  if (/(^|[^\r])\n|\r(?!\n)/.test(ics)) throw new Error('ICS must use CRLF line endings');

  const physicalLines = ics.slice(0, -2).split('\r\n');
  for (let index = 0; index < physicalLines.length; index += 1) {
    const line = physicalLines[index]!;
    const length = Buffer.byteLength(line, 'utf8');
    if (length > 75) throw new Error('ICS content line ' + (index + 1) + ' is ' + length + ' octets (maximum 75)');
    if (line.startsWith(' ') || line.startsWith('\t')) {
      if (index === 0 || !physicalLines[index - 1]) throw new Error('Invalid folded line at ' + (index + 1));
    }
  }

  const lines = physicalLines.reduce<string[]>((unfolded, line) => {
    if (line.startsWith(' ') || line.startsWith('\t')) {
      if (unfolded.length === 0) throw new Error('Continuation line has no preceding line');
      unfolded[unfolded.length - 1] += line.slice(1);
    } else {
      unfolded.push(line);
    }
    return unfolded;
  }, []);

  if (lines.filter((line) => line === 'BEGIN:VCALENDAR').length !== 1 ||
      lines.filter((line) => line === 'END:VCALENDAR').length !== 1) {
    throw new Error('ICS must contain exactly one calendar container');
  }
  if (lines[0] !== 'BEGIN:VCALENDAR' || lines[lines.length - 1] !== 'END:VCALENDAR') {
    throw new Error('Calendar component boundaries are misplaced');
  }

  const events: string[][] = [];
  let current: string[] | null = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      if (current) throw new Error('Nested VEVENT');
      current = [];
    } else if (line === 'END:VEVENT') {
      if (!current) throw new Error('END:VEVENT without BEGIN:VEVENT');
      events.push(current);
      current = null;
    } else if (current) {
      current.push(line);
    }
  }
  if (current) throw new Error('VEVENT is missing END:VEVENT');

  const uids = new Set<string>();
  for (let index = 0; index < events.length; index += 1) {
    const event = events[index]!;
    const values = (key: string) => event.filter((line) => line.startsWith(key + ':') || line.startsWith(key + ';'));
    for (const required of ['UID', 'DTSTAMP', 'DTSTART', 'DTEND', 'SUMMARY']) {
      if (values(required).length !== 1) throw new Error('Event ' + (index + 1) + ' must have exactly one ' + required);
    }

    const uid = event.find((line) => line.startsWith('UID:'))!.slice(4);
    if (!uid) throw new Error('Empty UID in event ' + (index + 1));
    if (uids.has(uid)) throw new Error('Duplicate UID: ' + uid);
    uids.add(uid);

    const startLine = event.find((line) => line.startsWith('DTSTART;VALUE=DATE:'));
    const endLine = event.find((line) => line.startsWith('DTEND;VALUE=DATE:'));
    if (!startLine || !endLine) throw new Error('Event ' + (index + 1) + ' must use all-day DTSTART and DTEND');
    const start = startLine.slice(startLine.indexOf(':') + 1);
    const end = endLine.slice(endLine.indexOf(':') + 1);
    const validDate = (value: string) => {
      if (!/^\d{8}$/.test(value)) return false;
      const d = new Date(Date.UTC(Number(value.slice(0, 4)), Number(value.slice(4, 6)) - 1, Number(value.slice(6, 8))));
      return d.getUTCFullYear() === Number(value.slice(0, 4)) &&
        d.getUTCMonth() + 1 === Number(value.slice(4, 6)) &&
        d.getUTCDate() === Number(value.slice(6, 8));
    };
    if (!validDate(start) || !validDate(end)) throw new Error('Event ' + (index + 1) + ' has an invalid date');

    const startMs = Date.UTC(Number(start.slice(0, 4)), Number(start.slice(4, 6)) - 1, Number(start.slice(6, 8)));
    const endMs = Date.UTC(Number(end.slice(0, 4)), Number(end.slice(4, 6)) - 1, Number(end.slice(6, 8)));
    if (endMs <= startMs) throw new Error('Event ' + (index + 1) + ' DTEND must be after DTSTART');

    const stamp = event.find((line) => line.startsWith('DTSTAMP:'))!.slice(8);
    if (!/^\d{8}T\d{6}Z$/.test(stamp)) throw new Error('Event ' + (index + 1) + ' has invalid DTSTAMP');
    const rrules = values('RRULE');
    if (rrules.length > 1) throw new Error('Event ' + (index + 1) + ' has multiple RRULEs');
    if (rrules.length === 1 && !/^RRULE:FREQ=YEARLY;/.test(rrules[0]!)) {
      throw new Error('Unsupported or malformed RRULE in event ' + (index + 1));
    }
  }
  if (events.length === 0) throw new Error('ICS contains no events');
  return { eventCount: events.length, uids: uids.size };
}
