import axiosInstance from './axiosInstance.js'

/**
 * policyApi — insurance policy management API service.
 *
 * All functions return the Axios response directly.
 * Calling code accesses `response.data` for the ApiResponse envelope.
 */

/**
 * getPolicies — retrieve a paginated, filtered list of all policies (ADMIN/AGENT).
 *
 * @param {Object} [params] - Query parameters (page, size, sort, sortDir, status, customerId, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<Page<PolicyDTO>>
 */
export const getPolicies = (params) =>
  axiosInstance.get('/policies', { params })

/**
 * getMyPolicies — retrieve the authenticated customer's own policies.
 *
 * @param {Object} [params] - Query parameters (page, size, sort, sortDir, status, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<Page<PolicyDTO>>
 */
export const getMyPolicies = (params) =>
  axiosInstance.get('/policies/mine', { params })

/**
 * getPolicyById — retrieve a single policy by its ID.
 *
 * @param {number|string} id - Policy ID
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<PolicyDTO>
 */
export const getPolicyById = (id) =>
  axiosInstance.get(`/policies/${id}`)

/**
 * purchasePolicy — self-purchase a policy as a CUSTOMER.
 * The backend derives customerId from the authenticated user's JWT.
 *
 * @param {Object} data - Purchase fields (planId, startDate, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<PolicyDTO>
 */
export const purchasePolicy = (data) =>
  axiosInstance.post('/policies', data)

/**
 * issuePolicy — issue a policy on behalf of a customer (AGENT).
 * The customerId must be included in the request body.
 *
 * @param {Object} data - Issue fields (planId, startDate, customerId, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<PolicyDTO>
 */
export const issuePolicy = (data) =>
  axiosInstance.post('/policies', data)
