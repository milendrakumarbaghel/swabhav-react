import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Inline fallback spinner — used while AuthContext is still initializing.
 * A full Spinner component will be available in Task 5; this keeps routing
 * functional immediately without a circular dependency.
 */
function LoadingFallback() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 flex items-center justify-center bg-white"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    </div>
  )
}

/**
 * ProtectedRoute
 *
 * A route wrapper that enforces authentication and optional role-based access.
 *
 * Behaviour:
 * 1. While AuthContext is still initialising (`isLoading === true`) → renders the
 *    inline loading fallback so the router does not flash a redirect.
 * 2. If the user is NOT authenticated → redirects to `/login` with the attempted
 *    location stored in `state.from` so `LoginPage` can restore it after login.
 * 3. If `allowedRoles` is provided and the user's role is NOT in the list →
 *    redirects to `/unauthorized`.
 * 4. Otherwise → renders the nested route via `<Outlet />`.
 *
 * @param {{ allowedRoles?: string[] }} props
 *   - allowedRoles — plain array of role strings, e.g. `['ADMIN']`.
 *                    When omitted every authenticated user is allowed through.
 */
function ProtectedRoute({ allowedRoles }) {
  const { isLoading, isAuthenticated, user } = useAuth()
  const location = useLocation()

  // Step 1 — still reading localStorage / resolving initial auth state
  if (isLoading) {
    return <LoadingFallback />
  }

  // Step 2 — unauthenticated: send to login, remember the attempted URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Step 3 — authenticated but wrong role
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  // Step 4 — all checks passed; render the child routes
  return <Outlet />
}

export default ProtectedRoute
