/**
 * Currency formatting utilities
 */

/**
 * Format amount in rupees (₹) with Indian locale
 * @param amount - Amount in rupees (not paisa)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Format amount with full currency formatting using Intl.NumberFormat
 * @param amount - Amount in rupees (not paisa)
 * @param currency - Currency code (default: 'INR')
 * @returns Formatted currency string
 */
export const formatCurrencyIntl = (amount: number, currency = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format amount for display in statistics cards
 * @param amount - Amount in rupees (not paisa)
 * @returns Formatted currency string for stats display
 */
export const formatStatsCurrency = (amount: number): string => {
  return formatCurrencyIntl(amount);
};