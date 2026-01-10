# Liberia Chinese Hub

生产可用的华人分类信息与社区门户，支持中文优先 + 英文可选（`/zh`、`/en`），认证使用 Supabase Auth（手机号 OTP 为主）。

## Tech Stack

- Next.js 15 App Router + TypeScript
- Tailwind CSS + shadcn/ui 组件风格
- next-intl 路由级 i18n
- Prisma ORM
- 本地开发数据库：SQLite
- 生产数据库：Vercel Postgres（推荐）或 Supabase Postgres
- Supabase Auth（短信 OTP + Google 可选）

## 本地开发（Postgres）

```bash
cp .env.example .env.local
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

访问：`http://localhost:3000/zh`

## 生产数据库（Supabase）

1. 在 Supabase 创建 Postgres 数据库
2. 设置 `DATABASE_URL`（pooler）和 `DIRECT_URL`（direct）
3. 运行迁移：

```bash
npx prisma migrate deploy
```

## 认证配置（Supabase Auth）

- 短信 OTP 默认使用手机号登录（+231）
- Google 登录需在 Supabase 启用 OAuth，并设置 `NEXT_PUBLIC_ENABLE_GOOGLE=true`
- 管理员：
  - 设置 `ADMIN_PHONE`，登录同手机号会自动赋予 `ADMIN`

## 政策资讯模块（News）

### 环境变量

- `OPENAI_API_KEY`：OpenAI Responses API 密钥（服务端）
- `CRON_SECRET`：Vercel Cron 访问密钥（Authorization Bearer）
- `GITHUB_CRON_SECRET`：GitHub Actions 调度密钥（Authorization Bearer）
- `SUPABASE_URL`：用于 Supabase Storage 公共 URL（可选）
- `SUPABASE_STORAGE_BUCKET`：图片桶名称（默认 `news-images`）
- `NEXT_PUBLIC_SITE_URL`：站点 URL（用于 sitemap）

### 迁移与种子

```bash
npx prisma migrate deploy
npm run prisma:seed
```

### Cron（Vercel）

```
POST /api/cron/news
Authorization: Bearer <CRON_SECRET>
```

### GitHub Actions（可选）

1. 启用 `.github/workflows/news-cron.yml`
2. 在仓库设置中添加 Secrets：
   - `GITHUB_CRON_SECRET`
3. 默认每 6 小时触发一次，调用 `/api/cron/news?source=github`

## 数据种子

```bash
npm run prisma:seed
```

会生成：
- 分类目录
- 示例帖子
- 示例 Banner
- 推广价格表
- 政策资讯来源

## 部署到 Vercel

1. 推送到 GitHub
2. 在 Vercel 创建新项目
3. 设置环境变量（`DATABASE_URL`、`DIRECT_URL`、`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY`）
4. 部署完成后访问 `/zh` 或 `/en`

## 目录结构（核心）

```
app/
  [locale]/
    page.tsx
    categories/
    posts/
    publish/
    search/
    dashboard/
    admin/
  api/
    auth/[...nextauth]
    posts
prisma/
  schema.prisma
  seed.ts
components/
  ui/
lib/
  prisma.ts
  data.ts
```

## 后续扩展

- Stripe 付款 + 推广套餐自动化
- Vercel Blob / S3 图片上传
- 更完整的审核流程与举报队列
