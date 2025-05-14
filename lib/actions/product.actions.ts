'use server'

import { and, count, desc, eq, ilike, sql } from 'drizzle-orm'
import { allowedProducts, products } from '../schema'
import db from '../drizzle'
import { PAGE_SIZE } from '../constants'
import { revalidatePath } from 'next/cache'
import { formatError } from '../utils'
import { z } from 'zod'
import { insertAllowedProductSchema, updateAllowedProductSchema, updateProductSchema } from '../validator'

// CREATE
export async function createAllowedProduct(data: z.infer<typeof insertAllowedProductSchema>) {
  try {
    const product = insertAllowedProductSchema.parse(data)
    await db.insert(allowedProducts).values(product)
    revalidatePath('/admin/products')
    return {
      success: true,
      message: 'Product created successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
// UPDATE


export async function updateAllowedProduct(data: z.infer<typeof updateAllowedProductSchema>) {
  try {
    const product = updateAllowedProductSchema.parse(data)
    const productExists = await db.query.allowedProducts.findFirst({
      where: eq(allowedProducts.id, product.id),
    })
    if (!productExists) throw new Error('Product not found')
    await db.update(allowedProducts).set(product).where(eq(allowedProducts.id, product.id))
    revalidatePath('/admin/products')
    return {
      success: true,
      message: 'Product updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// GET
export async function getProductById(productId: string) {
  return await db.query.products.findFirst({
    where: eq(products.id, productId),
  })
}

export async function getAllowedProductById(productId: string) {
  return await db.query.allowedProducts.findFirst({
    where: eq(products.id, productId),
  })
}


export async function getLatestProducts() {
  try {
    const data = await db.query.products.findMany({
      orderBy: [desc(products.createdAt)],
      limit: 4,
    })
    return data
  } catch (error) {
    console.error('Error fetching latest products:', error)
    return []
  }
}

export async function getProductBySlug(slug: string) {
  return await db.query.products.findFirst({
    where: eq(products.slug, slug),
  })
}

export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string
  category: string
  limit?: number
  page: number
  price?: string
  rating?: string
  sort?: string
}) {
  try {
    const queryFilter =
      query && query !== 'all' ? ilike(products.name, `%${query}%`) : undefined
    const categoryFilter =
      category && category !== 'all' ? eq(products.category, category) : undefined
    const ratingFilter =
      rating && rating !== 'all'
        ? sql`${products.rating} >= ${rating}`
        : undefined
    // 100-200
    const priceFilter =
      price && price !== 'all'
        ? sql`${products.price} >= ${price.split('-')[0]} AND ${
            products.price
          } <= ${price.split('-')[1]}`
        : undefined
    const order =
      sort === 'lowest'
        ? products.price
        : sort === 'highest'
        ? desc(products.price)
        : sort === 'rating'
        ? desc(products.rating)
        : desc(products.createdAt)
    const condition = and(queryFilter, categoryFilter, ratingFilter, priceFilter)
    const data = await db
      .select()
      .from(products)
      .where(condition)
      .orderBy(order)
      .offset((page - 1) * limit)
      .limit(limit)
    const dataCount = await db
      .select({ count: count() })
      .from(products)
      .where(condition)
    return {
      data,
      totalPages: Math.ceil(dataCount[0].count / limit),
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      data: [],
      totalPages: 0
    }
  }
}

export async function getAllAllowedProducts({
  limit = 20,
  page,
}: {
limit?: number
page: number
}) {
const data = await db.query.allowedProducts.findMany({
  orderBy: [desc(allowedProducts.createdAt)],
  limit,
  offset: (page - 1) * limit,
})
const dataCount = await db.select({ count: count() }).from(allowedProducts)
return {
  data,
  totalPages: Math.ceil(dataCount[0].count / limit),
}
}


export async function getAllProductCategories() {
  try {
    const data = await db
      .selectDistinctOn([products.category], { name: products.category })
      .from(products)
      .orderBy(products.category)
    return data
  } catch (error) {
    console.error('Error fetching product categories:', error)
    return []
  }
}


// DELETE
export async function deleteProduct(id: string) {
  try {
    const productExists = await db.query.products.findFirst({
      where: eq(products.id, id),
    })
    if (!productExists) throw new Error('Product not found')
    await db.delete(products).where(eq(products.id, id))
    revalidatePath('/admin/products')
    return {
      success: true,
      message: 'Product deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function deleteAllowedProduct(id: string) {
  try {
    const productExists = await db.query.allowedProducts.findFirst({
      where: eq(allowedProducts.id, id),
    })
    if (!productExists) throw new Error('Product not found')
    await db.delete(allowedProducts).where(eq(allowedProducts.id, id))
    revalidatePath('/admin/products')
    return {
      success: true,
      message: 'Product deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}