# Implementation Plan: Insurance Policy and Claim Management System — Frontend

## Overview

This plan builds the Insurance Policy and Claim Management System frontend in 13 sequential groups, following the approved design build order: scaffold → routing → layout → shared infrastructure → shared components → API services → domain hooks → admin pages → agent pages → customer pages → error handling integration → unit tests → property-based tests.

All implementation uses **JavaScript (JSX)** — no TypeScript.

## Tasks

- [x] 1. Project Scaffold — install dependencies, create folder structure, and wire global configuration
  - Install runtime dependencies: `react-router-dom axios @tanstack/react-query react-hook-form zod @hookform/resolvers`
  - Create the full `src/` folder tree: `api/`, `components/common/`, `components/layout/`, `context/`, `hooks/`, `pages/auth/`, `pages/customer/`, `pages/agent/`, `pages/admin/`, `routes/`, `utils/`
  - Create `src/utils/constants.js` — export `POLICY_STATUSES`, `CLAIM_STATUSES`, `PAYMENT_MODES`, `DEFAULT_PAGE_SIZE`, `MAX_PAGE_SIZE`, `DEFAULT_SORT`, `DEFAULT_SORT_DIR` as plain JS constants (no TypeScript enums); document shape with JSDoc comments
  - Create `src/api/axiosInstance.js` — Axios instance with `baseURL` from `import.meta.env.VITE_API_BASE_URL` (fallback `http://localhost:8080/api`), 15 000 ms timeout, JWT request interceptor (attaches `Authorization: Bearer <token>`), and 401 response interceptor that removes `token`/`user` from `localStorage` and redirects to `/login`
  - Create `src/context/AuthContext.jsx` — `AuthProvider` with `isLoading`, `isAuthenticated`, `user` state; `login()` and `logout()` helpers; `initAuth` effect on mount (reads `token`/`user` from `localStorage`, sets `isLoading: false`); export `useAuth` hook
  - Create `src/utils/formatters.js` — `formatDate`, `formatDateTime`, `formatCurrency` (₹ prefix), `formatStatus` (SCREAMING_SNAKE_CASE → Title Case)
  - Create `src/utils/validators.js` — Zod schemas: `loginSchema`, `registerSchema`, `productSchema`, `planSchema`, `purchasePolicySchema`, `issuePolicySchema`, `paymentSchema`, `raiseClaimSchema`, `reviewClaimSchema`, `recommendClaimSchema`, `decideClaimSchema`
  - Create `src/utils/queryKeys.js` — `queryKeys` factory object for `products`, `plans`, `policies`, `payments`, `claims`, `customers`, `me`
  - Create `src/utils/handleApiError.js` — `handleApiError(error, showToast)` implementing error-mapping: 400 → backend message, 403 → permission message, 404 → backend message or "Resource not found", 409/422 → backend message, 500 → generic message, no response → network error message
  - Wire `src/main.jsx` with provider hierarchy: `StrictMode → QueryClientProvider (staleTime 30 000, gcTime 300 000, retry 1, mutations retry 0, refetchOnWindowFocus false) → BrowserRouter → AuthProvider → ToastProvider → AppRouter`
  - _Requirements: 1, 24_

- [x] 2. Routing — AppRouter, route guards, and auth pages
  - Create `src/routes/ProtectedRoute.jsx` — reads `isLoading`, `isAuthenticated`, `user.role` from `useAuth`; renders `<Spinner fullScreen />` while loading; redirects unauthenticated users to `/login` with `state={{ from: location }}`; redirects role-mismatched users to `/unauthorized`; otherwise renders `<Outlet />`; accepts `allowedRoles` prop (plain array)
  - Create `src/routes/AppRouter.jsx` — full route tree: public routes (`/login`, `/register`, `/unauthorized`, `*`); customer routes under `/customer/*` guarded by `ProtectedRoute allowedRoles={['CUSTOMER']}`; agent routes under `/agent/*` guarded by `allowedRoles={['AGENT']}`; admin routes under `/admin/*` guarded by `allowedRoles={['ADMIN']}`; root `/` redirects to role-appropriate dashboard
  - Create `src/pages/auth/LoginPage.jsx` — RHF + `loginSchema`; on success calls `AuthContext.login()` and navigates to role dashboard; on failure shows error Toast
  - Create `src/pages/auth/RegisterPage.jsx` — RHF + `registerSchema`; on success navigates to `/login` with success Toast; on 409 shows conflict error Toast without clearing the form
  - Create `src/pages/shared/UnauthorizedPage.jsx` and `src/pages/shared/NotFoundPage.jsx`
  - _Requirements: 1, 2, 3, 24_

