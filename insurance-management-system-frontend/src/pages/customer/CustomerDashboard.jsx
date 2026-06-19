import { Link } from 'react-router-dom'

/**
 * CustomerDashboard — summary cards linking to key customer sections.
 * Requirements: 4, 5, 6, 7, 8, 17
 */
function CustomerDashboard() {
  const cards = [
    {
      title: 'Browse Products',
      description: 'Explore available insurance products and plans.',
      to: '/customer/products',
      icon: '🛡️',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      textColor: 'text-blue-700',
    },
    {
      title: 'My Policies',
      description: 'View and manage your active and past policies.',
      to: '/customer/policies',
      icon: '📋',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      textColor: 'text-green-700',
    },
    {
      title: 'My Claims',
      description: 'Track your submitted claims and their status.',
      to: '/customer/claims',
      icon: '📝',
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      textColor: 'text-orange-700',
    },
    {
      title: 'Payment History',
      description: 'View all your premium payment records.',
      to: '/customer/payments',
      icon: '💳',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      textColor: 'text-purple-700',
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Manage your insurance policies and claims from here.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className={`rounded-xl border p-6 transition-colors ${card.color}`}
          >
            <div className="mb-3 text-3xl">{card.icon}</div>
            <h2 className={`text-base font-semibold ${card.textColor}`}>{card.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CustomerDashboard
