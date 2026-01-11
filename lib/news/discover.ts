import { JSDOM } from 'jsdom';
import { parseRss } from '@/lib/news/rss';

const MAX_LINKS = 100;

const EXCLUDE_KEYWORDS = [
  '/webmail',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/taxonomy',
  '/category',
  '/tag',
  '/search',
  '/login',
  '/register',
  '/rss',
  '/sitemap',
];

const INCLUDE_PATTERNS = [
  /\/news\//i,
  /\/press/i,
  /\/press-release/i,
  /\/media/i,
  /\/release/i,
  /\/announcement/i,
  /\/publications?/i,
  /\/statement/i,
  /\/speeches?/i,
  /\/t\d{8}_\d+\.htm/i,
  /\/\d{4}\/\d{2}\//,
];

function looksLikeNews(url: string) {
  const lower = url.toLowerCase();
  if (EXCLUDE_KEYWORDS.some((keyword) => lower.includes(keyword))) {
    return false;
  }
  return INCLUDE_PATTERNS.some((pattern) => pattern.test(url));
}

function isSameHost(baseUrl: string, link: string) {
  try {
    const base = new URL(baseUrl);
    const target = new URL(link, baseUrl);
    return base.host === target.host;
  } catch (error) {
    return false;
  }
}

export async function discoverSourceLinks(website: string, rssUrl?: string | null) {
  if (rssUrl) {
    const rssResponse = await fetch(rssUrl, { headers: { 'User-Agent': 'liberia-chinese-news-bot/1.0' } });
    if (rssResponse.ok) {
      const xml = await rssResponse.text();
      const items = parseRss(xml);
      return items.map((item) => ({ url: item.link, publishedAt: item.publishedAt ?? null }));
    }
  }

  const response = await fetch(website, {
    headers: { 'User-Agent': 'liberia-chinese-news-bot/1.0' },
  });
  if (!response.ok) return [];

  const html = await response.text();
  const dom = new JSDOM(html, { url: website });
  const links = Array.from(dom.window.document.querySelectorAll('a'))
    .map((anchor) => anchor.getAttribute('href'))
    .filter(Boolean)
    .map((href) => {
      try {
        return new URL(String(href), website).toString();
      } catch (error) {
        return null;
      }
    })
    .filter((href): href is string => Boolean(href))
    .filter((href) => isSameHost(website, href))
    .filter((href) => !href.includes('#'));

  const unique = Array.from(new Set(links)).filter(looksLikeNews);
  return unique.slice(0, MAX_LINKS).map((url) => ({ url, publishedAt: null }));
}
