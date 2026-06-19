import { forwardRef } from 'react'

/**
 * FormDatePicker — labeled <input type="date"> with inline error message.
 *
 * Forwards the ref to the underlying <input> element so it works with
 * React Hook Form's `register` API.
 *
 * Props (in addition to all native <input> props):
 *   label    {string}  — visible label text
 *   name     {string}  — input name / id
 *   error    {string}  — RHF/Zod error message; renders below the field when set
 *   required {boolean} — adds a red asterisk to the label
 *   minDate  {string}  — ISO date string forwarded as the `min` attribute
 *   maxDate  {string}  — ISO date string forwarded as the `max` attribute
 */
const FormDatePicker = forwardRef(function FormDatePicker(
  { label, name, error, required = false, minDate, maxDate, className = '', ...rest },
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

      <input
        ref={ref}
        id={inputId}
        type="date"
        name={name}
        min={minDate}
        max={maxDate}
        aria-describedby={error ? `${inputId}-error` : undefined}
        aria-invalid={!!error}
        className={`rounded-md border px-3 py-2 text-sm text-gray-800 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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

export default FormDatePicker
