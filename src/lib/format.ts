// Utility functions for formatting numbers and currency

/**
 * Format a number with commas (e.g., 1000 -> 1,000)
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

/**
 * Format a number as currency with commas (e.g., 1000 -> $1,000.00)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

/**
 * Format a number as currency without decimals (e.g., 1000 -> $1,000)
 */
export const formatCurrencyNoDecimals = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format a number with commas and 2 decimal places (e.g., 1000 -> 1,000.00)
 */
export const formatNumberWithDecimals = (num: number): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
