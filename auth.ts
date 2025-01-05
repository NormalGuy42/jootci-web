import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { compareSync } from 'bcrypt-ts-edge'
import { eq } from 'drizzle-orm'
import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { carts, users } from './lib/schema'
import db from './lib/db'

declare module '@auth/core/adapters' {
  interface AdapterUser {
    role: string
  }
}

declare module 'next-auth' {
  interface User {
    role: string
  }
  
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: string
    }
  }
}

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        })
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          )
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }: any) => {
      if (user) {
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0]
          await db
            .update(users)
            .set({
              name: token.name,
            })
            .where(eq(users.id, user.id))
        }

        token.role = user.role
        if (trigger === 'signIn' || trigger === 'signUp') {
          const sessionCartId = cookies().get('sessionCartId')?.value
          if (!sessionCartId) throw new Error('Session Cart Not Found')
          const sessionCartExists = await db.query.carts.findFirst({
            where: eq(carts.sessionCartId, sessionCartId),
          })
          if (sessionCartExists && !sessionCartExists.userId) {
            const userCartExists = await db.query.carts.findFirst({
              where: eq(carts.userId, user.id),
            })
            if (userCartExists) {
              cookies().set('beforeSigninSessionCartId', sessionCartId)
              cookies().set('sessionCartId', userCartExists.sessionCartId)
            } else {
              db.update(carts)
                .set({ userId: user.id })
                .where(eq(carts.id, sessionCartExists.id))
            }
          }
        }
      }

      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name
      }

      return token
    },
    session: async ({ session, user, trigger, token }: any) => {
      session.user.id = token.sub
      session.user.role = token.role
      if (trigger === 'update') {
        session.user.name = user.name
      }
      return session
    },
    authorized({ request, auth }: any) {
      const protectedPaths = [
        '/shipping-address',
        '/payment-method',
        '/place-order',
        '/profile',
        '/orders',
        '/user',
      ]
      const { pathname } = request.nextUrl

     // Check if path requires authentication
     const requiresAuth = protectedPaths.some(path => pathname.startsWith(path))

     // If not logged in and trying to access any protected path (including admin/vendor)
     if (!auth?.user && (requiresAuth || pathname.startsWith('/admin') || pathname.startsWith('/vendor'))) {
       return false // This will redirect to sign-in
     }

     // If logged in, check role-based access
     if (auth?.user) {
       // Admin route protection
       if (pathname.startsWith('/admin') && auth.user.role !== 'admin') {
         return Response.redirect(new URL('/unauthorized', request.url))
       }

       // Vendor route protection
       if (pathname.startsWith('/vendor') && auth.user.role !== 'vendor') {
         return Response.redirect(new URL('/unauthorized', request.url))
       }
     }
      // Admin route protection
      // if (pathname.startsWith('/admin')) {
      //   // If not logged in or not an admin
      //   if (!userRole || userRole !== 'admin') {
      //     // If logged in but wrong role, go to unauthorized
      //     if (userRole) {
      //       return NextResponse.redirect(new URL('/unauthorized', request.url))
      //     }
      //     // If not logged in, go to sign in
      //     return NextResponse.redirect(new URL('/sign-in', request.url))
      //   }
      // }

      // // Vendor route protection
      // if (pathname.startsWith('/vendor')) {
      //   // If not logged in or not a vendor
      //   if (!userRole || userRole !== 'vendor') {
      //     // If logged in but wrong role, go to unauthorized
      //     if (userRole) {
      //       return NextResponse.redirect(new URL('/unauthorized', request.url))
      //     }
      //     // If not logged in, go to sign in
      //     return NextResponse.redirect(new URL('/sign-in', request.url))
      //   }
      // }
      
      if (!request.cookies.get('sessionCartId')) {
        const sessionCartId = crypto.randomUUID()
        const newRequestHeaders = new Headers(request.headers)
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        })
        response.cookies.set('sessionCartId', sessionCartId)
        return response
      } else {
        return true
      }
    },
  },
} satisfies NextAuthConfig
export const { handlers, auth, signIn, signOut } = NextAuth(config)

