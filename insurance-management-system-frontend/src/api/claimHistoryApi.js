import axiosInstance from './axiosInstance.js'

/**
 * claimHistoryApi — claim status history API service.
 *
 * All functions return the Axios response directly.
 * Calling code accesses `response.data` for the ApiResponse envelope.
 */

/**
 * getClaimHistory — retrieve the full status transition history for a claim.
 *
 * Each entry includes:
 *  - fromStatus: previous status (null for the initial creation entry)
 *  - toStatus:   new status after the transition
 *  - changedBy:  username of the actor who triggered the change
 *  - changedAt:  ISO timestamp of the transition
 *  - remarks:    optional notes left by the actor
 *
 * @param {number|string} claimId - Claim ID whose history to fetch
 * @returns {Promise<import('axios').AxiosResponse>}
 *   response.data: ApiResponse<ClaimHistoryDTO[]>
 */
export const getClaimHistory = (claimId) =>
  axiosInstance.get(`/claims/${claimId}/history`)
