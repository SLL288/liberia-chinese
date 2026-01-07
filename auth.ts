import NextAuth from 'next-auth';
import Email from 'next-auth/providers/email';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const devLoginEnabled =
  process.env.DEV_LOGIN_ENABLED === 'true' || !process.env.EMAIL_SERVER;

const providers: any[] = [];

if (process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
  providers.push(
    Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    })
  );
}

if (devLoginEnabled) {
  providers.push(
    Credentials({
      name: 'Dev Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        name: { label: 'Name', type: 'text', placeholder: 'Demo User' },
      },
      async authorize(credentials) {
        const schema = z.object({
          email: z.string().email(),
          name: z.string().min(1).optional(),
        });
        const parsed = schema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const email = parsed.data.email;
        const allowOnly = process.env.DEV_LOGIN_EMAIL;
        if (allowOnly && allowOnly.length > 0 && allowOnly !== email) {
          return null;
        }

        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            name: parsed.data.name || 'Dev User',
          },
        });

        return {
          id: user.id,
          name: user.name ?? undefined,
          email: user.email ?? undefined,
          role: user.role,
        };
      },
    })
  );
}

if (providers.length === 0) {
  providers.push(
    Credentials({
      name: 'Login Disabled',
      credentials: {},
      async authorize() {
        return null;
      },
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  session: { strategy: 'database' },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
});
