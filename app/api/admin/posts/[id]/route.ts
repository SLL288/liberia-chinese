import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.string().optional(),
  currency: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'BANNED', 'EXPIRED']).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const formData = await request.formData();
  const payload = schema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    price: formData.get('price'),
    currency: formData.get('currency'),
    city: formData.get('city'),
    region: formData.get('region'),
    status: formData.get('status'),
  });

  if (!payload.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const data = payload.data;
  const priceValue = data.price ? Number(data.price) : null;

  await prisma.post.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      price: Number.isNaN(priceValue) ? null : priceValue,
      currency: data.currency || 'USD',
      city: data.city || null,
      region: data.region || null,
      status: data.status ?? undefined,
    },
  });

  const referer = request.headers.get('referer');
  const redirectUrl = referer ? new URL(referer) : new URL('/zh/admin', request.url);
  return NextResponse.redirect(redirectUrl, 303);
}
