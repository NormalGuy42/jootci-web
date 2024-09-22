
import { Badge, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { getMyCart } from '../../../lib/actions/cart.actions'
import { Button } from '../../ui/button'


export default async function CartButton() {

  const cart = await getMyCart()

  return (
    <div>
      <Button asChild variant="ghost">
      {/* <Link href="/cart"> */}
      <div>
      <ShoppingCart className="mr-1" />
        Cart
        {cart && cart.items.length > 0 && (
          <div className='ml-2 main-green-bg w-8 h-8 flex justify-center items-center text-white rounded-full border'>
            {cart.items.reduce((a, c) => a + c.qty, 0)}
          </div>
        )}
      </div>
        
      {/* </Link> */}
          
    </Button>
    </div>
  )
}