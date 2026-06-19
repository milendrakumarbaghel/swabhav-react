import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as policyApi from '../api/policyApi.js'
import { queryKeys } from '../utils/queryKeys.js'

/**
 * usePolicies — paginated/filtered list of all policies (ADMIN/AGENT).
 *
 * @param {Object} [params] - Query parameters (page, size, sort, sortDir, status, customerId, etc.)
 */
export const usePolicies = (params) => {
  return useQuery({
    queryKey: queryKeys.policies.list(params),
    queryFn: () => policyApi.getPolicies(params).then((res) => res.data),
  })
}

/**
 * useMyPolicies — authenticated customer's own policies.
 *
 * @param {Object} [params] - Query parameters (page, size, sort, sortDir, status, etc.)
 */
export const useMyPolicies = (params) => {
  return useQuery({
    queryKey: queryKeys.policies.mine(params),
    queryFn: () => policyApi.getMyPolicies(params).then((res) => res.data),
  })
}

/**
 * usePolicy — single policy by ID.
 *
 * @param {number|string} id - Policy ID
 */
export const usePolicy = (id) => {
  return useQuery({
    queryKey: queryKeys.policies.detail(id),
    queryFn: () => policyApi.getPolicyById(id).then((res) => res.data),
    enabled: !!id,
  })
}

/**
 * usePurchasePolicy — mutation for a CUSTOMER to self-purchase a policy.
 * Invalidates all policy cache entries (broad invalidation covers both list and mine).
 */
export const usePurchasePolicy = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => policyApi.purchasePolicy(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.policies.all() })
    },
  })
}

/**
 * useIssuePolicy — mutation for an AGENT to issue a policy on behalf of a customer.
 * Invalidates all policy cache entries (broad invalidation covers both list and mine).
 */
export const useIssuePolicy = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => policyApi.issuePolicy(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.policies.all() })
    },
  })
}
