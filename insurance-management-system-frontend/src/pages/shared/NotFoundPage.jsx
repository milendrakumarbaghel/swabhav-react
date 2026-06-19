import { Link } from 'react-router-dom'

/**
 * NotFoundPage
 *
 * Catch-all route for any path that does not match the application's
 * route tree. Displays a 404 message with a link back to the home page.
 */
function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center">
      <div className="rounded-2xl bg-white p-10 shadow-md max-w-md w-full">
        <p className="text-6xl font-bold text-blue-500" aria-hidden="true">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-800">Page Not Found</h1>
        <p className="mt-2 text-gray-500">
          The page you are looking for does not exist or has been moved.
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

export default NotFoundPage
