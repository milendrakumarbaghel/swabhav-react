import axiosInstance from './axiosInstance.js'

/**
 * planApi — insurance plan management API service.
 *
 * All functions return the Axios response directly.
 * Calling code accesses `response.data` for the ApiResponse envelope.
 *
 * NOTE: Plans are never deleted — deactivation is always done via togglePlan (PATCH).
 */

/**
 * getPlans — retrieve a paginated, filtered list of plans.
 *
 * @param {Object} [params] - Query parameters (page, size, sort, sortDir, active, productId, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<Page<PlanDTO>>
 */
export const getPlans = (params) =>
  axiosInstance.get('/plans', { params })

/**
 * getPlansByProduct — retrieve plans for a specific product.
 * Passes productId as a query parameter alongside any other filters.
 *
 * @param {number|string} productId - The product whose plans to fetch
 * @param {Object} [params] - Additional query parameters (page, size, sort, active, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<Page<PlanDTO>>
 */
export const getPlansByProduct = (productId, params) =>
  axiosInstance.get('/plans', { params: { ...params, productId } })

/**
 * getPlanById — retrieve a single plan by its ID.
 *
 * @param {number|string} id - Plan ID
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<PlanDTO>
 */
export const getPlanById = (id) =>
  axiosInstance.get(`/plans/${id}`)

/**
 * createPlan — create a new insurance plan under a product (ADMIN).
 *
 * @param {Object} data - Plan fields (planName, productId, sumInsured, premiumAmount, tenureMonths, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<PlanDTO>
 */
export const createPlan = (data) =>
  axiosInstance.post('/plans', data)

/**
 * updatePlan — update an existing insurance plan (ADMIN).
 *
 * @param {number|string} id - Plan ID
 * @param {Object} data - Updated plan fields
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<PlanDTO>
 */
export const updatePlan = (id, data) =>
  axiosInstance.put(`/plans/${id}`, data)

/**
 * togglePlan — activate or deactivate a plan (ADMIN).
 * Uses PATCH — plans are never deleted.
 *
 * @param {number|string} id - Plan ID
 * @param {boolean} active - Whether to activate (true) or deactivate (false)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<PlanDTO>
 */
export const togglePlan = (id, active) =>
  axiosInstance.patch(`/plans/${id}`, { active })
