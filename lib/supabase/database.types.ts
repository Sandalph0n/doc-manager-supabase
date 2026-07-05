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
      customer: {
        Row: {
          address: string
          company_name: string
          contact_person: string
          created_at: string | null
          email: string
          id: string
          phone: string
          updated_at: string | null
        }
        Insert: {
          address: string
          company_name: string
          contact_person: string
          created_at?: string | null
          email: string
          id?: string
          phone: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          company_name?: string
          contact_person?: string
          created_at?: string | null
          email?: string
          id?: string
          phone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      seller_profile: {
        Row: {
          address_cn: string | null
          address_en: string | null
          address_vi: string | null
          authorized_person: string
          bank_account: string
          bank_address: string
          bank_name: string
          company_name_cn: string
          company_name_en: string
          company_name_vi: string
          created_at: string | null
          id: string
          position: string | null
          swift_code: string
          tax_code: string
          updated_at: string | null
        }
        Insert: {
          address_cn?: string | null
          address_en?: string | null
          address_vi?: string | null
          authorized_person: string
          bank_account: string
          bank_address: string
          bank_name: string
          company_name_cn: string
          company_name_en: string
          company_name_vi: string
          created_at?: string | null
          id?: string
          position?: string | null
          swift_code: string
          tax_code: string
          updated_at?: string | null
        }
        Update: {
          address_cn?: string | null
          address_en?: string | null
          address_vi?: string | null
          authorized_person?: string
          bank_account?: string
          bank_address?: string
          bank_name?: string
          company_name_cn?: string
          company_name_en?: string
          company_name_vi?: string
          created_at?: string | null
          id?: string
          position?: string | null
          swift_code?: string
          tax_code?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      shipment: {
        Row: {
          contract_date: string | null
          created_at: string | null
          customer_id: string
          doc_number: string
          id: string
          packing_type: string | null
          payment_terms: string | null
          port_of_destination: string | null
          port_of_loading: string | null
          shipment_date: string | null
          shipping_marks: string | null
          status: string | null
          transport_mode: string | null
          updated_at: string | null
        }
        Insert: {
          contract_date?: string | null
          created_at?: string | null
          customer_id: string
          doc_number: string
          id?: string
          packing_type?: string | null
          payment_terms?: string | null
          port_of_destination?: string | null
          port_of_loading?: string | null
          shipment_date?: string | null
          shipping_marks?: string | null
          status?: string | null
          transport_mode?: string | null
          updated_at?: string | null
        }
        Update: {
          contract_date?: string | null
          created_at?: string | null
          customer_id?: string
          doc_number?: string
          id?: string
          packing_type?: string | null
          payment_terms?: string | null
          port_of_destination?: string | null
          port_of_loading?: string | null
          shipment_date?: string | null
          shipping_marks?: string | null
          status?: string | null
          transport_mode?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
        ]
      }
      shipment_document: {
        Row: {
          doc_type: string
          file_name: string
          id: string
          is_auto_generated: boolean
          shipment_id: string
          storage_path: string | null
          uploaded_at: string | null
        }
        Insert: {
          doc_type: string
          file_name: string
          id?: string
          is_auto_generated?: boolean
          shipment_id: string
          storage_path?: string | null
          uploaded_at?: string | null
        }
        Update: {
          doc_type?: string
          file_name?: string
          id?: string
          is_auto_generated?: boolean
          shipment_id?: string
          storage_path?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_document_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipment"
            referencedColumns: ["id"]
          },
        ]
      }
      shipment_item: {
        Row: {
          cbm: number | null
          created_at: string | null
          gw_kg: number | null
          hs_code: string | null
          id: string
          item_no: number | null
          name_cn: string | null
          name_en: string
          num_packages: number | null
          nw_kg: number | null
          quantity: number | null
          shipment_id: string
          specification: string | null
          unit: string | null
          unit_price_usd: number | null
        }
        Insert: {
          cbm?: number | null
          created_at?: string | null
          gw_kg?: number | null
          hs_code?: string | null
          id?: string
          item_no?: number | null
          name_cn?: string | null
          name_en: string
          num_packages?: number | null
          nw_kg?: number | null
          quantity?: number | null
          shipment_id: string
          specification?: string | null
          unit?: string | null
          unit_price_usd?: number | null
        }
        Update: {
          cbm?: number | null
          created_at?: string | null
          gw_kg?: number | null
          hs_code?: string | null
          id?: string
          item_no?: number | null
          name_cn?: string | null
          name_en?: string
          num_packages?: number | null
          nw_kg?: number | null
          quantity?: number | null
          shipment_id?: string
          specification?: string | null
          unit?: string | null
          unit_price_usd?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_item_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipment"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
