import { z } from 'zod'

// ── Auth ──────────────────────────────────────────────────────────────────────

/**
 * Zod schema for the login form.
 * Validates: username (min 3), password (min 6)
 */
export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

/**
 * Zod schema for the customer registration form.
 * Validates: username, email, password, firstName, lastName,
 *            phone (10 digits), address (min 5), dateOfBirth (past date)
 */
export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  dateOfBirth: z.string().refine(
    (val) => new Date(val) < new Date(),
    'Date of birth must be in the past'
  ),
})

// ── Product ───────────────────────────────────────────────────────────────────

/**
 * Zod schema for creating/editing an insurance product.
 * Validates: name (2–100), description (10–500), category (required)
 */
export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  category: z.string().min(1, 'Category is required'),
})

// ── Plan ──────────────────────────────────────────────────────────────────────

/**
 * Zod schema for creating/editing a policy plan.
 * Validates: productId (positive int), planName (2–100),
 *            sumInsured (positive), premiumAmount (positive), tenureMonths (int ≥ 1)
 */
export const planSchema = z.object({
  productId: z.number().int().positive('Product is required'),
  planName: z.string().min(2, 'Plan name must be at least 2 characters').max(100),
  sumInsured: z.number().positive('Sum insured must be > 0'),
  premiumAmount: z.number().positive('Premium amount must be > 0'),
  tenureMonths: z.number().int().min(1, 'Tenure must be at least 1 month'),
})

// ── Policy ────────────────────────────────────────────────────────────────────

/**
 * Zod schema for purchasing a policy (customer self-purchase).
 * Validates: planId (positive int), startDate (today or future)
 */
export const purchasePolicySchema = z.object({
  planId: z.number().int().positive('Plan is required'),
  startDate: z.string().refine(
    (val) => new Date(val) >= new Date(new Date().toDateString()),
    'Start date cannot be in the past'
  ),
})

/**
 * Zod schema for issuing a policy on behalf of a customer (agent flow).
 * Extends purchasePolicySchema with a required customerId.
 */
export const issuePolicySchema = purchasePolicySchema.extend({
  customerId: z.number().int().positive('Customer is required'),
})

// ── Payment ───────────────────────────────────────────────────────────────────

/**
 * Zod schema for recording a premium payment.
 * Validates: policyId, amount (> 0), paymentDate (not future),
 *            paymentMode (enum), receiptNumber (required)
 */
export const paymentSchema = z.object({
  policyId: z.number().int().positive('Policy is required'),
  amount: z.number().positive('Amount must be > 0'),
  paymentDate: z.string().refine(
    (val) => new Date(val) <= new Date(),
    'Payment date cannot be in the future'
  ),
  paymentMode: z.enum(['CASH', 'CHEQUE', 'ONLINE', 'NEFT', 'RTGS'], {
    errorMap: () => ({ message: 'Select a valid payment mode' }),
  }),
  receiptNumber: z.string().min(1, 'Receipt number is required'),
})

// ── Claim ─────────────────────────────────────────────────────────────────────

/**
 * Zod schema for raising a claim (customer).
 * Validates: policyId, claimType, claimAmount (> 0),
 *            incidentDate (not future), description (min 20 chars)
 */
export const raiseClaimSchema = z.object({
  policyId: z.number().int().positive('Policy is required'),
  claimType: z.string().min(1, 'Claim type is required'),
  claimAmount: z.number().positive('Claim amount must be > 0'),
  incidentDate: z.string().refine(
    (val) => new Date(val) <= new Date(),
    'Incident date cannot be in the future'
  ),
  description: z.string().min(20, 'Describe the incident in at least 20 characters'),
})

/**
 * Zod schema for reviewing a claim (agent — add remarks only).
 * Validates: agentRemarks (min 10 chars)
 */
export const reviewClaimSchema = z.object({
  agentRemarks: z.string().min(10, 'Remarks must be at least 10 characters'),
})

/**
 * Zod schema for recommending a claim decision (agent).
 * Validates: recommendation (APPROVE | REJECT), agentRemarks (min 10 chars)
 */
export const recommendClaimSchema = z.object({
  recommendation: z.enum(['APPROVE', 'REJECT'], {
    errorMap: () => ({ message: 'Select a recommendation' }),
  }),
  agentRemarks: z.string().min(10, 'Remarks must be at least 10 characters'),
})

/**
 * Zod schema for making a final claim decision (admin).
 * Validates: decision (APPROVE | REJECT), adminRemarks (min 10 chars)
 */
export const decideClaimSchema = z.object({
  decision: z.enum(['APPROVE', 'REJECT'], {
    errorMap: () => ({ message: 'Select a decision' }),
  }),
  adminRemarks: z.string().min(10, 'Remarks must be at least 10 characters'),
})
