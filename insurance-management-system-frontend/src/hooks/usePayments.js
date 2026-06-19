import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as paymentApi from '../api/paymentApi.js'
import { queryKeys } from '../utils/queryKeys.js'

/**
 * usePayments — paginated/filtered list of all payments (ADMIN/AGENT).
 *
 * @param {Object} [params] - Query parameters (page, size, sort, sortDir, policyId, customerId, etc.)
 */
export const usePayments = (params) => {
  return useQuery({
    queryKey: queryKeys.payments.list(params),
    queryFn: () => paymentApi.getPayments(params).then((res) => res.data),
  })
}

/**
 * usePaymentsByPolicy — payments for a specific policy.
 *
 * @param {number|string} policyId - The policy whose payments to fetch
 * @param {Object} [params] - Additional query parameters (page, size, sort, etc.)
 */
export const usePaymentsByPolicy = (policyId, params) => {
  return useQuery({
    queryKey: queryKeys.payments.byPolicy(policyId, params),
    queryFn: () => paymentApi.getPaymentsByPolicy(policyId, params).then((res) => res.data),
    enabled: !!policyId,
  })
}

/**
 * useRecordPayment — mutation to record a premium payment.
 * Invalidates all payment cache entries, the specific policy's payment list,
 * and all policy cache entries (to refresh policy status after payment).
 */
export const useRecordPayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => paymentApi.recordPayment(data).then((res) => res.data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all() })
      if (variables?.policyId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.payments.byPolicy(variables.policyId),
        })
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.policies.all() })
    },
  })
}
