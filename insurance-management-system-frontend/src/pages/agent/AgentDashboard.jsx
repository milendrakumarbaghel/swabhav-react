import { Link } from 'react-router-dom'

/**
 * AgentDashboard — summary cards linking to agent sections.
 *
 * Requirements: 9, 10, 11, 17
 */

const DASHBOARD_CARDS = [
  {
    title: 'Customers',
    description: 'Browse and search customer profiles, view their policies.',
    to: '/agent/customers',
    icon: '👤',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    iconBg: 'bg-blue-100',
  },
  {
    title: 'Policies',
    description: 'View all policies and issue new policies on behalf of customers.',
    to: '/agent/policies',
    icon: '📄',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    iconBg: 'bg-purple-100',
  },
  {
    title: 'Claim Queue',
    description: 'Review submitted and under-review claims, add remarks and recommendations.',
    to: '/agent/claims',
    icon: '🔔',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    iconBg: 'bg-orange-100',
  },
  {
    title: 'Payments',
    description: 'Record premium payments and view payment history.',
    to: '/agent/payments',
    icon: '💳',
    color: 'bg-teal-50 border-teal-200 hover:bg-teal-100',
    iconBg: 'bg-teal-100',
  },
]

function AgentDashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage customers, policies, claims, and payments.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {DASHBOARD_CARDS.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className={`flex items-start gap-4 rounded-xl border p-5 transition-colors ${card.color}`}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg text-2xl ${card.iconBg} shrink-0`}
            >
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

export default AgentDashboard
