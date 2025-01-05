import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductForm from '../../../../components/shared/vendor/product-form'
import { getProductById } from '../../../../lib/actions/product.actions'


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
  const product = await getProductById(id)
  
  if (!product) notFound()

  const productData = {
    allowedProductId: product.id,
    price: Number(product.price),
    stock: product.stock!,
    description: product.description,
  }
  
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Product</h1>
      <ProductForm type="Update" product={productData} productId={product.id} />
    </div>
  )
}