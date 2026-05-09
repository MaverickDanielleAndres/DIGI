/**
 * Digi — Database Types (Supabase auto-gen compatible)
 * Used as generic parameter for createClient<Database>
 */

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          account_type: string;
          plan: string;
          brand_name: string | null;
          brand_logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      events: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          description: string | null;
          event_type: string;
          cover_photo_url: string | null;
          cover_video_url: string | null;
          status: string;
          visibility: string;
          starts_at: string | null;
          ends_at: string | null;
          timezone: string;
          location: string | null;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
      };
      participants: {
        Row: {
          id: string;
          event_id: string;
          user_id: string | null;
          guest_nickname: string | null;
          role: string;
          shots_used: number;
          joined_at: string;
          last_active_at: string;
          is_banned: boolean;
          is_removed: boolean;
          device_id: string | null;
          push_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['participants']['Row'], 'id' | 'created_at' | 'updated_at' | 'joined_at' | 'last_active_at' | 'shots_used'>;
        Update: Partial<Database['public']['Tables']['participants']['Insert']>;
      };
      photos: {
        Row: {
          id: string;
          event_id: string;
          album_id: string | null;
          uploader_id: string | null;
          storage_path: string;
          thumbnail_path: string | null;
          hd_path: string | null;
          caption: string | null;
          is_revealed: boolean;
          is_approved: boolean;
          is_featured: boolean;
          is_hidden: boolean;
          shot_number: number | null;
          captured_at: string;
          upload_status: string;
          latitude: number | null;
          longitude: number | null;
          camera_style_used: string | null;
          ai_caption: string | null;
          ai_tags: unknown;
          dedup_hash: string | null;
          blurhash: string | null;
          width: number | null;
          height: number | null;
          file_size_bytes: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['photos']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['photos']['Insert']>;
      };
      albums: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          type: string;
          layout: string;
          created_by: string | null;
          is_public: boolean;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['albums']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['albums']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          event_id: string | null;
          type: string;
          title: string;
          body: string | null;
          data: unknown;
          is_read: boolean;
          sent_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at' | 'sent_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
    };
    Functions: {
      decrement_shot_and_return: {
        Args: { p_participant_id: string; p_event_id: string };
        Returns: { new_shots_used: number; shot_limit: number }[];
      };
    };
    Enums: Record<string, never>;
  };
}
