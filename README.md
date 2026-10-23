# CN Holiday Calendar

A TypeScript project that generates a read-only iCalendar subscription for Chinese traditional customs, Chinese commemorative dates and selected international observances.

## Included catalogue

- Traditional lunar customs: 二月二·龙抬头、迎财神、腊八节、小年（北方习俗）、小年（南方习俗）、中元节
- Popular observances: 情人节、白色情人节、母亲节、父亲节、感恩节（美国）、万圣节前夜（万圣节）、圣诞前夜（平安夜）、圣诞节、愚人节
- Chinese dates: 教师节（中国）、五四青年节（中国青年节）、南京大屠杀死难者国家公祭日、辛亥革命纪念日／中华民国国庆日（双十节）、植树节
- International and professional observances: 国际护士节、世界图书与版权日（世界读书日）、世界环境日、国际地球母亲日（世界地球日）、世界无烟日、国际消费者权益日（3·15）、程序员节（第256天）

## Naming policy

Where a recognized organization uses an established Chinese title, it is preferred and a familiar alternative is kept in parentheses when useful. Examples include **世界图书与版权日（世界读书日）** and **国际地球母亲日（世界地球日）**. Some entries are folk customs or popular observances rather than formally constituted holidays (e.g. 迎财神, 白色情人节 and 程序员节); their names are conventional labels, not claims of statutory status. Local customs can vary.

## Design

- \`src/holidays.ts\` is the single source of truth for holiday metadata and rules.
- \`src/date-rules.ts\` implements fixed Gregorian dates, nth/last weekday rules, ordinal-day rules and lunar conversion. Gregorian recurrences use open-ended \`RRULE\`s. Lunar observances are expanded into concrete dates for the current Gregorian year through 20 years ahead for broad client compatibility.
- \`src/ics.ts\` serializes RFC 5545 content with escaped values, CRLF endings and UTF-8-aware line folding.
- \`src/validate.ts\` and \`tests/\` check catalogue IDs, date calculations, event UIDs, all-day ranges, CRLF, line folding and generated output.
- GitHub Actions runs type-checking, tests, generation and validation on Node.js 22 and 24. The feed is refreshed yearly to extend the lunar-event window.

## Development

Requires Node.js 22 or newer.

\`\`\`sh
npm ci
npm run check
\`\`\`

Generated output: \`dist/holidays.ics\`.

## Subscribe on Apple Calendar

Subscription URL:

\`\`\`text
https://raw.githubusercontent.com/yuqingc/cn-holiday-calendar/main/dist/holidays.ics
\`\`\`

In Apple Calendar, choose **Add Calendar → Add Subscription Calendar** and paste the URL. The calendar is read-only and updates when the client next refreshes its subscription.

## Notes

- 迎财神 uses the common lunar-date convention of lunar month 1, day 5; local customs vary.
- 小年（北方习俗） and 小年（南方习俗） use lunar month 12, days 23 and 24 respectively; regional customs vary.
- 感恩节 refers specifically to the United States date rule (fourth Thursday in November).
- 母亲节 and 父亲节 use the common second-Sunday-in-May and third-Sunday-in-June rules.
- This supplementary calendar is not an official Chinese statutory-holiday or make-up-workday feed.
