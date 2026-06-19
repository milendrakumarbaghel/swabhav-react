import axiosInstance from './axiosInstance.js'

/**
 * paymentApi — premium payment management API service.
 *
 * All functions return the Axios response directly.
 * Calling code accesses `response.data` for the ApiResponse envelope.
 */

/**
 * getPayments — retrieve a paginated, filtered list of all payments (ADMIN/AGENT).
 *
 * @param {Object} [params] - Query parameters (page, size, sort, sortDir, policyId, customerId, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<Page<PaymentDTO>>
 */
export const getPayments = (params) =>
  axiosInstance.get('/payments', { params })

/**
 * getPaymentsByPolicy — retrieve payments for a specific policy.
 * Passes policyId as a query parameter alongside any other filters.
 *
 * @param {number|string} policyId - The policy whose payments to fetch
 * @param {Object} [params] - Additional query parameters (page, size, sort, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<Page<PaymentDTO>>
 */
export const getPaymentsByPolicy = (policyId, params) =>
  axiosInstance.get('/payments', { params: { ...params, policyId } })

/**
 * recordPayment — record a premium payment for a policy (CUSTOMER/AGENT).
 *
 * @param {Object} data - Payment fields (policyId, amount, paymentMode, paymentDate, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<PaymentDTO>
 */
export const recordPayment = (data) =>
  axiosInstance.post('/payments', data)
