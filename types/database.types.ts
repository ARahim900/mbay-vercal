export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      electricity_consumption: {
        Row: {
          apr_2024_kwh: number | null
          apr_2025_kwh: number | null
          aug_2024_kwh: number | null
          created_at: string | null
          dec_2024_kwh: number | null
          feb_2025_kwh: number | null
          id: number
          jan_2025_kwh: number | null
          jul_2024_kwh: number | null
          jun_2024_kwh: number | null
          mar_2025_kwh: number | null
          may_2024_kwh: number | null
          meter_account_no: string
          name: string
          nov_2024_kwh: number | null
          oct_2024_kwh: number | null
          sep_2024_kwh: number | null
          total_cost_omr: number | null
          total_kwh: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          apr_2024_kwh?: number | null
          apr_2025_kwh?: number | null
          aug_2024_kwh?: number | null
          created_at?: string | null
          dec_2024_kwh?: number | null
          feb_2025_kwh?: number | null
          id?: number
          jan_2025_kwh?: number | null
          jul_2024_kwh?: number | null
          jun_2024_kwh?: number | null
          mar_2025_kwh?: number | null
          may_2024_kwh?: number | null
          meter_account_no: string
          name: string
          nov_2024_kwh?: number | null
          oct_2024_kwh?: number | null
          sep_2024_kwh?: number | null
          total_cost_omr?: number | null
          total_kwh?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          apr_2024_kwh?: number | null
          apr_2025_kwh?: number | null
          aug_2024_kwh?: number | null
          created_at?: string | null
          dec_2024_kwh?: number | null
          feb_2025_kwh?: number | null
          id?: number
          jan_2025_kwh?: number | null
          jul_2024_kwh?: number | null
          jun_2024_kwh?: number | null
          mar_2025_kwh?: number | null
          may_2024_kwh?: number | null
          meter_account_no?: string
          name?: string
          nov_2024_kwh?: number | null
          oct_2024_kwh?: number | null
          sep_2024_kwh?: number | null
          total_cost_omr?: number | null
          total_kwh?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      electricity_monthly_summary: {
        Row: {
          avg_consumption_per_unit: number | null
          created_at: string | null
          id: number
          month_order: number
          month_year: string
          total_consumption_kwh: number
          total_cost_omr: number
        }
        Insert: {
          avg_consumption_per_unit?: number | null
          created_at?: string | null
          id?: number
          month_order: number
          month_year: string
          total_consumption_kwh: number
          total_cost_omr: number
        }
        Update: {
          avg_consumption_per_unit?: number | null
          created_at?: string | null
          id?: number
          month_order?: number
          month_year?: string
          total_consumption_kwh?: number
          total_cost_omr?: number
        }
        Relationships: []
      }
    }
    Views: {
      electricity_high_consumption: {
        Row: {
          meter_account_no: string | null
          name: string | null
          percentage_of_total: number | null
          rank: number | null
          total_cost_omr: number | null
          total_kwh: number | null
          type: string | null
        }
        Relationships: []
      }
      electricity_type_summary: {
        Row: {
          avg_kwh_per_device: number | null
          device_count: number | null
          percentage_of_total: number | null
          total_cost_omr: number | null
          total_kwh: number | null
          type: string | null
        }
        Relationships: []
      }
    }
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
