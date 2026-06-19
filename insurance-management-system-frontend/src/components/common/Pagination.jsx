/**
 * Pagination — page-navigation controls + page-size selector.
 *
 * Props:
 *   currentPage      {number}   — 0-indexed current page
 *   totalPages       {number}   — total number of pages
 *   pageSize         {number}   — current page size
 *   totalRecords     {number}   — total number of records
 *   onPageChange     {function} — called with new 0-indexed page number
 *   onPageSizeChange {function} — called with new page size; optional
 *   pageSizeOptions  {number[]} — options for the page-size selector; default [10, 25, 50, 100]
 */
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}) {
  // "Showing X – Y of Z records"
  const start = totalRecords === 0 ? 0 : currentPage * pageSize + 1
  const end = Math.min((currentPage + 1) * pageSize, totalRecords)

  const isFirst = currentPage === 0
  const isLast = currentPage >= totalPages - 1

  /**
   * Build a compact page-window: always show first, last, current ±1,
   * with ellipsis placeholders where needed.
   */
  function buildPages() {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i)
    }

    const pages = new Set([0, totalPages - 1, currentPage])
    if (currentPage > 0) pages.add(currentPage - 1)
    if (currentPage < totalPages - 1) pages.add(currentPage + 1)

    const sorted = Array.from(pages).sort((a, b) => a - b)
    const result = []
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
        result.push('...')
      }
      result.push(sorted[i])
    }
    return result
  }

  const pages = buildPages()

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-3 text-sm text-gray-600">
      {/* Record count summary */}
      <span>
        Showing{' '}
        <span className="font-medium text-gray-800">
          {start}–{end}
        </span>{' '}
        of{' '}
        <span className="font-medium text-gray-800">{totalRecords}</span>{' '}
        records
      </span>

      {/* Page navigation */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirst}
          aria-label="Previous page"
          className="rounded px-2 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ‹
        </button>

        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-1 select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p + 1}`}
              aria-current={p === currentPage ? 'page' : undefined}
              className={`min-w-[2rem] rounded px-2 py-1 font-medium transition-colors ${
                p === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {p + 1}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLast}
          aria-label="Next page"
          className="rounded px-2 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ›
        </button>
      </div>

      {/* Page-size selector */}
      {onPageSizeChange && (
        <label className="flex items-center gap-2">
          Rows per page
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded border border-gray-300 px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  )
}

export default Pagination
