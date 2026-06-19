import { Link } from 'react-router-dom'
import { useUsers, useToggleUser } from '../../hooks/useUsers.js'
import { usePagination } from '../../hooks/usePagination.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'
import DataTable from '../../components/common/DataTable.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'

/**
 * UserListPage — paginated list of all users for admin.
 *
 * Features:
 * - Paginated table via useUsers + usePagination
 * - Shows username, email, role, active StatusBadge
 * - Toggle deactivate/reactivate (no delete)
 * - Deactivated users remain in the list
 * - Link to create agent page
 *
 * Requirements: 15, 17
 */
function UserListPage() {
  const { params, page, pageSize, setPage, setPageSize } = usePagination()
  const { data, isLoading } = useUsers(params)
  const toggleUser = useToggleUser()
  const { showToast } = useToast()

  const records = data?.data?.content ?? []
  const totalPages = data?.data?.totalPages ?? 0
  const totalElements = data?.data?.totalElements ?? 0

  function handleToggle(row) {
    toggleUser.mutate(
      { id: row.id, active: !row.active },
      {
        onSuccess: () => {
          showToast(
            `User "${row.username}" has been ${!row.active ? 'activated' : 'deactivated'}.`,
            'success'
          )
        },
        onError: (error) => handleApiError(error, showToast),
      }
    )
  }

  const columns = [
    { key: 'username', header: 'Username', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
          {row.role}
        </span>
      ),
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
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleToggle(row)
          }}
          disabled={toggleUser.isPending}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
            row.active
              ? 'bg-red-50 text-red-700 hover:bg-red-100'
              : 'bg-green-50 text-green-700 hover:bg-green-100'
          }`}
        >
          {row.active ? 'Deactivate' : 'Reactivate'}
        </button>
      ),
    },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">Manage all user accounts on the platform.</p>
        </div>
        <Link
          to="/admin/users/create-agent"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + Create Agent
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={records}
        isLoading={isLoading}
        emptyMessage="No users found."
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

export default UserListPage
