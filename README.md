# Liberian Chinese Society - Website

A production-ready, bilingual (English/中文) website for the Liberian Chinese Society built with modern web technologies.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui patterns
- **Internationalization**: next-intl (English + Simplified Chinese)
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payments**: Stripe
- **Deployment**: Cloudflare Pages or Vercel

## Features

### Public Pages
- **Home**: Hero section, mission statement, latest news, upcoming events, partner logos
- **About**: Organization history, leadership committee, constitution/bylaws downloads
- **Events**: Event listings, detailed event pages, RSVP functionality, calendar exports
- **News**: Blog-style announcements, categories, search functionality
- **Directory**: Business directory with filtering and contact options
- **Resources**: Newcomer guides, legal information, local services, emergency contacts
- **Gallery**: Photo and video gallery
- **Contact**: Contact form, location map, WeChat/WhatsApp integration
- **Donate**: One-time and recurring donations, sponsorship tiers
- **Membership**: Membership tier options and benefits

### Member Features
- Email magic link authentication
- Member profiles with WeChat ID and business listing
- Membership dashboard
- RSVP history and management
- Invoice/receipt downloads
- Event ticket purchases

### Admin Features
- Protected admin dashboard
- CRUD operations for: events, posts, directory listings, gallery items, resources
- Approve/reject directory submissions
- Member export (CSV)
- Basic analytics dashboard
- Sponsorship management

## Project Structure

```
liberia-chinese/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/
│   │   ├── events/
│   │   ├── news/
│   │   ├── directory/
│   │   ├── resources/
│   │   ├── gallery/
│   │   ├── contact/
│   │   ├── donate/
│   │   ├── membership/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── admin/
│   ├── api/
│   │   └── stripe/webhooks/
│   └── globals.css
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Layout.tsx
├── lib/
│   ├── supabase.ts
│   ├── stripe.ts
│   ├── utils.ts
│   ├── database.types.ts
│   └── constants.ts
├── content/
│   ├── en.ts
│   └── zh.ts
├── supabase/
│   └── migrations/
│       ├── 001_init.sql
│       └── 002_notifications.sql
└── public/
```

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd liberia-chinese
npm install
```

### 2. Supabase Setup

1. Create a Supabase project: https://supabase.com
2. Get API credentials from Settings > API
3. Apply migrations in SQL Editor from `supabase/migrations/*.sql`

### 3. Stripe Setup

1. Create Stripe account: https://stripe.com
2. Get API keys from Developers > API Keys
3. Create webhook: `stripe listen --forward-to localhost:3000/api/stripe/webhooks`

### 4. Environment Variables

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Deployment

### Vercel

```bash
# Push to GitHub
# Connect to Vercel and add environment variables
# Deploy!
```

### Cloudflare Pages

```bash
wrangler deploy
```

## Database

The application uses Supabase PostgreSQL with:
- **Tables**: profiles, events, posts, directory_listings, gallery_items, resources, payments, etc.
- **Auth**: Email magic links + Google OAuth
- **Storage**: Image uploads to Supabase CDN
- **RLS**: Row-level security policies for all tables

## Internationalization

Routes are language-prefixed:
- `/en/*` - English
- `/zh/*` - Chinese (Simplified)

Add translations in `content/en.ts` and `content/zh.ts`

## Security

- ✅ Row-Level Security (RLS) in Supabase
- ✅ Server actions for secure mutations
- ✅ Environment variable isolation
- ✅ HTTPS in production
- ✅ CSRF protection
- ✅ SQL injection prevention

## Common Commands

```bash
# Development
npm run dev

# Build
npm run build
npm start

# Type check
npm run type-check

# Lint
npm run lint

# Database migrations
supabase db push
```

## Support

Email: info@liberiachinese.com
Phone: +231 XX XXX XXXX

## License

© 2025 Liberian Chinese Society. All rights reserved.