- [x] 3. Layout Shell — AppLayout, AuthLayout, Navbar, Sidebar, ErrorBoundary
  - Create `src/components/layout/AuthLayout.jsx` — centered card layout for login/register pages; renders `<Outlet />`
  - Create `src/components/layout/Navbar.jsx` — displays app name, current user's username and role badge, and a Logout button that calls `AuthContext.logout()`
  - Create `src/components/layout/Sidebar.jsx` — role-aware navigation links; accepts `role`, `isOpen`, `onClose` props; renders only nav items applicable to the given role
  - Create `src/components/layout/AppLayout.jsx` — wraps authenticated pages with `Navbar` + collapsible `Sidebar` + main content area; renders `<Outlet />`
  - Create `src/components/common/ErrorBoundary.jsx` — class-based React ErrorBoundary that catches rendering errors and displays a generic error UI instead of a blank screen
  - _Requirements: 3, 20, 24_

- [x] 4. Shared Infrastructure — usePagination, useDebounce
  - Create `src/hooks/usePagination.js` — reads `page`, `size`, `sort`, `sortDir`, and filter keys from `useSearchParams`; clamps `pageSize` to `[1, 100]`; exposes `setPage`, `setPageSize`, `setSort`, `setFilter` (resets page to 0 on any filter/sort change), and `resetFilters`; all changes reflected in URL search params
  - Create `src/hooks/useDebounce.js` — `useDebounce(value, delay)` hook; delays propagating value until `delay` ms after last change (default 300 ms)
  - _Requirements: 16, 21, 22_

- [x] 5. Shared Components — UI component library
  - Create `src/components/common/Spinner.jsx` — accepts optional `fullScreen` prop; renders centered loading spinner
  - Create `src/components/common/EmptyState.jsx` — accepts `message` prop; renders centered empty-state illustration and message
  - Create `src/components/common/StatusBadge.jsx` — accepts `status` and optional `size` props; maps status string to Tailwind color classes per design spec (PENDING_PAYMENT→yellow, ACTIVE→green, LAPSED/EXPIRED→gray, CANCELLED→red, SUBMITTED→blue, UNDER_REVIEW→indigo, RECOMMENDED_APPROVAL→teal, RECOMMENDED_REJECTION→orange, APPROVED→green, REJECTED→red)
  - Create `src/components/common/Pagination.jsx` — accepts `currentPage`, `totalPages`, `pageSize`, `totalRecords`, `onPageChange`, `onPageSizeChange`, `pageSizeOptions` props; renders page buttons and page-size selector
  - Create `src/components/common/DataTable.jsx` — accepts `columns`, `data`, `isLoading`, `emptyMessage`, `onRowClick`, `paginationProps` props; shows `Spinner` when loading, `EmptyState` when data is empty, sortable column headers, inline `Pagination` when `paginationProps` provided
  - Create `src/components/common/SearchFilterBar.jsx` — accepts `filters`, `values`, `onChange`, `onReset`, `searchPlaceholder` props; renders text/select/date inputs; uses `useDebounce` on text search before calling `onChange`
  - Create `src/components/common/Modal.jsx` — portal-based modal accepting `isOpen`, `onClose`, `title`, `size`, `children` props; traps focus; closes on backdrop click or Escape key
  - Create `src/components/common/ConfirmDialog.jsx` — modal accepting `isOpen`, `title`, `message`, `confirmLabel`, `cancelLabel`, `variant`, `onConfirm`, `onCancel`, `isLoading` props; disables confirm button and shows loading indicator when `isLoading` is true
  - Create `src/components/common/Toast.jsx` and `src/context/ToastContext.jsx` — `ToastProvider` with toast queue; `useToast()` hook exposing `showToast(message, type, duration?)`; renders toasts in fixed corner overlay with auto-dismiss
  - Create form field components `src/components/common/FormInput.jsx`, `FormSelect.jsx`, `FormDatePicker.jsx`, `FormTextarea.jsx` — each accepts `label`, `name`, `error`, `required` props; renders input with inline error message below the field when `error` is set
  - _Requirements: 17, 20_

