export const ENDPOINTS = {
  products: "/api/v1/products",
  categories: "/api/v1/categories",
  brands: "/api/v1/brands",
  cart: "/api/v1/cart",
  wishlist: "/api/v1/wishlist",
  orders: "/api/v1/orders",
  auth: {
    signin: "/api/v1/auth/signin",
    signup: "/api/v1/auth/signup",
    forgotPasswords: "/api/v1/auth/forgotPasswords",
    verifyResetCode: "/api/v1/auth/verifyResetCode",
    resetPassword: "/api/v1/auth/resetPassword",
  },
} as const;
