// ==============================================================================
// Muhammad Kairu Electronics — Supabase Database Types
// Generated TypeScript interfaces reflecting the canonical PostgreSQL schema
// ==============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type EmployeeRole =
  | 'owner'
  | 'product_manager'
  | 'inventory_manager'
  | 'customer_support'
  | 'marketing_manager'
  | 'viewer';

export type MembershipStatus = 'active' | 'suspended' | 'invited';

export type StockStatus = 'confirm_with_store' | 'in_stock' | 'out_of_stock';

export type EnquiryStatus = 'new' | 'contacted' | 'in_progress' | 'resolved' | 'closed';

export type StockMovementReason =
  | 'initial_stock'
  | 'restock'
  | 'correction'
  | 'damage'
  | 'sale_enquiry'
  | 'other';

export type AnalyticsEventType =
  | 'page_view'
  | 'product_view'
  | 'search_submission'
  | 'search_zero_results'
  | 'category_view'
  | 'enquiry_submission'
  | 'whatsapp_click'
  | 'phone_click';

export interface Database {
  public: {
    Tables: {
      store_settings: {
        Row: {
          id: string;
          business_name: string;
          tagline: string | null;
          address: string;
          phone: string;
          whatsapp: string;
          email: string;
          primary_color: string;
          secondary_color: string;
          background_color: string;
          accent_color: string | null;
          font_family: string | null;
          opening_hours: string | null;
          currency: string;
          contact_links: Json;
          features: Json;
          seo_title: string | null;
          seo_description: string | null;
          delivery_info: string | null;
          warranty_policy: string | null;
          about_text: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_name: string;
          tagline?: string | null;
          address: string;
          phone: string;
          whatsapp: string;
          email: string;
          primary_color?: string;
          secondary_color?: string;
          background_color?: string;
          accent_color?: string | null;
          font_family?: string | null;
          opening_hours?: string | null;
          currency?: string;
          contact_links?: Json;
          features?: Json;
          seo_title?: string | null;
          seo_description?: string | null;
          delivery_info?: string | null;
          warranty_policy?: string | null;
          about_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['store_settings']['Insert']>;
        Relationships: [];
      };

      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };

      employee_memberships: {
        Row: {
          id: string;
          user_id: string;
          role: EmployeeRole;
          status: MembershipStatus;
          invited_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: EmployeeRole;
          status?: MembershipStatus;
          invited_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['employee_memberships']['Insert']>;
        Relationships: [];
      };

      role_permissions: {
        Row: {
          id: string;
          role: EmployeeRole;
          permission: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          role: EmployeeRole;
          permission: string;
          description?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['role_permissions']['Insert']>;
        Relationships: [];
      };

      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
        Relationships: [];
      };

      brands: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['brands']['Insert']>;
        Relationships: [];
      };

      products: {
        Row: {
          id: string;
          category_id: string | null;
          brand_id: string | null;
          name: string;
          slug: string;
          summary: string;
          description: string | null;
          price_kobo: number | null;
          previous_price_kobo: number | null;
          currency: string;
          stock_status: StockStatus;
          warranty_details: string | null;
          is_published: boolean;
          is_archived: boolean;
          is_featured: boolean;
          specifications: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          brand_id?: string | null;
          name: string;
          slug: string;
          summary: string;
          description?: string | null;
          price_kobo?: number | null;
          previous_price_kobo?: number | null;
          currency?: string;
          stock_status?: StockStatus;
          warranty_details?: string | null;
          is_published?: boolean;
          is_archived?: boolean;
          is_featured?: boolean;
          specifications?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
        Relationships: [];
      };

      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          name: string;
          attributes: Json;
          price_kobo: number | null;
          stock_quantity: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku: string;
          name: string;
          attributes?: Json;
          price_kobo?: number | null;
          stock_quantity?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['product_variants']['Insert']>;
        Relationships: [];
      };

      product_images: {
        Row: {
          id: string;
          product_id: string;
          storage_path: string;
          alt_text: string | null;
          sort_order: number;
          is_primary: boolean;
          is_approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          storage_path: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          is_approved?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['product_images']['Insert']>;
        Relationships: [];
      };

      inventory_records: {
        Row: {
          id: string;
          product_id: string;
          quantity: number | null;
          low_stock_threshold: number;
          last_verified_at: string | null;
          verified_by: string | null;
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          quantity?: number | null;
          low_stock_threshold?: number;
          last_verified_at?: string | null;
          verified_by?: string | null;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['inventory_records']['Insert']>;
        Relationships: [];
      };

      stock_movements: {
        Row: {
          id: string;
          product_id: string;
          variant_id: string | null;
          previous_quantity: number;
          quantity_change: number;
          resulting_quantity: number;
          reason: StockMovementReason;
          notes: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          variant_id?: string | null;
          previous_quantity: number;
          quantity_change: number;
          resulting_quantity: number;
          reason: StockMovementReason;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['stock_movements']['Insert']>;
        Relationships: [];
      };

      customers: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
        Relationships: [];
      };

      enquiries: {
        Row: {
          id: string;
          reference: string;
          customer_id: string | null;
          name: string;
          phone: string;
          email: string | null;
          product_id: string | null;
          product_name: string | null;
          message: string;
          status: EnquiryStatus;
          assigned_to: string | null;
          source: string;
          created_at: string;
          updated_at: string;
          closed_at: string | null;
        };
        Insert: {
          id?: string;
          reference: string;
          customer_id?: string | null;
          name: string;
          phone: string;
          email?: string | null;
          product_id?: string | null;
          product_name?: string | null;
          message: string;
          status?: EnquiryStatus;
          assigned_to?: string | null;
          source?: string;
          created_at?: string;
          updated_at?: string;
          closed_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['enquiries']['Insert']>;
        Relationships: [];
      };

      enquiry_notes: {
        Row: {
          id: string;
          enquiry_id: string;
          author_id: string | null;
          note: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          enquiry_id: string;
          author_id?: string | null;
          note: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['enquiry_notes']['Insert']>;
        Relationships: [];
      };

      analytics_events: {
        Row: {
          id: string;
          event_type: AnalyticsEventType;
          entity_type: string | null;
          entity_id: string | null;
          metadata: Json;
          visitor_hash: string | null;
          session_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_type: AnalyticsEventType;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json;
          visitor_hash?: string | null;
          session_hash?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['analytics_events']['Insert']>;
        Relationships: [];
      };

      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          target_entity: string;
          target_id: string | null;
          details: Json;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          target_entity: string;
          target_id?: string | null;
          details?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>;
        Relationships: [];
      };

      store_announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          badge_text: string | null;
          action_url: string | null;
          is_active: boolean;
          starts_at: string | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          badge_text?: string | null;
          action_url?: string | null;
          is_active?: boolean;
          starts_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['store_announcements']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_owner: {
        Args: { lookup_uid: string };
        Returns: boolean;
      };
      is_active_employee: {
        Args: { lookup_uid: string };
        Returns: boolean;
      };
      has_employee_permission: {
        Args: { lookup_uid: string; required_permission: string };
        Returns: boolean;
      };
      bootstrap_first_owner: {
        Args: { target_email: string };
        Returns: Json;
      };
    };
  };
}
