# Requirements Document

## Introduction

This document defines the functional requirements for the Insurance Policy and Claim Management System Frontend — a React 19 single-page application built with Vite and Tailwind CSS v4. The system supports three distinct user roles (Admin, Agent, Customer) and consumes a Spring Boot REST API. Requirements cover authentication and authorization, all role-specific feature surfaces, shared UI components, pagination and filtering, form validation, API integration, error handling, and cache management. These requirements are derived from the approved design document.

---

## Glossary

- **System**: The Insurance Policy and Claim Management System Frontend application.
- **Router**: The React Router DOM v6 client-side routing layer (`AppRouter`, `ProtectedRoute`, `RoleGuardOutlet`).
- **AuthContext**: The React context that holds JWT token, user information, and authentication state.
- **AxiosInstance**: The configured Axios HTTP client with JWT request interceptor and 401 response interceptor.
- **TanStack_Query**: The server-state caching layer (`QueryClient`, `useQuery`, `useMutation`) that manages all API data.
- **RHF**: React Hook Form — the form state management library used throughout the application.
- **Zod_Schema**: A Zod validation schema that enforces field-level constraints before form submission.
- **Customer**: An authenticated user with role `CUSTOMER` who can browse products, manage their own policies, make payments, and raise claims.
- **Agent**: An authenticated user with role `AGENT` who can manage customer policies, record payments, and review/recommend claim decisions.
- **Admin**: An authenticated user with role `ADMIN` who can manage products, plans, users, all policies, and make final claim decisions.
- **Policy**: An insurance contract between a Customer and an insurance plan, with status `PENDING_PAYMENT | ACTIVE | LAPSED | EXPIRED | CANCELLED`.
- **Claim**: A request for compensation filed against an active Policy, with status `SUBMITTED | UNDER_REVIEW | RECOMMENDED_APPROVAL | RECOMMENDED_REJECTION | APPROVED | REJECTED`.
- **DataTable**: The shared paginated table component used across all list pages.
- **Pagination**: The shared pagination control component rendering page navigation and page-size selectors.
- **SearchFilterBar**: The shared search and filter component that syncs filter values to URL search params.
- **StatusBadge**: The shared colored badge component that renders Policy and Claim statuses.
- **Toast**: The global notification component for success, error, warning, and info feedback messages.
- **ConfirmDialog**: The shared modal dialog for destructive or irreversible action confirmations.
- **usePagination**: The custom hook that manages page, pageSize, sort, sortDir, and filter state synced to URL.
- **PageParams**: The parameter object `{ page, pageSize, sort, sortDir, ...filters }` passed to all list API calls.
- **PaginatedResponse**: The backend response envelope `{ records, currentPage, pageSize, totalRecords, totalPages, isLastPage, sortField, sortDirection }`.
- **ApiResponse**: The standard backend success envelope `{ success, message, data, timestamp }`.
- **ApiError**: The standard backend error envelope `{ timestamp, statusCode, errorType, message, path }`.
- **localStorage**: The browser's `localStorage` Web Storage API used to persist the JWT token and user object.
- **ErrorBoundary**: The top-level React error boundary that catches rendering errors across the component tree.

---

## Requirements

---

### Requirement 1: User Authentication

**User Story:** As a user of any role, I want to log in and out of the system securely, so that my session is protected and my identity is verified before accessing any data.

#### Acceptance Criteria

1. WHEN a user submits valid credentials on the login form, THE System SHALL send a `POST /api/auth/login` request and receive a `{ token, role, userId, username, email }` response.
2. WHEN authentication succeeds, THE AuthContext SHALL store the JWT token and serialized user object in `localStorage` under the keys `token` and `user`.
3. WHEN a user logs out, THE System SHALL remove the `token` and `user` keys from `localStorage`, clear the AuthContext state, and navigate to `/login`.
4. WHILE `isLoading` is true in the AuthContext, THE Router SHALL render a full-screen `Spinner` instead of any route content.
5. IF no `token` key exists in `localStorage` on application mount, THEN THE System SHALL set `isAuthenticated` to `false` and restrict the user to public routes only (`/login`, `/register`, `/unauthorized`).
6. WHEN the AxiosInstance receives a `401` HTTP response, THE System SHALL remove `token` and `user` from `localStorage`, clear the AuthContext, and redirect the browser to `/login`.

---

### Requirement 2: User Registration (Customer)

**User Story:** As a new customer, I want to register an account with my personal details, so that I can access the platform and manage my insurance policies.

