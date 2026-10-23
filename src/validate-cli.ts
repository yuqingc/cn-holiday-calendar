import { readFile } from 'node:fs/promises';
import { holidays } from './holidays.js';
import { resolveHolidays } from './date-rules.js';
import { validateCatalogue, validateIcs } from './validate.js';

validateCatalogue();
const year = new Date().getUTCFullYear();
const occurrences = resolveHolidays(holidays, year, year + 20);
const ics = await readFile('dist/holidays.ics', 'utf8');
const result = validateIcs(ics);
if (result.eventCount !== occurrences.length) {
  throw new Error('ICS event count (' + result.eventCount + ') does not match expected count (' + occurrences.length + ')');
}
if (result.uids !== occurrences.length) throw new Error('Not all event UIDs are unique');
console.log('Validated ' + holidays.filter((holiday) => holiday.enabled).length + ' enabled holidays, ' +
  result.eventCount + ' events, unique UIDs, valid dates, line folding and CRLF format.');
