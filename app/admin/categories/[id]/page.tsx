import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductForm from '../../../../components/shared/vendor/product-form'
import { getProductById } from '../../../../lib/actions/product.actions'
import CategoryForm from '../../../../components/shared/admin/category-form'
import { getCategoryById } from '../../../../lib/actions/category.action'


export const metadata: Metadata = {
  title: `Update product - Tibb-Jox`,
}
export default async function UpdateProductPage({
  params: { id },
}: {
  params: {
    id: string
  }
}) {
  const category = await getCategoryById(id)
  if (!category) notFound()
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Product</h1>
      <CategoryForm type="Update" category={category} categoryId={category.id} />
    </div>
  )
}