import { useNavigate } from 'react-router-dom'
import { useCustomers } from '../../hooks/useCustomers.js'
import { usePagination } from '../../hooks/usePagination.js'
import DataTable from '../../components/common/DataTable.jsx'
import SearchFilterBar from '../../components/common/SearchFilterBar.jsx'

/**
 * CustomerListPage — paginated, searchable list of customers for agent.
 *
 * Features:
 * - Paginated table via useCustomers + usePagination
 * - Text search by name via SearchFilterBar
 * - Sortable columns: name, email, username
 * - Row click navigates to /agent/customers/:id
 *
 * Requirements: 9, 17
 */

const FILTER_DEFS = [
  { key: 'search', label: 'Search', type: 'text' },
]

function CustomerListPage() {
  const navigate = useNavigate()
  const { params, page, pageSize, setPage, setPageSize, setFilter, resetFilters } =
    usePagination()

  const { data, isLoading } = useCustomers(params)

  const records = data?.data?.content ?? []
  const totalPages = data?.data?.totalPages ?? 0
  const totalElements = data?.data?.totalElements ?? 0

  const filterValues = {
    search: params.search ?? '',
  }

  const columns = [
    {
      key: 'username',
      header: 'Username',
      sortable: true,
      render: (row) => row.username ?? '—',
    },
    {
      key: 'firstName',
      header: 'Name',
      sortable: true,
      render: (row) =>
        [row.firstName, row.lastName].filter(Boolean).join(' ') || '—',
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      render: (row) => row.email ?? '—',
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (row) => row.phone ?? '—',
    },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 mt-1">
          Browse and search customers. Click a row to view full profile.
        </p>
      </div>

      <div className="mb-4">
        <SearchFilterBar
          filters={FILTER_DEFS}
          values={filterValues}
          onChange={(key, value) => setFilter(key, value)}
          onReset={resetFilters}
          searchPlaceholder="Search by name, email or username…"
        />
      </div>

      <DataTable
        columns={columns}
        data={records}
        isLoading={isLoading}
        emptyMessage="No customers found."
        onRowClick={(row) => navigate(`/agent/customers/${row.id}`)}
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

export default CustomerListPage
