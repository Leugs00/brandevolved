// Generated from the live Supabase schema (project website-rebuilder).
// Regenerate with the Supabase MCP generate_typescript_types after migrations.
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
          starred: boolean
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
          starred?: boolean
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
          starred?: boolean
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
          organization_id: string | null
          site_id: string | null
          source_path: string | null
          status: Database["public"]["Enums"]["submission_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json
          form_id: string
          id?: string
          organization_id?: string | null
          site_id?: string | null
          source_path?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json
          form_id?: string
          id?: string
          organization_id?: string | null
          site_id?: string | null
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
      industries: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          organization_id: string
          site_id: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization_id: string
          site_id: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          site_id?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "industries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "industries_site_id_fkey"
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
      project_results: {
        Row: {
          comparison_period: string | null
          created_at: string
          description: string | null
          display_value: string | null
          featured: boolean
          id: string
          metric_name: string | null
          metric_unit: string | null
          metric_value: number | null
          organization_id: string
          project_id: string
          result_kind: Database["public"]["Enums"]["result_kind"]
          result_type_id: string | null
          site_id: string
          sort_order: number
          supporting_note: string | null
          time_period: string | null
          title: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          comparison_period?: string | null
          created_at?: string
          description?: string | null
          display_value?: string | null
          featured?: boolean
          id?: string
          metric_name?: string | null
          metric_unit?: string | null
          metric_value?: number | null
          organization_id: string
          project_id: string
          result_kind: Database["public"]["Enums"]["result_kind"]
          result_type_id?: string | null
          site_id: string
          sort_order?: number
          supporting_note?: string | null
          time_period?: string | null
          title: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          comparison_period?: string | null
          created_at?: string
          description?: string | null
          display_value?: string | null
          featured?: boolean
          id?: string
          metric_name?: string | null
          metric_unit?: string | null
          metric_value?: number | null
          organization_id?: string
          project_id?: string
          result_kind?: Database["public"]["Enums"]["result_kind"]
          result_type_id?: string | null
          site_id?: string
          sort_order?: number
          supporting_note?: string | null
          time_period?: string | null
          title?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "project_results_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_results_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_results_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_results_result_type_id_fkey"
            columns: ["result_type_id"]
            isOneToOne: false
            referencedRelation: "result_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_results_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      project_services: {
        Row: {
          created_at: string
          organization_id: string
          project_id: string
          service_id: string
          site_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          organization_id: string
          project_id: string
          service_id: string
          site_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          organization_id?: string
          project_id?: string
          service_id?: string
          site_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_services_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_services_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_services_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "public_project_services"
            referencedColumns: ["service_id"]
          },
          {
            foreignKeyName: "project_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "public_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_services_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      project_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          organization_id: string
          site_id: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization_id: string
          site_id: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          site_id?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_types_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_types_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          after_images: Json
          approach: string | null
          before_images: Json
          business_stage: string | null
          case_study_enabled: boolean
          challenge: string | null
          created_at: string
          featured: boolean
          gallery: Json
          hero_image_url: string | null
          id: string
          industry_id: string | null
          launch_date: string | null
          organization_id: string
          outcome_summary: string | null
          project_summary: string | null
          project_type_id: string | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          show_in_portfolio: boolean
          showcase_client_id: string
          site_id: string
          slug: string
          solution: string | null
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          after_images?: Json
          approach?: string | null
          before_images?: Json
          business_stage?: string | null
          case_study_enabled?: boolean
          challenge?: string | null
          created_at?: string
          featured?: boolean
          gallery?: Json
          hero_image_url?: string | null
          id?: string
          industry_id?: string | null
          launch_date?: string | null
          organization_id: string
          outcome_summary?: string | null
          project_summary?: string | null
          project_type_id?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          show_in_portfolio?: boolean
          showcase_client_id: string
          site_id: string
          slug: string
          solution?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          after_images?: Json
          approach?: string | null
          before_images?: Json
          business_stage?: string | null
          case_study_enabled?: boolean
          challenge?: string | null
          created_at?: string
          featured?: boolean
          gallery?: Json
          hero_image_url?: string | null
          id?: string
          industry_id?: string | null
          launch_date?: string | null
          organization_id?: string
          outcome_summary?: string | null
          project_summary?: string | null
          project_type_id?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          show_in_portfolio?: boolean
          showcase_client_id?: string
          site_id?: string
          slug?: string
          solution?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_project_type_id_fkey"
            columns: ["project_type_id"]
            isOneToOne: false
            referencedRelation: "project_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_showcase_client_id_fkey"
            columns: ["showcase_client_id"]
            isOneToOne: false
            referencedRelation: "showcase_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      result_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          organization_id: string
          site_id: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization_id: string
          site_id: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          site_id?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "result_types_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "result_types_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          organization_id: string
          site_id: string
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization_id: string
          site_id: string
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          site_id?: string
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_categories_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          audiences: Json
          business_stages: Json
          created_at: string
          cta_text: string | null
          cta_url: string | null
          currency: string | null
          deliverables: Json
          delivery_formats: Json
          delivery_time: string | null
          featured: boolean
          featured_image_url: string | null
          full_description: string | null
          icon_url: string | null
          id: string
          ideal_for: string | null
          name: string
          organization_id: string
          parent_service_id: string | null
          price_label: string | null
          process: Json
          seo_description: string | null
          seo_title: string | null
          service_category_id: string | null
          short_description: string | null
          site_id: string
          slug: string
          sort_order: number
          starting_price: number | null
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          audiences?: Json
          business_stages?: Json
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          currency?: string | null
          deliverables?: Json
          delivery_formats?: Json
          delivery_time?: string | null
          featured?: boolean
          featured_image_url?: string | null
          full_description?: string | null
          icon_url?: string | null
          id?: string
          ideal_for?: string | null
          name: string
          organization_id: string
          parent_service_id?: string | null
          price_label?: string | null
          process?: Json
          seo_description?: string | null
          seo_title?: string | null
          service_category_id?: string | null
          short_description?: string | null
          site_id: string
          slug: string
          sort_order?: number
          starting_price?: number | null
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          audiences?: Json
          business_stages?: Json
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          currency?: string | null
          deliverables?: Json
          delivery_formats?: Json
          delivery_time?: string | null
          featured?: boolean
          featured_image_url?: string | null
          full_description?: string | null
          icon_url?: string | null
          id?: string
          ideal_for?: string | null
          name?: string
          organization_id?: string
          parent_service_id?: string | null
          price_label?: string | null
          process?: Json
          seo_description?: string | null
          seo_title?: string | null
          service_category_id?: string | null
          short_description?: string | null
          site_id?: string
          slug?: string
          sort_order?: number
          starting_price?: number | null
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_parent_service_id_fkey"
            columns: ["parent_service_id"]
            isOneToOne: false
            referencedRelation: "public_project_services"
            referencedColumns: ["service_id"]
          },
          {
            foreignKeyName: "services_parent_service_id_fkey"
            columns: ["parent_service_id"]
            isOneToOne: false
            referencedRelation: "public_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_parent_service_id_fkey"
            columns: ["parent_service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_service_category_id_fkey"
            columns: ["service_category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      showcase_clients: {
        Row: {
          business_name: string
          created_at: string
          featured: boolean
          id: string
          industry_id: string | null
          location: string | null
          logo_url: string | null
          name: string | null
          organization_id: string
          permission_to_publish: boolean
          photo_url: string | null
          public_bio: string | null
          role: string | null
          site_id: string
          slug: string | null
          status: Database["public"]["Enums"]["showcase_client_status"]
          updated_at: string
          website_url: string | null
        }
        Insert: {
          business_name: string
          created_at?: string
          featured?: boolean
          id?: string
          industry_id?: string | null
          location?: string | null
          logo_url?: string | null
          name?: string | null
          organization_id: string
          permission_to_publish?: boolean
          photo_url?: string | null
          public_bio?: string | null
          role?: string | null
          site_id: string
          slug?: string | null
          status?: Database["public"]["Enums"]["showcase_client_status"]
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          business_name?: string
          created_at?: string
          featured?: boolean
          id?: string
          industry_id?: string | null
          location?: string | null
          logo_url?: string | null
          name?: string | null
          organization_id?: string
          permission_to_publish?: boolean
          photo_url?: string | null
          public_bio?: string | null
          role?: string | null
          site_id?: string
          slug?: string | null
          status?: Database["public"]["Enums"]["showcase_client_status"]
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "showcase_clients_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showcase_clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showcase_clients_site_id_fkey"
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
      testimonial_services: {
        Row: {
          created_at: string
          organization_id: string
          service_id: string
          site_id: string
          sort_order: number
          testimonial_id: string
        }
        Insert: {
          created_at?: string
          organization_id: string
          service_id: string
          site_id: string
          sort_order?: number
          testimonial_id: string
        }
        Update: {
          created_at?: string
          organization_id?: string
          service_id?: string
          site_id?: string
          sort_order?: number
          testimonial_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonial_services_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonial_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "public_project_services"
            referencedColumns: ["service_id"]
          },
          {
            foreignKeyName: "testimonial_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "public_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonial_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonial_services_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonial_services_testimonial_id_fkey"
            columns: ["testimonial_id"]
            isOneToOne: false
            referencedRelation: "public_testimonials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonial_services_testimonial_id_fkey"
            columns: ["testimonial_id"]
            isOneToOne: false
            referencedRelation: "testimonials"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonial_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          organization_id: string
          site_id: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization_id: string
          site_id: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          site_id?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonial_types_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonial_types_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          audio_url: string | null
          business_logo_override_url: string | null
          business_name_override: string | null
          client_name_override: string | null
          client_photo_override_url: string | null
          client_role_override: string | null
          created_at: string
          featured: boolean
          id: string
          organization_id: string
          permission_confirmed: boolean
          project_id: string | null
          published_at: string | null
          quote: string
          rating: number | null
          short_quote: string | null
          showcase_client_id: string
          site_id: string
          sort_order: number
          source_name: string | null
          source_url: string | null
          status: Database["public"]["Enums"]["content_status"]
          testimonial_date: string | null
          testimonial_type_id: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          business_logo_override_url?: string | null
          business_name_override?: string | null
          client_name_override?: string | null
          client_photo_override_url?: string | null
          client_role_override?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          organization_id: string
          permission_confirmed?: boolean
          project_id?: string | null
          published_at?: string | null
          quote: string
          rating?: number | null
          short_quote?: string | null
          showcase_client_id: string
          site_id: string
          sort_order?: number
          source_name?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          testimonial_date?: string | null
          testimonial_type_id?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          business_logo_override_url?: string | null
          business_name_override?: string | null
          client_name_override?: string | null
          client_photo_override_url?: string | null
          client_role_override?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          organization_id?: string
          permission_confirmed?: boolean
          project_id?: string | null
          published_at?: string | null
          quote?: string
          rating?: number | null
          short_quote?: string | null
          showcase_client_id?: string
          site_id?: string
          sort_order?: number
          source_name?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          testimonial_date?: string | null
          testimonial_type_id?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonials_showcase_client_id_fkey"
            columns: ["showcase_client_id"]
            isOneToOne: false
            referencedRelation: "showcase_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonials_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonials_testimonial_type_id_fkey"
            columns: ["testimonial_type_id"]
            isOneToOne: false
            referencedRelation: "testimonial_types"
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
      public_project_results: {
        Row: {
          comparison_period: string | null
          description: string | null
          display_value: string | null
          featured: boolean | null
          id: string | null
          metric_name: string | null
          metric_unit: string | null
          metric_value: number | null
          project_id: string | null
          result_kind: Database["public"]["Enums"]["result_kind"] | null
          result_type_name: string | null
          result_type_slug: string | null
          sort_order: number | null
          supporting_note: string | null
          time_period: string | null
          title: string | null
          verified: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "project_results_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_results_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      public_project_services: {
        Row: {
          project_id: string | null
          service_id: string | null
          service_name: string | null
          service_slug: string | null
          sort_order: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_services_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_services_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      public_projects: {
        Row: {
          after_images: Json | null
          approach: string | null
          before_images: Json | null
          business_name: string | null
          business_stage: string | null
          case_study_enabled: boolean | null
          challenge: string | null
          client_bio: string | null
          client_location: string | null
          client_logo: string | null
          client_name: string | null
          client_photo: string | null
          client_role: string | null
          client_slug: string | null
          client_website: string | null
          featured: boolean | null
          gallery: Json | null
          hero_image_url: string | null
          id: string | null
          industry_name: string | null
          industry_slug: string | null
          launch_date: string | null
          outcome_summary: string | null
          project_summary: string | null
          project_type_name: string | null
          project_type_slug: string | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          show_in_portfolio: boolean | null
          site_id: string | null
          slug: string | null
          solution: string | null
          sort_order: number | null
          title: string | null
          website_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      public_services: {
        Row: {
          audiences: Json | null
          business_stages: Json | null
          category_name: string | null
          category_slug: string | null
          cta_text: string | null
          cta_url: string | null
          currency: string | null
          deliverables: Json | null
          delivery_formats: Json | null
          delivery_time: string | null
          featured: boolean | null
          featured_image_url: string | null
          full_description: string | null
          icon_url: string | null
          id: string | null
          ideal_for: string | null
          name: string | null
          price_label: string | null
          process: Json | null
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          site_id: string | null
          slug: string | null
          sort_order: number | null
          starting_price: number | null
        }
        Relationships: [
          {
            foreignKeyName: "services_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      public_testimonials: {
        Row: {
          audio_url: string | null
          client_location: string | null
          client_slug: string | null
          client_website: string | null
          display_business: string | null
          display_logo: string | null
          display_name: string | null
          display_photo: string | null
          display_role: string | null
          featured: boolean | null
          id: string | null
          industry_slug: string | null
          project_id: string | null
          project_slug: string | null
          project_title: string | null
          quote: string | null
          rating: number | null
          short_quote: string | null
          site_id: string | null
          sort_order: number | null
          source_name: string | null
          source_url: string | null
          testimonial_date: string | null
          testimonial_type_name: string | null
          testimonial_type_slug: string | null
          video_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonials_site_id_fkey"
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
      org_members: {
        Args: { org: string }
        Returns: {
          client_names: string[]
          email: string
          membership_id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }[]
      }
      showcase_client_is_public: { Args: { p_id: string }; Returns: boolean }
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
      content_status: "draft" | "published" | "archived"
      deploy_status: "queued" | "building" | "live" | "failed"
      lead_status: "new" | "contacted" | "won" | "lost"
      page_status: "draft" | "published"
      result_kind: "quantitative" | "qualitative"
      revision_entity: "page" | "content_block"
      showcase_client_status: "active" | "past" | "confidential" | "archived"
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
      content_status: ["draft", "published", "archived"],
      deploy_status: ["queued", "building", "live", "failed"],
      lead_status: ["new", "contacted", "won", "lost"],
      page_status: ["draft", "published"],
      result_kind: ["quantitative", "qualitative"],
      revision_entity: ["page", "content_block"],
      showcase_client_status: ["active", "past", "confidential", "archived"],
      site_status: ["draft", "building", "live", "archived"],
      submission_status: ["new", "seen", "archived"],
      user_role: ["super_admin", "agency_developer", "designer", "client"],
    },
  },
} as const
