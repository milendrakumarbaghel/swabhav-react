/**
 * @fileoverview useDebounce hook — delays propagating a value until the user
 * stops changing it for `delay` milliseconds.
 *
 * Used by SearchFilterBar to avoid firing an API request on every keystroke.
 *
 * Requirements: 22
 */

import { useState, useEffect } from 'react'

/**
 * useDebounce
 *
 * Returns a debounced copy of `value` that only updates after `delay` ms
 * have elapsed since the last change.
 *
 * @template T
 * @param {T} value  - The value to debounce.
 * @param {number} [delay=300] - Debounce delay in milliseconds.
 * @returns {T} The debounced value.
 *
 * @example
 * const debouncedSearch = useDebounce(searchText, 300)
 * // debouncedSearch updates 300 ms after the user stops typing
 */
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cancel the pending timeout whenever value or delay changes
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
