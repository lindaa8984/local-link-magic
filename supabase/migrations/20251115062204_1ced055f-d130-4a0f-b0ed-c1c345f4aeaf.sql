-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in TIMESTAMP WITH TIME ZONE,
  check_out TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'present',
  late_minutes INTEGER DEFAULT 0,
  early_leave_minutes INTEGER DEFAULT 0,
  overtime_minutes INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE,
  CONSTRAINT unique_employee_date UNIQUE (employee_id, date)
);

-- Add comments
COMMENT ON TABLE public.attendance IS 'Employee attendance records with check-in/out times';
COMMENT ON COLUMN public.attendance.status IS 'present, absent, late, half_day, sick_leave, annual_leave, unpaid_leave';

-- Enable RLS
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow authenticated users to read attendance"
ON public.attendance
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert attendance"
ON public.attendance
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update attendance"
ON public.attendance
FOR UPDATE
TO authenticated
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_attendance_updated_at
BEFORE UPDATE ON public.attendance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_attendance_employee_date ON public.attendance(employee_id, date DESC);
CREATE INDEX idx_attendance_date ON public.attendance(date DESC);
CREATE INDEX idx_attendance_status ON public.attendance(status);

-- Create leave requests table
CREATE TABLE public.leave_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  leave_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_count INTEGER NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE CASCADE
);

COMMENT ON TABLE public.leave_requests IS 'Employee leave requests and approvals';
COMMENT ON COLUMN public.leave_requests.leave_type IS 'annual_leave, sick_leave, unpaid_leave, emergency_leave, maternity_leave';
COMMENT ON COLUMN public.leave_requests.status IS 'pending, approved, rejected';

-- Enable RLS
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow authenticated users to read leave requests"
ON public.leave_requests
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert leave requests"
ON public.leave_requests
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update leave requests"
ON public.leave_requests
FOR UPDATE
TO authenticated
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_leave_requests_updated_at
BEFORE UPDATE ON public.leave_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_leave_requests_employee ON public.leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON public.leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON public.leave_requests(start_date, end_date);