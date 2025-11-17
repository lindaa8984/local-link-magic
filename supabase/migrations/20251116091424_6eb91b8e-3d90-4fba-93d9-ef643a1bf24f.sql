-- Create module_settings table
CREATE TABLE IF NOT EXISTS public.module_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_key TEXT NOT NULL UNIQUE,
  module_name_en TEXT NOT NULL,
  module_name_ar TEXT NOT NULL,
  parent_module_key TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default modules
INSERT INTO public.module_settings (module_key, module_name_en, module_name_ar, parent_module_key, display_order, icon, is_enabled) VALUES
  ('dashboard', 'Dashboard', 'لوحة التحكم', NULL, 1, 'LayoutDashboard', true),
  ('employees', 'Employees', 'الموظفون', NULL, 2, 'Users', true),
  ('attendance', 'Attendance', 'الحضور', NULL, 3, 'Clock', true),
  ('leaves', 'Leaves', 'الإجازات', NULL, 4, 'Calendar', true),
  ('payroll', 'Payroll', 'الرواتب', NULL, 5, 'DollarSign', true),
  ('accounting', 'Accounting', 'المحاسبة', NULL, 6, 'Calculator', true),
  ('reports', 'Reports', 'التقارير', NULL, 7, 'FileText', true),
  ('settings', 'Settings', 'الإعدادات', NULL, 8, 'Settings', true);

-- Create leaves table
CREATE TABLE IF NOT EXISTS public.leaves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_count INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reason TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on module_settings
ALTER TABLE public.module_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for module_settings (everyone can read)
CREATE POLICY "Anyone can view module settings"
  ON public.module_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update module settings"
  ON public.module_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Enable RLS on leaves
ALTER TABLE public.leaves ENABLE ROW LEVEL SECURITY;

-- Create policies for leaves
CREATE POLICY "Employees can view their own leaves"
  ON public.leaves
  FOR SELECT
  USING (
    employee_id IN (
      SELECT id FROM public.employees WHERE user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Employees can create their own leaves"
  ON public.leaves
  FOR INSERT
  WITH CHECK (
    employee_id IN (
      SELECT id FROM public.employees WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and managers can update leaves"
  ON public.leaves
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can delete leaves"
  ON public.leaves
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_module_settings_updated_at
  BEFORE UPDATE ON public.module_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leaves_updated_at
  BEFORE UPDATE ON public.leaves
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();