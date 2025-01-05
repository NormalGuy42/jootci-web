
export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 24

export const APP_NAME = "Tibb-Jox"

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(', ')
  : ['admin', 'user', 'vendor', 'moderator']

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(', ')
  : ['PayPal', 'Stripe', 'CashOnDelivery']
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || 'PayPal'


export const signInDefaultValues = {
    email: '',
    password: '',
}

export const signUpDefaultValues = {
    name: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
}

export const shippingAddressDefaultValues = {
    fullName: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: '',
  }

  export const categoryDefaultValues = {
    name: '',
    slug: '',
    images: '',
    description: '',
  }

  export const allowedProductDefaultValues = {
    name: '',
    category: '',
    images: [],
    stockType: '',
  }

  export const productDefaultValues = {
    allowedProductId: '', // Add this
    price: 0,
    stock: 0,
    description: '',
  }

  export const reviewFormDefaultValues = {
    title: '',
    comment: '',
    rating: 0,
  }
