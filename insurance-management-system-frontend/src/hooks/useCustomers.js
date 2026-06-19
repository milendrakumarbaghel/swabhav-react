import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as customerApi from '../api/customerApi.js'
import { queryKeys } from '../utils/queryKeys.js'

/**
 * useCustomers — paginated/filtered list of customers (ADMIN/AGENT).
 *
 * @param {Object} [params] - Query parameters (page, size, sort, sortDir, search, etc.)
 */
export const useCustomers = (params) => {
  return useQuery({
    queryKey: queryKeys.customers.list(params),
    queryFn: () => customerApi.getCustomers(params).then((res) => res.data),
  })
}

/**
 * useCustomer — single customer by ID (ADMIN/AGENT).
 *
 * @param {number|string} id - Customer ID
 */
export const useCustomer = (id) => {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => customerApi.getCustomerById(id).then((res) => res.data),
    enabled: !!id,
  })
}

/**
 * useMyProfile — authenticated customer's own profile.
 */
export const useMyProfile = () => {
  return useQuery({
    queryKey: queryKeys.customers.me(),
    queryFn: () => customerApi.getMyProfile().then((res) => res.data),
  })
}

/**
 * useUpdateMyProfile — mutation to update the authenticated customer's own profile.
 * Invalidates the `customers.me` cache on success.
 */
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => customerApi.updateMyProfile(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.me() })
    },
  })
}
