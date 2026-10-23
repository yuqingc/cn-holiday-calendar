# CN Holiday Calendar

A TypeScript project that generates a read-only iCalendar subscription for Chinese traditional customs, commemorative dates and selected international observances.

## Included catalogue

- Traditional lunar customs: 二月二·龙抬头、迎财神、腊八节、小年（北方习俗）、小年（南方习俗）、中元节
- Popular observances: 情人节、白色情人节、母亲节、父亲节、感恩节（美国）、万圣夜、平安夜、圣诞节、愚人节
- Chinese dates: 教师节（中国）、中国人民抗日战争胜利纪念日暨世界反法西斯战争胜利纪念日、九一八事变纪念日、南京大屠杀死难者国家公祭日、辛亥革命纪念日／中华民国国庆日（双十节）、植树节
- International and professional observances: 国际护士节、世界读书日、世界环境日、世界海洋日、世界地球日、世界无烟日、国际消费者权益日（3·15）、国际程序员节（每年第256天）
- Chinese tech-culture observance: 1024程序员节（中国，10月24日）

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
- 母亲节 and 父亲节 use the commonly used second-Sunday-in-May and third-Sunday-in-June rules.
- 国际程序员节按每年第256天计算（平年9月13日、闰年9月12日）；1024程序员节（中国）固定为10月24日，属于行业文化节日而非法定假日。
- The catalogue excludes 五四青年节 and π 日 per project preferences.
- This supplementary calendar is not an official Chinese statutory-holiday or make-up-workday feed.
