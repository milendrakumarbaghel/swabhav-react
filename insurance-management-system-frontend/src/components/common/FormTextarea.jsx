import { forwardRef } from 'react'

/**
 * FormTextarea — labeled <textarea> with inline error message.
 *
 * Forwards the ref to the underlying <textarea> element so it works with
 * React Hook Form's `register` API.
 *
 * Props (in addition to all native <textarea> props):
 *   label    {string}  — visible label text
 *   name     {string}  — textarea name / id
 *   error    {string}  — RHF/Zod error message; renders below the field when set
 *   required {boolean} — adds a red asterisk to the label
 *   rows     {number}  — number of visible rows; default 4
 */
const FormTextarea = forwardRef(function FormTextarea(
  { label, name, error, required = false, rows = 4, className = '', ...rest },
  ref
) {
  const inputId = `field-${name}`

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <textarea
        ref={ref}
        id={inputId}
        name={name}
        rows={rows}
        aria-describedby={error ? `${inputId}-error` : undefined}
        aria-invalid={!!error}
        className={`rounded-md border px-3 py-2 text-sm text-gray-800 shadow-sm transition-colors placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y ${
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
            : 'border-gray-300 focus:border-blue-500'
        } ${className}`}
        {...rest}
      />

      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
})

export default FormTextarea
