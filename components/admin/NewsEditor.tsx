"use client";

import { useMemo, useState } from 'react';
import { parseSummary } from '@/lib/news/format';
import { getPublicImageUrl } from '@/lib/news/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type NewsEditorProps = {
  locale: string;
  item: {
    id: string;
    url: string;
    title: string | null;
    publishedAt: string | null;
    rawExcerpt: string | null;
    summaryZh: string | null;
    whyItMatters: string | null;
    tags: string[];
    ogImageUrl: string | null;
    imagePath: string | null;
    titleOverride: string | null;
    publishedAtOverride: string | null;
    summaryOverrideZh: string | null;
    whyItMattersOverride: string | null;
    tagsOverride: string[];
    imageOverrideUrl: string | null;
    isHidden: boolean;
    isFeatured: boolean;
    editorNote: string | null;
  };
};

export function NewsEditor({ locale, item }: NewsEditorProps) {
  const [formState, setFormState] = useState({
    titleOverride: item.titleOverride || '',
    summaryOverrideZh: item.summaryOverrideZh || '',
    whyItMattersOverride: item.whyItMattersOverride || '',
    tagsOverride: item.tagsOverride?.join(', ') || '',
    imageOverrideUrl: item.imageOverrideUrl || '',
    publishedAtOverride: item.publishedAtOverride || '',
    isHidden: item.isHidden,
    isFeatured: item.isFeatured,
    editorNote: item.editorNote || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const preview = useMemo(() => {
    const summary = parseSummary(formState.summaryOverrideZh || item.summaryZh || '');
    const image =
      formState.imageOverrideUrl ||
      getPublicImageUrl(item.imagePath) ||
      item.ogImageUrl ||
      '/images/banners/home-top.svg';
    const tags = formState.tagsOverride
      ? formState.tagsOverride.split(',').map((tag) => tag.trim()).filter(Boolean)
      : item.tags;
    return { summary, image, tags };
  }, [formState, item]);

  const save = async (useAi = false) => {
    setLoading(true);
    setMessage(null);
    const payload = useAi
      ? { useAi: true }
      : {
          titleOverride: formState.titleOverride,
          summaryOverrideZh: formState.summaryOverrideZh,
          whyItMattersOverride: formState.whyItMattersOverride,
          tagsOverride: formState.tagsOverride
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
          imageOverrideUrl: formState.imageOverrideUrl,
          publishedAtOverride: formState.publishedAtOverride || null,
          isHidden: formState.isHidden,
          isFeatured: formState.isFeatured,
          editorNote: formState.editorNote,
        };

    const response = await fetch(`/api/admin/news/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setMessage(locale === 'zh' ? '已保存' : 'Saved');
    } else {
      const text = await response.text();
      setMessage(text || (locale === 'zh' ? '保存失败' : 'Save failed'));
    }
    setLoading(false);
  };

  const reprocess = async () => {
    setLoading(true);
    setMessage(null);
    const response = await fetch(`/api/admin/news/reprocess/${item.id}`, { method: 'POST' });
    if (response.ok) {
      setMessage(locale === 'zh' ? '已重新处理' : 'Reprocessed');
    } else {
      setMessage(locale === 'zh' ? '处理失败' : 'Reprocess failed');
    }
    setLoading(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6 rounded-2xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold">{locale === 'zh' ? '原文提取' : 'Extracted'}</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div>{item.title || item.url}</div>
          <div>{item.publishedAt || '-'}</div>
        </div>
        <Textarea value={item.rawExcerpt || ''} readOnly className="min-h-[240px]" />
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">{locale === 'zh' ? 'AI 摘要' : 'AI summary'}</h3>
          <Textarea value={item.summaryZh || ''} readOnly className="min-h-[160px]" />
        </div>
      </div>

      <div className="space-y-6 rounded-2xl border border-border bg-white p-6">
        <h2 className="text-lg font-semibold">{locale === 'zh' ? '人工修订' : 'Overrides'}</h2>
        <Input
          placeholder={locale === 'zh' ? '标题' : 'Title'}
          value={formState.titleOverride}
          onChange={(event) => setFormState({ ...formState, titleOverride: event.target.value })}
        />
        <Input
          placeholder={locale === 'zh' ? '发布时间 (YYYY-MM-DD)' : 'Published date (YYYY-MM-DD)'}
          value={formState.publishedAtOverride}
          onChange={(event) => setFormState({ ...formState, publishedAtOverride: event.target.value })}
        />
        <Input
          placeholder={locale === 'zh' ? '图片 URL' : 'Image URL'}
          value={formState.imageOverrideUrl}
          onChange={(event) => setFormState({ ...formState, imageOverrideUrl: event.target.value })}
        />
        <Input
          placeholder={locale === 'zh' ? '标签 (逗号分隔)' : 'Tags (comma separated)'}
          value={formState.tagsOverride}
          onChange={(event) => setFormState({ ...formState, tagsOverride: event.target.value })}
        />
        <Textarea
          placeholder={locale === 'zh' ? '摘要（JSON 或段落）' : 'Summary (JSON or paragraph)'}
          value={formState.summaryOverrideZh}
          onChange={(event) => setFormState({ ...formState, summaryOverrideZh: event.target.value })}
          className="min-h-[140px]"
        />
        <Textarea
          placeholder={locale === 'zh' ? '与社区关系' : 'Why it matters'}
          value={formState.whyItMattersOverride}
          onChange={(event) => setFormState({ ...formState, whyItMattersOverride: event.target.value })}
        />
        <Textarea
          placeholder={locale === 'zh' ? '编辑备注' : 'Editor note'}
          value={formState.editorNote}
          onChange={(event) => setFormState({ ...formState, editorNote: event.target.value })}
        />
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formState.isHidden}
              onChange={(event) => setFormState({ ...formState, isHidden: event.target.checked })}
            />
            {locale === 'zh' ? '隐藏' : 'Hidden'}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formState.isFeatured}
              onChange={(event) => setFormState({ ...formState, isFeatured: event.target.checked })}
            />
            {locale === 'zh' ? '推荐' : 'Featured'}
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => save(false)} disabled={loading}>
            {locale === 'zh' ? '保存修改' : 'Save changes'}
          </Button>
          <Button variant="outline" onClick={() => save(true)} disabled={loading}>
            {locale === 'zh' ? '使用 AI 版本' : 'Use AI version'}
          </Button>
          <Button variant="ghost" onClick={reprocess} disabled={loading}>
            {locale === 'zh' ? '重新摘要' : 'Reprocess'}
          </Button>
        </div>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 lg:col-span-2">
        <h2 className="text-lg font-semibold">{locale === 'zh' ? '预览' : 'Preview'}</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-[240px_1fr]">
          <div className="overflow-hidden rounded-xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview.image} alt="preview" className="h-40 w-full object-cover" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{formState.titleOverride || item.title || item.url}</h3>
            <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
              {preview.summary.bullets.map((bullet, index) => (
                <li key={`preview-bullet-${index}`}>{bullet}</li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">{preview.summary.paragraph}</p>
            <div className="flex flex-wrap gap-2">
              {preview.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-2 py-1 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
