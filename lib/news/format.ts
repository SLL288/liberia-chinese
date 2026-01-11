export type SummaryBlock = {
  bullets: string[];
  paragraph: string;
};

export function parseSummary(summary: string | null | undefined): SummaryBlock {
  if (!summary) {
    return { bullets: [], paragraph: '' };
  }

  try {
    const parsed = JSON.parse(summary);
    const bullets = Array.isArray(parsed.bullets)
      ? parsed.bullets
          .map((item: unknown) => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object' && 'bullet' in item) {
              const value = (item as { bullet?: unknown }).bullet;
              return typeof value === 'string' ? value : '';
            }
            return '';
          })
          .filter(Boolean)
      : [];
    const paragraph =
      typeof parsed.paragraph === 'string'
        ? parsed.paragraph
        : typeof parsed.paragraph === 'object' && parsed.paragraph !== null && 'text' in parsed.paragraph
        ? String((parsed.paragraph as { text?: unknown }).text ?? summary)
        : summary;
    return { bullets, paragraph };
  } catch (error) {
    return { bullets: [], paragraph: summary };
  }
}
