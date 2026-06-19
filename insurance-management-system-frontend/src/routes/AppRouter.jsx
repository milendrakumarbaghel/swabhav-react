import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

// ── Auth pages ────────────────────────────────────────────────────────────────
import LoginPage from '../pages/auth/LoginPage.jsx'
import RegisterPage from '../pages/auth/RegisterPage.jsx'

// ── Shared pages ──────────────────────────────────────────────────────────────
import UnauthorizedPage from '../pages/shared/UnauthorizedPage.jsx'
import NotFoundPage from '../pages/shared/NotFoundPage.jsx'

// ── Admin pages ───────────────────────────────────────────────────────────────
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import ProductListPage from '../pages/admin/ProductListPage.jsx'
import ProductFormPage from '../pages/admin/ProductFormPage.jsx'
import PlanListPage from '../pages/admin/PlanListPage.jsx'
import PlanFormPage from '../pages/admin/PlanFormPage.jsx'
import UserListPage from '../pages/admin/UserListPage.jsx'
import CreateAgentPage from '../pages/admin/CreateAgentPage.jsx'
import AdminPolicyListPage from '../pages/admin/AdminPolicyListPage.jsx'
import AdminClaimListPage from '../pages/admin/AdminClaimListPage.jsx'
import ClaimDecisionPage from '../pages/admin/ClaimDecisionPage.jsx'
import AllPaymentsPage from '../pages/admin/AllPaymentsPage.jsx'

// ── Placeholder — rendered for all role-specific sub-routes that will be
//    built in Tasks 8-10.  A simple div so the app doesn't crash.
function Placeholder({ title }) {
  return (
    <div className="p-8 text-center text-gray-400">
      <p className="text-lg font-medium">{title}</p>
      <p className="text-sm mt-1">Coming soon</p>
    </div>
  )
}

// ── Root redirect ─────────────────────────────────────────────────────────────

/**
 * RoleRedirect
 *
 * Renders at the root `/` path.
 * - Authenticated → redirect to role-appropriate dashboard.
 * - Loading → return null (ProtectedRoute will show the spinner upstream, but
 *   this component is also used directly below so we handle it safely).
 * - Not authenticated → redirect to `/login`.
 */
function RoleRedirect() {
  const { isLoading, isAuthenticated, user } = useAuth()

  if (isLoading) return null

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const dashboardMap = {
    CUSTOMER: '/customer/dashboard',
    AGENT: '/agent/dashboard',
    ADMIN: '/admin/dashboard',
  }
  return <Navigate to={dashboardMap[user?.role] ?? '/login'} replace />
}

// ── AppRouter ─────────────────────────────────────────────────────────────────

/**
 * AppRouter
 *
 * Full application route tree.
 *
 * Structure:
 * /                           → RoleRedirect (role-based dashboard redirect)
 * /login                      → LoginPage    (public)
 * /register                   → RegisterPage (public)
 * /unauthorized               → UnauthorizedPage (public)
 * /*                          → NotFoundPage (catch-all, public)
 *
 * /customer/*                 → ProtectedRoute [CUSTOMER]
 * /agent/*                    → ProtectedRoute [AGENT]
 * /admin/*                    → ProtectedRoute [ADMIN]
 *
 * All role-specific sub-routes are stubbed as <Placeholder /> for now;
 * each will be replaced when their respective task (8, 9, 10) is executed.
 */
function AppRouter() {
  return (
    <Routes>
      {/* ── Root ──────────────────────────────────────────────────────────── */}
      <Route path="/" element={<RoleRedirect />} />

      {/* ── Public routes ─────────────────────────────────────────────────── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* ── Customer routes ───────────────────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
        <Route path="/customer/dashboard" element={<Placeholder title="Customer Dashboard" />} />
        <Route path="/customer/profile" element={<Placeholder title="Customer Profile" />} />
        <Route path="/customer/products" element={<Placeholder title="Products" />} />
        <Route path="/customer/products/:id/plans" element={<Placeholder title="Plans" />} />
        <Route path="/customer/policies/purchase/:planId" element={<Placeholder title="Purchase Policy" />} />
        <Route path="/customer/policies" element={<Placeholder title="My Policies" />} />
        <Route path="/customer/policies/:id" element={<Placeholder title="Policy Detail" />} />
        <Route path="/customer/policies/:id/pay" element={<Placeholder title="Make Payment" />} />
        <Route path="/customer/payments" element={<Placeholder title="Payment History" />} />
        <Route path="/customer/claims" element={<Placeholder title="My Claims" />} />
        <Route path="/customer/claims/raise/:policyId" element={<Placeholder title="Raise Claim" />} />
        <Route path="/customer/claims/:id" element={<Placeholder title="Claim Detail" />} />
      </Route>

      {/* ── Agent routes ──────────────────────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={['AGENT']} />}>
        <Route path="/agent/dashboard" element={<Placeholder title="Agent Dashboard" />} />
        <Route path="/agent/customers" element={<Placeholder title="Customer List" />} />
        <Route path="/agent/customers/:id" element={<Placeholder title="Customer Detail" />} />
        <Route path="/agent/policies/issue" element={<Placeholder title="Issue Policy" />} />
        <Route path="/agent/policies" element={<Placeholder title="Policy List" />} />
        <Route path="/agent/payments/record" element={<Placeholder title="Record Payment" />} />
        <Route path="/agent/payments" element={<Placeholder title="Payment List" />} />
        <Route path="/agent/claims" element={<Placeholder title="Claim Queue" />} />
        <Route path="/agent/claims/:id/review" element={<Placeholder title="Review Claim" />} />
        <Route path="/agent/claims/history" element={<Placeholder title="Claim History" />} />
      </Route>

      {/* ── Admin routes ──────────────────────────────────────────────────── */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserListPage />} />
        <Route path="/admin/users/create-agent" element={<CreateAgentPage />} />
        <Route path="/admin/products" element={<ProductListPage />} />
        <Route path="/admin/products/new" element={<ProductFormPage />} />
        <Route path="/admin/products/:id/edit" element={<ProductFormPage />} />
        <Route path="/admin/plans" element={<PlanListPage />} />
        <Route path="/admin/plans/new" element={<PlanFormPage />} />
        <Route path="/admin/plans/:id/edit" element={<PlanFormPage />} />
        <Route path="/admin/policies" element={<AdminPolicyListPage />} />
        <Route path="/admin/claims" element={<AdminClaimListPage />} />
        <Route path="/admin/claims/:id/decide" element={<ClaimDecisionPage />} />
        <Route path="/admin/claims/history" element={<Placeholder title="Claim History" />} />
        <Route path="/admin/payments" element={<AllPaymentsPage />} />
      </Route>

      {/* ── Catch-all ─────────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRouter
