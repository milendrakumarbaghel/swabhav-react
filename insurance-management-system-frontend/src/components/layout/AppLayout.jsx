import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'

/**
 * AppLayout
 *
 * Shell layout for all authenticated pages.  Composes:
 *  - Navbar (fixed top bar with app name, user info, logout)
 *  - Sidebar (role-aware collapsible left navigation)
 *  - Main content area (renders the current page via <Outlet />)
 *
 * Sidebar state:
 *  - On large screens (≥1024px) the sidebar defaults to open and can be
 *    collapsed via the Navbar hamburger toggle.
 *  - On smaller screens it starts closed and slides in/out as an overlay.
 *
 * Requirements: 3, 24
 */
function AppLayout() {
  const { user } = useAuth()

  // Default open on desktop, closed on mobile.
  // We use a single boolean and rely on Tailwind responsive classes in
  // Sidebar to always show it on lg screens regardless of this state.
  const [sidebarOpen, setSidebarOpen] = useState(true)

  function toggleSidebar() {
    setSidebarOpen((prev) => !prev)
  }

  function closeSidebar() {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <Navbar onMenuToggle={toggleSidebar} />

      {/* Sidebar — role-aware navigation */}
      <Sidebar
        role={user?.role}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/*
        Main content area
        On large screens: offset to the right by the sidebar width (w-64 = 16rem)
        when the sidebar is open.  On mobile: full-width regardless.
      */}
      <main
        className={[
          'pt-16 min-h-screen transition-all duration-200',
          // When sidebar is open on lg, push content right
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-0',
        ].join(' ')}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Active page content */}
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout
