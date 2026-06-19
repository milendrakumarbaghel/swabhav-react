import { useQuery } from '@tanstack/react-query'
import * as claimHistoryApi from '../api/claimHistoryApi.js'
import { queryKeys } from '../utils/queryKeys.js'

/**
 * useClaimHistory — full status transition history for a specific claim.
 *
 * @param {number|string} claimId - Claim ID whose history to fetch
 */
export const useClaimHistory = (claimId) => {
  return useQuery({
    queryKey: queryKeys.claims.history(claimId),
    queryFn: () => claimHistoryApi.getClaimHistory(claimId).then((res) => res.data),
    enabled: !!claimId,
  })
}
