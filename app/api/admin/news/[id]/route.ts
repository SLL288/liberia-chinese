import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

const payloadSchema = z.object({
  titleOverride: z.string().optional().nullable(),
  summaryOverrideZh: z.string().optional().nullable(),
  whyItMattersOverride: z.string().optional().nullable(),
  tagsOverride: z.array(z.string()).optional().nullable(),
  imageOverrideUrl: z.string().optional().nullable(),
  publishedAtOverride: z.string().datetime().optional().nullable(),
  isHidden: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  editorNote: z.string().optional().nullable(),
  useAi: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { id } = await params;
  const payload = parsed.data;

  const existing = await prisma.newsItem.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const updates: Record<string, any> = {
    editedByUserId: admin.id,
    editedAt: new Date(),
  };

  if (payload.useAi) {
    updates.titleOverride = null;
    updates.summaryOverrideZh = null;
    updates.whyItMattersOverride = null;
    updates.tagsOverride = [];
    updates.imageOverrideUrl = null;
    updates.publishedAtOverride = null;
  } else {
    if (payload.titleOverride !== undefined) updates.titleOverride = payload.titleOverride || null;
    if (payload.summaryOverrideZh !== undefined)
      updates.summaryOverrideZh = payload.summaryOverrideZh || null;
    if (payload.whyItMattersOverride !== undefined)
      updates.whyItMattersOverride = payload.whyItMattersOverride || null;
    if (payload.tagsOverride !== undefined)
      updates.tagsOverride = payload.tagsOverride?.filter(Boolean) || [];
    if (payload.imageOverrideUrl !== undefined)
      updates.imageOverrideUrl = payload.imageOverrideUrl || null;
    if (payload.publishedAtOverride !== undefined)
      updates.publishedAtOverride = payload.publishedAtOverride
        ? new Date(payload.publishedAtOverride)
        : null;
  }

  if (payload.isHidden !== undefined) updates.isHidden = payload.isHidden;
  if (payload.isFeatured !== undefined) updates.isFeatured = payload.isFeatured;
  if (payload.editorNote !== undefined) updates.editorNote = payload.editorNote || null;

  const updated = await prisma.newsItem.update({
    where: { id },
    data: updates,
  });

  await prisma.auditLog.create({
    data: {
      actorUserId: admin.id,
      action: 'NEWS_EDIT',
      entityType: 'news',
      entityId: id,
      detail: 'News item edited',
      metadata: { fields: Object.keys(updates) },
    },
  });

  if (payload.isHidden !== undefined && payload.isHidden !== existing.isHidden) {
    await prisma.auditLog.create({
      data: {
        actorUserId: admin.id,
        action: payload.isHidden ? 'NEWS_HIDE' : 'NEWS_UNHIDE',
        entityType: 'news',
        entityId: id,
        detail: payload.isHidden ? 'News hidden' : 'News unhidden',
      },
    });
  }

  if (payload.isFeatured !== undefined && payload.isFeatured !== existing.isFeatured) {
    await prisma.auditLog.create({
      data: {
        actorUserId: admin.id,
        action: payload.isFeatured ? 'NEWS_FEATURE' : 'NEWS_UNFEATURE',
        entityType: 'news',
        entityId: id,
        detail: payload.isFeatured ? 'News featured' : 'News unfeatured',
      },
    });
  }

  return NextResponse.json({ id: updated.id });
}
