import { startOfWeek, addDays, setHours, setMinutes, setSeconds, isAfter } from 'date-fns';

/**
 * Calculate the booking window for a slot date.
 * 
 * Booking opens: immediately (no 14-day restriction)
 * Booking closes: Thursday 23:59:59 of the week before the slot
 * 
 * Example: Slot on Monday Feb 9, 2026
 * - Booking opens: immediately
 * - Booking closes: Thursday Feb 5, 2026 23:59:59
 */
export function getBookingWindow(slotDate: Date): { end: Date } {
  // Get Monday of the slot's week (week starts on Monday in Germany)
  const slotWeekMonday = startOfWeek(slotDate, { weekStartsOn: 1 });
  
  // Go to previous week's Monday
  const previousWeekMonday = addDays(slotWeekMonday, -7);
  
  // Get Thursday of previous week (3 days after Monday)
  const previousThursday = addDays(previousWeekMonday, 3);
  
  // Set time to 23:59:59
  const end = setSeconds(setMinutes(setHours(previousThursday, 23), 59), 59);
  
  return { end };
}

/**
 * Check if booking is currently allowed for a slot date.
 * Booking is open until Thursday 23:59:59 of the week before the slot.
 */
export function isBookingOpen(slotDate: Date): { isOpen: boolean; reason?: string } {
  const now = new Date();
  const { end } = getBookingWindow(slotDate);
  
  if (isAfter(now, end)) {
    return { 
      isOpen: false, 
      reason: `Buchungsfrist abgelaufen (${formatDateDE(end)})` 
    };
  }
  
  return { isOpen: true };
}

/**
 * Format date for German display
 */
export function formatDateDE(date: Date): string {
  return date.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format time range for display
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  const formatTime = (time: string) => time.slice(0, 5); // "HH:MM:SS" -> "HH:MM"
  return `${formatTime(startTime)} - ${formatTime(endTime)} Uhr`;
}
