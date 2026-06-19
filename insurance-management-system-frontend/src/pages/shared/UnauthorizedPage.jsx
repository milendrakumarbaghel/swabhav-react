import { Link } from 'react-router-dom'

/**
 * UnauthorizedPage
 *
 * Rendered when an authenticated user attempts to access a route outside
 * their allowed role. Displays a 403 message with a link back to the
 * application home.
 */
function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center">
      <div className="rounded-2xl bg-white p-10 shadow-md max-w-md w-full">
        <p className="text-6xl font-bold text-red-500" aria-hidden="true">403</p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-800">Unauthorized</h1>
        <p className="mt-2 text-gray-500">
          You do not have permission to view this page.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Go back home
        </Link>
      </div>
    </main>
  )
}

export default UnauthorizedPage
