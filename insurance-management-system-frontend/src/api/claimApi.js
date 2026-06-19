import axiosInstance from './axiosInstance.js'

/**
 * claimApi — insurance claim lifecycle management API service.
 *
 * All functions return the Axios response directly.
 * Calling code accesses `response.data` for the ApiResponse envelope.
 *
 * Claim lifecycle:
 *   SUBMITTED → UNDER_REVIEW (reviewClaim)
 *   UNDER_REVIEW → RECOMMENDED_APPROVAL | RECOMMENDED_REJECTION (recommendClaim)
 *   RECOMMENDED_APPROVAL | RECOMMENDED_REJECTION → APPROVED | REJECTED (decideClaim)
 */

/**
 * getClaims — retrieve a paginated, filtered list of all claims (ADMIN/AGENT).
 *
 * @param {Object} [params] - Query parameters (page, size, sort, sortDir, status, policyId, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<Page<ClaimDTO>>
 */
export const getClaims = (params) =>
  axiosInstance.get('/claims', { params })

/**
 * getMyClaims — retrieve the authenticated customer's own claims.
 *
 * @param {Object} [params] - Query parameters (page, size, sort, sortDir, status, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<Page<ClaimDTO>>
 */
export const getMyClaims = (params) =>
  axiosInstance.get('/claims/mine', { params })

/**
 * getClaimById — retrieve a single claim by its ID.
 *
 * @param {number|string} id - Claim ID
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<ClaimDTO>
 */
export const getClaimById = (id) =>
  axiosInstance.get(`/claims/${id}`)

/**
 * raiseClaim — submit a new insurance claim (CUSTOMER).
 *
 * @param {Object} data - Claim fields (policyId, claimType, claimAmount, incidentDate, description, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<ClaimDTO>
 */
export const raiseClaim = (data) =>
  axiosInstance.post('/claims', data)

/**
 * reviewClaim — mark a claim as UNDER_REVIEW (AGENT).
 * Transitions status from SUBMITTED → UNDER_REVIEW.
 *
 * @param {number|string} id - Claim ID
 * @param {Object} data - Review fields (agentRemarks, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<ClaimDTO>
 */
export const reviewClaim = (id, data) =>
  axiosInstance.put(`/claims/${id}/review`, data)

/**
 * recommendClaim — recommend approval or rejection for a claim (AGENT).
 * Transitions status from UNDER_REVIEW → RECOMMENDED_APPROVAL | RECOMMENDED_REJECTION.
 *
 * @param {number|string} id - Claim ID
 * @param {Object} data - Recommendation fields (recommendation, agentRemarks, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<ClaimDTO>
 */
export const recommendClaim = (id, data) =>
  axiosInstance.put(`/claims/${id}/recommend`, data)

/**
 * decideClaim — approve or reject a claim (ADMIN).
 * Transitions status from RECOMMENDED_APPROVAL | RECOMMENDED_REJECTION → APPROVED | REJECTED.
 *
 * @param {number|string} id - Claim ID
 * @param {Object} data - Decision fields (decision, adminRemarks, etc.)
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<ClaimDTO>
 */
export const decideClaim = (id, data) =>
  axiosInstance.put(`/claims/${id}/decide`, data)
