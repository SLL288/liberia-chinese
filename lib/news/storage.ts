import { createClient } from '@supabase/supabase-js';

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export async function uploadNewsImage(url: string, fileName: string) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'news-images';

  if (!supabaseUrl || !serviceKey) {
    return null;
  }

  const response = await fetch(url, { headers: { 'User-Agent': 'liberia-chinese-news-bot/1.0' } });
  if (!response.ok) return null;

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) return null;

  const arrayBuffer = await response.arrayBuffer();
  if (arrayBuffer.byteLength > MAX_IMAGE_BYTES) return null;

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const path = `news/${fileName}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, arrayBuffer, { contentType, upsert: true });

  if (error) return null;

  return path;
}

export function getPublicImageUrl(path: string | null) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'news-images';
  if (!supabaseUrl || !path) return null;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}
