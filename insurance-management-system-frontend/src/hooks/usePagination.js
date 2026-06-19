/**
 * @fileoverview usePagination hook — syncs page, size, sort, sortDir, and filter
 * state to the URL via react-router-dom's useSearchParams.
 *
 * Requirements: 16, 21, 22
 */

import { useSearchParams } from 'react-router-dom'
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  DEFAULT_SORT,
  DEFAULT_SORT_DIR,
} from '../utils/constants'

/**
 * Clamps a numeric value to the inclusive range [min, max].
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/** Known pagination/sort param keys — used to identify filter params. */
const PAGINATION_KEYS = new Set(['page', 'size', 'sort', 'sortDir'])

/**
 * usePagination
 *
 * Reads `page`, `size`, `sort`, `sortDir`, and any additional filter keys from
 * the URL search params. All state changes are written back to the URL so the
 * view is bookmarkable and shareable.
 *
 * Defaults (sourced from constants):
 *   page    → 0
 *   size    → DEFAULT_PAGE_SIZE (10)
 *   sort    → DEFAULT_SORT ('createdAt')
 *   sortDir → DEFAULT_SORT_DIR ('DESC')
 *
 * @param {object} [options]
 * @param {number}          [options.defaultPageSize=DEFAULT_PAGE_SIZE]
 * @param {string}          [options.defaultSort=DEFAULT_SORT]
 * @param {'ASC'|'DESC'}    [options.defaultSortDir=DEFAULT_SORT_DIR]
 *
 * @returns {{
 *   params: object,
 *   page: number,
 *   pageSize: number,
 *   sort: string,
 *   sortDir: string,
 *   setPage: (n: number) => void,
 *   setPageSize: (n: number) => void,
 *   setSort: (field: string, dir: string) => void,
 *   setFilter: (key: string, value: string|number|undefined) => void,
 *   resetFilters: () => void,
 * }}
 */
export function usePagination({
  defaultPageSize = DEFAULT_PAGE_SIZE,
  defaultSort = DEFAULT_SORT,
  defaultSortDir = DEFAULT_SORT_DIR,
} = {}) {
  const [searchParams, setSearchParams] = useSearchParams()

  // ── Derive current values from URL ─────────────────────────────────────────

  const page = clamp(
    parseInt(searchParams.get('page') ?? '0', 10) || 0,
    0,
    Number.MAX_SAFE_INTEGER
  )

  const pageSize = clamp(
    parseInt(searchParams.get('size') ?? String(defaultPageSize), 10) || defaultPageSize,
    1,
    MAX_PAGE_SIZE
  )

  const sort = searchParams.get('sort') ?? defaultSort
  const sortDir = searchParams.get('sortDir') ?? defaultSortDir

  // Collect any additional filter keys (everything that is not a pagination key)
  const filters = {}
  for (const [key, value] of searchParams.entries()) {
    if (!PAGINATION_KEYS.has(key)) {
      filters[key] = value
    }
  }

  /**
   * The params object suitable for passing directly to API calls.
   * Maps camelCase names expected by the API layer.
   */
  const params = {
    page,
    pageSize,
    sort,
    sortDir,
    ...filters,
  }

  // ── Setters ────────────────────────────────────────────────────────────────

  /**
   * Navigate to a specific page (0-indexed).
   * @param {number} n
   */
  function setPage(n) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', String(n))
      return next
    })
  }

  /**
   * Update the page size. Value is clamped to [1, 100] and page resets to 0.
   * @param {number} n
   */
  function setPageSize(n) {
    const clamped = clamp(n, 1, MAX_PAGE_SIZE)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('size', String(clamped))
      next.set('page', '0')
      return next
    })
  }

  /**
   * Update sort field and direction. Resets page to 0.
   * @param {string} field
   * @param {'ASC'|'DESC'} dir
   */
  function setSort(field, dir) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('sort', field)
      next.set('sortDir', dir)
      next.set('page', '0')
      return next
    })
  }

  /**
   * Set a single filter param. Passing undefined or '' removes the key.
   * Always resets page to 0.
   * @param {string} key
   * @param {string|number|undefined} value
   */
  function setFilter(key, value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value === undefined || value === '') {
        next.delete(key)
      } else {
        next.set(key, String(value))
      }
      next.set('page', '0')
      return next
    })
  }

  /**
   * Remove all filter params and reset pagination to defaults.
   * Keeps only the four core pagination keys.
   */
  function resetFilters() {
    setSearchParams({
      page: '0',
      size: String(defaultPageSize),
      sort: defaultSort,
      sortDir: defaultSortDir,
    })
  }

  return {
    params,
    page,
    pageSize,
    sort,
    sortDir,
    setPage,
    setPageSize,
    setSort,
    setFilter,
    resetFilters,
  }
}

export default usePagination
