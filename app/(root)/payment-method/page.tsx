import { Metadata } from 'next'


import PaymentMethodForm from './payment-method-form'
import { auth } from '../../../auth'
import { getUserById } from '../../../lib/actions/user.actions'

export const metadata: Metadata = {
  title: `Payment Method - Tibb-Jox`,
}

export default async function PaymentMethodPage() {

  const session = await auth()
  const user = await getUserById(session?.user.id!)

  return <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
}