#### Acceptance Criteria

1. WHEN a new user submits the registration form, THE System SHALL send a `POST /api/auth/register` request containing `username`, `email`, `password`, `firstName`, `lastName`, `phone`, `address`, and `dateOfBirth`.
2. WHEN registration succeeds, THE System SHALL navigate the user to the `/login` page and display a success Toast message.
3. IF a registration request fails with a `409` conflict response, THEN THE System SHALL display the backend error message in an error Toast without clearing the form.

---

### Requirement 3: Role-Based Route Access Control

**User Story:** As a system, I want to enforce strict role-based access on every route, so that no user can access pages outside their authorized role by manipulating the URL.

#### Acceptance Criteria

1. WHEN an unauthenticated user navigates to any protected route, THE Router SHALL redirect to `/login` and preserve the attempted URL in router state.
2. WHEN an authenticated user navigates to a route whose `allowedRoles` does not include their role, THE Router SHALL redirect to `/unauthorized`.
3. WHEN an authenticated `CUSTOMER` navigates to any `/agent/*` or `/admin/*` route, THE Router SHALL redirect to `/unauthorized`.
4. WHEN an authenticated `AGENT` navigates to any `/customer/*` or `/admin/*` route, THE Router SHALL redirect to `/unauthorized`.
5. WHEN an authenticated `ADMIN` navigates to any `/customer/*` or `/agent/*` route, THE Router SHALL redirect to `/unauthorized`.
6. WHEN the root path `/` is accessed by an authenticated user, THE Router SHALL redirect to `/customer/dashboard`, `/agent/dashboard`, or `/admin/dashboard` based on the user's role.

---

### Requirement 4: Customer Profile Management

**User Story:** As a customer, I want to view and update my profile, so that my personal information is accurate and up to date.

#### Acceptance Criteria

1. WHEN a customer visits `/customer/profile`, THE System SHALL display all fields from the `Customer` entity: `firstName`, `lastName`, `phone`, `address`, `dateOfBirth`, `email`, and `username`.
2. WHEN a customer submits the profile update form, THE System SHALL send a `PUT /api/customers/me` request with the updated fields.
3. WHEN the profile update succeeds, THE System SHALL display a success Toast and re-fetch the customer profile data.
4. IF the profile update fails, THEN THE System SHALL display the backend error message in an error Toast and retain the form values.

---

### Requirement 5: Browse Insurance Products and Plans (Customer)

**User Story:** As a customer, I want to browse available insurance products and their associated plans, so that I can choose the right coverage for my needs.

#### Acceptance Criteria

1. WHEN a customer visits `/customer/products`, THE System SHALL display a paginated list of active insurance products fetched from `GET /api/products`.
2. WHEN a customer selects a product, THE System SHALL navigate to `/customer/products/:id/plans` and display the plans associated with that product via `GET /api/plans?productId=:id`.
3. WHEN a plan is displayed, THE System SHALL show `planName`, `sumInsured`, `premiumAmount`, and `tenureMonths` for each plan.
4. WHILE data is being fetched, THE DataTable SHALL display a `Spinner` component.
5. IF no products or plans are found, THEN THE DataTable SHALL display the `EmptyState` component.

---

### Requirement 6: Policy Purchase (Customer)

**User Story:** As a customer, I want to purchase an insurance policy by selecting a plan and providing a start date, so that I can get coverage under my chosen plan.

#### Acceptance Criteria

1. WHEN a customer submits the purchase policy form, THE System SHALL send a `POST /api/policies` request containing `planId` and `startDate`.
2. WHEN a policy is created with status `PENDING_PAYMENT`, THE System SHALL display a "Make Payment" action button on that policy's detail and list views.
3. WHEN a policy has status `ACTIVE`, THE System SHALL enable and display the "Raise Claim" action button.
4. WHEN a policy has status `LAPSED`, `EXPIRED`, or `CANCELLED`, THE System SHALL disable the payment and claim action buttons.
5. WHEN the policy purchase succeeds, THE TanStack_Query SHALL invalidate the `policies.all(*)` and `policies.mine(*)` cache keys.

---

### Requirement 7: Premium Payment (Customer)

**User Story:** As a customer, I want to record my premium payment for a policy, so that my policy becomes active.

#### Acceptance Criteria

