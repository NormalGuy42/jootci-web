'use client'

import { Loader, Minus, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { addItemToCart, removeItemFromCart  } from '../../../lib/actions/cart.actions'
import { Cart, CartItem } from '../../../types/customTypes'
import { Button } from '../../ui/button'
import { useToast } from '../../ui/use-toast'
import { useSession } from 'next-auth/react'
import { ToastAction } from '../../ui/toast'


export default function AddToCart({
  cart,
  item,
}: {
  cart?: Cart
  item: Omit<CartItem, 'cartId'>
}) {
  const router = useRouter()

  const { data: session } = useSession()
  const { toast } = useToast()

  // Check if user is admin or vendor
  const isAdminOrVendor = session?.user?.role === 'admin' || session?.user?.role === 'vendor'

  const [isPending, startTransition] = useTransition()
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId)
  // If user is admin or vendor, disable the button
  if (isAdminOrVendor) {
    return (
      <Button
        disabled
        className="w-full"
        title="Admins and vendors cannot add items to cart"
      >
        Unauthorized
      </Button>
    )
  }

  return existItem ? (
    <div>
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const res = await removeItemFromCart(item.productId)
            toast({
              variant: res.success ? 'default' : 'destructive',
              description: res.message,
            })
            return
          })
        }}
      >
        {isPending ? (
          <Loader className="w-4 h-4  animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const res = await addItemToCart(item)
            toast({
              variant: res.success ? 'default' : 'destructive',
              description: res.message,
            })
            return
          })
        }}
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full"
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const res = await addItemToCart(item)
          if (!res.success) {
            toast({
              variant: 'destructive',
              description: res.message,
            })
            return
          }
          toast({
            description: `${item.name} added to the cart`,
            action: (
              <ToastAction
                className="main-green-bg text-white hover:text-black"
                onClick={() => router.push('/cart')}
                altText="Go to cart"
              >
                Go to cart
              </ToastAction>
            ),
          })
        })
      }}
    >
      {isPending ? <Loader className="animate-spin" /> : <Plus />}
      Add to cart
    </Button>
  )
}
