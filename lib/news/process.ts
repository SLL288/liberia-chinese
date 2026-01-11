import { prisma } from '@/lib/prisma';
import { extractArticle } from '@/lib/news/extract';
import { hashContent } from '@/lib/news/hash';
import { summarizeArticleZh } from '@/lib/news/openai';
import { uploadNewsImage } from '@/lib/news/storage';

const MAX_INPUT_CHARS = 12000;

export async function processNewsItem(id: string) {
  const item = await prisma.newsItem.findUnique({
    where: { id },
    include: { source: true },
  });
  if (!item) return { status: 'missing' };

  await prisma.newsItem.update({
    where: { id },
    data: { status: 'PROCESSING', error: null },
  });

  try {
    const response = await fetch(item.url, {
      headers: {
        'User-Agent': 'liberia-chinese-news-bot/1.0',
      },
    });
    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status}`);
    }
    const html = await response.text();
    const extracted = extractArticle(html, item.url);
    const excerpt = extracted.excerpt || '';
    if (!excerpt || excerpt.length < 200) {
      await prisma.newsItem.update({
        where: { id },
        data: {
          title: extracted.title ?? item.title,
          publishedAt: extracted.publishedAt ?? item.publishedAt,
          fetchedAt: new Date(),
          ogImageUrl: extracted.ogImageUrl ?? item.ogImageUrl,
          rawExcerpt: excerpt,
          status: 'FAILED',
          error: 'Extracted content too short',
        },
      });
      return { status: 'failed' };
    }
    const contentHash = hashContent(excerpt);

    const shouldSummarize = !item.summaryZh || item.contentHash !== contentHash;
    let summaryZh = item.summaryZh;
    let whyItMatters = item.whyItMatters;
    let tags = item.tags;
    let riskFlags = item.riskFlags;

    let summarizeError: string | null = null;
    if (shouldSummarize) {
      try {
        const summary = await summarizeArticleZh(
          excerpt.slice(0, MAX_INPUT_CHARS),
          extracted.title
        );
        summaryZh = JSON.stringify({
          bullets: summary.summaryBullets,
          paragraph: summary.summaryParagraph,
        });
        whyItMatters = summary.whyItMatters;
        tags = summary.tags;
        riskFlags = summary.riskFlags;
      } catch (error: any) {
        summarizeError = error?.message || 'OpenAI summarization failed';
      }
    }

    let imagePath = item.imagePath;
    if (!imagePath && extracted.ogImageUrl) {
      const fileName = `${item.id}.jpg`;
      imagePath = await uploadNewsImage(extracted.ogImageUrl, fileName);
    }

    await prisma.newsItem.update({
      where: { id },
      data: {
        title: extracted.title ?? item.title,
        publishedAt: extracted.publishedAt ?? item.publishedAt,
        fetchedAt: new Date(),
        ogImageUrl: extracted.ogImageUrl ?? item.ogImageUrl,
        rawExcerpt: excerpt,
        contentHash,
        summaryZh,
        whyItMatters,
        tags,
        riskFlags,
        imagePath,
        status: summarizeError ? 'FAILED' : 'READY',
        error: summarizeError,
      },
    });

    return { status: summarizeError ? 'failed' : 'ready' };
  } catch (error: any) {
    await prisma.newsItem.update({
      where: { id },
      data: {
        status: 'FAILED',
        error: error?.message || 'Processing failed',
      },
    });
    return { status: 'failed' };
  }
}
