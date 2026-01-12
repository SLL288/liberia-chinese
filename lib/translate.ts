const CHINESE_REGEX = /[\u4E00-\u9FFF]/;

export function isChinese(text: string) {
  return CHINESE_REGEX.test(text);
}

export async function translateText(text: string, target: 'zh' | 'en') {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY missing');
  }

  const system =
    target === 'zh'
      ? 'Translate the user text into Simplified Chinese. Output only the translated text.'
      : 'Translate the user text into English. Output only the translated text.';

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: text },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content ?? '';
  return String(content).trim();
}
