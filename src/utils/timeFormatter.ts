/**
 * Format a time string based on user's 12hr/24hr preference
 * @param timeString - Time string in format "HH:mm:ss" or "HH:mm"
 * @param is24Hour - Whether to use 24-hour format
 * @returns Formatted time string
 */
export const formatTimeString = (timeString: string, is24Hour: boolean = false): string => {
  if (!timeString) return '-';
  
  try {
    // Parse the time string (could be "20:41:49" or "09:30 am")
    let hours: number;
    let minutes: number;
    let seconds = '00';
    
    // Check if already in 12hr format (contains 'am' or 'pm')
    if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
      const isPM = timeString.toLowerCase().includes('pm');
      const timePart = timeString.replace(/am|pm/gi, '').trim();
      const parts = timePart.split(':');
      
      hours = parseInt(parts[0]);
      minutes = parseInt(parts[1]);
      if (parts[2]) seconds = parts[2];
      
      // Convert to 24hr for processing
      if (isPM && hours !== 12) {
        hours += 12;
      } else if (!isPM && hours === 12) {
        hours = 0;
      }
    } else {
      // Assume 24hr format
      const parts = timeString.split(':');
      hours = parseInt(parts[0]);
      minutes = parseInt(parts[1]);
      if (parts[2]) seconds = parts[2];
    }
    
    // Return based on preference
    if (is24Hour) {
      // Return 24hr format: "20:41:49"
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${seconds}`;
    } else {
      // Return 12hr format: "8:41:49 PM"
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${String(minutes).padStart(2, '0')}:${seconds} ${period}`;
    }
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString; // Return original if parsing fails
  }
};

/**
 * Format a time string to short format (without seconds)
 */
export const formatTimeStringShort = (timeString: string, is24Hour: boolean = false): string => {
  const formatted = formatTimeString(timeString, is24Hour);
  // Remove seconds: "8:41:49 PM" -> "8:41 PM" or "20:41:49" -> "20:41"
  return formatted.replace(/:\d{2}(\s|$)/, '$1').trim();
};
