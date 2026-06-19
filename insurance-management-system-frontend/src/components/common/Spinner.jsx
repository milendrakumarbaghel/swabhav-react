/**
 * Spinner — animated loading indicator.
 *
 * @param {{ fullScreen?: boolean }} props
 *   fullScreen — when true, renders a fixed overlay covering the entire screen.
 */
function Spinner({ fullScreen = false }) {
  const spinner = (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      <span className="sr-only">Loading…</span>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
        {spinner}
      </div>
    )
  }

  return spinner
}

export default Spinner