1. WHEN a customer submits the payment form, THE System SHALL send a `POST /api/payments` request containing `policyId`, `amount`, `paymentDate`, `paymentMode`, and `receiptNumber`.
2. WHEN a payment is recorded successfully, THE TanStack_Query SHALL invalidate `payments.all(*)`, `payments.byPolicy(policyId, *)`, and `policies.detail(policyId)` cache keys.
3. WHEN a customer visits `/customer/payments`, THE System SHALL display a paginated payment history fetched from `GET /api/payments`.
4. WHEN a customer visits `/customer/policies/:id/pay`, THE System SHALL only allow payment recording if the policy status is `PENDING_PAYMENT` or `ACTIVE`.

---

### Requirement 8: Raise and View Claims (Customer)

**User Story:** As a customer, I want to raise a claim against an active policy and view the status of all my claims, so that I can request compensation and track progress.

#### Acceptance Criteria

1. WHEN a customer submits the raise claim form, THE System SHALL send a `POST /api/claims` request containing `policyId`, `claimType`, `claimAmount`, `incidentDate`, and `description`.
2. WHEN a claim is created, THE System SHALL display the new claim with status `SUBMITTED` in the claims list.
3. WHEN a customer visits `/customer/claims`, THE System SHALL display a paginated list of their claims fetched from `GET /api/claims/mine`.
4. WHEN a customer visits `/customer/claims/:id`, THE System SHALL display the full claim detail including `claimType`, `claimAmount`, `incidentDate`, `description`, `status`, `agentRemarks`, and `adminRemarks`.
5. WHEN a claim is created successfully, THE TanStack_Query SHALL invalidate `claims.all(*)` and `claims.mine(*)` cache keys.

---

### Requirement 9: Agent — Customer Management

**User Story:** As an agent, I want to view all customers and their details, so that I can assist them with policies and claims.

#### Acceptance Criteria

1. WHEN an agent visits `/agent/customers`, THE System SHALL display a paginated, searchable list of all customers fetched from `GET /api/customers`.
2. WHEN an agent visits `/agent/customers/:id`, THE System SHALL display all customer profile fields and a list of that customer's policies.
3. WHEN the customer list is loaded, THE DataTable SHALL support sorting by available column headers and filtering by name or status.

---

### Requirement 10: Agent — Policy and Payment Management

**User Story:** As an agent, I want to issue policies on behalf of customers and record their payments, so that customers are covered and payments are tracked.

#### Acceptance Criteria

1. WHEN an agent submits the issue policy form, THE System SHALL send a `POST /api/policies` request containing `customerId`, `planId`, and `startDate`.
2. WHEN a policy is issued successfully, THE TanStack_Query SHALL invalidate `policies.all(*)` cache keys.
3. WHEN an agent visits `/agent/payments/record`, THE System SHALL submit a `POST /api/payments` request containing `policyId`, `amount`, `paymentDate`, `paymentMode`, and `receiptNumber`.
4. WHEN an agent visits `/agent/policies`, THE System SHALL display a paginated list of all policies the agent is associated with.
5. WHEN an agent visits `/agent/payments`, THE System SHALL display a paginated list of all payments recorded through the agent.

---

### Requirement 11: Agent — Claim Review and Recommendation

**User Story:** As an agent, I want to review submitted claims and recommend an approval or rejection decision, so that claims are properly evaluated before admin final action.

#### Acceptance Criteria

1. WHEN an agent visits `/agent/claims`, THE System SHALL display a paginated claim queue of claims with statuses `SUBMITTED` or `UNDER_REVIEW`.
2. WHEN an agent views a claim with status `SUBMITTED` or `UNDER_REVIEW`, THE System SHALL display the review action form accepting `agentRemarks`.
3. WHEN an agent submits a review, THE System SHALL send a `PUT /api/claims/:id/review` request and transition the claim to status `UNDER_REVIEW`.
4. WHEN an agent submits a recommendation, THE System SHALL send a `PUT /api/claims/:id/recommend` request with a `recommendation` of `APPROVE` or `REJECT` and transition the claim to `RECOMMENDED_APPROVAL` or `RECOMMENDED_REJECTION` respectively.
5. WHEN a claim status is `APPROVED`, `REJECTED`, `RECOMMENDED_APPROVAL`, or `RECOMMENDED_REJECTION`, THE System SHALL hide the review and recommend action forms for that claim.
6. WHEN a recommendation is submitted, THE TanStack_Query SHALL invalidate `claims.detail(id)`, `claims.all(*)`, `claims.mine(*)`, and `claims.history(id)` cache keys.

