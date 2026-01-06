# Complete Setup Guide

Complete step-by-step guide to get the Liberian Chinese Society website running from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [GitHub Setup](#github-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Stripe Configuration](#stripe-configuration)
5. [Local Development](#local-development)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Post-Launch](#post-launch)

## Prerequisites

### Required Software

- **Node.js**: Version 18.17 or higher
  - Download: https://nodejs.org/
  - Verify: `node --version`

- **npm**: Usually comes with Node.js
  - Verify: `npm --version`

- **Git**: For version control
  - Download: https://git-scm.com/
  - Verify: `git --version`

- **Code Editor**: VS Code recommended
  - Download: https://code.visualstudio.com/

### Required Accounts

- [GitHub](https://github.com) - For code hosting
- [Supabase](https://supabase.com) - For database
- [Stripe](https://stripe.com) - For payments
- [Vercel](https://vercel.com) OR [Cloudflare](https://cloudflare.com) - For hosting

## GitHub Setup

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `liberia-chinese`
3. Description: "Liberian Chinese Society Website"
4. Choose Public or Private
5. Initialize with README (recommended)
6. Click "Create repository"

### Step 2: Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/liberia-chinese.git
cd liberia-chinese
```

### Step 3: Add Project Files

All files are already in the repository. Verify key folders exist:

```bash
ls -la
# Should see: app/, components/, lib/, content/, supabase/, public/, etc.
```

### Step 4: Initial Commit

```bash
git add .
git commit -m "initial: project setup"
git push origin main
```

## Supabase Configuration

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "Sign In" or create new account
3. Go to dashboard and click "New project"
4. Fill in:
   - **Name**: `liberia-chinese`
   - **Database Password**: Create strong password
   - **Region**: Choose closest to Liberia (e.g., US East)
5. Click "Create new project"
6. Wait 2-3 minutes for provisioning

### Step 2: Get API Keys

1. Open your project
2. Go to **Settings > API** (left sidebar)
3. Copy these values to `.env.local`:

```
Project URL → NEXT_PUBLIC_SUPABASE_URL
anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY
service_role secret → SUPABASE_SERVICE_ROLE_KEY
```

### Step 3: Apply Database Migrations

#### Option A: Using Supabase Dashboard (Easiest)

1. Go to **SQL Editor** in Supabase dashboard
2. Click "New Query"
3. Open `supabase/migrations/001_init.sql` in your editor
4. Copy entire contents
5. Paste into Supabase SQL Editor
6. Click "Run"
7. Wait for completion (should see "Success")
8. Repeat with `002_notifications.sql`

#### Option B: Using Supabase CLI

```bash
# Install CLI
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Apply migrations
supabase db push
```

### Step 4: Set Up Authentication

1. Go to **Authentication > Providers** in Supabase
2. Find "Email" and ensure it's enabled
3. Click on "Email" to configure
4. Make sure "Enable email confirmations" is ON
5. (Optional) Enable Google OAuth:
   - Go to **Authentication > Providers > Google**
   - Click "Enable"
   - Get Google credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Add Client ID and Client Secret

### Step 5: Enable Row-Level Security

1. Go to **SQL Editor**
2. Run this command to verify RLS is enabled:

```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;
```

All tables should be listed.

### Step 6: Test Connection Locally

```bash
# Create .env.local with your Supabase credentials
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local  # or use your editor

# Test connection
npm install
npm run dev
```

Visit http://localhost:3000 - if it loads without errors, Supabase is working!

## Stripe Configuration

### Step 1: Create Stripe Account

1. Go to https://stripe.com
2. Click "Start now" or sign in
3. Complete onboarding (business info, etc.)

### Step 2: Get API Keys

1. Go to Dashboard https://dashboard.stripe.com
2. Click "Developers" (left sidebar) > "API keys"
3. Copy these values:

```
Publishable key → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Secret key → STRIPE_SECRET_KEY
```

### Step 3: Configure Webhook

1. Go to Developers > Webhooks
2. Click "Add an endpoint"
3. For local testing, use Stripe CLI:

```bash
# Install Stripe CLI
# macOS:
brew install stripe/stripe-cli/stripe

# Windows: Download from https://stripe.com/docs/stripe-cli
# Linux: See docs

# Authenticate
stripe login

# Start listening
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

4. Copy the webhook signing secret from output
5. Add to `.env.local`:

```
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Step 4: Configure Events

In Stripe Dashboard > Webhooks:

1. Click your endpoint
2. Click "Select events to send"
3. Select these events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Click "Select events"

### Step 5: Test Stripe Locally

```bash
# With stripe listen running in another terminal
npm run dev

# In another terminal, trigger a test event
stripe trigger payment_intent.succeeded

# Check your app logs - should see webhook received
```

## Local Development

### Step 1: Install Dependencies

```bash
npm install
# or
pnpm install
yarn install
```

### Step 2: Create `.env.local`

```bash
cp .env.example .env.local
```

Fill in all values (you now have them from Supabase and Stripe):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyxxxxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 3: Run Development Server

```bash
npm run dev
```

Output should show:
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Step 4: Open in Browser

Visit http://localhost:3000

You should see:
- ✅ Homepage loads
- ✅ Navigation works
- ✅ Language switcher works
- ✅ Links navigate correctly

### Step 5: Test Key Features

#### Test Authentication

1. Click "Join" in header
2. Go to `/en/auth/signup`
3. Fill in form and submit
4. Check Supabase > Authentication > Users - your user should appear
5. Try logging in at `/en/auth/login`

#### Test Database

1. Add an event in Supabase dashboard:

```sql
INSERT INTO public.events (
  title_en, title_zh, start_date, 
  is_free, status, created_by
) VALUES (
  'Test Event', '测试事件', now(),
  true, 'published', auth.uid()
);
```

2. Go to `/en/events`
3. New event should appear

#### Test Stripe Webhook

1. With `stripe listen` running
2. In terminal, run: `stripe trigger payment_intent.succeeded`
3. Check your app logs - should log webhook receipt

### Step 6: Common Issues & Fixes

**Error: "Cannot find module 'next'"**
- Run: `npm install`

**Error: "Supabase API key invalid"**
- Check `.env.local` has correct values
- Verify in Supabase Settings > API

**Port 3000 already in use**
- Run on different port: `npm run dev -- -p 3001`

**Tailwind CSS not loading**
- Clear cache: `rm -rf .next && npm run dev`

## Testing

### Manual Testing Checklist

- [ ] Home page loads without errors
- [ ] All public pages accessible (/about, /events, /news, etc.)
- [ ] Language switcher works (English ↔ Chinese)
- [ ] Header and footer render correctly
- [ ] Forms (contact, signup) work
- [ ] Authentication (signup/login) works
- [ ] Dashboard accessible when logged in
- [ ] Stripe payment dialog opens
- [ ] Responsive design works on mobile

### Automated Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint
```

### Test Accounts

**Stripe Test Cards:**
- Visa: `4242 4242 4242 4242`
- Amex: `3782 822463 10005`
- For any: CVC: `123`, Date: `12/25`

All test cards should return `succeeded` status.

## Deployment

See `DEPLOYMENT.md` for detailed deployment instructions.

### Quick Deploy to Vercel

```bash
# Push to GitHub
git add .
git commit -m "ready for deployment"
git push origin main

# Then:
# 1. Go to https://vercel.com/new
# 2. Connect GitHub repo
# 3. Add environment variables
# 4. Click Deploy
```

### Domain Setup

1. Register domain at registrar (Namecheap, GoDaddy, etc.)
2. Add DNS records provided by Vercel/Cloudflare
3. Wait for DNS propagation (up to 24 hours)

## Post-Launch

### Step 1: Email Configuration

Choose an email provider:

**Option A: Resend (Recommended)**
```bash
1. Sign up at https://resend.com
2. Get API key
3. Add to environment: RESEND_API_KEY=re_xxxxx
```

**Option B: SendGrid**
```bash
1. Sign up at https://sendgrid.com
2. Get API key
3. Configure in environment
```

### Step 2: Analytics

**Option A: Google Analytics**
1. Create property at https://analytics.google.com/
2. Get Measurement ID (G-XXXXX)
3. Add to `.env.local`: `NEXT_PUBLIC_GA_ID=G-XXXXX`

**Option B: Plausible (Privacy-friendly)**
1. Sign up at https://plausible.io
2. Add domain
3. Add script to layout

### Step 3: Newsletter Setup

1. Configure email provider
2. Set up Resend mailing list
3. Add newsletter signup form to homepage
4. Create welcome email template

### Step 4: Social Media Integration

1. Create social media accounts (Facebook, Instagram, WeChat)
2. Add links to footer
3. Create social media meta tags for sharing

### Step 5: Monitoring & Alerts

Set up alerts for:
- Failed Stripe charges
- Database errors
- Performance degradation
- Downtime

## Next Steps

1. ✅ Setup complete!
2. 📝 Customize site content (text, images, colors)
3. 👥 Add real user accounts
4. 📅 Create real events
5. 📰 Write blog posts
6. 🎨 Customize branding (logo, colors)
7. 🚀 Soft launch for testing
8. 📣 Public launch

## Support

If you get stuck:

1. **Check logs**: `npm run dev` output
2. **Check browser console**: F12 > Console tab
3. **Check Supabase logs**: Dashboard > Logs
4. **Check Stripe logs**: Dashboard > Logs
5. **Read documentation**:
   - Next.js: https://nextjs.org/docs
   - Supabase: https://supabase.com/docs
   - Stripe: https://stripe.com/docs
6. **Ask for help**:
   - Email: info@liberiachinese.com
   - GitHub Issues (if public)

## Maintenance

### Regular Tasks

- **Weekly**: Check error logs
- **Monthly**: Review analytics
- **Quarterly**: Update dependencies (`npm update`)
- **Yearly**: Security audit

### Backup Strategy

```bash
# Manual database backup
supabase db dump > backup-$(date +%Y%m%d).sql

# Supabase automatic backups: Daily + 14-day retention
```

---

**Congratulations!** Your Liberian Chinese Society website is now set up and ready to serve your community. 🎉

For questions or issues, contact: info@liberiachinese.com
