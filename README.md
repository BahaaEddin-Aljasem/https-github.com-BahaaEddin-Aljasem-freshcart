# FreshCart

Next.js 15 (App Router) + TypeScript (strict) + Tailwind 4 + Zustand + TanStack Query + React Hook Form + Zod.

## Run
```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000
npm run build && npm start  # optimized production mode on the same port
```

Development uses webpack on port 3000 and a separate `.next-freshcart-dev` directory.
This avoids file-lock errors when Next.js runs inside a synced Windows folder such as OneDrive.
Production builds use the default `.next` directory (required by Vercel); set `NEXT_DIST_DIR` to override either directory.

## Scripts
```bash
npm run dev | build | start
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm test            # Vitest (including local authentication)
```

## API and data
The catalog is loaded from the Route E-commerce API using `NEXT_PUBLIC_API_BASE_URL`.
Products, categories, product details, discounted offers, and related products use live API responses.
Search, category/price filters, sorting, and pagination run against the fetched catalog because the
live products endpoint does not return matching results for its search query parameters.

Sign-in and registration run entirely in the browser. Account records and persistent sessions are stored
in LocalStorage; passwords are stored as salted PBKDF2 hashes rather than plaintext. These local accounts
are device-specific and are not a security boundary: users can edit browser storage, and local accounts
cannot authenticate with the commerce API. Clear "Keep me signed in" to sign in only until the page is reloaded.
Password recovery, the catalog, and commerce operations still use the configured API.
Public catalog responses are cached for five minutes (categories and brands for ten minutes); optimized
product images are cached locally for one day. Single-category browsing uses the API's paginated category
filter instead of downloading and filtering the entire catalog. The home,
categories, and brands pages are revalidated in the background so repeat navigation avoids fresh API requests.

Cart and wishlist items are persisted in the browser with Zustand. Local accounts use those same
device-local cart and wishlist stores. Saved profile addresses are stored in LocalStorage per account
on this browser and are not synchronized with the commerce API. Placing orders and viewing server-side
order history require a commerce account accepted by the API. Card payments are not offered because no
payment endpoint is configured.
Registration, checkout, and saved addresses accept international phone numbers and country calling codes;
numbers are stored in E.164 format. The commerce API accepts no separate shipping-country field, so checkout
includes the country name with the city. Saved addresses can be selected at checkout and optionally saved
after a successful order.

## Structure
`src/app` routes and BFF handlers · `src/features/*` domain APIs, hooks, components, and product models ·
`src/components` shared UI · `src/store` persisted Zustand state · `src/services` catalog API ·
`src/schemas` Zod validation · `src/lib` shared infrastructure.

## Pages
/ · /products (Shop: search, category/brand/price filters, sorting, grid/list views, pagination) · /products/[id] · /categories (visual category directory) · /categories/[id] ·
/cart · /wishlist · /checkout (client-side local-session guard) · /profile/orders and /profile/orders/[id]
(client-side local-session guard) · /login · /register · /forgot-password

## Notes
- The Figma file requires an authenticated Figma session to inspect.
- Newsletter and app-promotion artwork is UI-only; no subscription endpoint or app-store destinations are configured.
