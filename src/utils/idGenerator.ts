/**
 * Generates a unique integer ID based on current date and time with a random suffix
 * Format: YYYYMMDDHHmmssSSSnnn (where nnn is a random 3-digit number)
 * Example: 20240315142536789123 (Year 2024, Month 03, Day 15, 14:25:36.789, Random 123)
 */
export const generateUniqueId = (): number => {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  
  return parseInt(`${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}${random}`);
};

/**
 * Generates a unique key for React components
 */
export const generateComponentKey = (prefix: string = ''): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}${timestamp}-${random}`;
};