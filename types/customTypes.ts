import { z } from "zod";
import { cartItemSchema, paymentResultSchema, shippingAddressSchema } from "../lib/validator";


import { InferSelectModel } from 'drizzle-orm'
import { carts, orderItems, orders, products } from "../lib/schema";

// PRODUCTS
export type Product = InferSelectModel<typeof products>

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