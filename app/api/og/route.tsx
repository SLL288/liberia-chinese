import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'home';
  const title = searchParams.get('title') || (type === 'news' ? '政策资讯' : '利比里亚华人分类信息');
  const subtitle = searchParams.get('subtitle') || 'Liberia Chinese Hub';
  const price = searchParams.get('price');
  const city = searchParams.get('city');

  const badge =
    type === 'news' ? '政策资讯' : type === 'post' ? '分类信息' : '社区门户';
  const metaLine = [price, city].filter(Boolean).join(' · ');
  const origin = new URL(request.url).origin;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: 'linear-gradient(135deg, #fff7ed 0%, #e0f2fe 100%)',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              backgroundColor: '#0f172a',
              color: 'white',
              fontSize: 24,
            }}
          >
            {badge}
          </div>
          <div style={{ fontSize: 20, color: '#475569' }}>{subtitle}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>
          {metaLine ? (
            <div style={{ fontSize: 28, color: '#334155' }}>{metaLine}</div>
          ) : null}
        </div>
        <div style={{ fontSize: 22, color: '#64748b' }}>{origin}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
