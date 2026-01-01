/**
 * Date formatting utility with timezone support
 * Formats dates according to user's selected timezone
 */

interface FormatOptions {
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
  showDate?: boolean;
  showTime?: boolean;
  hour12?: boolean;
}

/**
 * Format a date according to user's timezone
 * @param date - Date string, Date object, or timestamp
 * @param timezone - User's timezone (e.g., 'America/New_York', 'UTC')
 * @param options - Formatting options
 * @returns Formatted date string
 */
export const formatDateWithTimezone = (
  date: string | Date | number | null | undefined,
  timezone: string = 'UTC',
  options: FormatOptions = {}
): string => {
  if (!date) return '-';

  const {
    dateStyle = 'medium',
    timeStyle = 'short',
    showDate = true,
    showTime = true,
    hour12,
  } = options;

  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;

    if (isNaN(dateObj.getTime())) {
      return '-';
    }

    const formatOptions: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
    };

    if (showDate && showTime) {
      formatOptions.dateStyle = dateStyle;
      formatOptions.timeStyle = timeStyle;
      if (hour12 !== undefined) {
        formatOptions.hour12 = hour12;
      }
    } else if (showDate) {
      formatOptions.dateStyle = dateStyle;
    } else if (showTime) {
      formatOptions.timeStyle = timeStyle;
      if (hour12 !== undefined) {
        formatOptions.hour12 = hour12;
      }
    }

    return new Intl.DateTimeFormat('en-US', formatOptions).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

/**
 * Format date with short format (e.g., "12/31/2025")
 */
export const formatShortDate = (
  date: string | Date | number | null | undefined,
  timezone: string = 'UTC'
): string => {
  return formatDateWithTimezone(date, timezone, {
    dateStyle: 'short',
    showTime: false,
  });
};

/**
 * Format date with medium format (e.g., "Dec 31, 2025")
 */
export const formatMediumDate = (
  date: string | Date | number | null | undefined,
  timezone: string = 'UTC'
): string => {
  return formatDateWithTimezone(date, timezone, {
    dateStyle: 'medium',
    showTime: false,
  });
};

/**
 * Format date with long format (e.g., "December 31, 2025")
 */
export const formatLongDate = (
  date: string | Date | number | null | undefined,
  timezone: string = 'UTC'
): string => {
  return formatDateWithTimezone(date, timezone, {
    dateStyle: 'long',
    showTime: false,
  });
};

/**
 * Format time only (e.g., "2:30 PM")
 */
export const formatTime = (
  date: string | Date | number | null | undefined,
  timezone: string = 'UTC',
  hour12: boolean = true
): string => {
  return formatDateWithTimezone(date, timezone, {
    showDate: false,
    timeStyle: 'short',
    hour12,
  });
};

/**
 * Format date and time (e.g., "Dec 31, 2025, 2:30 PM")
 */
export const formatDateTime = (
  date: string | Date | number | null | undefined,
  timezone: string = 'UTC',
  hour12: boolean = true
): string => {
  return formatDateWithTimezone(date, timezone, {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12,
  });
};

/**
 * Format date and time with full details (e.g., "December 31, 2025 at 2:30:45 PM EST")
 */
export const formatFullDateTime = (
  date: string | Date | number | null | undefined,
  timezone: string = 'UTC',
  hour12: boolean = true
): string => {
  return formatDateWithTimezone(date, timezone, {
    dateStyle: 'long',
    timeStyle: 'long',
    hour12,
  });
};

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export const formatRelativeTime = (
  date: string | Date | number | null | undefined,
  timezone: string = 'UTC'
): string => {
  if (!date) return '-';

  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;

    if (isNaN(dateObj.getTime())) {
      return '-';
    }

    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (Math.abs(diffSec) < 60) {
      return 'just now';
    } else if (Math.abs(diffMin) < 60) {
      return diffMin > 0 ? `${diffMin} min ago` : `in ${Math.abs(diffMin)} min`;
    } else if (Math.abs(diffHour) < 24) {
      return diffHour > 0 ? `${diffHour} hour${diffHour > 1 ? 's' : ''} ago` : `in ${Math.abs(diffHour)} hour${Math.abs(diffHour) > 1 ? 's' : ''}`;
    } else if (Math.abs(diffDay) < 7) {
      return diffDay > 0 ? `${diffDay} day${diffDay > 1 ? 's' : ''} ago` : `in ${Math.abs(diffDay)} day${Math.abs(diffDay) > 1 ? 's' : ''}`;
    } else if (Math.abs(diffWeek) < 4) {
      return diffWeek > 0 ? `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago` : `in ${Math.abs(diffWeek)} week${Math.abs(diffWeek) > 1 ? 's' : ''}`;
    } else if (Math.abs(diffMonth) < 12) {
      return diffMonth > 0 ? `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago` : `in ${Math.abs(diffMonth)} month${Math.abs(diffMonth) > 1 ? 's' : ''}`;
    } else {
      return diffYear > 0 ? `${diffYear} year${diffYear > 1 ? 's' : ''} ago` : `in ${Math.abs(diffYear)} year${Math.abs(diffYear) > 1 ? 's' : ''}`;
    }
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '-';
  }
};

/**
 * Get user's timezone from localStorage or default to UTC
 */
export const getUserTimezone = (): string => {
  try {
    const authData = localStorage.getItem('qc_auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed?.user?.timezone || 'UTC';
    }
  } catch (error) {
    console.error('Error getting user timezone:', error);
  }
  return 'UTC';
};