- [x] 6. API Services — all 9 API modules
  - Create `src/api/authApi.js` — `login(payload)` → `POST /api/auth/login`, `register(payload)` → `POST /api/auth/register`, `logout()` helper
  - Create `src/api/customerApi.js` — `getCustomers(params)`, `getCustomerById(id)`, `getMyProfile()` → `GET /api/customers/me`, `updateMyProfile(data)` → `PUT /api/customers/me`
  - Create `src/api/productApi.js` — `getProducts(params)`, `getProductById(id)`, `createProduct(data)`, `updateProduct(id, data)`, `toggleProduct(id, active)` → PATCH with `{ active }`, never DELETE
  - Create `src/api/planApi.js` — `getPlans(params)`, `getPlansByProduct(productId, params)`, `getPlanById(id)`, `createPlan(data)`, `updatePlan(id, data)`, `togglePlan(id, active)` → PATCH with `{ active }`, never DELETE
  - Create `src/api/policyApi.js` — `getPolicies(params)`, `getMyPolicies(params)` → `GET /api/policies/mine`, `getPolicyById(id)`, `purchasePolicy(data)` → `POST /api/policies`, `issuePolicy(data)` → `POST /api/policies` with `customerId`
  - Create `src/api/paymentApi.js` — `getPayments(params)`, `getPaymentsByPolicy(policyId, params)`, `recordPayment(data)` → `POST /api/payments`
  - Create `src/api/claimApi.js` — `getClaims(params)`, `getMyClaims(params)` → `GET /api/claims/mine`, `getClaimById(id)`, `raiseClaim(data)` → `POST /api/claims`, `reviewClaim(id, data)` → `PUT /api/claims/:id/review`, `recommendClaim(id, data)` → `PUT /api/claims/:id/recommend`, `decideClaim(id, data)` → `PUT /api/claims/:id/decide`
  - Create `src/api/claimHistoryApi.js` — `getClaimHistory(claimId)` → `GET /api/claims/:id/history`
  - Create `src/api/userApi.js` — `getUsers(params)` → `GET /api/users`, `createAgent(data)` → `POST /api/users/create-agent`, `toggleUser(id, active)` → PATCH with `{ active }`, never DELETE
  - _Requirements: 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 23_

- [x] 7. Domain Hooks — TanStack Query wrappers with cache invalidation
  - Create `src/hooks/useAuthMutations.js` — `useLoginMutation()` and `useRegisterMutation()` mutations wrapping `authApi`
  - Create `src/hooks/useCustomers.js` — `useCustomers(params)`, `useCustomer(id)`, `useMyProfile()` (key `customers.me()`), `useUpdateMyProfile()` mutation (invalidates `customers.me`)
  - Create `src/hooks/useProducts.js` — `useProducts(params)`, `useProduct(id)`, `useCreateProduct()`, `useUpdateProduct()`, `useToggleProduct()` mutations; writes invalidate `products.all(*)` and `products.detail(id)`
  - Create `src/hooks/usePlans.js` — `usePlans(params)`, `usePlansByProduct(productId, params)`, `usePlan(id)`, `useCreatePlan()`, `useUpdatePlan()`, `useTogglePlan()` mutations; writes invalidate `plans.all(*)`, `plans.byProduct(productId, *)`, `plans.detail(id)`
  - Create `src/hooks/usePolicies.js` — `usePolicies(params)`, `useMyPolicies(params)`, `usePolicy(id)`, `usePurchasePolicy()` mutation (invalidates `policies.all(*)`, `policies.mine(*)`), `useIssuePolicy()` mutation (invalidates same)
  - Create `src/hooks/usePayments.js` — `usePayments(params)`, `usePaymentsByPolicy(policyId, params)`, `useRecordPayment()` mutation (invalidates `payments.all(*)`, `payments.byPolicy(policyId, *)`, `policies.detail(policyId)`)
  - Create `src/hooks/useClaims.js` — `useClaims(params)`, `useMyClaims(params)`, `useClaim(id)`, `useRaiseClaim()` (invalidates `claims.all(*)`, `claims.mine(*)`), `useReviewClaim()`, `useRecommendClaim()`, `useDecideClaim()` mutations (all three invalidate `claims.detail(id)`, `claims.all(*)`, `claims.mine(*)`, `claims.history(id)`)
  - Create `src/hooks/useClaimHistory.js` — `useClaimHistory(claimId)` query wrapping `claimHistoryApi.getClaimHistory`
  - Create `src/hooks/useUsers.js` — `useUsers(params)`, `useCreateAgent()`, `useToggleUser()` mutations
  - _Requirements: 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 23_

