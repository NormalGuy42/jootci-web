
import { Badge, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { getMyCart } from '../../../lib/actions/cart.actions'
import { Button } from '../../ui/button'


export default async function CartButton() {

  const cart = await getMyCart()

  return (
    <Link href="/cart">
    <div className='cursor-pointer'>
        <Button asChild variant="ghost">
        <div>
        <ShoppingCart className="mr-1" />
          Cart
          {cart && cart.items.length > 0 && (
            <div className='ml-2 main-green-bg w-8 h-8 flex justify-center items-center text-white rounded-full border'>
              {cart.items.reduce((a, c) => a + c.qty, 0)}
            </div>
          )}
        </div>    
      </Button>
      </div>
    </Link> 

  )
}