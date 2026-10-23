import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { holidays } from './holidays.js';
import { generateIcs } from './ics.js';
import { resolveHolidays } from './date-rules.js';

const currentYear = new Date().getUTCFullYear();
const startYear = currentYear;
const endYear = currentYear + 20;
const occurrences = resolveHolidays(holidays, startYear, endYear);
const outputPath = resolve('dist/holidays.ics');
await mkdir(resolve('dist'), { recursive: true });
// Stable within a calendar year: rerunning the workflow does not change DTSTAMP
// every minute and create noise-only commits.
const stableStamp = new Date(Date.UTC(startYear, 0, 1, 0, 0, 0));
await writeFile(outputPath, generateIcs(occurrences, stableStamp), 'utf8');
console.log('Generated ' + occurrences.length + ' calendar events/rules for ' + startYear + '-' + endYear + ': ' + outputPath);
