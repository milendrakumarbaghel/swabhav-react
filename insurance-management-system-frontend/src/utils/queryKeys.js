/**
 * @fileoverview TanStack Query key factory.
 *
 * Centralised query key definitions ensure consistent cache invalidation
 * across all domain hooks. Every key is a function so that params are
 * captured in the key array — preventing cache collisions between
 * different filter/pagination states.
 *
 * Usage examples:
 *   queryKeys.products.all()                     // ['products']
 *   queryKeys.products.list(params)              // ['products', 'list', params]
 *   queryKeys.products.detail(42)                // ['products', 'detail', 42]
 *
 *   queryKeys.claims.mine(params)                // ['claims', 'mine', params]
 *   queryKeys.claims.history(claimId)            // ['claims', 'history', claimId]
 *
 *   // Invalidate all product cache entries:
 *   queryClient.invalidateQueries({ queryKey: queryKeys.products.all() })
 *
 *   // Invalidate a specific product:
 *   queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) })
 */
export const queryKeys = {
  /** Insurance products */
  products: {
    /** Matches all product cache entries */
    all: () => ['products'],
    /** Matches paginated product list entries */
    list: (params) => ['products', 'list', params],
    /** Matches a single product by ID */
    detail: (id) => ['products', 'detail', id],
  },

  /** Policy plans */
  plans: {
    /** Matches all plan cache entries */
    all: () => ['plans'],
    /** Matches paginated plan list entries */
    list: (params) => ['plans', 'list', params],
    /** Matches plans filtered by a specific product */
    byProduct: (productId, params) => ['plans', 'byProduct', productId, params],
    /** Matches a single plan by ID */
    detail: (id) => ['plans', 'detail', id],
  },

  /** Policies */
  policies: {
    /** Matches all policy cache entries */
    all: () => ['policies'],
    /** Matches paginated policy list entries */
    list: (params) => ['policies', 'list', params],
    /** Matches the current user's own policies (customer view) */
    mine: (params) => ['policies', 'mine', params],
    /** Matches a single policy by ID */
    detail: (id) => ['policies', 'detail', id],
  },

  /** Premium payments */
  payments: {
    /** Matches all payment cache entries */
    all: () => ['payments'],
    /** Matches paginated payment list entries */
    list: (params) => ['payments', 'list', params],
    /** Matches payments filtered by a specific policy */
    byPolicy: (policyId, params) => ['payments', 'byPolicy', policyId, params],
  },

  /** Claims */
  claims: {
    /** Matches all claim cache entries */
    all: () => ['claims'],
    /** Matches paginated claim list entries */
    list: (params) => ['claims', 'list', params],
    /** Matches the current user's own claims (customer view) */
    mine: (params) => ['claims', 'mine', params],
    /** Matches a single claim by ID */
    detail: (id) => ['claims', 'detail', id],
    /** Matches the status history for a specific claim */
    history: (claimId) => ['claims', 'history', claimId],
  },

  /** Customers */
  customers: {
    /** Matches all customer cache entries */
    all: () => ['customers'],
    /** Matches paginated customer list entries */
    list: (params) => ['customers', 'list', params],
    /** Matches a single customer by ID */
    detail: (id) => ['customers', 'detail', id],
    /** Matches the current authenticated customer's own profile */
    me: () => ['customers', 'me'],
  },

  /** Current authenticated user */
  me: {
    /** Matches the current user's profile data */
    profile: () => ['me', 'profile'],
  },
}
