"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type AdminPost = {
  id: string;
  title: string;
  status: string;
  isFeatured?: boolean;
  isTop?: boolean;
  category: { nameZh: string; nameEn: string };
};

type AdminPostListProps = {
  posts: AdminPost[];
  locale: string;
};

export function AdminPostList({ posts, locale }: AdminPostListProps) {
  const t = useTranslations();
  const [rows, setRows] = useState(posts);
  const [busyId, setBusyId] = useState<string | null>(null);

  const labelStatus = (value: string) => {
    if (locale === 'zh') {
      if (value === 'PENDING') return '待审核';
      if (value === 'ACTIVE') return '已发布';
      if (value === 'BANNED') return '已封禁';
      if (value === 'EXPIRED') return '已过期';
      return value;
    }
    if (value === 'PENDING') return 'Pending';
    if (value === 'ACTIVE') return 'Active';
    if (value === 'BANNED') return 'Banned';
    if (value === 'EXPIRED') return 'Expired';
    return value;
  };

  const updateRow = (id: string, updater: (row: AdminPost) => AdminPost) => {
    setRows((prev) => prev.map((row) => (row.id === id ? updater(row) : row)));
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const postJson = async (payload: Record<string, any>) => {
    const response = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Request failed');
    }
  };

  const act = async (row: AdminPost, action: string, optimisticStatus?: string) => {
    setBusyId(row.id);
    if (optimisticStatus) {
      updateRow(row.id, (item) => ({ ...item, status: optimisticStatus }));
    }
    if (action === 'delete') {
      removeRow(row.id);
    }
    try {
      await postJson({ postId: row.id, action });
    } catch (error) {
      setRows(posts);
    } finally {
      setBusyId(null);
    }
  };

  const buttonClass = (active: boolean, variant: 'primary' | 'danger' | 'outline' = 'outline') => {
    if (variant === 'primary') {
      return `h-9 rounded-md px-3 text-xs ${active ? 'bg-primary text-white' : 'border border-border'}`;
    }
    if (variant === 'danger') {
      return `h-9 rounded-md px-3 text-xs ${active ? 'bg-destructive text-white' : 'border border-border text-destructive'}`;
    }
    return `h-9 rounded-md border px-3 text-xs ${active ? 'border-primary text-primary' : ''}`;
  };

  return (
    <div className="space-y-3">
      {rows.map((post) => (
        <div key={post.id} className="rounded-xl border border-border bg-white p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-xs text-muted-foreground">
                {labelStatus(post.status)} · {locale === 'zh' ? post.category.nameZh : post.category.nameEn}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className={buttonClass(post.status === 'ACTIVE', 'primary')}
                type="button"
                onClick={() => act(post, 'approve', 'ACTIVE')}
                disabled={busyId === post.id}
              >
                {locale === 'zh' ? '通过' : 'Approve'}
              </button>
              <button
                className={buttonClass(post.status === 'BANNED', 'danger')}
                type="button"
                onClick={() => act(post, 'ban', 'BANNED')}
                disabled={busyId === post.id}
              >
                {locale === 'zh' ? '封禁' : 'Ban'}
              </button>
              <button
                className={buttonClass(post.status !== 'ACTIVE')}
                type="button"
                onClick={() => act(post, post.status === 'ACTIVE' ? 'hide' : 'show', post.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE')}
                disabled={busyId === post.id}
              >
                {post.status === 'ACTIVE'
                  ? locale === 'zh'
                    ? '隐藏'
                    : 'Hide'
                  : locale === 'zh'
                  ? '显示'
                  : 'Show'}
              </button>
              <button
                className={buttonClass(Boolean(post.isFeatured))}
                type="button"
                onClick={() => act(post, 'feature')}
                disabled={busyId === post.id}
              >
                {locale === 'zh' ? '推荐' : 'Feature'}
              </button>
              <button
                className={buttonClass(Boolean(post.isTop))}
                type="button"
                onClick={() => act(post, 'top')}
                disabled={busyId === post.id}
              >
                {locale === 'zh' ? '置顶' : 'Top'}
              </button>
              <button
                className={buttonClass(false, 'danger')}
                type="button"
                onClick={() => act(post, 'delete')}
                disabled={busyId === post.id}
              >
                {t('common.delete')}
              </button>
              <Link
                href={`/${locale}/admin/posts/${post.id}`}
                className="h-9 rounded-md border px-3 text-xs"
                onClick={(event) => event.stopPropagation()}
              >
                {t('common.edit')}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
