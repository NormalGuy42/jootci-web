import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllowedProductById } from '../../../../lib/actions/product.actions'
import AllowedProductForm from '../../../../components/shared/admin/allowed-products-form'


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
  const product = await getAllowedProductById(id)
  if (!product) notFound()
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Product</h1>
      <AllowedProductForm type="Update" allowedProduct={product} productId={product.id} />
    </div>
  )
}