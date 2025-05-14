"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { categories } from "../schema"
import { formatError } from "../utils"
import { insertCategorySchema, updateCategorySchema } from "../validator"
import db from "../drizzle"
import { asc, count, desc, eq } from "drizzle-orm"

// CREATE
export async function createCategory(data: z.infer<typeof insertCategorySchema>) {
    try {
      const category = insertCategorySchema.parse(data)
      await db.insert(categories).values(category)
      revalidatePath('/admin/categories')
      return {
        success: true,
        message: 'Category created successfully',
      }
    } catch (error) {
      return { success: false, message: formatError(error) }
    }
  }

// UPDATE
export async function updateCategory(data: z.infer<typeof updateCategorySchema>) {
    try {
      const category = updateCategorySchema.parse(data)
      const categoryExists = await db.query.categories.findFirst({
        where: eq(categories.id, category.id),
      })
      if (!categoryExists) throw new Error('Category not found')
      await db.update(categories).set(category).where(eq(categories.id, category.id))
      revalidatePath('/admin/categories')
      return {
        success: true,
        message: 'Category updated successfully',
      }
    } catch (error) {
      return { success: false, message: formatError(error) }
    }
  }

// GET
export async function getCategoryById(productId: string) {
    try {
      return await db.query.categories.findFirst({
        where: eq(categories.id, productId),
      })
    } catch (error) {
      console.error('Error fetching category by id:', error)
      return null
    }
  }

export async function getCategories() {
  try {
    return await db.query.categories.findMany({
      orderBy: [asc(categories.createdAt)],
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getAllCategories({
    limit = 20,
    page,
}: {
  limit?: number
  page: number
}) {
  try {
    const data = await db.query.categories.findMany({
      orderBy: [desc(categories.createdAt)],
      limit,
      offset: (page - 1) * limit,
    })
    const dataCount = await db.select({ count: count() }).from(categories)
    return {
      data,
      totalPages: Math.ceil(dataCount[0].count / limit),
    }
  } catch (error) {
    console.error('Error fetching all categories:', error)
    return {
      data: [],
      totalPages: 0
    }
  }
}

// DELETE
export async function deleteCategory(id: string) {
  try {
    const categorytExists = await db.query.categories.findFirst({
      where: eq(categories.id, id),
    })
    if (!categorytExists) throw new Error('Category not found')
    await db.delete(categories).where(eq(categories.id, id))
    revalidatePath('/admin/categories')
    return {
      success: true,
      message: 'Category deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}