import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as userApi from '../api/userApi.js'

/**
 * useUsers — paginated/filtered list of all users (ADMIN).
 * Uses inline query key — no queryKeys factory entry for users.
 *
 * @param {Object} [params] - Query parameters (page, size, sort, sortDir, role, active, search, etc.)
 */
export const useUsers = (params) => {
  return useQuery({
    queryKey: ['users', 'list', params],
    queryFn: () => userApi.getUsers(params).then((res) => res.data),
  })
}

/**
 * useCreateAgent — mutation for an ADMIN to create a new AGENT user account.
 * Invalidates all user cache entries on success.
 */
export const useCreateAgent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => userApi.createAgent(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

/**
 * useToggleUser — mutation for an ADMIN to activate/deactivate a user account.
 * Accepts `{ id, active }`. Invalidates all user cache entries on success.
 */
export const useToggleUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, active }) => userApi.toggleUser(id, active).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
