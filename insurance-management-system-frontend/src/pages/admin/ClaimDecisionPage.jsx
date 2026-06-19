import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { decideClaimSchema } from '../../utils/validators.js'
import { useClaim, useDecideClaim } from '../../hooks/useClaims.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'
import { formatDate, formatCurrency } from '../../utils/formatters.js'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import FormTextarea from '../../components/common/FormTextarea.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import { CLAIM_STATUSES } from '../../utils/constants.js'

/**
 * Statuses that allow an admin to make a final decision.
 */
const DECIDABLE_STATUSES = [
  CLAIM_STATUSES.RECOMMENDED_APPROVAL,
  CLAIM_STATUSES.RECOMMENDED_REJECTION,
]

/**
 * Statuses that mean the claim is already fully resolved.
 */
const RESOLVED_STATUSES = [CLAIM_STATUSES.APPROVED, CLAIM_STATUSES.REJECTED]

/**
 * ClaimDecisionPage — view full claim details and optionally approve/reject.
 *
 * - Shows full claim details including agentRemarks
 * - Decision form (APPROVE/REJECT radio + adminRemarks) shown only when status
 *   is RECOMMENDED_APPROVAL or RECOMMENDED_REJECTION
 * - Form hidden when status is APPROVED or REJECTED
 *
 * Requirements: 14, 17
 */
function ClaimDecisionPage() {
  const { id } = useParams()
  const { showToast } = useToast()

  const { data: claimData, isLoading } = useClaim(id)
  const decideClaim = useDecideClaim()

  const claim = claimData?.data ?? claimData

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(decideClaimSchema),
    defaultValues: {
      decision: '',
      adminRemarks: '',
    },
  })

  function onSubmit(formData) {
    decideClaim.mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          showToast('Claim decision recorded successfully.', 'success')
        },
        onError: (error) => handleApiError(error, showToast),
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    )
  }

  if (!claim) {
    return (
      <div className="p-6 text-center text-gray-500">
        Claim not found.
      </div>
    )
  }

  const canDecide = DECIDABLE_STATUSES.includes(claim.status)
  const isResolved = RESOLVED_STATUSES.includes(claim.status)
  const isBusy = isSubmitting || decideClaim.isPending

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Claim Decision</h1>
          <p className="text-gray-500 mt-1">Claim ID: {claim.id}</p>
        </div>
        <StatusBadge status={claim.status} size="md" />
      </div>

      {/* Claim Details Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
          Claim Details
        </h2>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <DetailItem label="Policy Number" value={claim.policyNumber ?? claim.policy?.policyNumber} />
          <DetailItem
            label="Customer"
            value={claim.customerName ?? claim.customer?.username ?? claim.policy?.customer?.username}
          />
          <DetailItem label="Claim Type" value={claim.claimType} />
          <DetailItem label="Claim Amount" value={formatCurrency(claim.claimAmount)} />
          <DetailItem label="Incident Date" value={formatDate(claim.incidentDate)} />
          <DetailItem label="Submitted On" value={formatDate(claim.createdAt)} />
        </dl>

        {claim.description && (
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Description
            </dt>
            <dd className="text-sm text-gray-800 bg-gray-50 rounded-md p-3">
              {claim.description}
            </dd>
          </div>
        )}

        {claim.agentRemarks && (
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Agent Remarks
            </dt>
            <dd className="text-sm text-gray-800 bg-indigo-50 rounded-md p-3">
              {claim.agentRemarks}
            </dd>
          </div>
        )}

        {claim.adminRemarks && (
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Admin Remarks
            </dt>
            <dd className="text-sm text-gray-800 bg-teal-50 rounded-md p-3">
              {claim.adminRemarks}
            </dd>
          </div>
        )}
      </div>

      {/* Decision Form — only shown when claim is pending admin decision */}
      {canDecide && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">
            Make a Decision
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Decision radio buttons */}
            <fieldset>
              <legend className="text-sm font-medium text-gray-700 mb-2">
                Decision <span className="text-red-500">*</span>
              </legend>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="APPROVE"
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                    {...register('decision')}
                  />
                  <span className="text-sm text-gray-700 font-medium">Approve</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="REJECT"
                    className="h-4 w-4 text-red-600 focus:ring-red-500"
                    {...register('decision')}
                  />
                  <span className="text-sm text-gray-700 font-medium">Reject</span>
                </label>
              </div>
              {errors.decision && (
                <p role="alert" className="text-xs text-red-600 mt-1">
                  {errors.decision.message}
                </p>
              )}
            </fieldset>

            <FormTextarea
              label="Admin Remarks"
              name="adminRemarks"
              required
              rows={4}
              placeholder="Provide your remarks for this decision (min 10 characters)…"
              error={errors.adminRemarks?.message}
              {...register('adminRemarks')}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isBusy}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isBusy ? 'Submitting…' : 'Submit Decision'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resolved notice */}
      {isResolved && (
        <div
          className={`rounded-xl border p-4 text-sm font-medium ${
            claim.status === CLAIM_STATUSES.APPROVED
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          This claim has been{' '}
          {claim.status === CLAIM_STATUSES.APPROVED ? 'approved' : 'rejected'}. No further action
          is required.
        </div>
      )}
    </div>
  )
}

/** Small helper for a definition list row */
function DetailItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
      <dd className="mt-0.5 text-sm text-gray-900">{value ?? '—'}</dd>
    </div>
  )
}

export default ClaimDecisionPage