---

### Requirement 12: Admin — Product and Plan Management

**User Story:** As an admin, I want to create, edit, and deactivate insurance products and plans, so that the product catalog is accurate and up to date.

#### Acceptance Criteria

1. WHEN an admin submits the create product form, THE System SHALL send a `POST /api/products` request containing `name`, `description`, and `category`.
2. WHEN an admin submits the edit product form, THE System SHALL send a `PUT /api/products/:id` request with updated fields.
3. WHEN an admin visits `/admin/products`, THE System SHALL display both active and inactive products with a `StatusBadge` showing `ACTIVE` or `INACTIVE`.
4. WHEN an admin deactivates a product, THE System SHALL send a toggle request with `active: false` and SHALL NOT send a `DELETE` request.
5. WHEN an admin reactivates a product, THE System SHALL send a toggle request with `active: true`.
6. WHEN product create, update, or toggle succeeds, THE TanStack_Query SHALL invalidate `products.all(*)` and `products.detail(id)` cache keys.
7. WHEN an admin submits the create plan form, THE System SHALL send a `POST /api/plans` request containing `productId`, `planName`, `sumInsured`, `premiumAmount`, and `tenureMonths`.
8. WHEN plan create, update, or toggle succeeds, THE TanStack_Query SHALL invalidate `plans.all(*)`, `plans.byProduct(productId, *)`, and `plans.detail(id)` cache keys.

---

### Requirement 13: Admin — User and Agent Management

**User Story:** As an admin, I want to manage all users and create agent accounts, so that I can control who has access to the system and in what capacity.

#### Acceptance Criteria

1. WHEN an admin visits `/admin/users`, THE System SHALL display a paginated list of all users showing `username`, `email`, `role`, and `active` status.
2. WHEN an admin submits the create agent form, THE System SHALL send a `POST /api/users/create-agent` request containing `username`, `email`, and `password`.
3. WHEN an admin deactivates a user, THE System SHALL send a toggle request with `active: false` and SHALL NOT send a `DELETE` request.
4. WHEN a user is deactivated, THE System SHALL display the user in the list with an inactive `StatusBadge` rather than removing the user from the list.

---

### Requirement 14: Admin — Claim Decision

**User Story:** As an admin, I want to make final approval or rejection decisions on recommended claims, so that customers receive their claim outcomes.

#### Acceptance Criteria

1. WHEN an admin visits `/admin/claims`, THE System SHALL display a paginated list of all claims.
2. WHEN an admin views a claim with status `RECOMMENDED_APPROVAL` or `RECOMMENDED_REJECTION`, THE System SHALL display the decide action form accepting `decision` and `adminRemarks`.
3. WHEN an admin submits a decision of `APPROVE`, THE System SHALL send a `PUT /api/claims/:id/decide` request and transition the claim to status `APPROVED`.
4. WHEN an admin submits a decision of `REJECT`, THE System SHALL send a `PUT /api/claims/:id/decide` request and transition the claim to status `REJECTED`.
5. WHEN a claim status is `APPROVED` or `REJECTED`, THE System SHALL hide the decide action form for that claim.
6. WHEN a decision is submitted, THE TanStack_Query SHALL invalidate `claims.detail(id)`, `claims.all(*)`, `claims.mine(*)`, and `claims.history(id)` cache keys.

---

### Requirement 15: Admin — All Policies and Payments View

**User Story:** As an admin, I want to view all policies and payments across the system, so that I have a complete financial and coverage overview.

#### Acceptance Criteria

1. WHEN an admin visits `/admin/policies`, THE System SHALL display a paginated list of all policies fetched from `GET /api/policies`.
2. WHEN an admin visits `/admin/payments`, THE System SHALL display a paginated list of all payments fetched from `GET /api/payments`.
3. WHEN a policy row is clicked, THE System SHALL navigate to the policy detail page.

---

### Requirement 16: Shared — Pagination and Filtering

**User Story:** As any authenticated user, I want list pages to support pagination, sorting, and filtering with state reflected in the URL, so that I can navigate large datasets and share filtered views.

#### Acceptance Criteria

