import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as planApi from '../api/planApi.js'
import { queryKeys } from '../utils/queryKeys.js'

/**
 * usePlans — paginated/filtered list of plans.
 *
 * @param {Object} [params] - Query parameters (page, size, sort, sortDir, active, productId, etc.)
 */
export const usePlans = (params) => {
  return useQuery({
    queryKey: queryKeys.plans.list(params),
    queryFn: () => planApi.getPlans(params).then((res) => res.data),
  })
}

/**
 * usePlansByProduct — plans filtered by a specific product.
 *
 * @param {number|string} productId - The product whose plans to fetch
 * @param {Object} [params] - Additional query parameters (page, size, sort, active, etc.)
 */
export const usePlansByProduct = (productId, params) => {
  return useQuery({
    queryKey: queryKeys.plans.byProduct(productId, params),
    queryFn: () => planApi.getPlansByProduct(productId, params).then((res) => res.data),
    enabled: !!productId,
  })
}

/**
 * usePlan — single plan by ID.
 *
 * @param {number|string} id - Plan ID
 */
export const usePlan = (id) => {
  return useQuery({
    queryKey: queryKeys.plans.detail(id),
    queryFn: () => planApi.getPlanById(id).then((res) => res.data),
    enabled: !!id,
  })
}

/**
 * useCreatePlan — mutation to create a new insurance plan (ADMIN).
 * Invalidates all plan cache entries on success.
 */
export const useCreatePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => planApi.createPlan(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.all() })
    },
  })
}

/**
 * useUpdatePlan — mutation to update an existing insurance plan (ADMIN).
 * Accepts `{ id, data }`. Invalidates all plan cache entries and the specific
 * plan detail on success.
 */
export const useUpdatePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => planApi.updatePlan(id, data).then((res) => res.data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.detail(id) })
    },
  })
}

/**
 * useTogglePlan — mutation to activate/deactivate a plan (ADMIN).
 * Accepts `{ id, active }`. Invalidates all plan cache entries and the specific
 * plan detail on success.
 */
export const useTogglePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, active }) => planApi.togglePlan(id, active).then((res) => res.data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.detail(id) })
    },
  })
}
