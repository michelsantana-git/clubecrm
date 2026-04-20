// Tipos gerados a partir do schema do Supabase
// Em produção: gere automaticamente com: npx supabase gen types typescript --project-id=SEU_ID > types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          plan: "free" | "pro" | "enterprise";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      projects: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string | null;
          color: string;
          icon: string;
          funnel_stages: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["projects"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      leads: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          email: string;
          phone: string | null;
          company: string | null;
          tags: string[];
          score: number;
          stage: string;
          source: string | null;
          notes: string | null;
          newsletter_subscribed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["leads"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["leads"]["Insert"]>;
      };
      forms: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          fields: string[];
          tag: string;
          submissions: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["forms"]["Row"], "id" | "submissions" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["forms"]["Insert"]>;
      };
      newsletters: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          subject: string;
          content: string | null;
          status: "draft" | "scheduled" | "sent";
          sent_count: number;
          opened_count: number;
          clicked_count: number;
          scheduled_at: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["newsletters"]["Row"], "id" | "sent_count" | "opened_count" | "clicked_count" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["newsletters"]["Insert"]>;
      };
      landing_pages: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          slug: string;
          template: string;
          blocks: Json;
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["landing_pages"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["landing_pages"]["Insert"]>;
      };
      password_reset_tokens: {
        Row: {
          id: string;
          user_id: string;
          token_hash: string;
          expires_at: string;
          used: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["password_reset_tokens"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["password_reset_tokens"]["Insert"]>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      plan_type: "free" | "pro" | "enterprise";
      newsletter_status: "draft" | "scheduled" | "sent";
    };
  };
}

// ── Tipos de conveniência ─────────────────────────────────────────────────────
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Lead    = Database["public"]["Tables"]["leads"]["Row"];
export type Form    = Database["public"]["Tables"]["forms"]["Row"];
export type Newsletter = Database["public"]["Tables"]["newsletters"]["Row"];
export type LandingPage = Database["public"]["Tables"]["landing_pages"]["Row"];
