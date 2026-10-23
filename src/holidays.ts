import type { Holiday } from './types.js';

/**
 * The catalogue is the single source of truth. Add or disable holidays here.
 * Lunar rules use regular lunar months (not leap months).
 */
export const holidays: Holiday[] = [
  { id: 'dragon-head', name: '龙抬头', category: 'traditional', rule: { type: 'lunar', month: 2, day: 2 }, description: '农历二月初二', enabled: true },
  { id: 'god-of-wealth', name: '迎财神', category: 'traditional', rule: { type: 'lunar', month: 1, day: 5 }, description: '按常见民俗口径取农历正月初五；各地习俗可能不同', enabled: true },
  { id: 'laba', name: '腊八节', category: 'traditional', rule: { type: 'lunar', month: 12, day: 8 }, description: '农历腊月初八', enabled: true },
  { id: 'xiaonian-north', name: '北方小年', category: 'traditional', rule: { type: 'lunar', month: 12, day: 23 }, description: '按常见口径取农历腊月二十三；各地习俗可能不同', enabled: true },
  { id: 'xiaonian-south', name: '南方小年', category: 'traditional', rule: { type: 'lunar', month: 12, day: 24 }, description: '按常见口径取农历腊月二十四；各地习俗可能不同', enabled: true },
  { id: 'ghost-festival', name: '中元节', category: 'traditional', rule: { type: 'lunar', month: 7, day: 15 }, description: '农历七月十五', enabled: true },

  { id: 'valentines-day', name: '情人节', category: 'western', rule: { type: 'fixed', month: 2, day: 14 }, enabled: true },
  { id: 'white-day', name: '白色情人节', category: 'western', rule: { type: 'fixed', month: 3, day: 14 }, enabled: true },
  { id: 'mothers-day', name: '母亲节', category: 'western', rule: { type: 'nth-weekday', month: 5, weekday: 0, nth: 2 }, description: '每年五月第二个星期日', enabled: true },
  { id: 'fathers-day', name: '父亲节', category: 'western', rule: { type: 'nth-weekday', month: 6, weekday: 0, nth: 3 }, description: '每年六月第三个星期日', enabled: true },
  { id: 'thanksgiving-us', name: '感恩节（美国）', category: 'western', region: 'US', rule: { type: 'nth-weekday', month: 11, weekday: 4, nth: 4 }, description: '美国感恩节：每年十一月第四个星期四', enabled: true },
  { id: 'halloween', name: '万圣节', category: 'western', rule: { type: 'fixed', month: 10, day: 31 }, enabled: true },
  { id: 'christmas-eve', name: '平安夜', category: 'western', rule: { type: 'fixed', month: 12, day: 24 }, enabled: true },
  { id: 'christmas-day', name: '圣诞节', category: 'western', rule: { type: 'fixed', month: 12, day: 25 }, enabled: true },
  { id: 'april-fools-day', name: '愚人节', category: 'western', rule: { type: 'fixed', month: 4, day: 1 }, enabled: true },

  { id: 'teachers-day-cn', name: '教师节', category: 'china', rule: { type: 'fixed', month: 9, day: 10 }, enabled: true },
  { id: 'youth-day-cn', name: '青年节', category: 'china', rule: { type: 'fixed', month: 5, day: 4 }, enabled: true },
  { id: 'nurses-day', name: '护士节', category: 'international', rule: { type: 'fixed', month: 5, day: 12 }, enabled: true },
  { id: 'national-memorial-day', name: '南京大屠杀死难者国家公祭日', category: 'china', rule: { type: 'fixed', month: 12, day: 13 }, enabled: true },
  { id: 'xinhai-revolution-day', name: '辛亥革命纪念日（中华民国国庆日）', category: 'china', rule: { type: 'fixed', month: 10, day: 10 }, description: '按公历十月十日标记', enabled: true },

  { id: 'world-book-day', name: '世界读书日', category: 'international', rule: { type: 'fixed', month: 4, day: 23 }, enabled: true },
  { id: 'world-environment-day', name: '世界环境日', category: 'international', rule: { type: 'fixed', month: 6, day: 5 }, enabled: true },
  { id: 'earth-day', name: '世界地球日', category: 'international', rule: { type: 'fixed', month: 4, day: 22 }, enabled: true },
  { id: 'world-no-tobacco-day', name: '世界无烟日', category: 'international', rule: { type: 'fixed', month: 5, day: 31 }, enabled: true },
  { id: 'programmers-day', name: '程序员节', category: 'technology', rule: { type: 'ordinal-day', day: 256 }, description: '每年第 256 天；闰年为 9 月 12 日，平年为 9 月 13 日', enabled: true },
  { id: 'pi-day', name: 'π 日', category: 'technology', rule: { type: 'fixed', month: 3, day: 14 }, enabled: true },
];
