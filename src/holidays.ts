import type { Holiday } from './types.js';

/**
 * Single source of truth for the calendar catalogue.
 *
 * Names use authoritative Chinese names where an official observance exists.
 * Popular/customary observances without a single official name remain clearly
 * identifiable and include clarifying descriptions where dates or traditions vary.
 * Lunar rules use regular lunar months (not leap months).
 */
export const holidays: Holiday[] = [
  { id: 'dragon-head', name: '二月二·龙抬头', category: 'traditional', rule: { type: 'lunar', month: 2, day: 2 }, description: '农历二月初二的传统民俗节日，常称“二月二龙抬头”', enabled: true },
  { id: 'god-of-wealth', name: '迎财神', category: 'traditional', rule: { type: 'lunar', month: 1, day: 5 }, description: '民间迎财神习俗；本日历按常见口径取农历正月初五，各地习俗可能不同', enabled: true },
  { id: 'laba', name: '腊八节', category: 'traditional', rule: { type: 'lunar', month: 12, day: 8 }, description: '农历腊月初八', enabled: true },
  { id: 'xiaonian-north', name: '小年（北方习俗）', category: 'traditional', rule: { type: 'lunar', month: 12, day: 23 }, description: '按常见北方习俗取农历腊月二十三；各地习俗可能不同', enabled: true },
  { id: 'xiaonian-south', name: '小年（南方习俗）', category: 'traditional', rule: { type: 'lunar', month: 12, day: 24 }, description: '按常见南方习俗取农历腊月二十四；各地习俗可能不同', enabled: true },
  { id: 'ghost-festival', name: '中元节', category: 'traditional', rule: { type: 'lunar', month: 7, day: 15 }, description: '农历七月十五；各地也有不同的祭祖与民俗日期传统', enabled: true },

  { id: 'valentines-day', name: '情人节', category: 'western', rule: { type: 'fixed', month: 2, day: 14 }, enabled: true },
  { id: 'white-day', name: '白色情人节', category: 'western', rule: { type: 'fixed', month: 3, day: 14 }, enabled: true },
  { id: 'mothers-day', name: '母亲节', category: 'western', rule: { type: 'nth-weekday', month: 5, weekday: 0, nth: 2 }, description: '本日历采用通行的五月第二个星期日日期规则', enabled: true },
  { id: 'fathers-day', name: '父亲节', category: 'western', rule: { type: 'nth-weekday', month: 6, weekday: 0, nth: 3 }, description: '本日历采用通行的六月第三个星期日日期规则', enabled: true },
  { id: 'thanksgiving-us', name: '感恩节（美国）', category: 'western', region: 'US', rule: { type: 'nth-weekday', month: 11, weekday: 4, nth: 4 }, description: '美国感恩节：每年十一月第四个星期四；其他地区日期可能不同', enabled: true },
  { id: 'halloween', name: '万圣节前夜（万圣节）', category: 'western', rule: { type: 'fixed', month: 10, day: 31 }, description: 'Halloween，即西方万圣节前夜，固定为10月31日', enabled: true },
  { id: 'christmas-eve', name: '圣诞前夜（平安夜）', category: 'western', rule: { type: 'fixed', month: 12, day: 24 }, enabled: true },
  { id: 'christmas-day', name: '圣诞节', category: 'western', rule: { type: 'fixed', month: 12, day: 25 }, enabled: true },
  { id: 'april-fools-day', name: '愚人节', category: 'western', rule: { type: 'fixed', month: 4, day: 1 }, enabled: true },

  { id: 'teachers-day-cn', name: '教师节（中国）', category: 'china', rule: { type: 'fixed', month: 9, day: 10 }, description: '中国教师节，定于每年9月10日；与10月5日的世界教师日不同', enabled: true },
  { id: 'youth-day-cn', name: '中国青年节（五四青年节）', category: 'china', rule: { type: 'fixed', month: 5, day: 4 }, enabled: true },
  { id: 'nurses-day', name: '国际护士节', category: 'international', rule: { type: 'fixed', month: 5, day: 12 }, description: '每年5月12日', enabled: true },
  { id: 'national-memorial-day', name: '南京大屠杀死难者国家公祭日', category: 'china', rule: { type: 'fixed', month: 12, day: 13 }, enabled: true },
  { id: 'xinhai-revolution-day', name: '辛亥革命纪念日／中华民国国庆日（双十节）', category: 'china', rule: { type: 'fixed', month: 10, day: 10 }, description: '同为公历10月10日；本条并列不同历史与政治语境下使用的纪念名称', enabled: true },

  { id: 'world-book-day', name: '世界图书与版权日（世界读书日）', category: 'international', rule: { type: 'fixed', month: 4, day: 23 }, description: '联合国教科文组织设立的世界图书与版权日，通称世界读书日', enabled: true },
  { id: 'world-environment-day', name: '世界环境日', category: 'international', rule: { type: 'fixed', month: 6, day: 5 }, enabled: true },
  { id: 'earth-day', name: '国际地球母亲日（世界地球日）', category: 'international', rule: { type: 'fixed', month: 4, day: 22 }, description: '联合国称“国际地球母亲日”，亦常称世界地球日', enabled: true },
  { id: 'world-no-tobacco-day', name: '世界无烟日', category: 'international', rule: { type: 'fixed', month: 5, day: 31 }, enabled: true },
  { id: 'programmers-day', name: '程序员节（第256天）', category: 'technology', rule: { type: 'ordinal-day', day: 256 }, description: '流行的程序员纪念日，并非统一法定节日；每年第256天，闰年为9月12日，平年为9月13日', enabled: true },
  { id: 'consumer-rights-day', name: '国际消费者权益日（3·15）', category: 'international', rule: { type: 'fixed', month: 3, day: 15 }, description: '每年3月15日；中国官方宣传常用“3·15国际消费者权益日”', enabled: true },
  { id: 'tree-planting-day-cn', name: '植树节', category: 'china', rule: { type: 'fixed', month: 3, day: 12 }, description: '中国植树节，依据《中华人民共和国森林法》定于每年3月12日', enabled: true },
];
