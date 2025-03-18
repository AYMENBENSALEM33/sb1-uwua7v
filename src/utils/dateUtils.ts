export const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export const getSeasonColor = (dayOfYear: number): string => {
  // Spring: March 20 (day 79) to June 20 (day 171)
  // Summer: June 21 (day 172) to September 22 (day 265)
  // Autumn: September 23 (day 266) to December 20 (day 354)
  // Winter: December 21 (day 355) to March 19 (day 78)
  
  if (dayOfYear >= 79 && dayOfYear < 172) {
    // Spring - Soft sage green
    return 'rgba(167, 243, 208, 0.08)';
  } else if (dayOfYear >= 172 && dayOfYear < 266) {
    // Summer - Warm golden
    return 'rgba(251, 191, 36, 0.08)';
  } else if (dayOfYear >= 266 && dayOfYear < 355) {
    // Autumn - Muted amber
    return 'rgba(217, 119, 6, 0.08)';
  } else {
    // Winter - Cool blue
    return 'rgba(147, 197, 253, 0.08)';
  }
};

export const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const parseDate = (dateStr: string): Date => {
  // Handle YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr + 'T00:00:00.000Z');
  }
  
  // Handle DD/MM/YYYY format
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
};

export const toISODateString = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseDate(date) : date;
  return d.toISOString().split('T')[0];
};