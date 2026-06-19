import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as claimApi from '../api/claimApi.js'
import { queryKeys } from '../utils/queryKeys.js'

/**
 * useClaims — paginated/filtered list of all claims (ADMIN/AGENT).
 *
 * @param {Object} [params] - Query parameters (page, size, sort, sortDir, status, policyId, etc.)
 */
export const useClaims = (params) => {
  return useQuery({
    queryKey: queryKeys.claims.list(params),
    queryFn: () => claimApi.getClaims(params).then((res) => res.data),
  })
}

/**
 * useMyClaims — authenticated customer's own claims.
 *
 * @param {Object} [params] - Query parameters (page, size, sort, sortDir, status, etc.)
 */
export const useMyClaims = (params) => {
  return useQuery({
    queryKey: queryKeys.claims.mine(params),
    queryFn: () => claimApi.getMyClaims(params).then((res) => res.data),
  })
}

/**
 * useClaim — single claim by ID.
 *
 * @param {number|string} id - Claim ID
 */
export const useClaim = (id) => {
  return useQuery({
    queryKey: queryKeys.claims.detail(id),
    queryFn: () => claimApi.getClaimById(id).then((res) => res.data),
    enabled: !!id,
  })
}

/**
 * useRaiseClaim — mutation for a CUSTOMER to submit a new claim.
 * Invalidates all claim cache entries (broad invalidation covers list and mine).
 */
export const useRaiseClaim = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => claimApi.raiseClaim(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claims.all() })
    },
  })
}

/**
 * useReviewClaim — mutation for an AGENT to mark a claim as UNDER_REVIEW.
 * Accepts `{ id, data }`. Invalidates claim detail, all claims, and claim history.
 */
export const useReviewClaim = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => claimApi.reviewClaim(id, data).then((res) => res.data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claims.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.claims.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.claims.history(id) })
    },
  })
}

/**
 * useRecommendClaim — mutation for an AGENT to recommend approval or rejection.
 * Accepts `{ id, data }`. Invalidates claim detail, all claims, and claim history.
 */
export const useRecommendClaim = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => claimApi.recommendClaim(id, data).then((res) => res.data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claims.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.claims.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.claims.history(id) })
    },
  })
}

/**
 * useDecideClaim — mutation for an ADMIN to approve or reject a claim.
 * Accepts `{ id, data }`. Invalidates claim detail, all claims, and claim history.
 */
export const useDecideClaim = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => claimApi.decideClaim(id, data).then((res) => res.data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claims.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.claims.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.claims.history(id) })
    },
  })
}
