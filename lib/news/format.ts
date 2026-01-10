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
    const bullets = Array.isArray(parsed.bullets) ? parsed.bullets.filter(Boolean) : [];
    const paragraph = typeof parsed.paragraph === 'string' ? parsed.paragraph : summary;
    return { bullets, paragraph };
  } catch (error) {
    return { bullets: [], paragraph: summary };
  }
}
