"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';

type PostItem = {
  id: string;
  title: string;
  price: any;
  currency: string;
  city: string | null;
  region: string | null;
  createdAt: string | Date;
  views: number;
  isTop: boolean;
  isFeatured: boolean;
  isUrgent: boolean;
  images?: { url: string }[];
  category?: { nameZh: string; nameEn: string; slug: string };
};

type ViewMode = "large" | "small" | "list";

type PostListClientProps = {
  posts: PostItem[];
  locale: string;
};

const viewOptions: ViewMode[] = ["large", "small", "list"];

export function PostListClient({ posts, locale }: PostListClientProps) {
  const t = useTranslations();
  const storageKey = `view:posts`;
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
    if (view === "large") return "grid gap-6 md:grid-cols-3";
    if (view === "small") return "grid gap-4 sm:grid-cols-2 lg:grid-cols-4";
    return "space-y-3";
  }, [view]);

  const labelFor = (mode: ViewMode) => {
    if (mode === "large") return t("common.viewLarge");
    if (mode === "small") return t("common.viewSmall");
    return t("common.viewList");
  };

  const formatPrice = (post: PostItem) => {
    if (typeof post.price === "number") {
      return formatCurrency(post.price, post.currency, locale === "zh" ? "zh-CN" : "en-US");
    }
    if (post.price) {
      return formatCurrency(Number(post.price), post.currency, locale === "zh" ? "zh-CN" : "en-US");
    }
    return locale === "zh" ? "面议" : "Negotiable";
  };

  const formatCreated = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);
    return formatDate(date, locale === "zh" ? "zh-CN" : "en-US");
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
        {posts.map((post) => {
          const image = post.images?.[0]?.url ?? "/images/sample/house-1.svg";
          const priceLabel = formatPrice(post);
          const location = `${post.city ?? "—"}${post.region ? ` · ${post.region}` : ""}`;

          if (view === "list") {
            return (
              <Link
                key={post.id}
                href={`/${locale}/posts/${post.id}`}
                className="flex gap-4 rounded-xl border border-border bg-white p-4 shadow-sm transition hover:border-primary/40"
              >
                <div className="h-24 w-32 overflow-hidden rounded-lg border border-border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={post.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {post.isTop && <Badge>{locale === "zh" ? "置顶" : "Top"}</Badge>}
                    {post.isFeatured && (
                      <Badge variant="featured">{locale === "zh" ? "推荐" : "Featured"}</Badge>
                    )}
                    {post.isUrgent && <Badge variant="urgent">{locale === "zh" ? "加急" : "Urgent"}</Badge>}
                  </div>
                  <h3 className="text-base font-semibold text-display">{post.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>{priceLabel}</span>
                    <span>{formatCreated(post.createdAt)}</span>
                    <span>{location}</span>
                    <span>👁️ {post.views}</span>
                  </div>
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={post.id}
              href={`/${locale}/posts/${post.id}`}
              className="overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:shadow-md"
            >
              <div className={`bg-muted ${view === "large" ? "h-40" : "h-28"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={post.title} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-2 p-4">
                <div className="flex flex-wrap gap-2">
                  {post.isTop && <Badge>{locale === "zh" ? "置顶" : "Top"}</Badge>}
                  {post.isFeatured && (
                    <Badge variant="featured">{locale === "zh" ? "推荐" : "Featured"}</Badge>
                  )}
                  {post.isUrgent && <Badge variant="urgent">{locale === "zh" ? "加急" : "Urgent"}</Badge>}
                </div>
                <h3 className="line-clamp-2 text-base font-semibold text-display">{post.title}</h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{priceLabel}</span>
                  <span>{formatCreated(post.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{location}</span>
                  <span>👁️ {post.views}</span>
                </div>
                {post.category ? (
                  <div className="text-xs text-muted-foreground">
                    {locale === "zh" ? post.category.nameZh : post.category.nameEn}
                  </div>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
