import { z } from "zod";
import { cartItemSchema, paymentResultSchema, shippingAddressSchema } from "../lib/validator";


import { InferSelectModel } from 'drizzle-orm'
import { allowedProducts, carts, categories, orderItems, orders, products, reviews } from "../lib/schema";


// CATEGORIES
export type Category = InferSelectModel<typeof categories>

// PRODUCTS
export type Product = InferSelectModel<typeof products>
export type ProductFormData = {
    allowedProductId?: string;
    price: number;
    stock: number;
    description: string;
}
export type AllowedProduct = InferSelectModel<typeof allowedProducts>
export type Review = InferSelectModel<typeof reviews> & {
    user?: { name: string }
  }
  
// CART
export type CartItem = z.infer<typeof cartItemSchema>
export type Cart = InferSelectModel<typeof carts>

export type ProductCardData = {
    name: string,
    type: string,
    price: string,
    imageUrl: string,
}

export type CategoryCardData = {
    title: string,
    imagePath: string,
    url: string,
}

export type BlogCardData = {
    imageUrl:string,
    date:string,
    title:string,
    text:string,
}

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type PaymentResult = z.infer<typeof paymentResultSchema>;

// ORDERS
export type Order = InferSelectModel<typeof orders> & {
    orderItems: OrderItem[]
    user: { name: string; email: string }
  }
  export type OrderItem = InferSelectModel<typeof orderItems>

// Miscellanous types

export type SideNavLink = {
    title: string,
    href: string,
    icon: React.ReactNode,
}