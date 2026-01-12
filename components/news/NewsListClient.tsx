"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { parseSummary } from '@/lib/news/format';
import { getPublicImageUrl } from '@/lib/news/storage';

type NewsItem = {
  id: string;
  url: string;
  title: string | null;
  titleOverride: string | null;
  summaryZh: string | null;
  summaryOverrideZh: string | null;
  imagePath: string | null;
  imageOverrideUrl: string | null;
  ogImageUrl: string | null;
  publishedAt: string | Date | null;
  publishedAtOverride: string | Date | null;
  createdAt: string | Date;
  source: { name: string };
  tags: string[];
  tagsOverride: string[] | null;
};

type ViewMode = "large" | "small" | "list";

type NewsListClientProps = {
  items: NewsItem[];
  locale: string;
};

const viewOptions: ViewMode[] = ["large", "small", "list"];

export function NewsListClient({ items, locale }: NewsListClientProps) {
  const t = useTranslations();
  const storageKey = `view:news`;
  const [view, setView] = useState<ViewMode>("list");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(storageKey) : null;
    if (stored && viewOptions.includes(stored as ViewMode)) {
      setView(stored as ViewMode);
    }
  }, [storageKey]);

  const updateView = (next: ViewMode) => {
    setView(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, next);
    }
  };

  const gridClass = useMemo(() => {
    if (view === "large") return "grid gap-6 md:grid-cols-2";
    if (view === "small") return "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";
    return "space-y-3";
  }, [view]);

  const labelFor = (mode: ViewMode) => {
    if (mode === "large") return t("common.viewLarge");
    if (mode === "small") return t("common.viewSmall");
    return t("common.viewList");
  };

  const formatDate = (value: string | Date | null) => {
    if (!value) return "—";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toISOString().slice(0, 10);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
        <span>{t("common.view")}</span>
        <div className="flex items-center gap-2">
          {viewOptions.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => updateView(mode)}
              className={`rounded-md border px-3 py-1 ${
                view === mode ? "border-primary text-primary" : "border-border"
              }`}
            >
              {labelFor(mode)}
            </button>
          ))}
        </div>
      </div>

      <div className={gridClass}>
        {items.map((item) => {
          const summary = parseSummary(item.summaryOverrideZh || item.summaryZh || "");
          const image =
            item.imageOverrideUrl ||
            getPublicImageUrl(item.imagePath) ||
            item.ogImageUrl ||
            "/images/banners/home-top.svg";
          const dateValue = item.publishedAtOverride || item.publishedAt || item.createdAt;
          const title = item.titleOverride || item.title || item.url;

          if (view === "list") {
            return (
              <Link
                key={item.id}
                href={`/${locale}/news/${item.id}`}
                className="flex gap-4 rounded-xl border border-border bg-white p-4 shadow-sm transition hover:border-primary/40"
              >
                <div className="h-24 w-32 overflow-hidden rounded-lg border border-border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={title} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="text-xs text-muted-foreground">
                    {item.source.name} · {formatDate(dateValue)}
                  </div>
                  <h3 className="text-base font-semibold text-display">{title}</h3>
                  <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                    {summary.bullets.slice(0, 2).map((bullet, index) => (
                      <li key={`${item.id}-list-${index}`}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.id}
              href={`/${locale}/news/${item.id}`}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:border-primary/40"
            >
              <div
                className={`overflow-hidden rounded-xl border border-border bg-muted ${
                  view === "large" ? "aspect-video" : "h-32"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={title} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  {item.source.name} · {formatDate(dateValue)}
                </div>
                <h3 className="text-base font-semibold text-display">{title}</h3>
                <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  {summary.bullets.slice(0, view === "large" ? 3 : 2).map((bullet, index) => (
                    <li key={`${item.id}-grid-${index}`}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
