/**
 * @fileoverview Application-wide constants for the Insurance Management System.
 * All values are plain JS constants (no TypeScript enums).
 */

/**
 * All possible policy statuses.
 * @type {{ PENDING_PAYMENT: string, ACTIVE: string, LAPSED: string, EXPIRED: string, CANCELLED: string }}
 */
export const POLICY_STATUSES = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  ACTIVE: 'ACTIVE',
  LAPSED: 'LAPSED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
}

/**
 * All possible claim statuses.
 * @type {{
 *   SUBMITTED: string,
 *   UNDER_REVIEW: string,
 *   RECOMMENDED_APPROVAL: string,
 *   RECOMMENDED_REJECTION: string,
 *   APPROVED: string,
 *   REJECTED: string
 * }}
 */
export const CLAIM_STATUSES = {
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  RECOMMENDED_APPROVAL: 'RECOMMENDED_APPROVAL',
  RECOMMENDED_REJECTION: 'RECOMMENDED_REJECTION',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
}

/**
 * Accepted payment modes for premium payments.
 * @type {{ CASH: string, CHEQUE: string, ONLINE: string, NEFT: string, RTGS: string }}
 */
export const PAYMENT_MODES = {
  CASH: 'CASH',
  CHEQUE: 'CHEQUE',
  ONLINE: 'ONLINE',
  NEFT: 'NEFT',
  RTGS: 'RTGS',
}

/**
 * Default number of records per page for paginated list requests.
 * @type {number}
 */
export const DEFAULT_PAGE_SIZE = 10

/**
 * Maximum allowed page size. Values above this are clamped to MAX_PAGE_SIZE.
 * @type {number}
 */
export const MAX_PAGE_SIZE = 100

/**
 * Default sort field used in all paginated list requests.
 * @type {string}
 */
export const DEFAULT_SORT = 'createdAt'

/**
 * Default sort direction used in all paginated list requests.
 * @type {'ASC' | 'DESC'}
 */
export const DEFAULT_SORT_DIR = 'DESC'
