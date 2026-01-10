import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

const MAX_EXCERPT_CHARS = 6000;

const metaSelectors = [
  'meta[property="og:title"]',
  'meta[name="twitter:title"]',
  'meta[name="title"]',
];

const dateSelectors = [
  'meta[property="article:published_time"]',
  'meta[name="pubdate"]',
  'meta[name="publishdate"]',
  'meta[name="date"]',
  'meta[name="timestamp"]',
  'time[datetime]',
];

const imageSelectors = [
  'meta[property="og:image"]',
  'meta[name="twitter:image"]',
  'meta[property="og:image:url"]',
];

function getMetaContent(document: Document, selectors: string[]) {
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (!el) continue;
    const content = el.getAttribute('content') || el.getAttribute('datetime');
    if (content) return content.trim();
  }
  return null;
}

function normalizeText(input: string) {
  return input.replace(/\s+/g, ' ').trim();
}

function resolveUrl(base: string, url: string | null) {
  if (!url) return null;
  try {
    return new URL(url, base).toString();
  } catch (error) {
    return null;
  }
}

export type ExtractedArticle = {
  title: string | null;
  publishedAt: Date | null;
  ogImageUrl: string | null;
  excerpt: string;
};

export function extractArticle(html: string, url: string): ExtractedArticle {
  const dom = new JSDOM(html, { url });
  const document = dom.window.document;

  const title =
    getMetaContent(document, metaSelectors) ||
    document.querySelector('h1')?.textContent?.trim() ||
    document.title?.trim() ||
    null;

  const publishedRaw = getMetaContent(document, dateSelectors);
  const publishedAt = publishedRaw ? new Date(publishedRaw) : null;
  const publishedDate =
    publishedAt && !Number.isNaN(publishedAt.getTime()) ? publishedAt : null;

  const ogImage = resolveUrl(url, getMetaContent(document, imageSelectors));
  const firstImage = resolveUrl(url, document.querySelector('img')?.getAttribute('src') || null);

  const reader = new Readability(document);
  const result = reader.parse();
  const rawText = result?.textContent || document.body?.textContent || '';
  const excerpt = normalizeText(rawText).slice(0, MAX_EXCERPT_CHARS);

  return {
    title,
    publishedAt: publishedDate,
    ogImageUrl: ogImage || firstImage,
    excerpt,
  };
}
