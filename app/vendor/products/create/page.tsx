import { Metadata } from 'next'
import ProductForm from '../../../../components/shared/vendor/product-form'

export const metadata: Metadata = {
  title: `Create product - Tibb-JoX`,
}
export default async function UpdateProductPage() {
  return (
    <>
      <h1 className="h2-bold">Create Product</h1>
      <div className="my-8">
        <ProductForm type="Create" />
      </div>
    </>
  )
}