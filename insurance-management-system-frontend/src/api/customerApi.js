import axiosInstance from './axiosInstance.js'

/**
 * customerApi — customer profile and admin customer management API service.
 *
 * All functions return the Axios response directly.
 * Calling code accesses `response.data` for the ApiResponse envelope.
 */

/**
 * getCustomers — retrieve a paginated, filtered list of customers (ADMIN/AGENT).
 *
 * @param {Object} [params] - Query parameters (page, size, sort, sortDir, search, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<Page<CustomerDTO>>
 */
export const getCustomers = (params) =>
  axiosInstance.get('/customers', { params })

/**
 * getCustomerById — retrieve a single customer by their ID (ADMIN/AGENT).
 *
 * @param {number|string} id - Customer ID
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<CustomerDTO>
 */
export const getCustomerById = (id) =>
  axiosInstance.get(`/customers/${id}`)

/**
 * getMyProfile — retrieve the authenticated customer's own profile.
 *
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<CustomerDTO>
 */
export const getMyProfile = () =>
  axiosInstance.get('/customers/me')

/**
 * updateMyProfile — update the authenticated customer's own profile.
 *
 * @param {Object} data - Updated profile fields (firstName, lastName, phone, address, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<CustomerDTO>
 */
export const updateMyProfile = (data) =>
  axiosInstance.put('/customers/me', data)
