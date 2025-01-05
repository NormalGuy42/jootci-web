'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'

import { Loader, Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useToast } from '../../../components/ui/use-toast'
import { addItemToCart, removeItemFromCart, updateCartItemQuantity } from '../../../lib/actions/cart.actions'
import { Button } from '../../../components/ui/button'
import { Cart } from '../../../types/customTypes'
import { Input } from '../../../components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { formatCurrency } from '../../../lib/utils'

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
    newQty: number,
    vendorID: string
  ) => {
    if (newQty < 1) newQty = 1
    if (newQty > 99) newQty = 99

    startTransition(async () => {
      // Remove the existing item first to avoid quantity issues
      await removeItemFromCart(productId)
      
      const res = await updateCartItemQuantity({
        productId,
        name,
        slug,
        image,
        price,
        qty: newQty, // This will be the exact quantity entered
        vendorID
      })
      
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
      }
      setEditingId(null)
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
        value, // Pass the exact value entered
        item.vendorID
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
          value, // Pass the exact value entered
          item.vendorID
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
        <Table className="table">
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.items.map((item) => (
              <TableRow key={item.productId}>
                <TableCell>
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
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>{formatCurrency(item.price)}</TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <div className="card p-5">
          <ul>
            <li>
              <div className="pb-3 text-xl">
                Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)}) : {formatCurrency(cart.itemsPrice)}
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