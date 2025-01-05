import { Metadata } from 'next'
import AllowedProductForm from '../../../../components/shared/admin/allowed-products-form'

export const metadata: Metadata = {
  title: `Create product - Tibb-JoX`,
}
export default async function UpdateProductPage() {
  return (
    <>
      <h1 className="h2-bold">Create Product</h1>
      <div className="my-8">
        <AllowedProductForm type="Create" />
      </div>
    </>
  )
}