import { Metadata } from 'next'
import CategoryForm from '../../../../components/shared/admin/category-form'

export const metadata: Metadata = {
  title: `Create product - Tibb-JoX`,
}
export default async function UpdateProductPage() {
  return (
    <>
      <h1 className="h2-bold">Create Category</h1>
      <div className="my-8">
        <CategoryForm type="Create" />
      </div>
    </>
  )
}