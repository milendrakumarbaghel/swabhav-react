import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateAgent } from '../../hooks/useUsers.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'
import FormInput from '../../components/common/FormInput.jsx'

/**
 * createAgentSchema — validation for creating an agent account.
 * username (min 3), email (valid), password (min 6)
 */
const createAgentSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
})

/**
 * CreateAgentPage — form for admin to create a new agent user account.
 *
 * Requirements: 15, 17
 */
function CreateAgentPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const createAgent = useCreateAgent()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  function onSubmit(formData) {
    createAgent.mutate(formData, {
      onSuccess: () => {
        showToast('Agent account created successfully.', 'success')
        navigate('/admin/users')
      },
      onError: (error) => handleApiError(error, showToast),
    })
  }

  const isBusy = isSubmitting || createAgent.isPending

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Agent</h1>
        <p className="text-gray-500 mt-1">Create a new agent account for the platform.</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
      >
        <FormInput
          label="Username"
          name="username"
          required
          autoComplete="username"
          placeholder="e.g. agent_john"
          error={errors.username?.message}
          {...register('username')}
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="e.g. john@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="At least 6 characters"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/admin/users')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isBusy}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isBusy ? 'Creating…' : 'Create Agent'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateAgentPage
