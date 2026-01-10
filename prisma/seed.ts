import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const categories = [
  { slug: 'housing', nameZh: '房屋租售', nameEn: 'Housing Rentals', sortOrder: 1 },
  { slug: 'buy-sell', nameZh: '买卖二手', nameEn: 'Buy & Sell', sortOrder: 2 },
  { slug: 'jobs', nameZh: '招聘求职', nameEn: 'Jobs', sortOrder: 3 },
  { slug: 'services', nameZh: '生活服务', nameEn: 'Services', sortOrder: 4 },
  { slug: 'business', nameZh: '商家广告', nameEn: 'Business Ads', sortOrder: 5 },
  { slug: 'cars', nameZh: '汽车交易', nameEn: 'Cars', sortOrder: 6 },
  { slug: 'food', nameZh: '美食外卖', nameEn: 'Food', sortOrder: 7 },
  { slug: 'travel', nameZh: '旅游出行', nameEn: 'Travel', sortOrder: 8 },
  { slug: 'events', nameZh: '活动聚会', nameEn: 'Events', sortOrder: 9 },
  { slug: 'education', nameZh: '教育培训', nameEn: 'Education', sortOrder: 10 },
  { slug: 'legal', nameZh: '签证法律', nameEn: 'Visa & Legal', sortOrder: 11 },
  { slug: 'community', nameZh: '同城社区', nameEn: 'Community', sortOrder: 12 },
  { slug: 'lost-found', nameZh: '失物招领', nameEn: 'Lost & Found', sortOrder: 13 },
];

const newsSources = [
  {
    name: 'Ministry of Foreign Affairs (Liberia)',
    lang: 'en',
    website: 'https://mofa.gov.lr',
  },
  {
    name: 'Liberia Immigration Service',
    lang: 'en',
    website: 'https://lis.gov.lr',
  },
  {
    name: 'Executive Mansion Press Releases',
    lang: 'en',
    website: 'https://emansion.gov.lr',
  },
  {
    name: 'Ministry of Finance & Development Planning',
    lang: 'en',
    website: 'https://mfdp.gov.lr',
  },
  {
    name: 'Ministry of Commerce & Industry',
    lang: 'en',
    website: 'https://moci.gov.lr',
  },
  {
    name: 'Liberia Revenue Authority',
    lang: 'en',
    website: 'https://revenue.lra.gov.lr',
  },
  {
    name: 'Central Bank of Liberia',
    lang: 'en',
    website: 'https://cbl.org.lr',
  },
  {
    name: 'Chinese Embassy in Liberia',
    lang: 'zh',
    website: 'https://lr.china-embassy.gov.cn',
  },
  {
    name: 'MOFCOM Economic & Commercial Office (Liberia)',
    lang: 'zh',
    website: 'https://lr.mofcom.gov.cn',
  },
];

async function main() {
  const adminId = randomUUID();
  const admin = await prisma.user.create({
    data: {
      id: adminId,
      email: 'admin@local.test',
      name: 'Admin',
      role: 'ADMIN',
      wechat: 'admin_wechat',
      phone: '+231000000000',
    },
  });

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        nameZh: category.nameZh,
        nameEn: category.nameEn,
        sortOrder: category.sortOrder,
        isActive: true,
      },
      create: category,
    });
  }

  await prisma.newsSource.createMany({
    data: newsSources,
    skipDuplicates: true,
  });

  const housing = await prisma.category.findUnique({ where: { slug: 'housing' } });
  const jobs = await prisma.category.findUnique({ where: { slug: 'jobs' } });

  if (housing && jobs) {
    const post1 = await prisma.post.create({
      data: {
        userId: admin.id,
        categoryId: housing.id,
        title: '市中心两房出租，交通便利',
        description: '全新家具，安全小区，适合家庭或同事合租。欢迎微信联系。',
        price: 800,
        currency: 'USD',
        city: 'Monrovia',
        region: 'Sinkor',
        status: 'ACTIVE',
        isFeatured: true,
        featuredUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        images: {
          create: [
            { url: '/images/sample/house-1.svg', sortOrder: 1 },
            { url: '/images/sample/house-2.svg', sortOrder: 2 },
          ],
        },
      },
    });

    await prisma.post.create({
      data: {
        userId: admin.id,
        categoryId: jobs.id,
        title: '招聘中文/英文双语客服',
        description: '提供良好福利，需有电脑基础及沟通能力。',
        price: 0,
        currency: 'USD',
        city: 'Monrovia',
        region: 'Congo Town',
        status: 'ACTIVE',
        isUrgent: true,
        topUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.banner.createMany({
      data: [
        {
          position: 'HOME_TOP',
          imageUrl: '/images/banners/home-top.svg',
          linkUrl: 'https://example.com',
          isActive: true,
          weight: 10,
        },
        {
          position: 'HOME_SIDE',
          imageUrl: '/images/banners/home-side.svg',
          linkUrl: 'https://example.com',
          isActive: true,
          weight: 8,
        },
      ],
    });

    await prisma.pricingPlan.createMany({
      data: [
        { product: 'TOP', price: 15, currency: 'USD', durationDays: 7 },
        { product: 'FEATURED', price: 10, currency: 'USD', durationDays: 7 },
        { product: 'URGENT', price: 5, currency: 'USD', durationDays: 3 },
      ],
    });

    await prisma.auditLog.create({
      data: {
        actorUserId: admin.id,
        action: 'seed',
        entityType: 'post',
        entityId: post1.id,
        detail: 'Initial seed data created.',
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
