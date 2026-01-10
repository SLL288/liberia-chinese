import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';

const payloadSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().optional(),
  currency: z.string().default('USD'),
  city: z.string().optional(),
  region: z.string().optional(),
  categoryId: z.string(),
  imageUrls: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const data = parsed.data;
  const post = await prisma.post.create({
    data: {
      userId: user.id,
      categoryId: data.categoryId,
      title: data.title,
      description: data.description,
      price: data.price ?? null,
      currency: data.currency,
      city: data.city,
      region: data.region,
      status: 'ACTIVE',
      images: data.imageUrls?.length
        ? {
            create: data.imageUrls.map((url, index) => ({
              url,
              sortOrder: index + 1,
            })),
          }
        : undefined,
    },
  });

  return NextResponse.json({ id: post.id });
}
