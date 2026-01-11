"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

type NewsListItem = {
  id: string;
  status: 'QUEUED' | 'PROCESSING' | 'READY' | 'FAILED';
  isHidden: boolean;
  isFeatured: boolean;
  title: string | null;
  titleOverride: string | null;
  url: string;
  source: { name: string };
};

type AdminNewsListProps = {
  items: NewsListItem[];
  locale: string;
};

export function AdminNewsList({ items, locale }: AdminNewsListProps) {
  const t = useTranslations();
  const [rows, setRows] = useState(items);
  const [busyId, setBusyId] = useState<string | null>(null);

  const statusLabels =
    locale === 'zh'
      ? { QUEUED: '排队', PROCESSING: '处理中', READY: '已发布', FAILED: '失败' }
      : { QUEUED: 'Queued', PROCESSING: 'Processing', READY: 'Ready', FAILED: 'Failed' };

  const updateRow = (id: string, updater: (row: NewsListItem) => NewsListItem) => {
    setRows((prev) => prev.map((row) => (row.id === id ? updater(row) : row)));
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const postJson = async (url: string, payload: Record<string, any>) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Request failed');
    }
  };

  const toggleHidden = async (row: NewsListItem) => {
    const nextHidden = !row.isHidden;
    setBusyId(row.id);
    updateRow(row.id, (item) => ({ ...item, isHidden: nextHidden }));
    try {
      await postJson('/api/admin/news/visibility', {
        id: row.id,
        isHidden: String(nextHidden),
      });
    } catch (error) {
      updateRow(row.id, (item) => ({ ...item, isHidden: row.isHidden }));
    } finally {
      setBusyId(null);
    }
  };

  const togglePublish = async (row: NewsListItem) => {
    const nextStatus = row.status === 'READY' ? 'FAILED' : 'READY';
    setBusyId(row.id);
    updateRow(row.id, (item) => ({ ...item, status: nextStatus }));
    try {
      await postJson('/api/admin/news/visibility', {
        id: row.id,
        isHidden: 'false',
        status: nextStatus,
      });
    } catch (error) {
      updateRow(row.id, (item) => ({ ...item, status: row.status }));
    } finally {
      setBusyId(null);
    }
  };

  const deleteItem = async (row: NewsListItem) => {
    setBusyId(row.id);
    removeRow(row.id);
    try {
      await postJson('/api/admin/news/delete', { id: row.id });
    } catch (error) {
      setRows((prev) => [row, ...prev]);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      {rows.map((item) => (
        <div key={item.id} className="rounded-2xl border border-border bg-white p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">{item.titleOverride || item.title || item.url}</h3>
              <p className="text-xs text-muted-foreground">
                {item.source.name} · {statusLabels[item.status]}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="text-sm text-primary"
                type="button"
                onClick={() => toggleHidden(item)}
                disabled={busyId === item.id}
              >
                {item.isHidden ? t('news.showAction') : t('news.hideAction')}
              </button>
              <button
                className="text-sm text-primary"
                type="button"
                onClick={() => togglePublish(item)}
                disabled={busyId === item.id}
              >
                {item.status === 'READY' ? t('news.unpublishAction') : t('news.publishAction')}
              </button>
              <button
                className="text-sm text-primary"
                type="button"
                onClick={() => deleteItem(item)}
                disabled={busyId === item.id}
              >
                {t('common.delete')}
              </button>
              <Link href={`/${locale}/admin/news/${item.id}`} className="text-sm text-primary">
                {t('news.adminEdit')}
              </Link>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {item.isFeatured ? <span>{t('news.featured')}</span> : null}
            {item.isHidden ? <span>{t('news.hidden')}</span> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
