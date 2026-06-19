import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

/**
 * Role badge color map
 * @param {'ADMIN'|'AGENT'|'CUSTOMER'} role
 * @returns {string} Tailwind CSS classes
 */
function roleBadgeClass(role) {
  const map = {
    ADMIN: 'bg-red-100 text-red-700',
    AGENT: 'bg-purple-100 text-purple-700',
    CUSTOMER: 'bg-green-100 text-green-700',
  }
  return map[role] ?? 'bg-gray-100 text-gray-700'
}

/**
 * Navbar
 *
 * Top navigation bar rendered inside AppLayout for all authenticated pages.
 *
 * Displays:
 *  - App name "InsureMS" (left)
 *  - Hamburger button to toggle the sidebar on mobile (left, next to app name)
 *  - Current user's username and role badge (right)
 *  - Logout button (right) — calls AuthContext.logout() then navigates to /login
 *
 * Props:
 *  @param {() => void} onMenuToggle - callback to toggle the Sidebar open/close state
 *
 * Requirements: 3, 24
 */
function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shadow-sm z-30 relative">
      {/* Hamburger / sidebar toggle */}
      <button
        type="button"
        onClick={onMenuToggle}
        aria-label="Toggle navigation menu"
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors lg:hidden"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Also show toggle on desktop so user can collapse sidebar */}
      <button
        type="button"
        onClick={onMenuToggle}
        aria-label="Toggle navigation menu"
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors hidden lg:flex"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* App name */}
      <span className="text-lg font-bold text-blue-700 tracking-tight select-none">
        InsureMS
      </span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User info */}
      {user && (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-sm font-medium text-gray-800">{user.username}</span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${roleBadgeClass(user.role)}`}
            >
              {user.role}
            </span>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 rounded-lg border border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
            aria-label="Logout"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      )}
    </header>
  )
}

export default Navbar
