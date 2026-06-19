import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useState } from 'react'

import { loginSchema } from '../../utils/validators.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import * as authApi from '../../api/authApi.js'

/**
 * Role → dashboard path mapping.
 * Keeps navigation logic in one place and avoids magic strings scattered
 * across the login flow.
 */
const ROLE_DASHBOARDS = {
  CUSTOMER: '/customer/dashboard',
  AGENT: '/agent/dashboard',
  ADMIN: '/admin/dashboard',
}

/**
 * LoginPage
 *
 * Renders the login form and handles authentication.
 *
 * Flow:
 * 1. User fills in username + password, validated by `loginSchema` via RHF.
 * 2. On submit → POST /api/auth/login via `authApi.login`.
 * 3. On success → call `AuthContext.login(user)`, then navigate to:
 *    - the URL stored in `location.state.from` (if redirected from a protected
 *      route), or
 *    - the role-appropriate dashboard.
 * 4. On failure → show an error Toast with the backend message.
 */
function LoginPage() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await authApi.login(data)
      // Backend returns ApiResponse<{ token, role, userId, username, email }>
      const authUser = response.data?.data ?? response.data

      login(authUser)

      // Navigate to the page the user originally tried to visit, or their dashboard
      const from = location.state?.from?.pathname
      const dashboard = ROLE_DASHBOARDS[authUser.role] ?? '/login'
      navigate(from || dashboard, { replace: true })
    } catch (error) {
      const message =
        error.response?.data?.message ??
        error.response?.data?.error ??
        'Login failed. Please check your credentials.'
      showToast(message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back to InsureMS</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              {...register('username')}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? 'username-error' : undefined}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.username ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
              }`}
            />
            {errors.username && (
              <p id="username-error" role="alert" className="mt-1 text-xs text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
              }`}
            />
            {errors.password && (
              <p id="password-error" role="alert" className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
