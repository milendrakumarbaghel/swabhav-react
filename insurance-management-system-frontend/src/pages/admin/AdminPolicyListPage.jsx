import { useNavigate } from 'react-router-dom'
import { usePolicies } from '../../hooks/usePolicies.js'
import { usePagination } from '../../hooks/usePagination.js'
import { formatDate } from '../../utils/formatters.js'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'

/**
 * AdminPolicyListPage — paginated list of all policies for admin.
 *
 * Features:
 * - Paginated table via usePolicies + usePagination
 * - Shows policy number, customer name, plan name, status, start/end dates
 * - Row click navigates to /admin/policies (overview — detail view not in this task)
 *
 * Requirements: 14, 17
 */
function AdminPolicyListPage() {
  const navigate = useNavigate()
  const { params, page, pageSize, setPage, setPageSize } = usePagination()
  const { data, isLoading } = usePolicies(params)

  const records = data?.data?.content ?? []
  const totalPages = data?.data?.totalPages ?? 0
  const totalElements = data?.data?.totalElements ?? 0

  const columns = [
    { key: 'policyNumber', header: 'Policy Number', sortable: true },
    {
      key: 'customerName',
      header: 'Customer',
      render: (row) =>
        row.customerName ?? row.customer?.username ?? row.customer?.firstName ?? '—',
    },
    {
      key: 'planName',
      header: 'Plan',
      render: (row) => row.planName ?? row.plan?.planName ?? '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'startDate',
      header: 'Start Date',
      render: (row) => formatDate(row.startDate),
    },
    {
      key: 'endDate',
      header: 'End Date',
      render: (row) => formatDate(row.endDate),
    },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Policies</h1>
        <p className="text-gray-500 mt-1">View all insurance policies across all customers.</p>
      </div>

      <DataTable
        columns={columns}
        data={records}
        isLoading={isLoading}
        emptyMessage="No policies found."
        onRowClick={(row) => navigate(`/admin/policies`)}
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

export default AdminPolicyListPage
