import { supabaseAdmin } from '@/lib/supabase';

async function seedDatabase() {
  console.log('🌱 Seeding database...');

  try {
    // Create sample categories
    const { data: categories } = await supabaseAdmin
      .from('categories')
      .insert([
        {
          name_en: 'Restaurants',
          name_zh: '餐厅',
          slug: 'restaurants',
          description_en: 'Food and dining establishments',
          description_zh: '餐饮机构',
        },
        {
          name_en: 'Services',
          name_zh: '服务',
          slug: 'services',
          description_en: 'Professional services',
          description_zh: '专业服务',
        },
        {
          name_en: 'Education',
          name_zh: '教育',
          slug: 'education',
          description_en: 'Educational institutions',
          description_zh: '教育机构',
        },
      ])
      .select();

    console.log('✅ Categories created:', categories?.length);

    // Create sample events
    const { data: events } = await supabaseAdmin
      .from('events')
      .insert([
        {
          title_en: 'Lunar New Year Celebration',
          title_zh: '春节庆祝',
          description_en: 'Join us for our annual Lunar New Year celebration with traditional performances and food',
          description_zh: '参加我们的年度春节庆祝活动，有传统表演和美食',
          start_date: new Date(2025, 1, 10).toISOString(),
          location: 'Community Center',
          location_zh: '社区中心',
          is_free: true,
          status: 'published',
          created_by: '00000000-0000-0000-0000-000000000000',
        },
        {
          title_en: 'Business Networking Breakfast',
          title_zh: '商业交流早餐',
          description_en: 'Monthly networking breakfast for business members',
          description_zh: '每月为商业成员举行的交流早餐',
          start_date: new Date(2025, 1, 15).toISOString(),
          location: 'Hotel Restaurant',
          location_zh: '酒店餐厅',
          is_free: false,
          ticket_price: 25,
          status: 'published',
          created_by: '00000000-0000-0000-0000-000000000000',
        },
      ])
      .select();

    console.log('✅ Events created:', events?.length);

    console.log('✨ Database seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
