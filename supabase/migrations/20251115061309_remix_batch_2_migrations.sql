
-- Migration: 20251115060223
-- Create departments table (الأقسام)
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT,
  manager_id UUID,
  base_salary DECIMAL(10, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create employees table (الموظفين)
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  employee_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  position TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
  base_salary DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create salary components table (مكونات الراتب)
CREATE TABLE public.salary_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('allowance', 'deduction')),
  is_percentage BOOLEAN DEFAULT false,
  value DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create employee allowances table (بدلات الموظفين)
CREATE TABLE public.employee_allowances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  component_id UUID REFERENCES public.salary_components(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create employee deductions table (خصومات الموظفين)
CREATE TABLE public.employee_deductions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  component_id UUID REFERENCES public.salary_components(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payroll records table (سجلات المرتبات)
CREATE TABLE public.payroll_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  base_salary DECIMAL(10, 2) NOT NULL,
  total_allowances DECIMAL(10, 2) DEFAULT 0,
  total_deductions DECIMAL(10, 2) DEFAULT 0,
  net_salary DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
  payment_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(employee_id, month, year)
);

-- Enable RLS on all tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_allowances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_deductions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow authenticated users to read all data)
CREATE POLICY "Allow authenticated users to read departments"
  ON public.departments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read employees"
  ON public.employees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read salary components"
  ON public.salary_components FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read employee allowances"
  ON public.employee_allowances FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read employee deductions"
  ON public.employee_deductions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read payroll records"
  ON public.payroll_records FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for insert/update/delete (for now, allow all authenticated users)
CREATE POLICY "Allow authenticated users to insert departments"
  ON public.departments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update departments"
  ON public.departments FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert employees"
  ON public.employees FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update employees"
  ON public.employees FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert salary components"
  ON public.salary_components FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update salary components"
  ON public.salary_components FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert employee allowances"
  ON public.employee_allowances FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update employee allowances"
  ON public.employee_allowances FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert employee deductions"
  ON public.employee_deductions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update employee deductions"
  ON public.employee_deductions FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert payroll records"
  ON public.payroll_records FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update payroll records"
  ON public.payroll_records FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_employees_department ON public.employees(department_id);
CREATE INDEX idx_employees_status ON public.employees(status);
CREATE INDEX idx_payroll_records_employee ON public.payroll_records(employee_id);
CREATE INDEX idx_payroll_records_month_year ON public.payroll_records(month, year);
CREATE INDEX idx_employee_allowances_employee ON public.employee_allowances(employee_id);
CREATE INDEX idx_employee_deductions_employee ON public.employee_deductions(employee_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample departments
INSERT INTO public.departments (name_ar, name_en, base_salary) VALUES
  ('تقنية المعلومات', 'IT', 8000),
  ('الموارد البشرية', 'HR', 7000),
  ('المالية', 'Finance', 9000),
  ('التسويق', 'Marketing', 7500),
  ('المبيعات', 'Sales', 6500);

-- Insert sample salary components
INSERT INTO public.salary_components (name_ar, name_en, type, is_percentage, value) VALUES
  ('بدل سكن', 'Housing Allowance', 'allowance', true, 25),
  ('بدل مواصلات', 'Transportation Allowance', 'allowance', false, 500),
  ('بدل طعام', 'Food Allowance', 'allowance', false, 300),
  ('تأمينات اجتماعية', 'Social Insurance', 'deduction', true, 10),
  ('ضريبة الدخل', 'Income Tax', 'deduction', true, 5);

-- Migration: 20251115060323
-- Fix security warning: Set search_path for the function using CASCADE
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the triggers after dropping the function
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
