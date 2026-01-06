# Deployment Guide for Liberian Chinese Society Website

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied to Supabase
- [ ] Stripe webhook configured
- [ ] Domain DNS records configured
- [ ] Email provider configured (Resend, SendGrid, etc.)
- [ ] Analytics integrated (Plausible or Google Analytics)
- [ ] SSL/TLS certificate verified
- [ ] Backup strategy defined

## Deployment to Vercel (Recommended)

Vercel is the easiest option for Next.js apps and offers great performance.

### Step 1: Prepare Your Code

```bash
# Ensure all code is committed to GitHub
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to https://vercel.com/new
2. Connect your GitHub account
3. Select the `liberia-chinese` repository
4. Click "Import"

### Step 3: Configure Environment Variables

In Vercel dashboard:

1. Go to **Settings > Environment Variables**
2. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyxxxxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_SITE_URL=https://liberiachinese.com
RESEND_API_KEY=re_xxxxx
NEXT_PUBLIC_GA_ID=G-xxxxx
```

### Step 4: Deploy

1. Click "Deploy"
2. Vercel will build and deploy automatically
3. Your site will be available at `https://liberian-chinese.vercel.app`

### Step 5: Configure Custom Domain

1. Go to **Settings > Domains**
2. Add `liberiachinese.com`
3. Vercel will provide DNS records
4. Update your domain registrar's DNS settings
5. Wait for DNS propagation (can take 24 hours)

### Step 6: Set Production Environment

1. In **Settings > Environment Variables**
2. Set environment to "Production" for all variables
3. Redeploy: `git push` triggers auto-deployment

## Deployment to Cloudflare Pages

Cloudflare Pages is another excellent option with edge caching.

### Step 1: Prepare Repository

Push code to GitHub as above.

### Step 2: Connect to Cloudflare

1. Go to https://dash.cloudflare.com/
2. Go to **Pages > Create a project**
3. Select your GitHub repository
4. Click "Connect GitHub"

### Step 3: Build Configuration

Set these build settings:

- **Framework preset**: Next.js
- **Build command**: `npm run build`
- **Build output directory**: `.next`

### Step 4: Environment Variables

In **Settings > Environment Variables**:

- Set **Scope** to "Production"
- Add all environment variables listed above

### Step 5: Deploy

1. Click "Save and Deploy"
2. Cloudflare will build and deploy
3. Check deployment status in **Deployments** tab

### Step 6: Custom Domain

1. Go to **Custom Domain**
2. Add your domain
3. Follow DNS setup instructions
4. Cloudflare will manage SSL automatically

## Stripe Webhook Configuration

### For Production

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add an endpoint"
3. Enter webhook URL: `https://liberiachinese.com/api/stripe/webhooks`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

5. Click "Add endpoint"
6. Copy the webhook signing secret
7. Add to environment variable: `STRIPE_WEBHOOK_SECRET=whsec_xxxxx`

## Email Configuration

### Using Resend (Recommended)

1. Go to https://resend.com
2. Create account and get API key
3. Add to environment: `RESEND_API_KEY=re_xxxxx`
4. Configure sender: `noreply@liberiachinese.com`

Example send email:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'noreply@liberiachinese.com',
  to: user.email,
  subject: 'Welcome to Liberian Chinese Society',
  html: '<h1>Welcome!</h1>',
});
```

## Analytics Setup

### Google Analytics

1. Create property at https://analytics.google.com/
2. Get your Measurement ID (G-XXXXX)
3. Add to environment: `NEXT_PUBLIC_GA_ID=G-XXXXX`
4. Add script to layout

### Plausible Analytics (Privacy-Friendly)

1. Sign up at https://plausible.io
2. Add domain
3. Get script URL
4. Add to layout

## Database Backup

### Automatic Backups

Supabase provides:
- Daily automated backups
- Point-in-time recovery (14 days)
- Manual backup creation

### Manual Backup

```bash
# Using Supabase CLI
supabase db dump > backup-$(date +%Y%m%d).sql

# Using pg_dump
pg_dump postgresql://user:password@db.supabase.co/postgres > backup.sql
```

## SSL/TLS Certificate

Both Vercel and Cloudflare provide:
- ✅ Free SSL certificates
- ✅ Auto-renewal
- ✅ HSTS headers

No additional configuration needed!

## Monitoring & Logging

### Vercel Analytics

1. Go to **Analytics** in Vercel dashboard
2. Monitor:
   - Page load times
   - Web Vitals
   - Error rates

### Supabase Monitoring

1. Go to Supabase dashboard > Logs
2. Monitor:
   - Database queries
   - Auth events
   - API requests

### Stripe Monitoring

1. Go to https://dashboard.stripe.com/logs
2. Check webhook delivery status
3. Review failed payments

## Performance Optimization

### Image Optimization

- Ensure all images are WebP/AVIF format
- Use Next.js Image component
- Upload to Supabase Storage with CDN

### Caching

```typescript
// Revalidate every hour
export const revalidateTime = 3600;

// Or use route caching
export const revalidate = 'force-dynamic';
```

### Database Indexing

Already configured in migrations. Key indexes:
- Events by `start_date`
- Posts by `published_at`
- Searches with trigram indexes

## Security Hardening

### Headers (Already Configured)

```javascript
// next.config.js
headers: [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
]
```

### Additional Measures

1. Enable DDoS protection (Cloudflare)
2. Configure WAF rules
3. Enable rate limiting
4. Set up monitoring alerts

## Post-Deployment Steps

1. **Verify Everything**
   - Test all pages
   - Test forms (contact, signup)
   - Test authentication
   - Test payments with Stripe test mode

2. **Monitor Logs**
   - Check for errors
   - Monitor performance
   - Review user feedback

3. **Update DNS Records**
   - Verify CNAME records
   - Verify MX records (if using custom email)
   - Test SSL certificate

4. **Configure Social Media**
   - Update website links
   - Add social media meta tags
   - Set up tracking pixels

5. **Marketing**
   - Announce launch
   - Update business info
   - Promote on social media

## Troubleshooting

### Site Won't Deploy

1. Check build logs in deployment dashboard
2. Verify all environment variables are set
3. Check for TypeScript errors: `npm run type-check`
4. Try clearing cache: Click "Redeploy"

### Database Connection Failed

1. Verify Supabase credentials
2. Check RLS policies aren't blocking
3. Test with Supabase query editor
4. Check firewall/IP whitelist

### Stripe Webhook Not Firing

1. Verify webhook URL is correct
2. Check webhook signing secret
3. Test with `stripe trigger payment_intent.succeeded`
4. Review webhook logs in Stripe dashboard

### Emails Not Sending

1. Verify email provider API key
2. Check email reputation
3. Review email logs
4. Test with simple email first

## Rollback Plan

If deployment fails:

```bash
# Vercel: Automatic rollback
# Just click "Rollback" in Deployments

# Cloudflare: Redeploy previous commit
git revert HEAD
git push origin main

# Database: Use Supabase point-in-time recovery
# Or restore from backup
```

## Support

For deployment issues:
- Check Vercel/Cloudflare documentation
- Review application logs
- Contact support with:
  - Deployment ID
  - Error messages
  - Steps to reproduce

---

**Last Updated**: January 2025
**Next Review**: Quarterly
