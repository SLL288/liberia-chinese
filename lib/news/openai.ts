type SummaryResult = {
  summaryBullets: string[];
  summaryParagraph: string;
  whyItMatters: string;
  tags: string[];
  riskFlags: string[];
};

const RISK_FLAGS = [
  'policy',
  'travel',
  'tax',
  'trade',
  'embassy',
  'security',
] as const;

const SYSTEM_PROMPT = `你是严谨的中文政策资讯编辑。请基于原文内容输出 JSON。
要求：
- 不可编造，缺失信息请写“未在原文中明确说明”。
- 输出字段：summaryBullets (数组，5条要点), summaryParagraph (1段概述), whyItMatters (1-2句), tags (3-8个中文标签), riskFlags (从 policy/travel/tax/trade/embassy/security 中选择 0-3 个)。
- summaryBullets 与 summaryParagraph 为中文。`;

export async function summarizeArticleZh(text: string, title: string | null) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY missing');
  }

  const input = `标题：${title || '未在原文中明确说明'}\n\n正文：${text}`;

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      input: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: input },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const textOutput = data?.output?.[0]?.content?.[0]?.text ?? '{}';
  let parsed: SummaryResult;
  try {
    parsed = JSON.parse(textOutput);
  } catch (error) {
    throw new Error('OpenAI JSON parse failed');
  }

  const summaryBullets = Array.isArray(parsed.summaryBullets)
    ? parsed.summaryBullets.filter(Boolean).slice(0, 5)
    : [];
  const summaryParagraph = parsed.summaryParagraph || '未在原文中明确说明';
  const whyItMatters = parsed.whyItMatters || '未在原文中明确说明';
  const tags = Array.isArray(parsed.tags) ? parsed.tags.filter(Boolean).slice(0, 8) : [];
  const riskFlags = Array.isArray(parsed.riskFlags)
    ? parsed.riskFlags
        .filter((flag): flag is (typeof RISK_FLAGS)[number] =>
          RISK_FLAGS.includes(flag as (typeof RISK_FLAGS)[number])
        )
        .slice(0, 3)
    : [];

  return {
    summaryBullets,
    summaryParagraph,
    whyItMatters,
    tags,
    riskFlags,
  };
}
