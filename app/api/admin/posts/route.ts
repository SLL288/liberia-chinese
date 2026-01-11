import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

const schema = z.object({
  postId: z.string(),
  action: z.enum(['approve', 'ban', 'delete', 'feature', 'top', 'hide', 'show']),
});

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contentType = request.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await request.json() : Object.fromEntries(await request.formData());
  const payload = schema.safeParse({
    postId: body.postId ?? null,
    action: body.action ?? null,
  });

  if (!payload.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { postId, action } = payload.data;
  const now = new Date();
  let updateData: Record<string, any> = {};

  if (action === 'approve') {
    updateData = { status: 'ACTIVE' };
  }
  if (action === 'ban') {
    updateData = { status: 'BANNED' };
  }
  if (action === 'hide') {
    updateData = { status: 'BANNED' };
  }
  if (action === 'show') {
    updateData = { status: 'ACTIVE' };
  }
  if (action === 'feature') {
    updateData = { isFeatured: true, featuredUntil: new Date(now.getTime() + 7 * 86400000) };
  }
  if (action === 'top') {
    updateData = { isTop: true, topUntil: new Date(now.getTime() + 7 * 86400000) };
  }

  if (action === 'delete') {
    await prisma.post.delete({ where: { id: postId } });
  } else {
    await prisma.post.update({ where: { id: postId }, data: updateData });
  }

  await prisma.auditLog.create({
    data: {
      actorUserId: admin.id,
      action,
      entityType: 'post',
      entityId: postId,
      detail: `Admin ${admin.id} performed ${action}`,
    },
  });

  if (!isJson) {
    const referer = request.headers.get('referer');
    const redirectUrl = referer ? new URL(referer) : new URL('/zh/admin', request.url);
    return NextResponse.redirect(redirectUrl, 303);
  }

  return NextResponse.json({ postId, action });
}
