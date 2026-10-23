# CN Holiday Calendar

A small TypeScript project that generates an Apple Calendar-compatible `.ics` subscription for Chinese traditional festivals and selected international observances.

## Included holidays

- Traditional lunar festivals: 龙抬头、迎财神、腊八节、北方小年、南方小年、中元节
- Popular holidays: 情人节、白色情人节、母亲节、父亲节、美国感恩节、万圣节、平安夜、圣诞节、愚人节
- China/social dates: 教师节、青年节、护士节、南京大屠杀死难者国家公祭日、辛亥革命纪念日（中华民国国庆日）
- International/technology dates: 世界读书日、世界环境日、世界地球日、世界无烟日、程序员节、π 日

## Design

- `src/holidays.ts` is the single source of truth for holiday metadata and rules.
- `src/date-rules.ts` implements Gregorian fixed dates, nth/last weekday rules, ordinal day rules and lunar conversion. Gregorian recurrence rules are emitted as native open-ended `RRULE`s. Lunar observances are expanded into concrete dates for the current Gregorian year plus 20 years because Apple Calendar client support for non-Gregorian `RSCALE` extensions is not assumed.
- `src/ics.ts` serializes RFC 5545 text with escaped values and UTF-8-aware line folding.
- `src/validate.ts` and `tests/` check catalogue IDs, date calculations, UID uniqueness, all-day ranges, CRLF, content-line folding and the generated event count.
- GitHub Actions runs type-checking, tests, generation and validation on Node.js 22 and 24. The feed is refreshed yearly to extend the lunar-event window; Gregorian holidays have open-ended recurrence rules.

## Development

Requires Node.js 22 or newer.

```sh
npm install
npm run check
```

Generated output: `dist/holidays.ics`.

## Subscribe on Apple Calendar

Once the repository contains the generated file on the default branch, use:

```text
https://raw.githubusercontent.com/yuqingc/cn-holiday-calendar/main/dist/holidays.ics
```

In Apple Calendar, choose **Add Calendar → Add Subscription Calendar** and paste the URL. The calendar is read-only; updates appear when the client next refreshes the subscription.

## Notes

- 迎财神 uses the common lunar-date convention of lunar month 1, day 5; local customs vary.
- 北方小年 and 南方小年 use lunar month 12, days 23 and 24 respectively; customs can vary by region.
- 感恩节 is the United States date rule (fourth Thursday in November).
- This is a supplementary observance calendar, not an official Chinese statutory holiday or make-up-workday feed.
- Please report errors with a source citation or known-good date so the calculation or data can be reviewed.