- [-] 8. Admin Pages — products, plans, users, policies, claims, payments
  - Create `src/pages/admin/AdminDashboard.jsx` — summary cards linking to products, users, policies, claims, payments
  - Create `src/pages/admin/ProductListPage.jsx` — paginated table via `useProducts` + `usePagination`; `StatusBadge` for active/inactive; toggle buttons (no delete); links to create and edit
  - Create `src/pages/admin/ProductFormPage.jsx` — shared create/edit form for `/admin/products/new` and `/:id/edit`; RHF + `productSchema`; calls `useCreateProduct` or `useUpdateProduct`
  - Create `src/pages/admin/PlanListPage.jsx` — paginated table via `usePlans` + `usePagination`; shows plan name, product, sum insured, premium, tenure, status badge; toggle active/inactive
  - Create `src/pages/admin/PlanFormPage.jsx` — shared create/edit form for `/admin/plans/new` and `/:id/edit`; RHF + `planSchema`; `productId` select from `useProducts`
  - Create `src/pages/admin/UserListPage.jsx` — paginated table via `useUsers` + `usePagination`; shows username, email, role, active `StatusBadge`; toggle deactivate/reactivate (no delete); deactivated users remain in list; link to create agent page
  - Create `src/pages/admin/CreateAgentPage.jsx` — form with username, email, password; calls `useCreateAgent`; success Toast and navigate to `/admin/users`
  - Create `src/pages/admin/AdminPolicyListPage.jsx` — paginated table of all policies via `usePolicies` + `usePagination`; `StatusBadge` for status; row click navigates to policy detail
  - Create `src/pages/admin/AdminClaimListPage.jsx` — paginated table of all claims via `useClaims` + `usePagination`; `StatusBadge` for status; row click navigates to `/admin/claims/:id/decide`
  - Create `src/pages/admin/ClaimDecisionPage.jsx` — loads claim via `useClaim(id)`; shows full claim details including agent remarks; shows decide form (RHF + `decideClaimSchema`, decision radio APPROVE/REJECT + `adminRemarks` textarea) only when status is `RECOMMENDED_APPROVAL` or `RECOMMENDED_REJECTION`; hides form when status is `APPROVED` or `REJECTED`; calls `useDecideClaim`
  - Create `src/pages/admin/AllPaymentsPage.jsx` — paginated table of all payments via `usePayments` + `usePagination`
  - _Requirements: 12, 13, 14, 15, 17_