1. WHEN a list page first loads, THE usePagination hook SHALL initialize `page` to `0`, `pageSize` to `10`, `sort` to `createdAt`, and `sortDir` to `DESC`.
2. WHEN any filter value changes, THE usePagination hook SHALL reset `page` to `0`.
3. WHEN `pageSize` is set to any value, THE usePagination hook SHALL clamp it to the range `[1, 100]`.
4. WHEN pagination or filter state changes, THE System SHALL reflect the updated state in the URL search params so that the view is bookmarkable.
5. WHEN the reset filters action is triggered, THE usePagination hook SHALL restore all params to their default values.
6. WHEN a user changes page using the `Pagination` component, THE TanStack_Query SHALL refetch the list with the new `page` param.

---

### Requirement 17: Shared — DataTable, Pagination, and Status Components

**User Story:** As any authenticated user, I want consistent list and status displays throughout the application, so that data is always readable and visually coherent.

#### Acceptance Criteria

1. WHEN `DataTable` receives `isLoading: true`, THE DataTable SHALL display a `Spinner` in place of the table body.
2. WHEN `DataTable` receives an empty `data` array, THE DataTable SHALL display the `EmptyState` component with the configured `emptyMessage`.
3. WHEN a `StatusBadge` is rendered with any `PolicyStatus` value, THE StatusBadge SHALL apply a color class matching the design specification: `PENDING_PAYMENT` → yellow, `ACTIVE` → green, `LAPSED | EXPIRED` → gray, `CANCELLED` → red.
4. WHEN a `StatusBadge` is rendered with any `ClaimStatus` value, THE StatusBadge SHALL apply a color class matching the design specification: `SUBMITTED` → blue, `UNDER_REVIEW` → indigo, `RECOMMENDED_APPROVAL` → teal, `RECOMMENDED_REJECTION` → orange, `APPROVED` → green, `REJECTED` → red.
5. WHEN a `ConfirmDialog` `onConfirm` button is clicked, THE ConfirmDialog SHALL invoke the `onConfirm` callback.
6. WHEN a `ConfirmDialog` `onCancel` button is clicked, THE ConfirmDialog SHALL invoke the `onCancel` callback.
7. WHEN `isLoading` is `true` on a `ConfirmDialog`, THE ConfirmDialog SHALL disable the confirm button and show a loading indicator.

---

### Requirement 18: Shared — TanStack Query Cache Invalidation

**User Story:** As any authenticated user, I want data to always reflect the latest server state after I perform a write operation, so that I never see stale information.

#### Acceptance Criteria

1. WHEN `purchasePolicy` or `issuePolicy` mutation succeeds, THE TanStack_Query SHALL invalidate `policies.all(*)` and `policies.mine(*)`.
2. WHEN `recordPayment` mutation succeeds, THE TanStack_Query SHALL invalidate `payments.all(*)`, `payments.byPolicy(policyId, *)`, and `policies.detail(policyId)`.
3. WHEN `raiseClaim` mutation succeeds, THE TanStack_Query SHALL invalidate `claims.all(*)` and `claims.mine(*)`.
4. WHEN `reviewClaim`, `recommendClaim`, or `decideClaim` mutation succeeds, THE TanStack_Query SHALL invalidate `claims.detail(id)`, `claims.all(*)`, `claims.mine(*)`, and `claims.history(id)`.
5. WHEN `createProduct`, `updateProduct`, or `toggleProduct` mutation succeeds, THE TanStack_Query SHALL invalidate `products.all(*)` and `products.detail(id)`.
6. WHEN `createPlan`, `updatePlan`, or `togglePlan` mutation succeeds, THE TanStack_Query SHALL invalidate `plans.all(*)`, `plans.byProduct(productId, *)`, and `plans.detail(id)`.

---

### Requirement 19: Form Validation (Zod Schemas)

**User Story:** As any user submitting a form, I want clear inline validation feedback that prevents invalid data from reaching the API, so that I can correct mistakes immediately.

#### Acceptance Criteria

1. WHEN a login form is submitted with a `username` shorter than 3 characters, THE System SHALL display a validation error below the username field without sending an API request.
2. WHEN a registration form is submitted with a `phone` that is not exactly 10 digits, THE System SHALL display a validation error below the phone field without sending an API request.
3. WHEN a payment form is submitted with an `amount` of `0` or less, THE System SHALL display a validation error below the amount field without sending an API request.
4. WHEN a claim form is submitted with an `incidentDate` in the future, THE System SHALL display a validation error below the incident date field without sending an API request.
5. WHEN a purchase policy form is submitted with a `startDate` in the past, THE System SHALL display a validation error below the start date field without sending an API request.
6. WHEN a claim form is submitted with a `description` shorter than 20 characters, THE System SHALL display a validation error below the description field without sending an API request.
7. WHEN a review or decision form is submitted with `agentRemarks` or `adminRemarks` shorter than 10 characters, THE System SHALL display a validation error below the remarks field without sending an API request.
8. WHEN all Zod schema validations pass, THE System SHALL allow form submission and fire the corresponding API request.
9. WHEN any form field has a validation error, THE System SHALL display the error message inline directly below the affected input field.

