/**
 * @fileoverview Centralised API error handler.
 *
 * Maps HTTP status codes from the backend ApiError envelope to user-facing
 * Toast messages.  All domain hook mutation `onError` callbacks should call
 * this function.
 *
 * Backend ApiError envelope shape:
 * {
 *   timestamp:  string,
 *   statusCode: number,
 *   errorType:  string,
 *   message:    string,
 *   path:       string
 * }
 */

/**
 * Extracts a readable message from an Axios error response.
 * The backend wraps errors in `response.data.message`.
 *
 * @param {import('axios').AxiosError} error - the Axios error object
 * @returns {string|null} backend message or null if not available
 */
function getBackendMessage(error) {
  return error?.response?.data?.message ?? null
}

/**
 * Handles API errors by mapping HTTP status codes to appropriate Toast messages.
 *
 * Status code → message strategy:
 *   400  → backend message (validation / bad request)
 *   403  → "You do not have permission to perform this action"
 *   404  → backend message or "Resource not found"
 *   409  → backend message (conflict)
 *   422  → backend message (unprocessable entity)
 *   500  → generic server error message
 *   no response → network error message
 *
 * @param {import('axios').AxiosError} error  - the error thrown by Axios
 * @param {function(string, string): void} showToast - toast function from useToast()
 *   signature: showToast(message, type) where type is 'error' | 'success' | ...
 */
export function handleApiError(error, showToast) {
  if (!error.response) {
    // Network error — no HTTP response received
    showToast('Network error. Please check your connection.', 'error')
    return
  }

  const status = error.response.status
  const backendMessage = getBackendMessage(error)

  switch (status) {
    case 400:
      showToast(backendMessage || 'Invalid request. Please check your input.', 'error')
      break

    case 403:
      showToast('You do not have permission to perform this action.', 'error')
      break

    case 404:
      showToast(backendMessage || 'Resource not found.', 'error')
      break

    case 409:
      showToast(backendMessage || 'A conflict occurred. Please try again.', 'error')
      break

    case 422:
      showToast(backendMessage || 'The request could not be processed.', 'error')
      break

    case 500:
      showToast('Something went wrong. Please try again later.', 'error')
      break

    default:
      showToast(backendMessage || 'An unexpected error occurred.', 'error')
      break
  }
}
