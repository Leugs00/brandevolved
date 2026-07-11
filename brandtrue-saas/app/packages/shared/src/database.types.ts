// Generated from the live Supabase schema (project website-rebuilder).
// Regenerate with the Supabase MCP tool generate_typescript_types after migrations.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          id: number
          occurred_at: string
          path: string
          referrer: string | null
          site_id: string
          visitor_hash: string | null
        }
        Insert: {
          id?: never
          occurred_at?: string
          path: string
          referrer?: string | null
          site_id: string
          visitor_hash?: string | null
        }
        Update: {
          id?: never
          occurred_at?: string
          path?: string
          referrer?: string | null
          site_id?: string
          visitor_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      client_scopes: {
        Row: {
          client_id: string
          created_at: string
          id: string
          membership_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          membership_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          membership_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_scopes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_scopes_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          id: string
          name: string
          organization_id: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization_id: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_items: {
        Row: {
          collection_id: string
          created_at: string
          data: Json
          id: string
          organization_id: string
          position: number
          published: boolean
          site_id: string
          updated_at: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          data?: Json
          id?: string
          organization_id: string
          position?: number
          published?: boolean
          site_id: string
          updated_at?: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          data?: Json
          id?: string
          organization_id?: string
          position?: number
          published?: boolean
          site_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_items_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string
          id: string
          item_schema: Json
          kind: Database["public"]["Enums"]["collection_kind"]
          name: string
          organization_id: string
          site_id: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_schema?: Json
          kind?: Database["public"]["Enums"]["collection_kind"]
          name: string
          organization_id: string
          site_id: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_schema?: Json
          kind?: Database["public"]["Enums"]["collection_kind"]
          name?: string
          organization_id?: string
          site_id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collections_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          organization_id: string
          site_id: string
          source: string | null
          subscribed: boolean
          tags: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          organization_id: string
          site_id: string
          source?: string | null
          subscribed?: boolean
          tags?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          organization_id?: string
          site_id?: string
          source?: string | null
          subscribed?: boolean
          tags?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      content_blocks: {
        Row: {
          created_at: string
          data: Json
          duplicatable: boolean
          duplicated_from: string | null
          id: string
          kind: string
          locked: boolean
          organization_id: string
          page_id: string
          position: number
          site_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json
          duplicatable?: boolean
          duplicated_from?: string | null
          id?: string
          kind: string
          locked?: boolean
          organization_id: string
          page_id: string
          position?: number
          site_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json
          duplicatable?: boolean
          duplicated_from?: string | null
          id?: string
          kind?: string
          locked?: boolean
          organization_id?: string
          page_id?: string
          position?: number
          site_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_blocks_duplicated_from_fkey"
            columns: ["duplicated_from"]
            isOneToOne: false
            referencedRelation: "content_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_blocks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_blocks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_blocks_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      content_revisions: {
        Row: {
          created_at: string
          data: Json
          editor_user_id: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["revision_entity"]
          id: string
          label: string | null
          organization_id: string
          pinned: boolean
          site_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          editor_user_id?: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["revision_entity"]
          id?: string
          label?: string | null
          organization_id: string
          pinned?: boolean
          site_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          editor_user_id?: string | null
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["revision_entity"]
          id?: string
          label?: string | null
          organization_id?: string
          pinned?: boolean
          site_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_revisions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_revisions_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          company: string | null
          contact_id: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          organization_id: string
          phone: string | null
          site_id: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          contact_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          organization_id: string
          phone?: string | null
          site_id: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          contact_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          organization_id?: string
          phone?: string | null
          site_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      deploys: {
        Row: {
          created_at: string
          id: string
          note: string | null
          organization_id: string
          site_id: string
          status: Database["public"]["Enums"]["deploy_status"]
          triggered_by: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          organization_id: string
          site_id: string
          status?: Database["public"]["Enums"]["deploy_status"]
          triggered_by?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          organization_id?: string
          site_id?: string
          status?: Database["public"]["Enums"]["deploy_status"]
          triggered_by?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deploys_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deploys_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      email_log: {
        Row: {
          created_at: string
          detail: string | null
          id: string
          organization_id: string
          payload: Json
          recipients: string[]
          status: string
          subject: string
          template: string
        }
        Insert: {
          created_at?: string
          detail?: string | null
          id?: string
          organization_id: string
          payload?: Json
          recipients?: string[]
          status?: string
          subject: string
          template: string
        }
        Update: {
          created_at?: string
          detail?: string | null
          id?: string
          organization_id?: string
          payload?: Json
          recipients?: string[]
          status?: string
          subject?: string
          template?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      form_submissions: {
        Row: {
          created_at: string
          data: Json
          form_id: string
          id: string
          organization_id: string
          site_id: string
          source_path: string | null
          status: Database["public"]["Enums"]["submission_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json
          form_id: string
          id?: string
          organization_id: string
          site_id: string
          source_path?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json
          form_id?: string
          id?: string
          organization_id?: string
          site_id?: string
          source_path?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_submissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_submissions_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          created_at: string
          creates_contact: boolean
          creates_lead: boolean
          fields: Json
          honeypot_enabled: boolean
          id: string
          name: string
          notify_emails: string[]
          organization_id: string
          site_id: string
          slug: string
          success_message: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creates_contact?: boolean
          creates_lead?: boolean
          fields?: Json
          honeypot_enabled?: boolean
          id?: string
          name: string
          notify_emails?: string[]
          organization_id: string
          site_id: string
          slug: string
          success_message?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creates_contact?: boolean
          creates_lead?: boolean
          fields?: Json
          honeypot_enabled?: boolean
          id?: string
          name?: string
          notify_emails?: string[]
          organization_id?: string
          site_id?: string
          slug?: string
          success_message?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forms_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forms_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          form_submission_id: string | null
          id: string
          message: string | null
          name: string | null
          notes: string | null
          organization_id: string
          phone: string | null
          site_id: string
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          form_submission_id?: string | null
          id?: string
          message?: string | null
          name?: string | null
          notes?: string | null
          organization_id: string
          phone?: string | null
          site_id: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          form_submission_id?: string | null
          id?: string
          message?: string | null
          name?: string | null
          notes?: string | null
          organization_id?: string
          phone?: string | null
          site_id?: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_form_submission_id_fkey"
            columns: ["form_submission_id"]
            isOneToOne: false
            referencedRelation: "form_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          created_at: string
          id: string
          meta_description: string | null
          organization_id: string
          path: string
          site_id: string
          status: Database["public"]["Enums"]["page_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          meta_description?: string | null
          organization_id: string
          path: string
          site_id: string
          status?: Database["public"]["Enums"]["page_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          meta_description?: string | null
          organization_id?: string
          path?: string
          site_id?: string
          status?: Database["public"]["Enums"]["page_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          client_id: string
          cloudflare_project: string | null
          created_at: string
          id: string
          name: string
          organization_id: string
          primary_domain: string | null
          settings: Json
          slug: string
          status: Database["public"]["Enums"]["site_status"]
          updated_at: string
          wp_source_url: string | null
        }
        Insert: {
          client_id: string
          cloudflare_project?: string | null
          created_at?: string
          id?: string
          name: string
          organization_id: string
          primary_domain?: string | null
          settings?: Json
          slug: string
          status?: Database["public"]["Enums"]["site_status"]
          updated_at?: string
          wp_source_url?: string | null
        }
        Update: {
          client_id?: string
          cloudflare_project?: string | null
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          primary_domain?: string | null
          settings?: Json
          slug?: string
          status?: Database["public"]["Enums"]["site_status"]
          updated_at?: string
          wp_source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sites_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      analytics_daily: {
        Row: {
          day: string | null
          pageviews: number | null
          site_id: string | null
          unique_paths: number | null
          visitors: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      can_access_client: { Args: { p_client_id: string }; Returns: boolean }
      can_access_site: { Args: { p_site_id: string }; Returns: boolean }
      can_client_duplicate_block: {
        Args: { p_source_block_id: string; p_target_page_id: string }
        Returns: boolean
      }
      current_membership: {
        Args: { org: string }
        Returns: {
          created_at: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "memberships"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_org_role: {
        Args: { org: string; roles: Database["public"]["Enums"]["user_role"][] }
        Returns: boolean
      }
      is_org_member: { Args: { org: string }; Returns: boolean }
      site_is_public: { Args: { p_site_id: string }; Returns: boolean }
      storage_path_site_access: { Args: { p_name: string }; Returns: boolean }
    }
    Enums: {
      collection_kind:
        | "portfolio"
        | "product"
        | "service"
        | "testimonial"
        | "custom"
      deploy_status: "queued" | "building" | "live" | "failed"
      lead_status: "new" | "contacted" | "won" | "lost"
      page_status: "draft" | "published"
      revision_entity: "page" | "content_block"
      site_status: "draft" | "building" | "live" | "archived"
      submission_status: "new" | "seen" | "archived"
      user_role: "super_admin" | "agency_developer" | "designer" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      collection_kind: [
        "portfolio",
        "product",
        "service",
        "testimonial",
        "custom",
      ],
      deploy_status: ["queued", "building", "live", "failed"],
      lead_status: ["new", "contacted", "won", "lost"],
      page_status: ["draft", "published"],
      revision_entity: ["page", "content_block"],
      site_status: ["draft", "building", "live", "archived"],
      submission_status: ["new", "seen", "archived"],
      user_role: ["super_admin", "agency_developer", "designer", "client"],
    },
  },
} as const
