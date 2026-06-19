import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

/**
 * Modal — portal-based accessible modal dialog.
 *
 * Features:
 *   • Rendered into document.body via ReactDOM.createPortal
 *   • Focus is trapped inside the modal while open
 *   • Closes on backdrop click or Escape key
 *   • Scrolls its own content when tall
 *
 * Props:
 *   isOpen   {boolean}          — controls visibility
 *   onClose  {function}         — called when the user dismisses the modal
 *   title    {string}           — dialog title shown in the header
 *   size     {'sm'|'md'|'lg'|'xl'} — controls max-width; default 'md'
 *   children {React.ReactNode}  — modal body content
 */

const SIZE_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

// Focusable element selectors for focus-trap
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function Modal({ isOpen, onClose, title, size = 'md', children }) {
  const dialogRef = useRef(null)
  const maxWidthClass = SIZE_MAP[size] ?? SIZE_MAP.md

  // Close on Escape key + trap focus
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll(FOCUSABLE_SELECTORS)
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Move focus into the dialog
    const firstFocusable = dialogRef.current?.querySelector(FOCUSABLE_SELECTORS)
    firstFocusable?.focus()

    // Prevent background scroll
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {/* Semi-transparent overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <div
        ref={dialogRef}
        className={`relative z-10 w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-gray-800"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body
  )
}

export default Modal
