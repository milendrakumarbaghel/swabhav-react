import { createContext, useCallback, useContext, useState } from 'react'

/**
 * @typedef {'success'|'error'|'info'|'warning'} ToastType
 *
 * @typedef {Object} ToastItem
 * @property {number}    id
 * @property {string}    message
 * @property {ToastType} type
 * @property {number}    duration  - ms before auto-dismiss; 0 = persistent
 */

const ToastContext = createContext(null)

let _toastId = 0

/**
 * ToastProvider
 *
 * Manages a FIFO queue of toasts and renders them in a fixed overlay
 * in the bottom-right corner of the viewport.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  /**
   * showToast — adds a new toast to the queue.
   *
   * @param {string}    message  - the notification text
   * @param {ToastType} type     - visual variant
   * @param {number}    [duration=4000] - auto-dismiss delay in ms; 0 = persistent
   */
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++_toastId
    setToasts((prev) => [...prev, { id, message, type, duration }])

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
  }, [])

  /**
   * dismiss — manually removes a toast by id.
   *
   * @param {number} id
   */
  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  /**
   * Color classes per toast type.
   */
  const typeClasses = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-600 text-white',
  }

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}

      {/* Toast overlay — fixed bottom-right */}
      {toasts.length > 0 && (
        <div
          role="region"
          aria-label="Notifications"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role="alert"
              className={`flex items-start justify-between gap-3 rounded-lg px-4 py-3 shadow-lg text-sm ${typeClasses[toast.type] ?? typeClasses.info}`}
            >
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="shrink-0 ml-1 font-bold opacity-80 hover:opacity-100 cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

/**
 * useToast — consume the ToastContext.
 *
 * @returns {{ showToast: function(string, ToastType, number?): void, dismiss: function(number): void }}
 * @throws {Error} if called outside of ToastProvider
 */
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}
