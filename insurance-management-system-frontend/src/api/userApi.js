import axiosInstance from './axiosInstance.js'

/**
 * userApi — user account management API service (ADMIN).
 *
 * All functions return the Axios response directly.
 * Calling code accesses `response.data` for the ApiResponse envelope.
 *
 * NOTE: Users are never deleted — deactivation is always done via toggleUser (PATCH).
 */

/**
 * getUsers — retrieve a paginated, filtered list of all users (ADMIN).
 *
 * @param {Object} [params] - Query parameters (page, size, sort, sortDir, role, active, search, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<Page<UserDTO>>
 */
export const getUsers = (params) =>
  axiosInstance.get('/users', { params })

/**
 * createAgent — create a new AGENT user account (ADMIN).
 *
 * @param {Object} data - Agent account fields (username, email, password, firstName, lastName, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<UserDTO>
 */
export const createAgent = (data) =>
  axiosInstance.post('/users/create-agent', data)

/**
 * toggleUser — activate or deactivate a user account (ADMIN).
 * Uses PATCH — user accounts are never deleted.
 *
 * @param {number|string} id - User ID
 * @param {boolean} active - Whether to activate (true) or deactivate (false)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<UserDTO>
 */
export const toggleUser = (id, active) =>
  axiosInstance.patch(`/users/${id}`, { active })
