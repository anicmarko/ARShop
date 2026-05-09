# ARShop

ARShop is a full-stack e-commerce platform built with Next.js, TypeScript, Prisma, and Stripe. It consists of two separate Next.js projects — an **admin dashboard** and a **storefront** — that must both be running at the same time.

## Tech Stack

- Next.js 16, TypeScript, Tailwind CSS
- Prisma ORM + MySQL
- Stripe (payments)
- Clerk (authentication)
- Cloudinary (image uploads)

---

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL database
- Stripe, Clerk, and Cloudinary accounts

---

### 1. Admin (`arshop-admin`)

```bash
cd arshop-admin
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Runs on `http://localhost:3000`.

**.env file:**
```env
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
FRONTEND_URL=http://localhost:3001
```

---

### 2. Store (`arshop-store`)

```bash
cd arshop-store
npm install
npm run dev
```

Runs on `http://localhost:3001`.

**.env file:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/<STORE_ID>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

> `STORE_ID` is obtained from the admin dashboard after creating a store.

---

### Note

Both projects must be running at the same time — the storefront communicates with the admin API for products, categories, and checkout.

For Stripe webhooks in production, register the endpoint in the Stripe Dashboard:
```
https://<your-admin-domain>/api/webhook
```
