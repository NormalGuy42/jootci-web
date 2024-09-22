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
import { CartItem, ShippingAddress } from '../types/customTypes';

//PRODUCTS

export const products = pgTable(
    'product',
    {
        id: uuid('id').defaultRandom().primaryKey().notNull(),
        name: text('name').notNull(),
        slug: text('slug').notNull(),
        category: text('category').notNull(),
        images: text('images').array(),
        description: text('description'),
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

// USERS

export const users = pgTable("user", {
    id: uuid("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    role: text('role').notNull().default('user'),
    password: text('password'),
    image: text("image"),
    address: json('address').$type<ShippingAddress>(),
})

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

export const authenticators = pgTable(
    "authenticator",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: uuid("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
    },
(authenticator) => ({
    compositePK: primaryKey({
    columns: [authenticator.userId, authenticator.credentialID],
    }),
})
)

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