# CN Holiday Calendar

A lightweight TypeScript project that generates a read-only iCalendar (ICS) subscription for selected Chinese traditional customs, commemorative dates, and international observances.

## Purpose and Scope

This is a supplemental calendar. It intentionally excludes holidays already included in Apple's official Mainland China holiday calendar, so that subscribing to both calendars does not create duplicate entries.

The catalogue focuses on additional cultural, commemorative, professional, and international observances. It is not an official source for China's statutory holiday schedules or adjusted workdays.

## Included Observances

- **Traditional lunar observances:** 二月二·龙抬头、迎财神、腊八节、小年（北方习俗）、小年（南方习俗）、中元节
- **Popular cultural observances:** 情人节、白色情人节、母亲节、父亲节、感恩节（美国）、万圣夜、平安夜、圣诞节、愚人节
- **Chinese commemorative dates:** 教师节（中国）、中国人民抗日战争胜利纪念日暨世界反法西斯战争胜利纪念日、九一八事变纪念日、南京大屠杀死难者国家公祭日、辛亥革命纪念日／中华民国国庆日（双十节）、植树节
- **International and professional observances:** 国际护士节、世界读书日、世界环境日、世界海洋日、世界地球日、世界无烟日、国际消费者权益日（3·15）
- **Chinese technology-culture observance:** 程序员节（中国）, observed on October 24

## Design

- `src/holidays.ts` is the single source of truth for holiday metadata and date rules.
- `src/date-rules.ts` handles fixed Gregorian dates, weekday-based rules, ordinal-day rules, and lunar-date conversion. Gregorian recurrences use yearly `RRULE`s. Lunar observances are expanded into concrete dates from the current Gregorian year through 20 years ahead for broad calendar-client compatibility.
- `src/ics.ts` generates RFC 5545-compliant iCalendar content with escaped values, CRLF line endings, and UTF-8-aware line folding.
- `src/validate.ts` and the tests validate catalogue IDs, date calculations, event UIDs, all-day ranges, line folding, CRLF formatting, and generated output.
- GitHub Actions runs type-checking, unit and integration tests, ICS generation, and validation on Node.js 22 and 24. A yearly scheduled run extends the available lunar-event date range.

## Development

Requirements: Node.js 22 or newer.

```sh
npm ci
npm run check
```

The generated calendar is written to `dist/holidays.ics`.

## Subscribe in Apple Calendar

Subscription URL:

```text
https://raw.githubusercontent.com/yuqingc/cn-holiday-calendar/master/dist/holidays.ics
```

In Apple Calendar, choose **Add Calendar → Add Subscription Calendar** and paste the URL. The subscription is read-only; Apple Calendar refreshes it according to the client's subscription refresh schedule.

## Notes

- 迎财神 follows a commonly used lunar-date convention: the fifth day of the first lunar month. Local customs vary.
- 小年（北方习俗） uses lunar month 12, day 23; 小年（南方习俗） uses lunar month 12, day 24. Regional customs vary.
- 感恩节（美国） follows the United States rule of the fourth Thursday in November.
- 母亲节 and 父亲节 follow the commonly used second Sunday in May and third Sunday in June.
- 程序员节（中国） is a technology-culture observance on October 24, not a statutory holiday.
- The calendar excludes observances already covered by Apple's official Mainland China holiday calendar and does not publish make-up-workday arrangements.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
