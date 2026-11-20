# FixMate Client

FixMate is an on-demand device and home appliance repair service platform. Customers can discover certified local technicians across 7 repair categories, book doorstep home visits or shop drop-offs, track job progress, and pay securely upon verified job completion.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Better Auth with MongoDB Adapter
- **Authorization Bridge**: Short-lived HS256 JWTs via `jose` for secure Express API communication
- **Notifications**: `react-hot-toast`
- **Icons**: `lucide-react`
- **Database**: MongoDB Native Driver with connection pooling

## Architecture & Directory Structure

```text
FixMate/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx         # Centered authentication shell
│   │   ├── sign-in/page.tsx   # Email/password login with redirect
│   │   └── sign-up/page.tsx   # Customer/technician account creation
│   ├── (public)/
│   │   ├── layout.tsx         # Public navigation and footer
│   │   ├── page.tsx           # Repair-focused hero, categories, and workflow
│   │   ├── about/page.tsx     # How FixMate works & trust guarantees
│   │   └── services/page.tsx  # Live service catalog with category filtering
│   ├── api/
│   │   ├── auth/[...all]/     # Better Auth API endpoints
│   │   └── token/             # Session-guarded JWT issuer for backend API
│   ├── dashboard/
│   │   ├── layout.tsx         # Authenticated role guard & dashboard shell
│   │   ├── page.tsx           # Role-based dashboard router
│   │   ├── customer/page.tsx  # Customer repair requests & bookings
│   │   ├── technician/page.tsx# Technician service & job management
│   │   └── admin/page.tsx     # Platform moderation & oversight
│   ├── error.tsx              # Error boundary
│   ├── layout.tsx             # Root layout & toast container
│   ├── loading.tsx            # Global loading skeleton
│   └── not-found.tsx          # 404 page
├── components/
│   ├── Navbar.tsx             # Responsive header with mobile drawer & session state
│   ├── Footer.tsx             # Footer with categories and navigation
│   └── DashboardSignOut.tsx   # Session sign-out control
├── lib/
│   ├── auth.ts                # Server Better Auth configuration & hooks
│   ├── auth-client.ts         # Client authentication hooks
│   ├── db.ts                  # Reusable MongoDB client promise
│   ├── utils.ts               # Class name utility (clsx + tailwind-merge)
│   └── api/services.ts        # Service catalog API client
└── types/
    └── index.ts               # Core domain TypeScript interfaces
```

## Available Scripts

- `npm run dev`: Start local development server on `http://localhost:3000`
- `npm run build`: Compile and build production Next.js bundle
- `npm run start`: Run production server
- `npm run lint`: Run ESLint checks
- `npm run typecheck`: Run TypeScript compiler type checking (`tsc --noEmit`)

## Environment Variables

Configure these environment variables in your local `.env` and Vercel project settings. Never commit `.env` files to git.

| Variable | Description | Required In |
| --- | --- | --- |
| `BETTER_AUTH_SECRET` | Strong secret key for session cookie encryption | Phase 1 |
| `BETTER_AUTH_URL` | Application root URL (`http://localhost:3000` or production domain) | Phase 1 |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Comma-separated list of allowed origins | Phase 1 |
| `MONGODB_URI` | MongoDB Atlas connection string | Phase 1 |
| `MONGODB_DBNAME` | Database name (`fixmate-db`) | Phase 1 |
| `JWT_SECRET` | Shared cryptographic key for issuing API tokens | Phase 1 |
| `JWT_ISSUER` | Expected JWT issuer (must match frontend origin) | Phase 1 |
| `JWT_AUDIENCE` | Expected JWT audience (`fixmate-api`) | Phase 1 |
| `NEXT_PUBLIC_API_URL` | Express backend URL (`http://localhost:5000` or production backend) | Phase 1 |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID (optional) | Future |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret (optional) | Future |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Payment Phase |

## Vercel Deployment

1. Import the `CodeWithTanim/FixMate` repository in Vercel.
2. Select Framework Preset: `Next.js`.
3. Set Root Directory: `.` (repository root).
4. Build Command: `npm run build`.
5. Configure all required environment variables in Vercel Project Settings.
6. Deploy and verify authentication, public pages, and role dashboard routing.
