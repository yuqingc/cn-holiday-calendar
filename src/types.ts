export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sunday = 0

export type HolidayRule =
  | { type: 'fixed'; month: number; day: number }
  | { type: 'nth-weekday'; month: number; weekday: Weekday; nth: 1 | 2 | 3 | 4 | 5 | -1 }
  | { type: 'lunar'; month: number; day: number }
  | { type: 'ordinal-day'; day: number };

export interface Holiday {
  /** Stable, URL-safe identifier. Do not change after publication. */
  id: string;
  name: string;
  category: 'traditional' | 'western' | 'china' | 'international' | 'technology';
  rule: HolidayRule;
  description?: string;
  /** Optional locale/region hint, e.g. US for Thanksgiving. */
  region?: string;
  enabled: boolean;
}
