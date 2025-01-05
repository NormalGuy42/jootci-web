'use server'

import { and, count, desc, eq, sql, sum } from "drizzle-orm"
import db from "../drizzle"
import { allowedProducts, orders, products } from "../schema"
import { revalidatePath } from "next/cache"
import slugify from "slugify"
import { auth } from "../../auth"

//GET
export async function getAllVendorProducts({
    limit = 20,
    page,
    vendorId,  // Note: changed from vendorID to vendorId to match the type definition
  }: {
    limit?: number
    page: number
    vendorId: string  
  }) {
    const data = await db.query.products.findMany({
      where: eq(products.vendorID, vendorId),  // Add this line to filter by vendorId
      orderBy: [desc(products.createdAt)],
      limit,
      offset: (page - 1) * limit,
    })
    
    const dataCount = await db.select({ count: count() })
      .from(products)
      .where(eq(products.vendorID, vendorId))  // Add this line to count only vendor's products
      
    return {
      data,
      totalPages: Math.ceil(dataCount[0].count / limit),
    }
}

export async function getAllVendorOrders({
    limit = 20,
    page,
    vendorId,
  }: {
    limit?: number
    page: number
    vendorId: string
  }) {
    const data = await db.query.orders.findMany({
      where: eq(orders.vendorID, vendorId),
      orderBy: [desc(orders.createdAt)],
      limit,
      offset: (page - 1) * limit,
      with: {
        user: true  // Include the related user data
      }
    })
    
    const dataCount = await db.select({ count: count() })
      .from(orders)
      .where(eq(orders.vendorID, vendorId))
      
    return {
      data,
      totalPages: Math.ceil(dataCount[0].count / limit),
    }
}

export async function getVendorOrderSummary(vendorID: string) {
  const ordersCount = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.vendorID, vendorID))

  const productsCount = await db
    .select({ count: count() })
    .from(products)
    .where(eq(products.vendorID, vendorID))
  
  const ordersPrice = await db
    .select({ sum: sum(orders.totalPrice) })
    .from(orders)
    .where(eq(orders.vendorID, vendorID))
  
  const salesData = await db
    .select({
      months: sql<string>`to_char(${orders.createdAt},'MM/YY')`,
      totalSales: sql<number>`sum(${orders.totalPrice})`.mapWith(Number),
    })
    .from(orders)
    .where(eq(orders.vendorID, vendorID))
    .groupBy(sql`1`)
  
  const latestOrders = await db.query.orders.findMany({
    where: eq(orders.vendorID, vendorID),
    orderBy: [desc(orders.createdAt)],
    with: {
      user: { columns: { name: true } },
    },
    limit: 6,
  })

  return {
    ordersCount,
    productsCount,
    ordersPrice,
    salesData,
    latestOrders,
  }
}
//CREATE


export async function createVendorProduct(
  allowedProductId: string,
  vendorId: string,
  productData: {
    price: number,
    stock: number,
    description: string
  }
) {
  try {
    const session = await auth()
    if (!session) throw new Error('User is not authenticated')

    // First, fetch the allowed product
    const allowedProduct = await db.query.allowedProducts.findFirst({
      where: eq(allowedProducts.id, allowedProductId)
    })

    if (!allowedProduct) {
      return {
        success: false,
        message: "Allowed product not found"
      }
    }

  
    // Create the product with data from both sources
    const productValues = {
        name: allowedProduct.name,
        slug: slugify(`${allowedProduct.name}-${session.user.name}`, { lower: true }),
        category: allowedProduct.category,
        images: allowedProduct.images,
        stockType: allowedProduct.stockType,
        description: productData.description,
        stock: productData.stock,
        price: productData.price.toString(), // Convert number to string for numeric field
        vendorID: session.user.id!,
        rating: "0", // Use string for numeric field
        numReviews: 0
      } satisfies typeof products.$inferInsert
  
      // Insert the product
      const newProduct = await db.insert(products)
        .values(productValues)
        .returning()
  
    return {
      success: true,
      message: "Product added successfully",
      product: newProduct[0]
    }

  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to add product"
    }
  }
}

//UPDATE 

export async function updateVendorProduct(
    productId: string,
    vendorId: string,
    productData: {
      price: number,
      stock: number,
      description: string
    }
  ) {
    try {
      const session = await auth()
      if (!session) throw new Error('User is not authenticated')

      // First, verify the product belongs to this vendor
      const product = await db.query.products.findFirst({
        where: and(
          eq(products.id, productId),
          eq(products.vendorID, session.user.id!)
        ),
      })
  
      if (!product) {
        return {
          success: false,
          message: "Product not found or you don't have permission to update it"
        }
      }
  
      // If verification passes, update the product
      await db.update(products)
        .set({
          price: productData.price.toString(),
          stock: productData.stock,
          description: productData.description
        })
        .where(
          and(
            eq(products.id, productId),
            eq(products.vendorID, session.user.id!)
          )
        )
  
      revalidatePath('/vendor/products')
      return { 
        success: true,
        message: "Product updated successfully"
      }
    }catch (error) {
        return { 
          success: false, 
          message: error instanceof Error ? error.message : "Failed to update product"
        }
      }
    }
//DELETE

export async function deleteVendorProduct(id: string) {
    try {
      const session = await auth()
      if (!session) throw new Error('User is not authenticated')
      
      // First, verify the product belongs to this vendor
      const product = await db.query.products.findFirst({
        where: and(
          eq(products.id, id),
          eq(products.vendorID, session.user.id!)
        ),
      })
  
      if (!product) {
        throw new Error("Product not found or you don't have permission to delete it")
      }
  
      // If verification passes, delete the product
      await db.delete(products)
        .where(
          and(
            eq(products.id, id),
            eq(products.vendorID, session.user.id!)
          )
        )
  
      revalidatePath('/vendor/products')
      return { 
        success: true,
        message: "Product deleted successfully"
      }
    } catch (error) {
      return { 
        success: false, 
        message: (error as Error).message 
        }
    }
  }