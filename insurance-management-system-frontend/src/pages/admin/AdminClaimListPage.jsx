import { useNavigate } from 'react-router-dom'
import { useClaims } from '../../hooks/useClaims.js'
import { usePagination } from '../../hooks/usePagination.js'
import { formatCurrency } from '../../utils/formatters.js'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'

/**
 * AdminClaimListPage — paginated list of all claims for admin.
 *
 * Features:
 * - Paginated table via useClaims + usePagination
 * - Shows claim ID, policy number, customer, claim type, amount, status badge
 * - Row click navigates to /admin/claims/:id/decide
 *
 * Requirements: 14, 17
 */
function AdminClaimListPage() {
  const navigate = useNavigate()
  const { params, page, pageSize, setPage, setPageSize } = usePagination()
  const { data, isLoading } = useClaims(params)

  const records = data?.data?.content ?? []
  const totalPages = data?.data?.totalPages ?? 0
  const totalElements = data?.data?.totalElements ?? 0

  const columns = [
    { key: 'id', header: 'Claim ID', sortable: true },
    {
      key: 'policyNumber',
      header: 'Policy Number',
      render: (row) => row.policyNumber ?? row.policy?.policyNumber ?? '—',
    },
    {
      key: 'customerName',
      header: 'Customer',
      render: (row) =>
        row.customerName ?? row.customer?.username ?? row.policy?.customer?.username ?? '—',
    },
    { key: 'claimType', header: 'Claim Type', sortable: true },
    {
      key: 'claimAmount',
      header: 'Amount',
      render: (row) => formatCurrency(row.claimAmount),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Claims</h1>
        <p className="text-gray-500 mt-1">
          Review and decide on claims across the platform. Click a row to make a decision.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={records}
        isLoading={isLoading}
        emptyMessage="No claims found."
        onRowClick={(row) => navigate(`/admin/claims/${row.id}/decide`)}
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

export default AdminClaimListPage
