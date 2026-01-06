// Database type definitions (generated from Supabase)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          wechat_id: string | null;
          avatar_url: string | null;
          bio: string | null;
          role: 'admin' | 'moderator' | 'member' | 'guest';
          membership_tier: 'free' | 'standard' | 'premium' | 'patron';
          membership_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      events: {
        Row: {
          id: string;
          title_en: string;
          title_zh: string;
          description_en: string | null;
          description_zh: string | null;
          image_url: string | null;
          start_date: string;
          end_date: string | null;
          location: string | null;
          location_zh: string | null;
          max_attendees: number | null;
          event_type: string | null;
          is_free: boolean;
          ticket_price: number | null;
          status: 'draft' | 'published' | 'cancelled' | 'completed';
          created_by: string;
          created_at: string;
          updated_at: string;
        };
      };
      posts: {
        Row: {
          id: string;
          title_en: string;
          title_zh: string;
          slug: string;
          excerpt_en: string | null;
          excerpt_zh: string | null;
          content_en: string;
          content_zh: string;
          image_url: string | null;
          category_id: string | null;
          author_id: string;
          featured: boolean;
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      directory_listings: {
        Row: {
          id: string;
          user_id: string;
          business_name_en: string;
          business_name_zh: string;
          category_id: string | null;
          description_en: string | null;
          description_zh: string | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          wechat: string | null;
          address: string | null;
          image_url: string | null;
          featured: boolean;
          status: 'pending' | 'approved' | 'rejected' | 'expired';
          featured_until: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
