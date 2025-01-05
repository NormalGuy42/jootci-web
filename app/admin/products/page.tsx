
import { Metadata } from 'next'
import Link from 'next/link'
import DeleteDialog from '../../../components/shared/delete-dialog'
import Pagination from '../../../components/shared/pagination'
import { Button } from '../../../components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/ui/table'
import { deleteProduct, getAllAllowedProducts, getAllProducts } from '../../../lib/actions/product.actions'
import { formatId, formatCurrency } from '../../../lib/utils'


export const metadata: Metadata = {
  title: `Admin Products - Tibb-Jox`,
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
  const products = await getAllAllowedProducts({
    page,
  })
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Products</h1>
        <Button asChild variant="default">
          <Link href="/admin/products/create">Create Product</Link>
        </Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead className="w-[100px]">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.data.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{formatId(product.id)}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/products/${product.id}`}>Edit</Link>
                  </Button>
                  <DeleteDialog id={product.id} action={deleteProduct} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {products?.totalPages! > 1 && (
          <Pagination page={page} totalPages={products?.totalPages!} />
        )}
      </div>
    </div>
  )
}