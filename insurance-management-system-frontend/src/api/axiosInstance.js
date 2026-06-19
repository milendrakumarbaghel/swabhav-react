import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

/**
 * Configured Axios instance shared across all API service modules.
 *
 * Configuration:
 * - baseURL: from VITE_API_BASE_URL env variable, fallback http://localhost:8080/api
 * - timeout: 15 000 ms
 * - Content-Type: application/json
 *
 * Interceptors:
 * - Request:  Attaches "Authorization: Bearer <token>" if token is in localStorage
 * - Response: On 401, clears token/user from localStorage and redirects to /login
 */
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

/**
 * REQUEST INTERCEPTOR
 * Precondition:  request is outbound
 * Postcondition: Authorization header is attached if token exists in localStorage
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * RESPONSE INTERCEPTOR
 * Postcondition: On 401, clears auth state and redirects to /login
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