- [-] 9. Agent Pages — customers, policies, payments, claim queue, claim review
  - Create `src/pages/agent/AgentDashboard.jsx` — summary cards linking to customers, policies, claim queue, payments
  - Create `src/pages/agent/CustomerListPage.jsx` — paginated, searchable/filterable table via `useCustomers` + `usePagination` + `SearchFilterBar`; sortable column headers; row click → customer detail
  - Create `src/pages/agent/CustomerDetailPage.jsx` — loads customer via `useCustomer(id)`; displays all profile fields; secondary paginated policy table filtered by `customerId`
  - Create `src/pages/agent/IssuePolicyPage.jsx` — RHF + `issuePolicySchema`; customer select (from `useCustomers`), plan select (from `usePlans`), startDate; calls `useIssuePolicy`
  - Create `src/pages/agent/PolicyListPage.jsx` — paginated list of agent-associated policies via `usePolicies` + `usePagination`; `StatusBadge` for status
  - Create `src/pages/agent/RecordPaymentPage.jsx` — RHF + `paymentSchema`; policy select or pre-filled from query param; calls `useRecordPayment`
  - Create `src/pages/agent/PaymentListPage.jsx` — paginated list of payments recorded by the agent via `usePayments` + `usePagination`
  - Create `src/pages/agent/ClaimQueuePage.jsx` — paginated table of claims with status `SUBMITTED` or `UNDER_REVIEW` via `useClaims` + `usePagination`; row click → review page
  - Create `src/pages/agent/ReviewClaimPage.jsx` — loads claim via `useClaim(id)`; shows full claim detail with `StatusBadge`; renders review form (RHF + `reviewClaimSchema`) and recommend form (RHF + `recommendClaimSchema`) only when status is `SUBMITTED` or `UNDER_REVIEW`; hides both forms when status is `APPROVED`, `REJECTED`, `RECOMMENDED_APPROVAL`, or `RECOMMENDED_REJECTION`; calls `useReviewClaim` and `useRecommendClaim`
  - Create `src/pages/agent/ClaimHistoryPage.jsx` — list of claim status history entries via `useClaimHistory`; shows `fromStatus`, `toStatus`, `changedBy`, `changedAt`, `remarks`; null `fromStatus` displayed as initial creation event
  - _Requirements: 9, 10, 11, 17_

- [ ] 10. Customer Pages — products, plans, purchase, policies, payments, claims
  - Create `src/pages/customer/CustomerDashboard.jsx` — summary cards linking to products, my policies, my claims, payment history
  - Create `src/pages/customer/CustomerProfile.jsx` — loads profile via `useMyProfile()`; displays all fields; RHF profile update form calling `useUpdateMyProfile`; success Toast and re-fetch; error Toast on failure
  - Create `src/pages/customer/ProductsPage.jsx` — paginated list of active products via `useProducts` + `usePagination`; `Spinner` while loading, `EmptyState` when empty; row click → `/customer/products/:id/plans`
  - Create `src/pages/customer/PlansPage.jsx` — fetches plans for selected product via `usePlansByProduct(productId, params)`; displays `planName`, `sumInsured`, `premiumAmount`, `tenureMonths`; each plan has a "Purchase" button → `/customer/policies/purchase/:planId`
  - Create `src/pages/customer/PurchasePolicyPage.jsx` — RHF + `purchasePolicySchema`; `planId` pre-filled from route param; `startDate` date picker (cannot be in past); calls `usePurchasePolicy`; success navigates to `/customer/policies`
  - Create `src/pages/customer/MyPoliciesPage.jsx` — paginated list via `useMyPolicies` + `usePagination`; `StatusBadge`; action buttons by status: `PENDING_PAYMENT`/`ACTIVE` → "Make Payment", `ACTIVE` → "Raise Claim", `LAPSED`/`EXPIRED`/`CANCELLED` → buttons disabled; row click → policy detail
  - Create `src/pages/customer/PolicyDetailPage.jsx` — loads policy via `usePolicy(id)`; displays all fields with `StatusBadge`; same action button logic as MyPoliciesPage
  - Create `src/pages/customer/MakePaymentPage.jsx` — loads policy via `usePolicy(id)` to verify status is `PENDING_PAYMENT` or `ACTIVE`; RHF + `paymentSchema`; `policyId` pre-filled; calls `useRecordPayment`
  - Create `src/pages/customer/PaymentHistoryPage.jsx` — paginated list of customer payments via `usePayments` + `usePagination`
  - Create `src/pages/customer/MyClaimsPage.jsx` — paginated list via `useMyClaims` + `usePagination`; `StatusBadge`; row click → claim detail
  - Create `src/pages/customer/RaiseClaimPage.jsx` — RHF + `raiseClaimSchema`; `policyId` pre-filled from route param; claimType, claimAmount, incidentDate (cannot be future), description (min 20 chars); calls `useRaiseClaim`
  - Create `src/pages/customer/ClaimDetailPage.jsx` — loads claim via `useClaim(id)` and history via `useClaimHistory(id)`; displays all claim fields including `agentRemarks`, `adminRemarks`, `StatusBadge`; renders full status history timeline; null `fromStatus` shown as initial creation event
  - _Requirements: 4, 5, 6, 7, 8, 17_

