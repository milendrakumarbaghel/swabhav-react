import { useMutation } from '@tanstack/react-query'
import * as authApi from '../api/authApi.js'

/**
 * useLoginMutation — wraps authApi.login in a TanStack Query mutation.
 *
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (payload) => authApi.login(payload).then((res) => res.data),
  })
}

/**
 * useRegisterMutation — wraps authApi.register in a TanStack Query mutation.
 *
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (payload) => authApi.register(payload).then((res) => res.data),
  })
}
