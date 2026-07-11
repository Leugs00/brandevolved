// Placeholder — regenerated from the live schema after migrations run
// (mcp Supabase generate_typescript_types). Do not edit by hand.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: { [key: string]: { Row: any; Insert: any; Update: any; Relationships: any[] } };
    Views: { [key: string]: { Row: any } };
    Functions: { [key: string]: any };
    Enums: { [key: string]: string };
    CompositeTypes: { [key: string]: any };
  };
};
