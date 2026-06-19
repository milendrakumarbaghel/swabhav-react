import { Link } from 'react-router-dom'

/**
 * AdminDashboard — summary cards linking to all admin sections.
 *
 * Requirements: 12, 13, 14, 15, 17
 */

const DASHBOARD_CARDS = [
  {
    title: 'Products',
    description: 'Manage insurance products — create, edit, and toggle active status.',
    to: '/admin/products',
    icon: '📦',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    iconBg: 'bg-blue-100',
  },
  {
    title: 'Plans',
    description: 'Manage insurance plans — configure premiums, sum insured, and tenures.',
    to: '/admin/plans',
    icon: '📋',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    iconBg: 'bg-purple-100',
  },
  {
    title: 'Users',
    description: 'Manage user accounts — view all users and create agent accounts.',
    to: '/admin/users',
    icon: '👥',
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    iconBg: 'bg-green-100',
  },
  {
    title: 'Policies',
    description: 'View all issued policies across all customers and agents.',
    to: '/admin/policies',
    icon: '📄',
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    iconBg: 'bg-yellow-100',
  },
  {
    title: 'Claims',
    description: 'Review and decide on claims recommended by agents.',
    to: '/admin/claims',
    icon: '🔔',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    iconBg: 'bg-orange-100',
  },
  {
    title: 'Payments',
    description: 'View all premium payment records across the system.',
    to: '/admin/payments',
    icon: '💳',
    color: 'bg-teal-50 border-teal-200 hover:bg-teal-100',
    iconBg: 'bg-teal-100',
  },
]

function AdminDashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage the insurance platform from one place.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DASHBOARD_CARDS.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className={`flex items-start gap-4 rounded-xl border p-5 transition-colors ${card.color}`}
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-2xl ${card.iconBg} shrink-0`}>
              {card.icon}
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">{card.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
