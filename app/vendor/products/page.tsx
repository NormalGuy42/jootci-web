import { Metadata } from 'next'
import Link from 'next/link'
import DeleteDialog from '../../../components/shared/delete-dialog'
import Pagination from '../../../components/shared/pagination'
import { Button } from '../../../components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/ui/table'
import { deleteVendorProduct, getAllVendorProducts } from '../../../lib/actions/vendor.actions'
import { formatId, formatCurrency } from '../../../lib/utils'
import { auth } from '../../../auth'

export const metadata: Metadata = {
  title: `Vendor Products - Tibb-Jox`,
}

export default async function VendorProductsPage({
  searchParams,
}: {
  searchParams: {
    page: string
  }
}) {
  const session = await auth()
  const vendorId = session?.user?.id // Get the current vendor's ID from the session

  if (!vendorId) {
    // Handle the case where there's no vendor ID
    // You could redirect to login or show an error
    throw new Error('Unauthorized: No vendor ID found')
  }
  const page = Number(searchParams.page) || 1
  const products = await getAllVendorProducts({
    page,
    vendorId,
  })

  
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">My Products</h1>
        <Button asChild variant="default">
          <Link href="/vendor/products/create">Create Product</Link>
        </Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead className="text-right">PRICE</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead>STOCK</TableHead>
              <TableHead>RATING</TableHead>
              <TableHead className="w-[100px]">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.data.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{formatId(product.id)}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.rating}</TableCell>
                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/vendor/products/${product.id}`}>Edit</Link>
                  </Button>
                  <DeleteDialog 
                    id={product.id} 
                    action={deleteVendorProduct} 
                  />
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