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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string | null
          date: string
          early_leave_minutes: number | null
          employee_id: string
          id: string
          late_minutes: number | null
          notes: string | null
          overtime_minutes: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date: string
          early_leave_minutes?: number | null
          employee_id: string
          id?: string
          late_minutes?: number | null
          notes?: string | null
          overtime_minutes?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date?: string
          early_leave_minutes?: number | null
          employee_id?: string
          id?: string
          late_minutes?: number | null
          notes?: string | null
          overtime_minutes?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_devices: {
        Row: {
          created_at: string | null
          device_id: string
          device_name: string
          device_type: string
          id: string
          ip_address: string | null
          is_active: boolean | null
          last_sync: string | null
          location: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          device_id: string
          device_name: string
          device_type: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_sync?: string | null
          location?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          device_id?: string
          device_name?: string
          device_type?: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_sync?: string | null
          location?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address: string | null
          annual_leave_days: number | null
          city: string | null
          commercial_registration: string | null
          company_name: string
          company_name_ar: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          date_format: string | null
          email: string | null
          fiscal_year_start: number | null
          id: string
          late_deduction_enabled: boolean | null
          late_minutes_threshold: number | null
          logo_url: string | null
          overtime_enabled: boolean | null
          phone: string | null
          sick_leave_days: number | null
          tax_number: string | null
          timezone: string | null
          updated_at: string | null
          website: string | null
          working_days: number[] | null
          working_hours_end: string | null
          working_hours_start: string | null
        }
        Insert: {
          address?: string | null
          annual_leave_days?: number | null
          city?: string | null
          commercial_registration?: string | null
          company_name: string
          company_name_ar?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          date_format?: string | null
          email?: string | null
          fiscal_year_start?: number | null
          id?: string
          late_deduction_enabled?: boolean | null
          late_minutes_threshold?: number | null
          logo_url?: string | null
          overtime_enabled?: boolean | null
          phone?: string | null
          sick_leave_days?: number | null
          tax_number?: string | null
          timezone?: string | null
          updated_at?: string | null
          website?: string | null
          working_days?: number[] | null
          working_hours_end?: string | null
          working_hours_start?: string | null
        }
        Update: {
          address?: string | null
          annual_leave_days?: number | null
          city?: string | null
          commercial_registration?: string | null
          company_name?: string
          company_name_ar?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          date_format?: string | null
          email?: string | null
          fiscal_year_start?: number | null
          id?: string
          late_deduction_enabled?: boolean | null
          late_minutes_threshold?: number | null
          logo_url?: string | null
          overtime_enabled?: boolean | null
          phone?: string | null
          sick_leave_days?: number | null
          tax_number?: string | null
          timezone?: string | null
          updated_at?: string | null
          website?: string | null
          working_days?: number[] | null
          working_hours_end?: string | null
          working_hours_start?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          base_salary: number | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          manager_id: string | null
          name: string
          name_ar: string | null
          name_en: string | null
          updated_at: string | null
        }
        Insert: {
          base_salary?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          name: string
          name_ar?: string | null
          name_en?: string | null
          updated_at?: string | null
        }
        Update: {
          base_salary?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          name?: string
          name_ar?: string | null
          name_en?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          avatar_url: string | null
          base_salary: number | null
          created_at: string | null
          department_id: string | null
          email: string
          employee_number: string
          food_allowance: number | null
          full_name: string
          hire_date: string | null
          housing_allowance: number | null
          id: string
          other_allowances: number | null
          phone: string | null
          position: string | null
          status: string | null
          transportation_allowance: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          base_salary?: number | null
          created_at?: string | null
          department_id?: string | null
          email: string
          employee_number: string
          food_allowance?: number | null
          full_name: string
          hire_date?: string | null
          housing_allowance?: number | null
          id?: string
          other_allowances?: number | null
          phone?: string | null
          position?: string | null
          status?: string | null
          transportation_allowance?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          base_salary?: number | null
          created_at?: string | null
          department_id?: string | null
          email?: string
          employee_number?: string
          food_allowance?: number | null
          full_name?: string
          hire_date?: string | null
          housing_allowance?: number | null
          id?: string
          other_allowances?: number | null
          phone?: string | null
          position?: string | null
          status?: string | null
          transportation_allowance?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      leaves: {
        Row: {
          created_at: string
          days_count: number
          employee_id: string
          end_date: string
          id: string
          leave_type: string
          notes: string | null
          reason: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          days_count: number
          employee_id: string
          end_date: string
          id?: string
          leave_type: string
          notes?: string | null
          reason: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          days_count?: number
          employee_id?: string
          end_date?: string
          id?: string
          leave_type?: string
          notes?: string | null
          reason?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaves_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      module_settings: {
        Row: {
          created_at: string
          display_order: number
          icon: string | null
          id: string
          is_enabled: boolean
          module_key: string
          module_name_ar: string
          module_name_en: string
          parent_module_key: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          is_enabled?: boolean
          module_key: string
          module_name_ar: string
          module_name_en: string
          parent_module_key?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          is_enabled?: boolean
          module_key?: string
          module_name_ar?: string
          module_name_en?: string
          parent_module_key?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payroll_records: {
        Row: {
          base_salary: number
          created_at: string | null
          employee_id: string
          id: string
          month: number
          net_salary: number
          payment_date: string | null
          status: string | null
          total_allowances: number | null
          total_deductions: number | null
          updated_at: string | null
          year: number
        }
        Insert: {
          base_salary: number
          created_at?: string | null
          employee_id: string
          id?: string
          month: number
          net_salary: number
          payment_date?: string | null
          status?: string | null
          total_allowances?: number | null
          total_deductions?: number | null
          updated_at?: string | null
          year: number
        }
        Update: {
          base_salary?: number
          created_at?: string | null
          employee_id?: string
          id?: string
          month?: number
          net_salary?: number
          payment_date?: string | null
          status?: string | null
          total_allowances?: number | null
          total_deductions?: number | null
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "payroll_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          created_at: string | null
          department_id: string | null
          description: string | null
          id: string
          salary_grade: string | null
          title: string
          title_ar: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          salary_grade?: string | null
          title: string
          title_ar?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          salary_grade?: string | null
          title?: string
          title_ar?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "positions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          employee_number: string | null
          full_name: string
          id: string
          phone: string | null
          position: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          employee_number?: string | null
          full_name: string
          id: string
          phone?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          employee_number?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      salary_components: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          is_percentage: boolean | null
          name_ar: string
          name_en: string
          type: string
          updated_at: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_percentage?: boolean | null
          name_ar: string
          name_en: string
          type: string
          updated_at?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_percentage?: boolean | null
          name_ar?: string
          name_en?: string
          type?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "employee"
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
      app_role: ["admin", "manager", "employee"],
    },
  },
} as const
