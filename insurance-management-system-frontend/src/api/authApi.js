import axiosInstance from './axiosInstance.js'

/**
 * authApi — authentication API service module.
 *
 * All functions return the Axios response directly.
 * The calling code (mutations / pages) accesses `response.data` for the
 * `ApiResponse<T>` envelope from the backend.
 */

/**
 * login — authenticate a user and receive a JWT token.
 *
 * @param {{ username: string, password: string }} payload
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<{ token, role, userId, username, email }>
 */
export const login = (payload) => axiosInstance.post('/auth/login', payload)

/**
 * register — create a new CUSTOMER account.
 *
 * @param {{ username: string, email: string, password: string,
 *            firstName: string, lastName: string, phone: string,
 *            address: string, dateOfBirth: string }} payload
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<void>
 */
export const register = (payload) => axiosInstance.post('/auth/register', payload)

/**
 * logout — optional server-side session invalidation.
 * In the current implementation this is a no-op (stateless JWT);
 * the real logout is handled by AuthContext clearing localStorage.
 *
 * @returns {Promise<void>}
 */
export const logout = () => Promise.resolve()
