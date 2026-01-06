# Quick Reference Guide

## Common Commands

```bash
# Development
npm run dev                 # Start development server

# Building
npm run build               # Build for production
npm start                   # Start production server

# Code Quality
npm run type-check          # Check TypeScript
npm run lint                # Run ESLint
npm run format              # Format code with Prettier

# Database
supabase db push            # Apply migrations
supabase db reset           # Reset database (careful!)
npm run db:seed             # Seed with demo data

# Stripe Testing
stripe listen --forward-to localhost:3000/api/stripe/webhooks
stripe trigger payment_intent.succeeded
```

## File Locations

| Feature | Location |
|---------|----------|
| Public Pages | `/app/[locale]/{about,events,news,...}/page.tsx` |
| Components | `/components/{Header,Footer,ui/}` |
| Translations | `/content/{en,zh}.ts` |
| Database Types | `/lib/database.types.ts` |
| Database Migrations | `/supabase/migrations/*.sql` |
| Tailwind Config | `/tailwind.config.ts` |
| Next.js Config | `/next.config.js` |

## Environment Variables

```env
# Required - Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Required - Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET

# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Adding a New Page

1. Create directory: `/app/[locale]/new-page/`
2. Create file: `/app/[locale]/new-page/page.tsx`
3. Use template:

```typescript
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container, Section, SectionTitle } from '@/components/ui/Layout';

export default function NewPage() {
  return (
    <>
      <Header />
      <Section>
        <Container>
          <SectionTitle>Page Title</SectionTitle>
          {/* Content */}
        </Container>
      </Section>
      <Footer />
    </>
  );
}
```

## Adding a Translation

```typescript
// content/en.ts
export const en = {
  my_new_feature: {
    title: 'Title in English',
    description: 'Description...',
  },
};

// content/zh.ts
export const zh = {
  my_new_feature: {
    title: '英文标题',
    description: '描述...',
  },
};

// Usage in component
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations();
  return <h1>{t('my_new_feature.title')}</h1>;
}
```

## Database Tables Quick Reference

| Table | Purpose |
|-------|---------|
| `profiles` | User accounts & membership |
| `events` | Community events |
| `posts` | News & announcements |
| `rsvps` | Event attendance |
| `directory_listings` | Business directory |
| `gallery_items` | Photos & videos |
| `resources` | Community resources |
| `payments` | Transaction history |
| `sponsors` | Sponsorship records |
| `categories` | Content categories |

## Useful Links

- **Supabase**: https://app.supabase.com
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Vercel**: https://vercel.com/dashboard
- **Cloudflare**: https://dash.cloudflare.com
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

## Keyboard Shortcuts

| Action | Keys |
|--------|------|
| Format code | `Alt + Shift + F` |
| Quick fix | `Ctrl + .` |
| Go to file | `Ctrl + P` |
| Go to line | `Ctrl + G` |
| Find | `Ctrl + F` |
| Replace | `Ctrl + H` |

## Debugging

```typescript
// Console logging
console.log('Value:', value);
console.error('Error:', error);
console.warn('Warning:', warning);

// Next.js specific
console.log('Environment:', process.env.NODE_ENV);

// Browser DevTools
F12 // Open developer tools
Ctrl + Shift + I // Alternative
```

## Performance Tips

1. Use Next.js Image component for images
2. Lazy load components with `dynamic()`
3. Use `React.memo()` for expensive components
4. Enable production build: `npm run build && npm start`
5. Monitor with Vercel Analytics

## Security Checklist

- ✅ Never commit `.env.local`
- ✅ Use environment variables for secrets
- ✅ Enable HTTPS in production
- ✅ Validate all user inputs
- ✅ Use server actions for mutations
- ✅ Check RLS policies in Supabase
- ✅ Monitor logs for errors
- ✅ Regular backups

## Deployment Checklist

- ✅ All environment variables configured
- ✅ Database migrations applied
- ✅ Stripe webhooks configured
- ✅ Domain DNS records set
- ✅ Email provider configured
- ✅ SSL certificate verified
- ✅ Backups enabled
- ✅ Analytics configured
- ✅ Monitoring alerts set

## Support Resources

- **Documentation**: See README.md and SETUP.md
- **Deployment**: See DEPLOYMENT.md
- **GitHub Issues**: Create for bugs/features
- **Email**: info@liberiachinese.com
- **GitHub Discussions**: For questions

---

For more details, see:
- `README.md` - Project overview
- `SETUP.md` - Full setup instructions
- `DEPLOYMENT.md` - Deployment guide