---

### Requirement 20: API Error Handling

**User Story:** As any authenticated user, I want clear feedback when an API call fails, so that I understand what went wrong and can take appropriate action.

#### Acceptance Criteria

1. WHEN an API call returns a `400` response, THE System SHALL display the `message` field from the `ApiError` response in an error Toast.
2. WHEN an API call returns a `403` response, THE System SHALL display "You do not have permission to perform this action" in an error Toast.
3. WHEN an API call returns a `404` response, THE System SHALL display the `message` field from the `ApiError` response or "Resource not found" in an error Toast.
4. WHEN an API call returns a `409` response, THE System SHALL display the `message` field from the `ApiError` response in an error Toast.
5. WHEN an API call returns a `422` response, THE System SHALL display the `message` field from the `ApiError` response in an error Toast.
6. WHEN an API call returns a `500` response, THE System SHALL display "Something went wrong. Please try again later." in an error Toast.
7. WHEN an API call fails due to a network error with no HTTP response, THE System SHALL display "Network error. Please check your connection." in an error Toast.
8. WHEN a rendering error is caught by the `ErrorBoundary`, THE System SHALL display a generic error UI rather than a blank screen.

---

### Requirement 21: Utility Functions

**User Story:** As a developer and user, I want consistently formatted dates, currencies, and status labels throughout the UI, so that data is always readable and coherent.

#### Acceptance Criteria

1. WHEN `formatCurrency` is called with any finite positive number, THE System SHALL return a string that begins with the `₹` symbol.
2. WHEN `formatDate` is called with a valid ISO 8601 date string, THE System SHALL return a non-empty human-readable date string.
3. WHEN `formatDate` is called with `null` or `undefined`, THE System SHALL return the string `'—'`.
4. WHEN `formatStatus` is called with a `SCREAMING_SNAKE_CASE` string, THE System SHALL return a `Title Case` string where each word is capitalized and underscores are replaced with spaces.

---

### Requirement 22: Input Debouncing in Search

**User Story:** As any user typing in a search field, I want the search query to be debounced before triggering an API call, so that the system does not fire excessive requests on every keystroke.

#### Acceptance Criteria

1. WHEN a user types in the `SearchFilterBar` search input, THE useDebounce hook SHALL delay propagating the value to the `PageParams` by at least the configured delay duration (default 300 ms).
2. WHEN the user stops typing and the debounce delay elapses, THE System SHALL update the filter param and trigger a new API request with the current search value.

---

### Requirement 23: Claim Status History

**User Story:** As any user viewing a claim, I want to see the full audit trail of status changes, so that I can understand how the claim has progressed.

#### Acceptance Criteria

1. WHEN a user views a claim detail page, THE System SHALL fetch claim history from `GET /api/claims/:id/history` and display each `ClaimStatusHistory` entry.
2. WHEN a claim history entry is displayed, THE System SHALL show `fromStatus`, `toStatus`, `changedBy`, `changedAt`, and `remarks` for each record.
3. IF a `ClaimStatusHistory` entry has a `null` `fromStatus`, THEN THE System SHALL display it as the initial creation event.

---

### Requirement 24: Application Provider Hierarchy and Global Configuration

**User Story:** As a developer, I want a well-defined provider hierarchy and cache configuration, so that global state, routing, and server-state management are consistent and predictable.

#### Acceptance Criteria

1. THE System SHALL wrap the application in the following provider order from outermost to innermost: `StrictMode`, `QueryClientProvider`, `BrowserRouter`, `AuthProvider`, `ToastProvider`, `AppRouter`.
2. THE TanStack_Query QueryClient SHALL configure a default `staleTime` of 30,000 ms, `gcTime` of 300,000 ms, `retry` of 1 for queries, `retry` of 0 for mutations, and `refetchOnWindowFocus` set to `false`.
3. THE AxiosInstance SHALL configure a `baseURL` from the `VITE_API_BASE_URL` environment variable with a fallback of `http://localhost:8080/api` and a request timeout of 15,000 ms.
