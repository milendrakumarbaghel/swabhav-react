/**
 * @fileoverview Utility functions for formatting dates, currency, and status labels.
 */

/**
 * Formats an ISO 8601 date string to a human-readable date (day/month/year).
 *
 * @param {string|null|undefined} dateString - ISO 8601 date string
 * @returns {string} formatted date string, or '—' for null/undefined inputs
 *
 * @example
 * formatDate('2024-03-15T10:30:00')  // → '15 Mar 2024'
 * formatDate(null)                   // → '—'
 */
export function formatDate(dateString) {
  if (dateString === null || dateString === undefined) {
    return '—'
  }
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return '—'
  }
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Formats an ISO 8601 date-time string to a human-readable date and time.
 *
 * @param {string|null|undefined} dateTimeString - ISO 8601 date-time string
 * @returns {string} formatted date-time string, or '—' for null/undefined inputs
 *
 * @example
 * formatDateTime('2024-03-15T10:30:00')  // → '15 Mar 2024, 10:30 AM'
 * formatDateTime(null)                   // → '—'
 */
export function formatDateTime(dateTimeString) {
  if (dateTimeString === null || dateTimeString === undefined) {
    return '—'
  }
  const date = new Date(dateTimeString)
  if (isNaN(date.getTime())) {
    return '—'
  }
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Formats a number as Indian Rupee currency with ₹ prefix.
 *
 * @param {number} amount - the numeric value to format
 * @returns {string} formatted currency string starting with '₹'
 *
 * @example
 * formatCurrency(50000)   // → '₹50,000.00'
 * formatCurrency(1234.5)  // → '₹1,234.50'
 */
export function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Converts a SCREAMING_SNAKE_CASE status string to Title Case.
 * Underscores are replaced with spaces and each word is capitalised.
 *
 * @param {string} status - SCREAMING_SNAKE_CASE string
 * @returns {string} Title Case representation
 *
 * @example
 * formatStatus('PENDING_PAYMENT')       // → 'Pending Payment'
 * formatStatus('RECOMMENDED_APPROVAL') // → 'Recommended Approval'
 * formatStatus('ACTIVE')               // → 'Active'
 */
export function formatStatus(status) {
  if (!status) return ''
  return status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
