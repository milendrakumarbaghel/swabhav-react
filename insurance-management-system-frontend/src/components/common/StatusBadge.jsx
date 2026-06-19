/**
 * StatusBadge — maps a policy/claim status string to a coloured pill.
 *
 * Color mapping (per design spec):
 *   PENDING_PAYMENT          → yellow
 *   ACTIVE                   → green
 *   LAPSED / EXPIRED         → gray
 *   CANCELLED                → red
 *   SUBMITTED                → blue
 *   UNDER_REVIEW             → indigo
 *   RECOMMENDED_APPROVAL     → teal
 *   RECOMMENDED_REJECTION    → orange
 *   APPROVED                 → green
 *   REJECTED                 → red
 *   unknown                  → gray (fallback)
 *
 * @param {{ status: string, size?: 'sm' | 'md' }} props
 */

const STATUS_CLASS_MAP = {
  PENDING_PAYMENT:       'bg-yellow-100 text-yellow-800',
  ACTIVE:                'bg-green-100 text-green-800',
  LAPSED:                'bg-gray-100 text-gray-600',
  EXPIRED:               'bg-gray-100 text-gray-600',
  CANCELLED:             'bg-red-100 text-red-700',
  SUBMITTED:             'bg-blue-100 text-blue-800',
  UNDER_REVIEW:          'bg-indigo-100 text-indigo-800',
  RECOMMENDED_APPROVAL:  'bg-teal-100 text-teal-800',
  RECOMMENDED_REJECTION: 'bg-orange-100 text-orange-800',
  APPROVED:              'bg-green-100 text-green-800',
  REJECTED:              'bg-red-100 text-red-700',
  // INACTIVE is used by admin user/product/plan toggles
  INACTIVE:              'bg-gray-100 text-gray-600',
}

const FALLBACK_CLASS = 'bg-gray-100 text-gray-600'

/**
 * Convert SCREAMING_SNAKE_CASE to Title Case for display.
 * e.g. "PENDING_PAYMENT" → "Pending Payment"
 */
function formatLabel(status) {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function StatusBadge({ status, size = 'md' }) {
  const colorClass = STATUS_CLASS_MAP[status] ?? FALLBACK_CLASS
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}
    >
      {formatLabel(status)}
    </span>
  )
}

export default StatusBadge
