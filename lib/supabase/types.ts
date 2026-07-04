export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type TableDefinition<
  Row,
  RequiredInsertKeys extends keyof Row,
  Relationships extends Relationship[] = [],
> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, RequiredInsertKeys>;
  Update: Partial<Row>;
  Relationships: Relationships;
};

export type ArtistRow = {
  id: string;
  name: string;
  role: string | null;
  specialty: string | null;
  quote: string | null;
  image_url: string | null;
  instagram_handle: string | null;
  instagram_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AwardRow = {
  id: string;
  title: string;
  year: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type BookingRow = {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  guests: number;
  booking_date: string;
  booking_time: string;
  status: "pending" | "confirmed" | "rejected" | "cancelled";
  notes: string | null;
  admin_message: string | null;
  created_at: string;
  updated_at: string;
};

export type CocktailCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CocktailRow = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  ingredients: string | null;
  price: number | null;
  image_url: string | null;
  is_signature: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type EventRow = {
  id: string;
  title: string;
  slug: string | null;
  frequency: string | null;
  description: string | null;
  image_url: string | null;
  event_date: string | null;
  event_time: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type GalleryImageRow = {
  id: string;
  title: string | null;
  category: string | null;
  image_url: string;
  alt: string | null;
  aspect_ratio: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type MenuCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type MenuItemRow = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  ingredients: string | null;
  price: number | null;
  image_url: string | null;
  alcohol_level: string | null;
  tags: string[];
  is_featured: boolean;
  is_available: boolean;
  display_order: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type NewsletterSubscriberRow = {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ReservationRow = {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  notes: string | null;
  status: "pending" | "confirmed" | "rejected" | "cancelled";
  created_at: string;
  updated_at: string;
};

export type SiteSettingRow = {
  id: string;
  key: string;
  value: string | null;
  site_name: string | null;
  tagline: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  address: string | null;
  city: string | null;
  opening_hours: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  logo_url: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_description: string | null;
  hero_background_url: string | null;
  created_at: string;
  updated_at: string;
};

export type TestimonialRow = {
  id: string;
  name: string;
  text: string;
  rating: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      artists: TableDefinition<ArtistRow, "name">;
      awards: TableDefinition<AwardRow, "title">;
      bookings: TableDefinition<
        BookingRow,
        | "customer_name"
        | "phone"
        | "guests"
        | "booking_date"
        | "booking_time"
      >;
      cocktail_categories: TableDefinition<
        CocktailCategoryRow,
        "name" | "slug"
      >;
      cocktails: TableDefinition<
        CocktailRow,
        "name" | "slug",
        [
          {
            foreignKeyName: "cocktails_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "cocktail_categories";
            referencedColumns: ["id"];
          },
        ]
      >;
      events: TableDefinition<EventRow, "title">;
      gallery_images: TableDefinition<GalleryImageRow, "image_url">;
      menu_categories: TableDefinition<
        MenuCategoryRow,
        "name" | "slug"
      >;
      menu_items: TableDefinition<
        MenuItemRow,
        "name" | "slug" | "category",
        [
          {
            foreignKeyName: "menu_items_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "menu_categories";
            referencedColumns: ["id"];
          },
        ]
      >;
      newsletter_subscribers: TableDefinition<
        NewsletterSubscriberRow,
        "email"
      >;
      reservations: TableDefinition<
        ReservationRow,
        | "customer_name"
        | "phone"
        | "reservation_date"
        | "reservation_time"
        | "guests"
      >;
      site_settings: TableDefinition<SiteSettingRow, "key">;
      testimonials: TableDefinition<
        TestimonialRow,
        "name" | "text"
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<
  TableName extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][TableName]["Row"];

export type TablesInsert<
  TableName extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][TableName]["Insert"];

export type TablesUpdate<
  TableName extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][TableName]["Update"];
