import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMyProfile, useUpdateMyProfile } from '../../hooks/useCustomers.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'
import FormInput from '../../components/common/FormInput.jsx'
import Spinner from '../../components/common/Spinner.jsx'

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
})

/**
 * CustomerProfile — view and update the authenticated customer's profile.
 * Requirements: 17
 */
function CustomerProfile() {
  const { showToast } = useToast()
  const { data, isLoading } = useMyProfile()
  const { mutate: updateProfile, isPending } = useUpdateMyProfile()

  const profile = data?.data ?? data ?? null

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
    },
  })

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        phone: profile.phone ?? '',
        address: profile.address ?? '',
      })
    }
  }, [profile, reset])

  function onSubmit(formData) {
    updateProfile(formData, {
      onSuccess: () => {
        showToast('Profile updated successfully.', 'success')
      },
      onError: (err) => {
        handleApiError(err, showToast)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      {/* Read-only profile details */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-700 mb-4">Account Information</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Username</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile?.username ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile?.email ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">First Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile?.firstName ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile?.lastName ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile?.phone ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date of Birth</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile?.dateOfBirth ?? '—'}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile?.address ?? '—'}</dd>
          </div>
        </dl>
      </div>

      {/* Update form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-700 mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="First Name"
              name="firstName"
              required
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <FormInput
              label="Last Name"
              name="lastName"
              required
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
          <FormInput
            label="Phone"
            name="phone"
            required
            error={errors.phone?.message}
            {...register('phone')}
          />
          <FormInput
            label="Address"
            name="address"
            required
            error={errors.address?.message}
            {...register('address')}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerProfile
