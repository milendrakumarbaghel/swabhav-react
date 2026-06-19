import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as productApi from '../api/productApi.js'
import { queryKeys } from '../utils/queryKeys.js'

/**
 * useProducts — paginated/filtered list of products.
 *
 * @param {Object} [params] - Query parameters (page, size, sort, sortDir, active, search, etc.)
 */
export const useProducts = (params) => {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productApi.getProducts(params).then((res) => res.data),
  })
}

/**
 * useProduct — single product by ID.
 *
 * @param {number|string} id - Product ID
 */
export const useProduct = (id) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productApi.getProductById(id).then((res) => res.data),
    enabled: !!id,
  })
}

/**
 * useCreateProduct — mutation to create a new insurance product (ADMIN).
 * Invalidates all product cache entries on success.
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => productApi.createProduct(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() })
    },
  })
}

/**
 * useUpdateProduct — mutation to update an existing insurance product (ADMIN).
 * Accepts `{ id, data }`. Invalidates all product cache entries and the specific
 * product detail on success.
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => productApi.updateProduct(id, data).then((res) => res.data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) })
    },
  })
}

/**
 * useToggleProduct — mutation to activate/deactivate a product (ADMIN).
 * Accepts `{ id, active }`. Invalidates all product cache entries and the specific
 * product detail on success.
 */
export const useToggleProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, active }) => productApi.toggleProduct(id, active).then((res) => res.data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) })
    },
  })
}
