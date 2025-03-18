export const DEFAULT_COLORS = {
  SATURDAY: '#22C55E',
  SUNDAY: '#6B7280',
  HOLIDAY: '#EF4444',
  SCHOOL_HOLIDAY: '#3B82F6',
  RELIGIOUS: '#9333EA'
} as const;

export const DEFAULT_POSITIONS = {
  WEEKEND: 1,
  HOLIDAY: 1,
  SCHOOL_HOLIDAY: 2,
  RELIGIOUS: 3
} as const;

export const SYSTEM_CATEGORIES = {
  WEEKEND: 'weekend',
  HOLIDAY: 'holiday',
  SCHOOL_HOLIDAY: 'school_holiday',
  RELIGIOUS: 'religious'
} as const;