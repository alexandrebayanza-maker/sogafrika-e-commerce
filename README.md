# SogAfrika - Electronic Security & Technology E-Commerce Platform

A modern, production-ready full-stack e-commerce platform built with Next.js 14, Supabase, Stripe, and Tailwind CSS.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + React 18
- **Styling**: Tailwind CSS + Framer Motion animations
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + Row Level Security
- **Storage**: Supabase Storage (product images)
- **Payments**: Stripe Checkout
- **Email**: Resend
- **State Management**: Zustand (persisted)
- **Form Validation**: React Hook Form + Zod
- **Icons**: Lucide React

## Features

### Customer-Facing
- Responsive dark-theme UI with glowing accents
- Product catalog with search, filter, sort, and pagination
- Product detail pages with image gallery and specifications
- Shopping cart with persistent state
- Wishlist system
- Secure checkout with Stripe payment
- Order confirmation emails
- Multi-currency support (USD, EUR, XOF)
- Dark/Light mode toggle
- Mobile-responsive design

### Admin Dashboard
- Secure authentication with role-based access
- Product management (full CRUD)
- Image upload to Supabase Storage
- Category management
- Order management with status updates
- Inventory monitoring with low-stock alerts
- Sales analytics dashboard

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)
- Stripe account (test mode)
- Resend account (for emails)

### 1. Clone and Install

```bash
cd sogafrika
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rpc_functions.sql`
3. Go to Storage and create a bucket called `product-images` (set to public)
4. Copy your project URL and keys from Settings > API

### 3. Create Admin User

1. In Supabase Authentication, create a new user (email + password)
2. Copy the user ID
3. In SQL Editor, run:
```sql
INSERT INTO admin_profiles (id, role) VALUES ('YOUR_USER_ID', 'admin');
```

### 4. Set Up Stripe

1. Get your API keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. For webhooks (production), create a webhook endpoint:
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`

### 5. Set Up Resend

1. Create account at [resend.com](https://resend.com)
2. Add and verify your domain
3. Get your API key

### 6. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Required variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=contact@sogafrika.com
```

### 7. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

Admin login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### 2. Deploy on Vercel

1. Import your repo at [vercel.com/new](https://vercel.com/new)
2. Add all environment variables from `.env.local`
3. Update `NEXT_PUBLIC_SITE_URL` to your Vercel domain
4. Deploy

### 3. Post-Deploy

1. Update Stripe webhook URL to your production domain
2. Verify Resend domain settings
3. Test the complete checkout flow with Stripe test cards

## Project Structure

```
sogafrika/
├── app/
│   ├── (store)/          # Customer-facing pages
│   │   ├── page.tsx      # Home page
│   │   ├── products/     # Catalog + detail pages
│   │   ├── cart/         # Shopping cart
│   │   ├── checkout/     # Checkout + success
│   │   └── wishlist/     # Wishlist page
│   ├── admin/            # Admin dashboard
│   │   ├── products/     # Product CRUD
│   │   ├── categories/   # Category management
│   │   ├── orders/       # Order management
│   │   └── inventory/    # Stock monitoring
│   ├── api/              # API routes
│   │   ├── products/     # Product endpoints
│   │   ├── categories/   # Category endpoints
│   │   ├── orders/       # Order endpoints
│   │   ├── stripe/       # Stripe checkout + webhooks
│   │   ├── upload/       # Image upload
│   │   └── analytics/    # Admin analytics
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── store/            # Store UI components
│   └── shared/           # Shared components
├── lib/
│   ├── supabase/         # Supabase clients
│   ├── stripe.ts         # Stripe utility
│   ├── resend.ts         # Email templates
│   ├── constants.ts      # App constants
│   └── utils.ts          # Helper functions
├── stores/               # Zustand stores
├── types/                # TypeScript types
├── middleware.ts         # Auth middleware
└── supabase/
    └── migrations/       # Database schema
```

## Testing Payments

Use Stripe test cards:
- **Success**: `4242 4242 4242 4242`
- **Requires auth**: `4000 0025 0000 3155`
- **Decline**: `4000 0000 0000 0002`

Any future date, any 3-digit CVC, any postal code.

## License

Private - SogAfrika &copy; 2024
