# Liberia Chinese Hub

生产可用的华人分类信息与社区门户，支持中文优先 + 英文可选（`/zh`、`/en`）。

## Tech Stack

- Next.js 15 App Router + TypeScript
- Tailwind CSS + shadcn/ui 组件风格
- next-intl 路由级 i18n
- Prisma ORM
- 本地开发数据库：SQLite
- 生产数据库：Vercel Postgres（推荐）或 Supabase Postgres
- Auth.js (NextAuth) 邮箱魔法链接 + 开发模式登录

## 本地开发（SQLite）

```bash
cp .env.example .env.local
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed
npm run dev
```

访问：`http://localhost:3000/zh`

## 切换到 Postgres（生产）

1. 在 Vercel 或 Supabase 创建 Postgres 数据库
2. 将 `DATABASE_URL` 替换为 Postgres 连接串
3. 运行迁移：

```bash
npx prisma migrate deploy
```

## 认证配置

- 邮件魔法链接（生产）：
  - 设置 `EMAIL_SERVER`、`EMAIL_FROM`
- 开发登录（本地）：
  - `DEV_LOGIN_ENABLED=true`
  - 可选 `DEV_LOGIN_EMAIL=demo@local.test` 限制邮箱

## 数据种子

```bash
npm run prisma:seed
```

会生成：
- 分类目录
- 示例帖子
- 示例 Banner
- 推广价格表

## 部署到 Vercel

1. 推送到 GitHub
2. 在 Vercel 创建新项目
3. 设置环境变量（`DATABASE_URL`、`NEXTAUTH_SECRET`、`NEXTAUTH_URL`）
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
