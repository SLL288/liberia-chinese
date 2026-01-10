import { XMLParser } from 'fast-xml-parser';

export type RssItem = {
  link: string;
  publishedAt?: Date | null;
};

export function parseRss(xml: string): RssItem[] {
  const parser = new XMLParser({ ignoreAttributes: false });
  const data = parser.parse(xml);
  const channel = data?.rss?.channel || data?.feed;
  const rawItems = channel?.item || channel?.entry || [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];

  return items
    .map((item: any) => {
      const link =
        item.link?.['@_href'] ||
        item.link?.href ||
        item.link ||
        item.guid ||
        item.id;
      const dateStr = item.pubDate || item.published || item.updated;
      const publishedAt = dateStr ? new Date(dateStr) : null;
      return link
        ? {
            link: String(link),
            publishedAt: publishedAt && !Number.isNaN(publishedAt.getTime()) ? publishedAt : null,
          }
        : null;
    })
    .filter(Boolean) as RssItem[];
}
