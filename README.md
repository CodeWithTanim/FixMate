# FixMate Client

FixMate is an on-demand electronic device and home appliance repair marketplace connecting customers with vetted local repair technicians. Customers discover services across 7 specialized repair categories, schedule appointments, track repair lifecycle milestones, and pay securely only after verified repair completion.

## Key Features

- **Multi-Role Workflows**: Tailored portals for Customers, Technicians, and Administrators.
- **Pay-After-Completion Protection**: Customers pay zero upfront deposits; invoices are settled via Stripe card checkout only after work is completed.
- **Catalog Discovery**: Server-paginated search, category and service mode filtering, price sorting, and deep links.
- **Repair Lifecycle State Machine**: Enforces strict transitions (`requested` -> `accepted`/`rejected`, `accepted` -> `in-progress`, `in-progress` -> `completed` with final billable amount).
- **Audit Timeline**: Timestamped audit trail tracking every status transition with actor email, role, and notes.
- **Administrative Moderation**: Quality control workflow requiring admin approval for new service listings and price updates.
- **Settlement & Receipts**: Real-time Stripe webhook verification, customer transaction history, printable invoice modal, and platform revenue ledger.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 with Petrol (`#0B3638`), Jade (`#18756B`), and Amber (`#F4B740`) design tokens
- **Authentication**: Better Auth with MongoDB Adapter
- **Authorization Bridge**: Short-lived HS256 JWTs via `jose` for secure Express API communication
- **Payments**: Stripe Checkout Sessions with test-mode fulfillment
- **Testing**: Node.js native test runner (`node --test`)
- **Notifications**: `react-hot-toast`
- **Icons**: `lucide-react`

## Directory Structure

```text
FixMate/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx                # Centered authentication shell
│   │   ├── sign-in/page.tsx          # Login with redirect callbacks
│   │   └── sign-up/page.tsx          # Registration with server password policy
│   ├── (public)/
│   │   ├── layout.tsx                # Public navigation & footer
│   │   ├── page.tsx                  # Split hero, 7 categories, and featured services
│   │   ├── about/page.tsx            # Transparent 4-step repair lifecycle
│   │   └── services/                 # Catalog search, filter, and details [id]
│   ├── api/
│   │   ├── auth/[...all]/            # Better Auth API endpoints
│   │   └── token/                    # Session-guarded JWT issuer for backend API
│   ├── dashboard/
│   │   ├── layout.tsx                # Role-aware dark petrol sidebar (250px)
│   │   ├── customer/                 # Overview, bookings, and payment receipts
│   │   ├── technician/               # Overview, queue, service listings, add service
│   │   ├── admin/                    # Overview, moderation, user roles, transactions
│   │   └── profile/page.tsx          # Profile management with photo upload
│   ├── payment/
│   │   ├── success/page.tsx          # Stripe session verification return handler
│   │   └── cancel/page.tsx           # Cancelled checkout return handler
│   ├── privacy/page.tsx              # Privacy policy
│   ├── terms/page.tsx                # Terms of service
│   ├── error.tsx                     # Themed diagnostic error boundary
│   ├── loading.tsx                   # Themed workshop loading screen
│   └── not-found.tsx                 # Themed repair 404 page
├── components/                       # Shared UI and domain components
├── lib/
│   ├── __tests__/                    # Automated domain unit tests
│   ├── api/                          # Token-aware backend API client
│   ├── auth.ts                       # Better Auth server configuration
│   ├── auth-client.ts                # Better Auth client hooks
│   ├── auth-guards.ts                # Server-side role boundaries
│   └── db.ts                         # Cached MongoDB connection singleton
└── scripts/
    └── seed.mjs                      # Idempotent database seeder
```

## Available Scripts

- `npm run dev`: Start local Next.js development server on port 3000
- `npm run build`: Compile and generate optimized production static pages
- `npm run start`: Launch the production build server
- `npm run lint`: Run ESLint checks
- `npm run typecheck`: Run TypeScript static type checking
- `npm run test`: Run automated domain unit tests
- `npm run seed`: Populate demo accounts, approved services, and connected bookings

## Environment Variables

Configure these variables in your deployment settings. Never commit `.env` files to Git.

| Variable | Description |
| --- | --- |
| `BETTER_AUTH_SECRET` | Secret key for signing authentication sessions |
| `BETTER_AUTH_URL` | Base URL of the client application (`http://localhost:3000`) |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Trusted origins for auth callbacks |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `MONGODB_DBNAME` | Target database name (`fixmate-db`) |
| `JWT_SECRET` | Shared secret key for API authorization tokens |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (`http://localhost:5000`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe test publishable key (`pk_test_...`) |
| `STRIPE_SECRET_KEY` | Stripe test secret key (`sk_test_...`) |
| `IMGBB_API_KEY` | Optional ImgBB API key for service and profile photo hosting |

## Demo Credentials

The database can be seeded idempotently using `npm run seed`:

- **Customer**: `customer@fixmate.dev` / Password: `FixMate2026!`
- **Technician 1**: `rahim.tech@fixmate.dev` / Password: `FixMate2026!`
- **Technician 2**: `sarah.appliances@fixmate.dev` / Password: `FixMate2026!`
- **Admin**: `admin@fixmate.dev` / Password: `FixMate2026!`
