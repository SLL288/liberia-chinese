import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminPostEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations();
  const admin = await requireAdmin();

  if (!admin) {
    return (
      <div className="container-shell py-16">
        <h1 className="text-2xl font-semibold">{t('admin.title')}</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {locale === 'zh' ? '仅管理员可访问。' : 'Admins only.'}
        </p>
      </div>
    );
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!post) {
    notFound();
  }

  return (
    <div className="container-shell space-y-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-display">{t('common.edit')}</h1>
          <p className="text-sm text-muted-foreground">
            {locale === 'zh' ? '编辑商家信息' : 'Edit business post'}
          </p>
        </div>
        <Link href={`/${locale}/admin`} className="text-sm text-primary">
          {t('admin.back')}
        </Link>
      </div>

      <form
        className="grid gap-4 rounded-2xl border border-border bg-white p-6 md:grid-cols-2"
        action={`/api/admin/posts/${post.id}`}
        method="post"
      >
        <input
          name="title"
          defaultValue={post.title}
          placeholder={locale === 'zh' ? '标题' : 'Title'}
          className="h-10 rounded-md border px-3 text-sm md:col-span-2"
          required
        />
        <textarea
          name="description"
          defaultValue={post.description}
          placeholder={locale === 'zh' ? '描述' : 'Description'}
          className="min-h-[160px] rounded-md border px-3 py-2 text-sm md:col-span-2"
          required
        />
        <input
          name="price"
          type="number"
          defaultValue={post.price?.toString() ?? ''}
          placeholder={locale === 'zh' ? '价格' : 'Price'}
          className="h-10 rounded-md border px-3 text-sm"
        />
        <input
          name="currency"
          defaultValue={post.currency}
          placeholder={locale === 'zh' ? '币种' : 'Currency'}
          className="h-10 rounded-md border px-3 text-sm"
        />
        <input
          name="city"
          defaultValue={post.city ?? ''}
          placeholder={locale === 'zh' ? '城市' : 'City'}
          className="h-10 rounded-md border px-3 text-sm"
        />
        <input
          name="region"
          defaultValue={post.region ?? ''}
          placeholder={locale === 'zh' ? '区域' : 'Region'}
          className="h-10 rounded-md border px-3 text-sm"
        />
        <select
          name="status"
          defaultValue={post.status}
          className="h-10 rounded-md border px-3 text-sm"
        >
          <option value="PENDING">{locale === 'zh' ? '待审核' : 'Pending'}</option>
          <option value="ACTIVE">{locale === 'zh' ? '已发布' : 'Active'}</option>
          <option value="BANNED">{locale === 'zh' ? '已封禁' : 'Banned'}</option>
          <option value="EXPIRED">{locale === 'zh' ? '已过期' : 'Expired'}</option>
        </select>
        <div className="flex items-center gap-3 md:col-span-2">
          <button
            type="submit"
            className="h-10 rounded-md bg-primary px-4 text-sm text-white"
          >
            {t('common.save')}
          </button>
          <Link href={`/${locale}/admin`} className="text-sm text-muted-foreground">
            {locale === 'zh' ? '返回' : 'Back'}
          </Link>
        </div>
      </form>
    </div>
  );
}
