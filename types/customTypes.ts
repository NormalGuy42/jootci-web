import { z } from "zod";
import { cartItemSchema, shippingAddressSchema } from "../lib/validator";


import { InferSelectModel } from 'drizzle-orm'
import { carts, products } from "../lib/schema";

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