import axiosInstance from './axiosInstance.js'

/**
 * productApi — insurance product management API service.
 *
 * All functions return the Axios response directly.
 * Calling code accesses `response.data` for the ApiResponse envelope.
 *
 * NOTE: Products are never deleted — deactivation is always done via toggleProduct (PATCH).
 */

/**
 * getProducts — retrieve a paginated, filtered list of products.
 *
 * @param {Object} [params] - Query parameters (page, size, sort, sortDir, active, search, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<Page<ProductDTO>>
 */
export const getProducts = (params) =>
  axiosInstance.get('/products', { params })

/**
 * getProductById — retrieve a single product by its ID.
 *
 * @param {number|string} id - Product ID
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<ProductDTO>
 */
export const getProductById = (id) =>
  axiosInstance.get(`/products/${id}`)

/**
 * createProduct — create a new insurance product (ADMIN).
 *
 * @param {Object} data - Product fields (productName, description, minAge, maxAge, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<ProductDTO>
 */
export const createProduct = (data) =>
  axiosInstance.post('/products', data)

/**
 * updateProduct — update an existing insurance product (ADMIN).
 *
 * @param {number|string} id - Product ID
 * @param {Object} data - Updated product fields
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<ProductDTO>
 */
export const updateProduct = (id, data) =>
  axiosInstance.put(`/products/${id}`, data)

/**
 * toggleProduct — activate or deactivate a product (ADMIN).
 * Uses PATCH — products are never deleted.
 *
 * @param {number|string} id - Product ID
 * @param {boolean} active - Whether to activate (true) or deactivate (false)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<ProductDTO>
 */
export const toggleProduct = (id, active) =>
  axiosInstance.patch(`/products/${id}`, { active })
