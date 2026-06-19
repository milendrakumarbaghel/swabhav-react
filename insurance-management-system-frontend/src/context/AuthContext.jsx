import { createContext, useContext, useEffect, useState } from 'react'

/**
 * @typedef {Object} AuthUser
 * @property {number}  userId
 * @property {string}  username
 * @property {string}  email
 * @property {string}  role   - 'ADMIN' | 'AGENT' | 'CUSTOMER'
 * @property {string}  token
 */

/**
 * @typedef {Object} AuthContextValue
 * @property {AuthUser|null} user
 * @property {boolean}       isAuthenticated
 * @property {boolean}       isLoading  - true during initial mount check
 * @property {function(AuthUser): void} login
 * @property {function(): void}         logout
 */

const AuthContext = createContext(null)

/**
 * AuthProvider
 *
 * Wraps the application tree and exposes auth state to all children via useAuth().
 *
 * State:
 * - user           — parsed user object from localStorage, or null
 * - isAuthenticated — true when a valid token + user pair is present
 * - isLoading       — true until the mount-time localStorage check completes
 *
 * ALGORITHM initAuth (runs once on mount):
 *   token ← localStorage.getItem('token')
 *   user  ← JSON.parse(localStorage.getItem('user'))
 *   IF token IS NOT NULL AND user IS NOT NULL THEN
 *     setAuth({ user, isAuthenticated: true, isLoading: false })
 *   ELSE
 *     setAuth({ user: null, isAuthenticated: false, isLoading: false })
 *   END IF
 *
 * No token validation API call is made — the 401 interceptor handles token
 * expiry transparently on the first protected API call.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // initAuth — read persisted session from localStorage on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem('token')
      const userRaw = localStorage.getItem('user')

      if (token && userRaw) {
        const parsedUser = JSON.parse(userRaw)
        setUser(parsedUser)
        setIsAuthenticated(true)
      }
    } catch {
      // Corrupt localStorage data — treat as unauthenticated
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * login — persists token + user to localStorage and updates auth state.
   * @param {AuthUser} authUser - the full user object (including token) returned by the API
   */
  const login = (authUser) => {
    localStorage.setItem('token', authUser.token)
    localStorage.setItem('user', JSON.stringify(authUser))
    setUser(authUser)
    setIsAuthenticated(true)
  }

  /**
   * logout — clears localStorage, resets auth state.
   * Navigation to /login is the caller's responsibility (or the 401 interceptor).
   */
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * useAuth — consume the AuthContext.
 * @returns {AuthContextValue}
 * @throws {Error} if called outside of AuthProvider
 */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
