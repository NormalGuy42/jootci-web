
import { Metadata } from 'next'
import Link from 'next/link'
import DeleteDialog from '../../../components/shared/delete-dialog'
import Pagination from '../../../components/shared/pagination'
import { Button } from '../../../components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/ui/table'
import { deleteProduct, getAllProducts } from '../../../lib/actions/product.actions'
import { formatId, formatCurrency } from '../../../lib/utils'
import { deleteCategory, getAllCategories } from '../../../lib/actions/category.action'


export const metadata: Metadata = {
  title: `Admin Categories - Tibb-Jox`,
}
export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: {
    page: string
    query: string
    category: string
  }
}) {
  const page = Number(searchParams.page) || 1
  const categories = await getAllCategories({
    page,
  })
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Categories</h1>
        <Button asChild variant="default">
          <Link href="/admin/categories/create">Add Category</Link>
        </Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead className="w-[100px]">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.data.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{formatId(category.id)}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/categories/${category.id}`}>Edit</Link>
                  </Button>
                  <DeleteDialog id={category.id} action={deleteCategory} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {categories?.totalPages! > 1 && (
          <Pagination page={page} totalPages={categories?.totalPages!} />
        )}
      </div>
    </div>
  )
}