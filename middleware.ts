export { auth as middleware } from "./auth";

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|_next/assets|favicon.ico).*)',
        '/admin/:path*',
        '/vendor/:path*',
        '/shipping-address/:path*',
        '/payment-method/:path*',
        '/place-order/:path*',
        '/profile/:path*',
        '/orders/:path*',
        '/user/:path*',
      ]
}
