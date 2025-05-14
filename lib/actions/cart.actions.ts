'use server'

import { cookies } from "next/headers"
import db from "../drizzle"
import { eq } from "drizzle-orm"
import { carts, products } from "../schema"
import { auth } from "../../auth"
import { formatError, round2 } from "../utils"
import { CartItem } from "../../types/customTypes"
import { revalidatePath } from "next/cache"
import { cartItemSchema } from "../validator"

const calcPrice = (items: CartItem[]) => {
    const itemsPrice = round2(
        items.reduce((acc, item) => acc + item.price * item.qty, 0)
      ),
      shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
      taxPrice = round2(0.15 * itemsPrice),
      totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
    return {
      itemsPrice: itemsPrice.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      taxPrice: taxPrice.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
    }
  }

  export const addItemToCart = async (data: CartItem) => {
    try {

      const session = await auth()
      if (!session) {
        throw new Error('Please sign in to add items to cart')
      }

      // Check if user is admin or vendor
      if (session.user.role === 'admin' || session.user.role === 'vendor') {
        throw new Error('Admins and vendors cannot add items to cart')
      }

      const sessionCartId = cookies().get('sessionCartId')?.value
      if (!sessionCartId) throw new Error('Cart Session not found')
      const userId = session?.user.id as string | undefined
      const cart = await getMyCart()
      const item = cartItemSchema.parse(data)
      const product = await db.query.products.findFirst({
        where: eq(products.id, item.productId),
      })
      if (!product) throw new Error('Product not found')
      if (!cart) {
        if (product.stock! < 1) throw new Error('Not enough stock')
        await db.insert(carts).values({
          userId: userId,
          items: [item],
          sessionCartId: sessionCartId,
          ...calcPrice([item]),
        })
        revalidatePath(`/product/${product.slug}`)
        return {
          success: true,
          message: 'Item added to cart successfully',
        }
      } else {
        const existItem = cart.items.find((x) => x.productId === item.productId)
        if (existItem) {
          if (product.stock! < existItem.qty + 1)
            throw new Error('Not enough stock')
          cart.items.find((x) => x.productId === item.productId)!.qty =
            existItem.qty + 1
        } else {
          if (product.stock! < 1) throw new Error('Not enough stock')
          cart.items.push(item)
        }
        await db
          .update(carts)
          .set({
            items: cart.items,
            ...calcPrice(cart.items),
          })
          .where(eq(carts.id, cart.id))
        revalidatePath(`/product/${product.slug}`)
        return {
          success: true,
          message: `${product.name} ${
            existItem ? 'updated in' : 'added to'
          } cart successfully`,
        }
      }
    } catch (error) {
      return { success: false, message: formatError(error) }
    }
  }
  
export const updateCartItemQuantity = async (data: CartItem) => {
  try {
    const session = await auth()
    if (!session) {
      throw new Error('Please sign in to update cart')
    }

    // Check if user is admin or vendor
    if (session.user.role === 'admin' || session.user.role === 'vendor') {
      throw new Error('Admins and vendors cannot add items to cart')
    }

    const sessionCartId = cookies().get('sessionCartId')?.value
    if (!sessionCartId) throw new Error('Cart Session not found')

    const cart = await getMyCart()
    const product = await db.query.products.findFirst({
      where: eq(products.id, data.productId),
    })

    if (!product) throw new Error('Product not found')
    if (!cart) throw new Error('Cart not found')

    if (product.stock! < data.qty) {
      throw new Error('Not enough stock')
    }

    // Update the quantity directly
    cart.items = cart.items.map(item => 
      item.productId === data.productId 
        ? { ...item, qty: data.qty }
        : item
    )

    await db
      .update(carts)
      .set({
        items: cart.items,
        ...calcPrice(cart.items),
      })
      .where(eq(carts.id, cart.id))

    revalidatePath('/cart')
    return {
      success: true,
      message: `${product.name} quantity updated successfully`,
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

  export async function handleCartSession(userId: string) {
    const sessionCartId = cookies().get('sessionCartId')?.value
    if (!sessionCartId) throw new Error('Session Cart Not Found')
    
    const sessionCartExists = await db.query.carts.findFirst({
      where: eq(carts.sessionCartId, sessionCartId),
    })
    
    if (sessionCartExists && !sessionCartExists.userId) {
      const userCartExists = await db.query.carts.findFirst({
        where: eq(carts.userId, userId),
      })
      
      if (userCartExists) {
        cookies().set('beforeSigninSessionCartId', sessionCartId)
        cookies().set('sessionCartId', userCartExists.sessionCartId)
      } else {
        await db.update(carts)
          .set({ userId: userId })
          .where(eq(carts.id, sessionCartExists.id))
      }
    }
  }
export async function getMyCart() {
    try {
      const sessionCartId = cookies().get('sessionCartId')?.value
      if (!sessionCartId) return undefined
      const session = await auth()
      const userId = session?.user.id
      const cart = await db.query.carts.findFirst({
        where: userId
          ? eq(carts.userId, userId)
          : eq(carts.sessionCartId, sessionCartId),
      })
      return cart
    } catch (error) {
      // Return a default cart structure instead of undefined
      console.error('Error fetching cart:', error)
      return {
        id: '',
        userId: null,
        sessionCartId: cookies().get('sessionCartId')?.value || '',
        items: [],
        itemsPrice: '0.00',
        shippingPrice: '0.00',
        taxPrice: '0.00',
        totalPrice: '0.00',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
  }

  export const removeItemFromCart = async (productId: string) => {
    try {
      const sessionCartId = cookies().get('sessionCartId')?.value
      if (!sessionCartId) throw new Error('Cart Session not found')
      const product = await db.query.products.findFirst({
        where: eq(products.id, productId),
      })
      if (!product) throw new Error('Product not found')
      const cart = await getMyCart()
      if (!cart) throw new Error('Cart not found')
      const exist = cart.items.find((x) => x.productId === productId)
      if (!exist) throw new Error('Item not found')
      if (exist.qty === 1) {
        cart.items = cart.items.filter((x) => x.productId !== exist.productId)
      } else {
        cart.items.find((x) => x.productId === productId)!.qty = exist.qty - 1
      }
      await db
        .update(carts)
        .set({
          items: cart.items,
          ...calcPrice(cart.items),
        })
        .where(eq(carts.id, cart.id))
      revalidatePath(`/product/${product.slug}`)
      return {
        success: true,
        message: `${product.name}  ${
          cart.items.find((x) => x.productId === productId)
            ? 'updated in'
            : 'removed from'
        } cart successfully`,
      }
    } catch (error) {
      return { success: false, message: formatError(error) }
  }
}

