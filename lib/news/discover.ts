import { JSDOM } from 'jsdom';
import { parseRss } from '@/lib/news/rss';

const MAX_LINKS = 20;

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

  const unique = Array.from(new Set(links));
  return unique.slice(0, MAX_LINKS).map((url) => ({ url, publishedAt: null }));
}
