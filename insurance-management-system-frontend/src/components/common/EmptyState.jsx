/**
 * EmptyState — centered illustration + message shown when a list has no records.
 *
 * @param {{ message?: string }} props
 */
function EmptyState({ message = 'No records found.' }) {
  return (
    <div
      role="status"
      aria-label={message}
      className="flex flex-col items-center justify-center py-16 text-gray-400"
    >
      {/* Simple inbox SVG illustration */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mb-4 h-16 w-16 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m4 0v1a3 3 0 006 0v-1"
        />
      </svg>
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}

export default EmptyState
