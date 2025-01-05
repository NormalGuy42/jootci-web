import * as z from 'zod'
import { formatNumberWithDecimal } from './utils'
import { PAYMENT_METHODS } from './constants'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { allowedProducts, categories, orderItems, orders, products, reviews } from './schema'



// USER
export const signInFormSchema = z.object({
    email: z.string().email().min(3, 'Email must be at least 3 characters'),
    password: z.string().min(3, 'Password must be at least 3 characters'),
  })

export const signUpFormSchema = z.object({

  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email().min(3, 'Email must be at least 3 characters'),
  role: z.enum(["user", "vendor"]),
  password: z.string().min(3, 'Password must be at least 3 characters'),
  confirmPassword: z.string().min(3, 'Confirm password must be at least 3 characters'),

}).refine((data)=> data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

export const updateProfileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email().min(3, 'Email must be at least 3 characters'),
})

export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, 'Id is required'),
  role: z.string().min(1, 'Role is required'),
})


// CATEGORY

export const insertCategorySchema = createSelectSchema(categories, {
  image: z.string().min(1, 'Category must have at least one image'),
  description: z.string().min(1, 'Description is required'),
}).omit({
  id: true,
  createdAt: true,
})

export const updateCategorySchema = createSelectSchema(categories, {
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  image: z.string().min(1, 'Category must have at least one image'),
  description: z.string().min(1, 'Description is required'),
}).omit({
  createdAt: true,
})


// PRODUCT

export const insertAllowedProductSchema = createSelectSchema(allowedProducts,{
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  images: z.array(z.string()).min(1, 'Product must have at least one image'),
  stockType: z.string().min(1, 'Stock Type is required'),
  
}).omit({
  id: true,
  createdAt: true,
})

export const updateAllowedProductSchema = createSelectSchema(allowedProducts,{
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  images: z.array(z.string()).min(1, 'Category must have at least one image'),
  stockType: z.string().min(1, 'Stock Type is required'),

}).omit({
  createdAt: true,
})

export const insertProductSchema = z.object({
  allowedProductId: z.string(),
  price: z.number().min(0),
  stock: z.number().min(0),
  description: z.string().min(10),
})

export const updateProductSchema = z.object({
  price: z.coerce.number().min(0, 'Price must be greater than 0'),
  stock: z.coerce.number().min(0, 'Stock must be greater than 0'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
})

export const insertReviewSchema = createInsertSchema(reviews, {
  rating: z.coerce
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
})


// CART
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  vendorID: z.string().min(1, 'Product is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  qty: z.number().int().nonnegative('Quantity must be a non-negative number'),
  image: z.string().min(1, 'Image is required'),
  price: z
    .number()
    .refine(
      (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(value)),
      'Price must have exactly two decimal places (e.g., 49.99)'
    ),
})

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  streetAddress: z.string().min(3, 'Address must be at least 3 characters'),
  city: z.string().min(3, 'city must be at least 3 characters'),
  postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
  country: z.string().min(3, 'Country must be at least 3 characters'),
  lat: z.number().optional(),
  lng: z.number().optional(),
})

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, 'Payment method is required'),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ['type'],
    message: 'Invalid payment method',
  })

  export const paymentResultSchema = z.object({
    id: z.string(),
    status: z.string(),
    email_address: z.string(),
    pricePaid: z.string(),
  })

  export const insertOrderSchema = createInsertSchema(orders, {
    shippingAddress: shippingAddressSchema,
    paymentResult: z
      .object({
        id: z.string(),
        status: z.string(),
        email_address: z.string(),
        pricePaid: z.string(),
      })
      .optional(),
  })

  export const insertOrderItemSchema = createInsertSchema(orderItems, {
    price: z.number(),
  })
