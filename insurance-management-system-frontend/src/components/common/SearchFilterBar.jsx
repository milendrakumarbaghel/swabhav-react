import { useEffect, useState } from 'react'
import useDebounce from '../../hooks/useDebounce'

/**
 * SearchFilterBar — renders a row of filter inputs + a Reset button.
 *
 * Props:
 *   filters           {FilterConfig[]} — filter definitions
 *   values            {Record<string,string>} — current filter values
 *   onChange          {function(key, value)} — called after debounce for text, immediately for others
 *   onReset           {function} — called when Reset button is clicked
 *   searchPlaceholder {string} — placeholder for the first text filter
 *
 * FilterConfig shape:
 *   key     {string}          — maps to a key in `values`
 *   label   {string}          — input label
 *   type    {'text'|'select'|'date'}
 *   options {Array<{value,label}>} — required when type === 'select'
 */

const DEBOUNCE_DELAY = 300

function SearchFilterBar({
  filters = [],
  values = {},
  onChange,
  onReset,
  searchPlaceholder = 'Search…',
}) {
  // Local state for text inputs so the debounce doesn't lag the visible value
  const [localText, setLocalText] = useState(() => {
    const init = {}
    filters.forEach((f) => {
      if (f.type === 'text') init[f.key] = values[f.key] ?? ''
    })
    return init
  })

  // Debounce every text value
  const debouncedText = {}
  filters
    .filter((f) => f.type === 'text')
    .forEach((f) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      debouncedText[f.key] = useDebounce(localText[f.key] ?? '', DEBOUNCE_DELAY)
    })

  // Fire onChange for text filters once the debounced value settles
  useEffect(() => {
    filters
      .filter((f) => f.type === 'text')
      .forEach((f) => {
        const debounced = debouncedText[f.key]
        if (debounced !== (values[f.key] ?? '')) {
          onChange(f.key, debounced)
        }
      })
    // Only trigger when debounced text changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.values(debouncedText).join('|')])

  // Keep local text in sync when parent resets values
  useEffect(() => {
    setLocalText((prev) => {
      const next = { ...prev }
      filters.forEach((f) => {
        if (f.type === 'text') {
          next[f.key] = values[f.key] ?? ''
        }
      })
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.map((f) => (f.type === 'text' ? values[f.key] ?? '' : '')).join('|')])

  function handleTextChange(key, value) {
    setLocalText((prev) => ({ ...prev, [key]: value }))
  }

  function handleReset() {
    const cleared = {}
    filters.forEach((f) => {
      if (f.type === 'text') cleared[f.key] = ''
    })
    setLocalText(cleared)
    onReset()
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg bg-gray-50 p-3">
      {filters.map((filter, idx) => {
        if (filter.type === 'text') {
          return (
            <div key={filter.key} className="flex flex-col gap-1">
              <label
                htmlFor={`filter-${filter.key}`}
                className="text-xs font-medium text-gray-600"
              >
                {filter.label}
              </label>
              <input
                id={`filter-${filter.key}`}
                type="text"
                value={localText[filter.key] ?? ''}
                onChange={(e) => handleTextChange(filter.key, e.target.value)}
                placeholder={idx === 0 ? searchPlaceholder : filter.label}
                className="w-48 rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )
        }

        if (filter.type === 'select') {
          return (
            <div key={filter.key} className="flex flex-col gap-1">
              <label
                htmlFor={`filter-${filter.key}`}
                className="text-xs font-medium text-gray-600"
              >
                {filter.label}
              </label>
              <select
                id={`filter-${filter.key}`}
                value={values[filter.key] ?? ''}
                onChange={(e) => onChange(filter.key, e.target.value)}
                className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All</option>
                {(filter.options ?? []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )
        }

        if (filter.type === 'date') {
          return (
            <div key={filter.key} className="flex flex-col gap-1">
              <label
                htmlFor={`filter-${filter.key}`}
                className="text-xs font-medium text-gray-600"
              >
                {filter.label}
              </label>
              <input
                id={`filter-${filter.key}`}
                type="date"
                value={values[filter.key] ?? ''}
                onChange={(e) => onChange(filter.key, e.target.value)}
                className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )
        }

        return null
      })}

      {/* Reset button */}
      <button
        type="button"
        onClick={handleReset}
        className="self-end rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Reset
      </button>
    </div>
  )
}

export default SearchFilterBar
