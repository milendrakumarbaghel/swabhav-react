import { Link } from 'react-router-dom'
import { usePlans, useTogglePlan } from '../../hooks/usePlans.js'
import { usePagination } from '../../hooks/usePagination.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'
import { formatCurrency } from '../../utils/formatters.js'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'

/**
 * PlanListPage — paginated list of insurance plans for admin.
 *
 * Features:
 * - Paginated table via usePlans + usePagination
 * - Shows plan name, product name, sum insured, premium, tenure, status badge
 * - Toggle active/inactive (no delete)
 * - Links to create and edit plan pages
 *
 * Requirements: 13, 17
 */
function PlanListPage() {
  const { params, page, pageSize, setPage, setPageSize } = usePagination()
  const { data, isLoading } = usePlans(params)
  const togglePlan = useTogglePlan()
  const { showToast } = useToast()

  const records = data?.data?.content ?? []
  const totalPages = data?.data?.totalPages ?? 0
  const totalElements = data?.data?.totalElements ?? 0

  function handleToggle(row) {
    togglePlan.mutate(
      { id: row.id, active: !row.active },
      {
        onSuccess: () => {
          showToast(
            `Plan "${row.planName}" has been ${!row.active ? 'activated' : 'deactivated'}.`,
            'success'
          )
        },
        onError: (error) => handleApiError(error, showToast),
      }
    )
  }

  const columns = [
    { key: 'planName', header: 'Plan Name', sortable: true },
    {
      key: 'productName',
      header: 'Product',
      render: (row) => row.productName ?? row.product?.name ?? '—',
    },
    {
      key: 'sumInsured',
      header: 'Sum Insured',
      render: (row) => formatCurrency(row.sumInsured),
    },
    {
      key: 'premiumAmount',
      header: 'Premium',
      render: (row) => formatCurrency(row.premiumAmount),
    },
    {
      key: 'tenureMonths',
      header: 'Tenure (months)',
      render: (row) => `${row.tenureMonths} mo`,
    },
    {
      key: 'active',
      header: 'Status',
      render: (row) => <StatusBadge status={row.active ? 'ACTIVE' : 'INACTIVE'} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/plans/${row.id}/edit`}
            className="rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Edit
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleToggle(row)
            }}
            disabled={togglePlan.isPending}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
              row.active
                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            {row.active ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plans</h1>
          <p className="text-gray-500 mt-1">Manage insurance plans and their configuration.</p>
        </div>
        <Link
          to="/admin/plans/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + New Plan
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={records}
        isLoading={isLoading}
        emptyMessage="No plans found."
        paginationProps={{
          currentPage: page,
          totalPages,
          pageSize,
          totalRecords: totalElements,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />
    </div>
  )
}

export default PlanListPage
