/**
 * Custom hook for formatting dates with user's timezone
 */

import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  formatDateWithTimezone,
  formatShortDate,
  formatMediumDate,
  formatLongDate,
  formatTime,
  formatDateTime,
  formatFullDateTime,
  formatRelativeTime,
} from '../utils/dateFormatter';

export const useDateFormatter = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const timezone = user?.timezone || 'UTC';
  const hour12 = user?.timeFormat === '24' ? false : true;

  return {
    /**
     * Format date with custom options
     */
    format: (
      date: string | Date | number | null | undefined,
      options?: {
        dateStyle?: 'full' | 'long' | 'medium' | 'short';
        timeStyle?: 'full' | 'long' | 'medium' | 'short';
        showDate?: boolean;
        showTime?: boolean;
        hour12?: boolean;
      }
    ) => formatDateWithTimezone(date, timezone, { hour12, ...options }),

    /**
     * Format date only (short format)
     * Example: "12/31/2025"
     */
    shortDate: (date: string | Date | number | null | undefined) =>
      formatShortDate(date, timezone),

    /**
     * Format date only (medium format)
     * Example: "Dec 31, 2025"
     */
    mediumDate: (date: string | Date | number | null | undefined) =>
      formatMediumDate(date, timezone),

    /**
     * Format date only (long format)
     * Example: "December 31, 2025"
     */
    longDate: (date: string | Date | number | null | undefined) =>
      formatLongDate(date, timezone),

    /**
     * Format time only
     * Example: "2:30 PM" or "14:30"
     */
    time: (date: string | Date | number | null | undefined) =>
      formatTime(date, timezone, hour12),

    /**
     * Format date and time
     * Example: "Dec 31, 2025, 2:30 PM" or "Dec 31, 2025, 14:30"
     */
    dateTime: (date: string | Date | number | null | undefined) =>
      formatDateTime(date, timezone, hour12),

    /**
     * Format full date and time
     * Example: "December 31, 2025 at 2:30:45 PM EST" or "December 31, 2025 at 14:30:45 EST"
     */
    fullDateTime: (date: string | Date | number | null | undefined) =>
      formatFullDateTime(date, timezone, hour12),

    /**
     * Format relative time
     * Example: "2 hours ago", "in 3 days"
     */
    relative: (date: string | Date | number | null | undefined) =>
      formatRelativeTime(date, timezone),

    /**
     * Get user's current timezone
     */
    timezone,
  };
};