- [~] 11. Error Handling Integration
  - Wire `handleApiError` into every domain hook's mutation `onError` callback so all API errors (400, 403, 404, 409, 422, 500, network) produce the correct Toast message
  - Wrap the application root with `ErrorBoundary` (inside providers, around `AppRouter`) so rendering errors show a generic error UI
  - Verify the Axios 401 interceptor clears `localStorage` keys `token` and `user` and redirects to `/login` on any 401 response
  - _Requirements: 20_

- [~] 12. Unit and Integration Tests
  - Write unit tests for `src/utils/formatters.js` — `formatCurrency` returns ₹ prefix for any positive number; `formatDate` returns non-empty string for valid ISO date and `'—'` for null/undefined; `formatStatus` converts SCREAMING_SNAKE_CASE to Title Case
  - Write unit tests for all Zod schemas in `src/utils/validators.js` — valid inputs pass; boundary values trigger correct errors (username < 3 chars, phone not 10 digits, amount ≤ 0, future incidentDate, past startDate for policy, description < 20 chars, remarks < 10 chars)
  - Write unit tests for `StatusBadge` — every `POLICY_STATUSES` and `CLAIM_STATUSES` value renders without error and produces a non-empty Tailwind color class
  - Write unit tests for `DataTable` — shows `Spinner` when `isLoading` is true; shows `EmptyState` when `data` is an empty array; calls `onRowClick` with the correct row on click
  - Write unit tests for `ConfirmDialog` — calls `onConfirm` when confirm button clicked; calls `onCancel` when cancel button clicked; confirm button disabled when `isLoading` is true
  - Write unit tests for `usePagination` — initial values match defaults; `setFilter` resets page to 0; `setPageSize` clamps to `[1, 100]`; `resetFilters` restores all defaults; changes reflected in URL search params
  - _Requirements: 16, 17, 19, 21, 22_

- [~] 13. Property-Based Tests
  - Install `fast-check` as a dev dependency
  - Write PBT for `usePagination` pagination bounds — for any arbitrary page and pageSize inputs, `params.pageSize` is always in `[1, 100]` and `params.page` is always `≥ 0`; a filter change always resets `params.page` to `0` (**Validates: Requirements 16.1, 16.2, 16.3**)
  - Write PBT for `StatusBadge` coverage — for every value in `POLICY_STATUSES` and `CLAIM_STATUSES`, `StatusBadge` renders without throwing and the rendered output contains a non-empty CSS class string (**Validates: Requirements 17.3, 17.4**)
  - Write PBT for `formatCurrency` — for any arbitrary finite positive number, the return value starts with `₹` (**Validates: Requirement 21.1**)
  - Write PBT for `queryKeys` uniqueness — for any two distinct params objects, their serialized query keys must not be equal (no cache collision between different filter states) (**Validates: Requirement 18**)
  - _Requirements: 16, 17, 21, 22_

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1"] },
    { "wave": 2, "tasks": ["2"] },
    { "wave": 3, "tasks": ["3"] },
    { "wave": 4, "tasks": ["4"] },
    { "wave": 5, "tasks": ["5"] },
    { "wave": 6, "tasks": ["6"] },
    { "wave": 7, "tasks": ["7"] },
    { "wave": 8, "tasks": ["8", "9", "10"] },
    { "wave": 9, "tasks": ["11"] },
    { "wave": 10, "tasks": ["12", "13"] }
  ]
}
```

## Notes

- All files use `.js` / `.jsx` extensions — no TypeScript
- All list pages follow the same pattern: `usePagination` → domain hook query → `DataTable` + `SearchFilterBar` + `Pagination`
- All forms follow the same pattern: RHF + Zod schema via `@hookform/resolvers` → domain hook mutation → success Toast + cache invalidation → error Toast via `handleApiError`
- No page ever uses a DELETE HTTP method — deactivation is always a toggle PATCH with `{ active: false }`
- Task 4 (`usePagination`, `useDebounce`) must be completed before Task 5 (`SearchFilterBar` depends on `useDebounce`)
- Task 5 (`Spinner`, `EmptyState`) must be completed before Task 2 (`ProtectedRoute` uses `Spinner`) — wire `Spinner` in Task 3 or stub it during Task 2 development
- The `fast-check` PBT library (Task 13) only needs to be added as a dev dependency; it has no effect on production builds
