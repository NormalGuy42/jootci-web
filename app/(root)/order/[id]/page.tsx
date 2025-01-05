
import { notFound } from 'next/navigation'
import OrderDetailsForm from './order-details-form'
import { getOrderById } from '../../../../lib/actions/order.actions'
import { auth } from '../../../../auth'
export const metadata = {
  title: `Order Details - Tibb-Jox`,
}
const OrderDetailsPage = async ({
  params: { id },
}: {
  params: {
    id: string
  }
}) => {
  const session = await auth()
  const order = await getOrderById(id)
  
  if (!order) notFound()
  order.user
  return <OrderDetailsForm order={order}  paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'} isVendor={session?.user.role === 'vendor' || false} />
}
export default OrderDetailsPage