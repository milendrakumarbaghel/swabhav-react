import { usePayments } from '../../hooks/usePayments.js'
import { usePagination } from '../../hooks/usePagination.js'
import { formatCurrency, formatDate } from '../../utils/formatters.js'
import DataTable from '../../components/common/DataTable.jsx'

/**
 * AllPaymentsPage — paginated list of all payment records for admin.
 *
 * Features:
 * - Paginated table via usePayments + usePagination
 * - Shows payment ID, policy, amount, mode, date
 *
 * Requirements: 14, 17
 */
function AllPaymentsPage() {
  const { params, page, pageSize, setPage, setPageSize } = usePagination()
  const { data, isLoading } = usePayments(params)

  const records = data?.data?.content ?? []
  const totalPages = data?.data?.totalPages ?? 0
  const totalElements = data?.data?.totalElements ?? 0

  const columns = [
    { key: 'id', header: 'Payment ID', sortable: true },
    {
      key: 'policyNumber',
      header: 'Policy',
      render: (row) => row.policyNumber ?? row.policy?.policyNumber ?? '—',
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (row) => formatCurrency(row.amount),
    },
    { key: 'paymentMode', header: 'Mode' },
    {
      key: 'paymentDate',
      header: 'Date',
      render: (row) => formatDate(row.paymentDate),
    },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Payments</h1>
        <p className="text-gray-500 mt-1">View all premium payment records across the platform.</p>
      </div>

      <DataTable
        columns={columns}
        data={records}
        isLoading={isLoading}
        emptyMessage="No payment records found."
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

export default AllPaymentsPage
