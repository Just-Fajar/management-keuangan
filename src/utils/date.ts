/**
 * Date Helper for Monthly Cycles & Daily Allowance calculation.
 */

export function getRemainingDaysInMonth(now: Date = new Date()): number {
  const year = now.getFullYear();
  const month = now.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const currentDay = now.getDate();
  const remaining = totalDays - currentDay + 1; // Including today
  return Math.max(remaining, 1);
}

export function getDaysInMonth(now: Date = new Date()): number {
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

export function isCurrentMonth(isoDateString: string, now: Date = new Date()): boolean {
  if (!isoDateString) return false;
  const d = new Date(isoDateString);
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}
