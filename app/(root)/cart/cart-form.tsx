'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'

import { Loader, Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useToast } from '../../../components/ui/use-toast'
import { addItemToCart, removeItemFromCart } from '../../../lib/actions/cart.actions'
import { Button } from '../../../components/ui/button'
import { Cart } from '../../../types/customTypes'
import { Input } from '../../../components/ui/input'

interface CartFormProps {
  cart: Cart | undefined  // Update this line
}

export default function CartForm({ cart }: CartFormProps) {

  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center">
        <p>Your cart is empty</p>
        <Link href="/" className="text-primary">
          Go shopping
        </Link>
      </div>
    )
  }

  const handleQuantityChange = async (
    productId: string,
    name: string,
    slug: string,
    image: string,
    price: number,
    newQty: number
  ) => {
    if (newQty < 1) newQty = 1
    if (newQty > 99) newQty = 99

    startTransition(async () => {
      const res = await addItemToCart({
        productId,
        name,
        slug,
        image,
        price,
        qty: newQty,
        vendorID: ''
      })
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
      }
      setEditingId(null) // Close input after update
    })
  }

  const handleInputBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    item: Cart['items'][0]
  ) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value)) {
      handleQuantityChange(
        item.productId,
        item.name,
        item.slug,
        item.image,
        item.price,
        value
      )
    }
    setEditingId(null)
  }

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    item: Cart['items'][0]
  ) => {
    if (e.key === 'Enter') {
      const value = parseInt(e.currentTarget.value)
      if (!isNaN(value)) {
        handleQuantityChange(
          item.productId,
          item.name,
          item.slug,
          item.image,
          item.price,
          value
        )
      }
      setEditingId(null)
    }
    if (e.key === 'Escape') {
      setEditingId(null)
    }
  }

  return (
    <div className="grid md:grid-cols-4 md:gap-5">
      <div className="overflow-x-auto md:col-span-3">
        <table className="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item.productId}>
                <td>
                  <Link
                    href={`/product/${item.slug}`}
                    className="flex items-center"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="p-1"
                    />
                    <span className="px-2">{item.name}</span>
                  </Link>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={isPending}
                      onClick={() => {
                        startTransition(async () => {
                          const res = await removeItemFromCart(item.productId)
                          if (!res.success) {
                            toast({
                              variant: 'destructive',
                              description: res.message,
                            })
                          }
                        })
                      }}
                    >
                      {isPending ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <Minus className="h-4 w-4" />
                      )}
                    </Button>

                    {editingId === item.productId ? (
                      <Input
                        type="number"
                        defaultValue={item.qty}
                        className="w-16 text-center"
                        min="1"
                        max="99"
                        autoFocus
                        onBlur={(e) => handleInputBlur(e, item)}
                        onKeyDown={(e) => handleInputKeyDown(e, item)}
                      />
                    ) : (
                      <button
                        className="w-12 text-center px-2 py-1 rounded hover:bg-gray-100"
                        onClick={() => setEditingId(item.productId)}
                        disabled={isPending}
                      >
                        {item.qty}
                      </button>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={isPending}
                      onClick={() => {
                        startTransition(async () => {
                          const res = await addItemToCart({
                            ...item,
                            qty: item.qty + 1,
                          })
                          if (!res.success) {
                            toast({
                              variant: 'destructive',
                              description: res.message,
                            })
                          }
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
                </td>
                <td>${item.price}</td>
                <td>
                  <Button
                    variant="destructive"
                    size="icon"
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        const res = await removeItemFromCart(item.productId,)
                        if (!res.success) {
                          toast({
                            variant: 'destructive',
                            description: res.message,
                          })
                        }
                      })
                    }}
                  >
                    {isPending ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <div className="card p-5">
          <ul>
            <li>
              <div className="pb-3 text-xl">
                Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)}) : $
                {cart.itemsPrice}
              </div>
            </li>
            <li>
              <Button
                onClick={() => router.push('/shipping-address')}
                className="w-full"
              >
                Proceed to checkout
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}