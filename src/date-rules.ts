import { Lunar } from 'lunar-javascript';
import type { Holiday, HolidayRule } from './types.js';

export interface ResolvedOccurrence {
  holiday: Holiday;
  date: Date;
  /** An open-ended RFC 5545 recurrence rule for supported Gregorian dates. */
  rrule?: string;
  recurring: boolean;
  /** For RRULEs, the Gregorian DTSTART year; for lunar events, the lunar source year. */
  occurrenceYear: number;
}

const WEEKDAY_CODES = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'] as const;

function assertIntegerRange(value: number, min: number, max: number, label: string): void {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${label} must be an integer from ${min} to ${max}; got ${value}`);
  }
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function daysInYear(year: number): number {
  return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
}

function assertYear(year: number): void {
  // Date.UTC treats years 0-99 specially; this calendar targets modern years.
  if (!Number.isInteger(year) || year < 100 || year > 9999) {
    throw new Error(`Year must be an integer from 100 to 9999; got ${year}`);
  }
}

export function nthWeekdayOfMonth(year: number, month: number, weekday: number, nth: number): Date {
  assertYear(year);
  assertIntegerRange(month, 1, 12, 'month');
  assertIntegerRange(weekday, 0, 6, 'weekday (Sunday = 0)');
  if (!Number.isInteger(nth) || ![-1, 1, 2, 3, 4, 5].includes(nth)) {
    throw new Error(`nth must be 1-5 or -1 (last); got ${nth}`);
  }

  const lastDayNumber = daysInMonth(year, month);
  if (nth === -1) {
    const lastDay = new Date(Date.UTC(year, month - 1, lastDayNumber));
    const offset = (lastDay.getUTCDay() - weekday + 7) % 7;
    return new Date(Date.UTC(year, month - 1, lastDayNumber - offset));
  }

  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const offset = (weekday - firstDay.getUTCDay() + 7) % 7;
  const day = 1 + offset + (nth - 1) * 7;
  if (day > lastDayNumber) throw new Error(`There is no ${nth}th weekday ${weekday} in ${year}-${month}`);
  return new Date(Date.UTC(year, month - 1, day));
}

export function resolveRuleDate(rule: HolidayRule, year: number): Date {
  assertYear(year);
  switch (rule.type) {
    case 'fixed': {
      assertIntegerRange(rule.month, 1, 12, 'month');
      assertIntegerRange(rule.day, 1, 31, 'day');
      if (rule.day > daysInMonth(year, rule.month)) {
        throw new Error(`Invalid fixed date ${year}-${rule.month}-${rule.day}`);
      }
      return new Date(Date.UTC(year, rule.month - 1, rule.day));
    }
    case 'nth-weekday':
      return nthWeekdayOfMonth(year, rule.month, rule.weekday, rule.nth);
    case 'lunar': {
      assertIntegerRange(rule.month, 1, 12, 'lunar month');
      assertIntegerRange(rule.day, 1, 30, 'lunar day');
      const solar = Lunar.fromYmd(year, rule.month, rule.day).getSolar();
      const solarDate = new Date(Date.UTC(solar.getYear(), solar.getMonth() - 1, solar.getDay()));
      // Round-trip because some calendar libraries normalize nonexistent lunar dates.
      const roundTrip = solar.getLunar();
      if (roundTrip.getYear() !== year || roundTrip.getMonth() !== rule.month || roundTrip.getDay() !== rule.day) {
        throw new Error(`Invalid lunar date ${year}-${rule.month}-${rule.day}`);
      }
      return solarDate;
    }
    case 'ordinal-day': {
      assertIntegerRange(rule.day, 1, 366, 'ordinal day');
      if (rule.day > daysInYear(year)) throw new Error(`Year ${year} has no day ${rule.day}`);
      return new Date(Date.UTC(year, 0, rule.day));
    }
  }
}

export function rruleFor(rule: HolidayRule): string | undefined {
  switch (rule.type) {
    case 'fixed':
      return `FREQ=YEARLY;BYMONTH=${rule.month};BYMONTHDAY=${rule.day}`;
    case 'nth-weekday':
      return `FREQ=YEARLY;BYMONTH=${rule.month};BYDAY=${rule.nth}${WEEKDAY_CODES[rule.weekday]}`;
    case 'ordinal-day':
      return `FREQ=YEARLY;BYYEARDAY=${rule.day}`;
    case 'lunar':
      return undefined;
  }
}

function firstValidGregorianOccurrence(rule: HolidayRule, startYear: number): { date: Date; year: number } {
  for (let year = startYear; year <= startYear + 8; year += 1) {
    try {
      return { date: resolveRuleDate(rule, year), year };
    } catch (error) {
      if (year === startYear + 8) throw error;
    }
  }
  throw new Error(`Could not find a valid recurrence occurrence from ${startYear}`);
}

/** RRULEs stay open-ended; lunar events are expanded so clients need not support RSCALE. */
export function resolveHolidays(holidays: Holiday[], startYear: number, endYear: number): ResolvedOccurrence[] {
  assertYear(startYear);
  assertYear(endYear);
  if (endYear < startYear) throw new Error(`endYear (${endYear}) must be >= startYear (${startYear})`);

  const output: ResolvedOccurrence[] = [];
  for (const holiday of holidays) {
    if (!holiday.enabled) continue;
    const rrule = rruleFor(holiday.rule);
    if (rrule) {
      const first = firstValidGregorianOccurrence(holiday.rule, startYear);
      output.push({ holiday, date: first.date, rrule, recurring: true, occurrenceYear: first.year });
      continue;
    }

    // Lunar years and Gregorian years differ around January/February. Include guard years
    // at both ends, then filter by the requested Gregorian year to avoid edge omissions.
    for (let lunarYear = Math.max(100, startYear - 1); lunarYear <= Math.min(9999, endYear + 1); lunarYear += 1) {
      const date = resolveRuleDate(holiday.rule, lunarYear);
      const gregorianYear = date.getUTCFullYear();
      if (gregorianYear >= startYear && gregorianYear <= endYear) {
        output.push({ holiday, date, recurring: false, occurrenceYear: lunarYear });
      }
    }
  }
  return output.sort((a, b) => a.date.getTime() - b.date.getTime() || a.holiday.name.localeCompare(b.holiday.name, 'zh-CN'));
}
