const DEFAULT_ZH_LIMIT = 34;
const DEFAULT_EN_LIMIT = 60;

export function cleanText(input: string) {
  return input.replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();
}

export function truncateForShare(input: string, locale: string, limit?: number) {
  const max = limit ?? (locale === 'zh' ? DEFAULT_ZH_LIMIT : DEFAULT_EN_LIMIT);
  const text = cleanText(input);
  if (text.length <= max) return text;
  return text.slice(0, max) + '…';
}

export function clampDescription(input: string, maxChars: number) {
  const text = cleanText(input);
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + '…';
}

export function isDataUrl(url: string | null | undefined) {
  return Boolean(url && url.startsWith('data:'));
}
