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

function parseIntAttr(value: string | null) {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function pickBestImage(root: Document | Element | null, baseUrl: string) {
  if (!root) return null;
  const images = Array.from(root.querySelectorAll('img'));
  let best: { url: string; score: number } | null = null;
  for (const img of images) {
    const src = img.getAttribute('src');
    if (!src || src.startsWith('data:')) continue;
    const resolved = resolveUrl(baseUrl, src);
    if (!resolved) continue;

    const width = parseIntAttr(img.getAttribute('width'));
    const height = parseIntAttr(img.getAttribute('height'));
    const area = width && height ? width * height : 0;
    const lower = resolved.toLowerCase();
    const penalty =
      lower.includes('logo') ||
      lower.includes('banner') ||
      lower.includes('header') ||
      lower.includes('icon')
        ? 0.2
        : 1;
    const score = (area || 1) * penalty;

    if (!best || score > best.score) {
      best = { url: resolved, score };
    }
  }

  return best?.url ?? null;
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

  const reader = new Readability(document);
  const result = reader.parse();
  const contentHtml = result?.content || '';
  const contentDom = contentHtml ? new JSDOM(contentHtml, { url }).window.document : null;
  const contentRoot =
    document.querySelector('.TRS_Editor, #TRS_Editor, .article, .content, .article-content, .content-detail') ||
    contentDom?.body ||
    document.body;
  const contentImage = pickBestImage(contentRoot, url);
  const ogImage = resolveUrl(url, getMetaContent(document, imageSelectors));
  const firstImage = pickBestImage(document, url);
  const rawText = result?.textContent || document.body?.textContent || '';
  const excerpt = normalizeText(rawText).slice(0, MAX_EXCERPT_CHARS);

  return {
    title,
    publishedAt: publishedDate,
    ogImageUrl: contentImage || ogImage || firstImage,
    excerpt,
  };
}
