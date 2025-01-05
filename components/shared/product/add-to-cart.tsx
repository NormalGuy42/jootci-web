'use client'

import { Loader, Minus, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition, useState, useRef, useEffect } from 'react'
import { addItemToCart, removeItemFromCart } from '../../../lib/actions/cart.actions'
import { Cart, CartItem } from '../../../types/customTypes'
import { Button } from '../../ui/button'
import { useToast } from '../../ui/use-toast'
import { useSession } from 'next-auth/react'
import { ToastAction } from '../../ui/toast'
import { Input } from '../../ui/input'

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
  const [isPending, startTransition] = useTransition()
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const existItem = cart && cart.items.find((x) => x.productId === item.productId)
  const isAdminOrVendor = session?.user?.role === 'admin' || session?.user?.role === 'vendor'

  // Handle quantity change
  const handleQuantityChange = (value: number) => {
    if (value < 1) value = 1
    if (value > 99) value = 99

    startTransition(async () => {
      // Remove existing items first
      if (existItem) {
        await removeItemFromCart(item.productId)
      }
      // Add new quantity
      const res = await addItemToCart({ ...item, qty: value })
      toast({
        variant: res.success ? 'default' : 'destructive',
        description: res.message,
      })
    })
  }

  // Handle input blur
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value)) {
      handleQuantityChange(value)
    }
    setIsEditing(false)
  }

  // Handle input keydown
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

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
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const res = await removeItemFromCart(item.productId)
            toast({
              variant: res.success ? 'default' : 'destructive',
              description: res.message,
            })
          })
        }}
      >
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>

      {isEditing ? (
        <Input
          ref={inputRef}
          type="number"
          defaultValue={existItem.qty}
          className="w-16 text-center"
          min="1"
          max="99"
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
        />
      ) : (
        <span
          className="w-8 text-center cursor-pointer hover:text-primary"
          onClick={() => setIsEditing(true)}
        >
          {existItem.qty}
        </span>
      )}

      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const res = await addItemToCart({ ...item, qty: existItem.qty + 1 })
            toast({
              variant: res.success ? 'default' : 'destructive',
              description: res.message,
            })
          })
        }}
      >
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
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