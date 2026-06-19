import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema } from '../../utils/validators.js'
import { useProduct, useCreateProduct, useUpdateProduct } from '../../hooks/useProducts.js'
import { useToast } from '../../context/ToastContext.jsx'
import { handleApiError } from '../../utils/handleApiError.js'
import FormInput from '../../components/common/FormInput.jsx'
import FormTextarea from '../../components/common/FormTextarea.jsx'
import Spinner from '../../components/common/Spinner.jsx'

/**
 * ProductFormPage — shared create/edit form for insurance products.
 *
 * Routes:
 *   /admin/products/new       → create mode
 *   /admin/products/:id/edit  → edit mode
 *
 * Requirements: 12, 17
 */
function ProductFormPage() {
  const { id } = useParams()
  const isEditMode = !!id
  const navigate = useNavigate()
  const { showToast } = useToast()

  const { data: productData, isLoading: isLoadingProduct } = useProduct(id)

  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
    },
  })

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && productData?.data) {
      const p = productData.data
      reset({
        name: p.name ?? '',
        description: p.description ?? '',
        category: p.category ?? '',
      })
    }
  }, [isEditMode, productData, reset])

  async function onSubmit(formData) {
    if (isEditMode) {
      updateProduct.mutate(
        { id, data: formData },
        {
          onSuccess: () => {
            showToast('Product updated successfully.', 'success')
            navigate('/admin/products')
          },
          onError: (error) => handleApiError(error, showToast),
        }
      )
    } else {
      createProduct.mutate(formData, {
        onSuccess: () => {
          showToast('Product created successfully.', 'success')
          navigate('/admin/products')
        },
        onError: (error) => handleApiError(error, showToast),
      })
    }
  }

  if (isEditMode && isLoadingProduct) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    )
  }

  const isBusy = isSubmitting || createProduct.isPending || updateProduct.isPending

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Product' : 'New Product'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isEditMode ? 'Update the product details below.' : 'Fill in the details to create a new insurance product.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <FormInput
          label="Product Name"
          name="name"
          required
          placeholder="e.g. Health Shield Plus"
          error={errors.name?.message}
          {...register('name')}
        />

        <FormInput
          label="Category"
          name="category"
          required
          placeholder="e.g. Health, Life, Vehicle"
          error={errors.category?.message}
          {...register('category')}
        />

        <FormTextarea
          label="Description"
          name="description"
          required
          rows={4}
          placeholder="Describe the product coverage and benefits..."
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isBusy}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isBusy ? 'Saving…' : isEditMode ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductFormPage
