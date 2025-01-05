import{
    boolean,
    integer,
    json,
    numeric,
    pgTable,
    primaryKey,
    text,
    timestamp,
    uniqueIndex,
    uuid,
} from 'drizzle-orm/pg-core';
import { AdapterAccountType } from 'next-auth/adapters';
import { CartItem, PaymentResult, ShippingAddress } from '../types/customTypes';
import { relations } from 'drizzle-orm';


// ORDERS
export const orders = pgTable('order', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    vendorID: uuid('vendorID')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
    shippingAddress: json('shippingAddress').$type<ShippingAddress>().notNull(),
    paymentMethod: text('paymentMethod').notNull(),
    paymentResult: json('paymentResult').$type<PaymentResult>(),
    itemsPrice: numeric('itemsPrice', { precision: 12, scale: 2 }).notNull(),
    shippingPrice: numeric('shippingPrice', {
      precision: 12,
      scale: 2,
    }).notNull(),
    taxPrice: numeric('taxPrice', { precision: 12, scale: 2 }).notNull(),
    totalPrice: numeric('totalPrice', { precision: 12, scale: 2 }).notNull(),
    isPaid: boolean('isPaid').notNull().default(false),
    paidAt: timestamp('paidAt'),
    isDelivered: boolean('isDelivered').notNull().default(false),
    deliveredAt: timestamp('deliveredAt'),
    orderStatus: text('orderStatus').notNull(),
    estimatedArrival: timestamp('estimatedArrival'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const ordersRelations = relations(orders, ({ one, many }) => ({
    orderItems: many(orderItems),
    user: one(users, { fields: [orders.userId], references: [users.id] }),
  }))

export const orderItems = pgTable(
    'orderItems',   
    {
        orderId: uuid('orderId')
        .notNull()
        .references(() => orders.id, { onDelete: 'cascade' }),
        productId: uuid('productId')
        .notNull()
        .references(() => products.id, { onDelete: 'cascade' }),
        qty: integer('qty').notNull(),
        price: numeric('price', { precision: 12, scale: 2 }).notNull(),
        name: text('name').notNull(),
        slug: text('slug').notNull(),
        image: text('image').notNull(),
    },
    (orderItem) => ({
        compoundKey: primaryKey({
        columns: [orderItem.orderId, orderItem.productId],
        }),
    })
)

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
}),
}))

//CATEGORIES

export const categories = pgTable(
  'category',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    image: text('image').notNull(), 
    description: text('description').notNull(),   
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  }
)

//PRODUCTS

export const allowedProducts = pgTable(
  'allowedProducts',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    name: text('name').notNull(),
    category: text('category').notNull(),
    images: text('images').array(),
    stockType: text('stockType'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  }
)

export const products = pgTable(
    'product',
    {
        id: uuid('id').defaultRandom().primaryKey().notNull(),
        name: text('name').notNull(),
        slug: text('slug').notNull(),
        category: text('category').notNull(),
        images: text('images').array(),
        description: text('description').notNull(),
        stock: integer('stock'),
        stockType: text('stockType'),
        price: numeric('price', { precision: 12, scale: 2}).default('0') ,
        rating: numeric('rating', { precision: 3, scale: 2}).default('0') ,
        numReviews: integer('numReviews').default(0),
        vendorID: text('vendorID').notNull(),
        createdAt: timestamp('createdAt').defaultNow().notNull(),
    },
    (table) =>{
        return {
            productSlugIndex: uniqueIndex('product_slug_index').on(table.slug)
        }
    }
)

export const reviews = pgTable('reviews', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    productId: uuid('productId')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    title: text('title').notNull(),
    description: text('slug').notNull(),
    isVerifiedPurchase: boolean('isVerifiedPurchase').notNull().default(true),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  })
  
  export const productRelations = relations(products, ({ many }) => ({
    reviews: many(reviews),
  }))


  export const reviewsRelations = relations(reviews, ({ one }) => ({
    user: one(users, { fields: [reviews.userId], references: [users.id] }),
    product: one(products, {
      fields: [reviews.productId],
      references: [products.id],
    }),
  }))

// USERS

export const users = pgTable("user", {
    id: uuid("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    role: text('role').notNull().default('user'),
    password: text('password'),
    image: text("image"),
    address: json('address').$type<ShippingAddress>(),
    paymentMethod: text('paymentMethod'),
    createdAt: timestamp('createdAt').defaultNow(),
    },
    (table) => {
        return {
          userEmailIdx: uniqueIndex('user_email_idx').on(table.email),
        }
      }
)



export const accounts = pgTable(
    "account",
{
    userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
},
(account) => ({
    compoundKey: primaryKey({
    columns: [account.provider, account.providerAccountId],
    }),
})
)

export const sessions = pgTable(
    "session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: uuid("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
        }),
    })
)

// export const authenticators = pgTable(
//     "authenticator",
//     {
//         credentialID: text("credentialID").notNull().unique(),
//         userId: uuid("userId")
//         .notNull()
//         .references(() => users.id, { onDelete: "cascade" }),
//         providerAccountId: text("providerAccountId").notNull(),
//         credentialPublicKey: text("credentialPublicKey").notNull(),
//         counter: integer("counter").notNull(),
//         credentialDeviceType: text("credentialDeviceType").notNull(),
//         credentialBackedUp: boolean("credentialBackedUp").notNull(),
//         transports: text("transports"),
//     },
// (authenticator) => ({
//     compositePK: primaryKey({
//     columns: [users.id, authenticator.credentialID],
//     }),
// })
// )

// CARTS
export const carts = pgTable('cart', {
    id: uuid('id').notNull().defaultRandom().primaryKey(),
    userId: uuid('userId').references(() => users.id, {
      onDelete: 'cascade',
    }),
    sessionCartId: text('sessionCartId').notNull(),
    items: json('items').$type<CartItem[]>().notNull().default([]),
    itemsPrice: numeric('itemsPrice', { precision: 12, scale: 2 }).notNull(),
    shippingPrice: numeric('shippingPrice', {
      precision: 12,
      scale: 2,
    }).notNull(),
    taxPrice: numeric('taxPrice', { precision: 12, scale: 2 }).notNull(),
    totalPrice: numeric('totalPrice', { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  })