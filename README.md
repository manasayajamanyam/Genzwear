# GEN Z WEAR

Men’s fashion catalogue website. Customers browse products and send WhatsApp enquiries. Administrators will manage the catalogue from a protected dashboard after Firebase is connected.

**Brand:** GEN Z WEAR  
**Tagline:** STYLE THAT SPEAKS.

## Current status

**Phase 1 is complete.** You can run the site locally, browse the homepage, categories, shop, product details, and static pages.

The catalogue currently loads from local sample data in `src/data/sampleCatalog.js` through service files. That is temporary. Later phases replace those services with Firestore. Do not treat the sample products as the live store.

## Stack

- React + Vite + JavaScript
- Tailwind CSS
- React Router
- Lucide React
- Firebase Authentication and Firestore
- Cloudinary unsigned uploads

## Run locally

You need **Node.js 20+**. This machine previously had Node 16, which cannot run current Vite. Node.js LTS was installed during setup.

```bash
cd C:\Users\yajam\genzwear
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Project structure

```
src/
  components/     Navbar, Footer, ProductCard, gallery, WhatsApp, search
  pages/          Home, Shop, ProductDetails, About, Contact, legal pages
  admin/          Login now; dashboard modules in later phases
  services/       Data access. UI does not talk to Firebase directly
  context/        Store-wide settings, categories, products
  hooks/          WhatsApp enquiry helper
  utils/          Price formatting and WhatsApp URL builders
  data/           Sample catalogue for Phase 1 only
```

## What works in Phase 1

- Homepage hero, categories, new arrivals, trending, bestsellers, featured collections
- Search, category pages, sorting
- Product details with size, colour, quantity, gallery, related products
- WhatsApp enquiry message format
- Floating WhatsApp button
- About, Contact, Privacy, Terms, Shipping pages
- `/admin` login screen placeholder (Firebase Auth is not connected yet)

## Credentials you will need later

Do **not** create these yet unless you want to get ahead. Phase 3 and Phase 5 will walk through each click.

### Phase 3 — Firebase (free Spark plan)

1. Open [https://console.firebase.google.com](https://console.firebase.google.com)
2. Create a project (name it something like `genz-wear`)
3. Enable **Firestore**
4. Register a **Web** app and copy the config object
5. Enable **Authentication > Email/Password** in Phase 4
6. Put the web config into `.env.local` using `.env.example` as the template

You do not need Firebase Hosting until Phase 9.

### Phase 5 — Cloudinary (free account)

1. Open [https://cloudinary.com](https://cloudinary.com) and create a free account
2. Copy **Cloud name**
3. Create an **unsigned upload preset** for admin image uploads
4. Keep **API secret** off the frontend. Never put it in a `VITE_` variable

## WhatsApp

Enquiries use the public Click-to-Chat URL:

`https://wa.me/91XXXXXXXXXX`

The number lives in store settings. It is empty in sample data on purpose so a fake number is not invented. After Admin Settings is built, the live site will use the number you save.

## Next phase

**Phase 2** expands shop filters (price, size), load-more/pagination, and tightens the product details experience. Still no Firebase credentials required.

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run preview` — preview the production build
