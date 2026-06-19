import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { planSchema } from '../../utils/validators.js'
import { usePlan, useCreatePlan, useUpdatePlan } from '../../hooks/usePlans.js'
import { useProducts } from '../../hooks/useProducts.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'
import FormInput from '../../components/common/FormInput.jsx'
import FormSelect from '../../components/common/FormSelect.jsx'
import Spinner from '../../components/common/Spinner.jsx'

/**
 * PlanFormPage — shared create/edit form for insurance plans.
 *
 * Routes:
 *   /admin/plans/new       → create mode
 *   /admin/plans/:id/edit  → edit mode
 *
 * Requirements: 13, 17
 */
function PlanFormPage() {
  const { id } = useParams()
  const isEditMode = !!id
  const navigate = useNavigate()
  const { showToast } = useToast()

  const { data: planData, isLoading: isLoadingPlan } = usePlan(id)

  // Fetch all products for the productId select (fetch a large page to avoid pagination)
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({ pageSize: 100, page: 0 })
  const products = productsData?.data?.content ?? []

  const createPlan = useCreatePlan()
  const updatePlan = useUpdatePlan()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(planSchema),
    defaultValues: {
      productId: '',
      planName: '',
      sumInsured: '',
      premiumAmount: '',
      tenureMonths: '',
    },
  })

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && planData?.data) {
      const p = planData.data
      reset({
        productId: p.productId ?? p.product?.id ?? '',
        planName: p.planName ?? '',
        sumInsured: p.sumInsured ?? '',
        premiumAmount: p.premiumAmount ?? '',
        tenureMonths: p.tenureMonths ?? '',
      })
    }
  }, [isEditMode, planData, reset])

  async function onSubmit(formData) {
    // Coerce numeric string fields to numbers (HTML inputs return strings)
    const payload = {
      ...formData,
      productId: Number(formData.productId),
      sumInsured: Number(formData.sumInsured),
      premiumAmount: Number(formData.premiumAmount),
      tenureMonths: Number(formData.tenureMonths),
    }

    if (isEditMode) {
      updatePlan.mutate(
        { id, data: payload },
        {
          onSuccess: () => {
            showToast('Plan updated successfully.', 'success')
            navigate('/admin/plans')
          },
          onError: (error) => handleApiError(error, showToast),
        }
      )
    } else {
      createPlan.mutate(payload, {
        onSuccess: () => {
          showToast('Plan created successfully.', 'success')
          navigate('/admin/plans')
        },
        onError: (error) => handleApiError(error, showToast),
      })
    }
  }

  if (isEditMode && isLoadingPlan) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    )
  }

  const isBusy = isSubmitting || createPlan.isPending || updatePlan.isPending

  const productOptions = [
    { value: '', label: '— Select a product —' },
    ...products.map((p) => ({ value: String(p.id), label: p.name })),
  ]

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Plan' : 'New Plan'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isEditMode ? 'Update the plan details below.' : 'Fill in the details to create a new insurance plan.'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
      >
        <FormSelect
          label="Product"
          name="productId"
          required
          options={productOptions}
          error={errors.productId?.message}
          disabled={isLoadingProducts}
          {...register('productId')}
        />

        <FormInput
          label="Plan Name"
          name="planName"
          required
          placeholder="e.g. Silver Health Plan"
          error={errors.planName?.message}
          {...register('planName')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Sum Insured (₹)"
            name="sumInsured"
            type="number"
            required
            min="1"
            step="0.01"
            placeholder="e.g. 500000"
            error={errors.sumInsured?.message}
            {...register('sumInsured', { valueAsNumber: true })}
          />

          <FormInput
            label="Premium Amount (₹)"
            name="premiumAmount"
            type="number"
            required
            min="1"
            step="0.01"
            placeholder="e.g. 12000"
            error={errors.premiumAmount?.message}
            {...register('premiumAmount', { valueAsNumber: true })}
          />
        </div>

        <FormInput
          label="Tenure (months)"
          name="tenureMonths"
          type="number"
          required
          min="1"
          step="1"
          placeholder="e.g. 12"
          error={errors.tenureMonths?.message}
          {...register('tenureMonths', { valueAsNumber: true })}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/admin/plans')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isBusy}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isBusy ? 'Saving…' : isEditMode ? 'Update Plan' : 'Create Plan'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PlanFormPage
