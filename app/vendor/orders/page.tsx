import { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '../../../auth'
import DeleteDialog from '../../../components/shared/delete-dialog'
import Pagination from '../../../components/shared/pagination'
import { Button } from '../../../components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/ui/table'
import { deleteOrder, getAllOrders } from '../../../lib/actions/order.actions'
import { formatId, formatDateTime, formatCurrency } from '../../../lib/utils'
import { getAllVendorOrders } from '../../../lib/actions/vendor.actions'

export const metadata: Metadata = {
  title: `Vendor Orders - Tibb-Jox`,
}
export default async function OrdersPage({
  searchParams: { page = '1' },
}: {
  searchParams: { page: string }
}) {
  const session = await auth()
  if (session?.user.role !== 'vendor')
    throw new Error('vendor permission required')

  const vendorId = session?.user?.id // Get the current vendor's ID from the session

  if (!vendorId) {
    // Handle the case where there's no vendor ID
    // You could redirect to login or show an error
    throw new Error('Unauthorized: No vendor ID found')
  }
  const orders = await getAllVendorOrders({
    page: Number(page),
    vendorId: vendorId,
  })
  return (
    <div className="space-y-2">
      <h1 className="h2-bold">Orders</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>BUYER</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>
                  {order.user ? order.user.name : 'Deleted user'}
                </TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : 'not paid'}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : 'not delivered'}
                </TableCell>
                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/order/${order.id}`}>Details</Link>
                  </Button>
                  <DeleteDialog id={order.id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination page={page} totalPages={orders?.totalPages!} />
        )}
      </div>
    </div>
  )
}