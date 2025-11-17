import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Plus, Eye, Check, Filter, Printer } from 'lucide-react';
import { toast } from 'sonner';

interface Department {
  id: string;
  name_ar: string;
  name_en: string;
  base_salary: number;
}

interface Employee {
  id: string;
  employee_number: string;
  full_name: string;
  department_id: string | null;
  position: string;
  base_salary: number;
  status: string;
}

interface PayrollRecord {
  id: string;
  employee_id: string;
  month: number;
  year: number;
  base_salary: number;
  total_allowances: number;
  total_deductions: number;
  net_salary: number;
  status: string;
  payment_date: string | null;
  employees: {
    full_name: string;
    employee_number: string;
    department_id: string | null;
    housing_allowance: number;
    transportation_allowance: number;
    food_allowance: number;
    other_allowances: number;
    departments: {
      name_ar: string;
      name_en: string;
    } | null;
  };
}

interface SalaryComponent {
  id: string;
  name_en: string;
  name_ar: string;
  type: 'allowance' | 'deduction';
  is_percentage: boolean;
  value: number;
  is_active: boolean;
}

export default function Payroll() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const queryClient = useQueryClient();
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth() + 1 + '');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear() + '');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  // Fetch departments
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data as Department[];
    },
  });

  // Fetch payroll records with department filter
  const { data: payrollRecords, isLoading: loadingRecords } = useQuery({
    queryKey: ['payroll-records', selectedDepartment, selectedMonth, selectedYear],
    queryFn: async () => {
      let query = supabase
        .from('payroll_records')
        .select(`
          *,
          employees!inner (
            full_name,
            employee_number,
            department_id,
            housing_allowance,
            transportation_allowance,
            food_allowance,
            other_allowances,
            departments (
              name_ar,
              name_en
            )
          )
        `)
        .eq('month', parseInt(selectedMonth))
        .eq('year', parseInt(selectedYear))
        .order('created_at', { ascending: true });

      // Apply department filter
      if (selectedDepartment !== 'all') {
        query = query.eq('employees.department_id', selectedDepartment);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as PayrollRecord[];
    },
  });

  // Fetch active employees
  const { data: employees } = useQuery({
    queryKey: ['active-employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*, departments(name_ar, name_en)')
        .eq('status', 'active');
      
      if (error) throw error;
      return data as (Employee & { departments: { name_ar: string; name_en: string; } | null })[];
    },
  });

  // Calculate statistics
  const totalEmployees = employees?.length || 0;
  const pendingPayrolls = payrollRecords?.filter(r => r.status === 'pending').length || 0;
  const totalSalaries = payrollRecords
    ?.filter(r => r.month === new Date().getMonth() + 1 && r.year === new Date().getFullYear())
    .reduce((sum, r) => sum + r.net_salary, 0) || 0;

  // Fetch salary components
  const { data: salaryComponents } = useQuery({
    queryKey: ['salary-components'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salary_components')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data as SalaryComponent[];
    },
  });

  // Generate payroll mutation
  const generatePayrollMutation = useMutation({
    mutationFn: async () => {
      if (!employees || !salaryComponents) throw new Error('Data not loaded');

      const month = parseInt(selectedMonth);
      const year = parseInt(selectedYear);

      // Generate payroll for each employee
      const payrollRecordsToInsert = employees.map(employee => {
        // Calculate total allowances from salary components
        const allowances = salaryComponents
          .filter(c => c.type === 'allowance' && c.is_active)
          .reduce((sum, c) => sum + (c.is_percentage ? (employee.base_salary * c.value / 100) : c.value), 0);

        // Calculate deductions from salary components
        const deductions = salaryComponents
          .filter(c => c.type === 'deduction' && c.is_active)
          .reduce((sum, c) => sum + (c.is_percentage ? (employee.base_salary * c.value / 100) : c.value), 0);

        const netSalary = employee.base_salary + allowances - deductions;

        return {
          employee_id: employee.id,
          month,
          year,
          base_salary: employee.base_salary,
          total_allowances: allowances,
          total_deductions: deductions,
          net_salary: netSalary,
          status: 'pending',
        };
      });

      const { error } = await supabase
        .from('payroll_records')
        .upsert(payrollRecordsToInsert, {
          onConflict: 'employee_id,month,year'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-records'] });
      setShowGenerateDialog(false);
      toast.success(t('payroll.generateSuccess'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('payroll.generateError'));
    },
  });

  // Approve payroll mutation
  const approvePayrollMutation = useMutation({
    mutationFn: async (recordId: string) => {
      const { error } = await supabase
        .from('payroll_records')
        .update({ 
          status: 'approved',
          payment_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', recordId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-records'] });
      toast.success(t('payroll.approveSuccess'));
    },
    onError: () => {
      toast.error(t('payroll.approveError'));
    },
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: t('payroll.status.pending'), variant: 'secondary' as const },
      approved: { label: t('payroll.status.approved'), variant: 'default' as const },
      paid: { label: t('payroll.status.paid'), variant: 'default' as const },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const handleViewDetails = (record: PayrollRecord) => {
    setSelectedRecord(record);
    setShowDetailsDialog(true);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('payroll-print-content');
    if (printContent) {
      const printWindow = window.open('', '', 'height=800,width=1200');
      if (printWindow) {
        printWindow.document.write('<html><head><title>' + t('payroll.payrollSheet') + '</title>');
        printWindow.document.write('<style>');
        printWindow.document.write('body{font-family:Arial,sans-serif;padding:10px;direction:' + (isRTL ? 'rtl' : 'ltr') + ';}');
        printWindow.document.write('table{width:100%;border-collapse:collapse;font-size:11px;}');
        printWindow.document.write('th,td{border:1px solid #333;padding:6px 4px;text-align:center;}');
        printWindow.document.write('th{background-color:#f5f5f5;font-weight:bold;}');
        printWindow.document.write('.text-green-600{color:#059669;}');
        printWindow.document.write('.text-red-600{color:#dc2626;}');
        printWindow.document.write('.text-blue-600{color:#2563eb;}');
        printWindow.document.write('.text-primary{color:#0ea5e9;}');
        printWindow.document.write('.font-bold{font-weight:bold;}');
        printWindow.document.write('.bg-green-50{background-color:#f0fdf4;}');
        printWindow.document.write('.bg-green-100{background-color:#dcfce7;}');
        printWindow.document.write('.bg-blue-50{background-color:#eff6ff;}');
        printWindow.document.write('.bg-red-50{background-color:#fef2f2;}');
        printWindow.document.write('.bg-muted{background-color:#f5f5f5;}');
        printWindow.document.write('@media print{body{padding:0;}table{font-size:10px;}th,td{padding:4px 2px;}}');
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<h2 style="text-align:center;margin-bottom:10px;">' + t('payroll.payrollSheet') + '</h2>');
        printWindow.document.write('<p style="text-align:center;margin-bottom:15px;">' + months[parseInt(selectedMonth) - 1].label + ' ' + selectedYear + '</p>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('<p style="text-align:center;margin-top:20px;font-size:10px;color:#666;">' + (isRTL ? 'تم إنشاؤه بواسطة نظام DIG ERP - ' : 'Generated by DIG ERP System - ') + new Date().toLocaleDateString(isRTL ? 'ar' : 'en-US') + '</p>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const months = [
    { value: '1', label: t('months.january') },
    { value: '2', label: t('months.february') },
    { value: '3', label: t('months.march') },
    { value: '4', label: t('months.april') },
    { value: '5', label: t('months.may') },
    { value: '6', label: t('months.june') },
    { value: '7', label: t('months.july') },
    { value: '8', label: t('months.august') },
    { value: '9', label: t('months.september') },
    { value: '10', label: t('months.october') },
    { value: '11', label: t('months.november') },
    { value: '12', label: t('months.december') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('payroll.title')}</h1>
          <p className="text-muted-foreground">{t('payroll.description')}</p>
        </div>
        <Button onClick={() => setShowGenerateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('payroll.generatePayroll')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t('common.filter')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>{t('payroll.department')}</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('payroll.allDepartments')}</SelectItem>
                  {departments?.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {isRTL ? dept.name_ar : dept.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('payroll.month')}</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('payroll.year')}</Label>
              <Input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                min="2020"
                max="2030"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('payroll.totalEmployees')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('payroll.pendingPayrolls')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payrollRecords?.filter(r => r.status === 'pending').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('payroll.totalSalaries')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employees?.reduce((sum, emp) => sum + emp.base_salary, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('payroll.thisMonth')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payrollRecords?.filter(r => 
                r.month === new Date().getMonth() + 1 && 
                r.year === new Date().getFullYear()
              ).reduce((sum, r) => sum + r.net_salary, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Payroll Sheet */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('payroll.payrollSheet')}</CardTitle>
              <CardDescription>
                {months[parseInt(selectedMonth) - 1].label} {selectedYear}
              </CardDescription>
            </div>
            <Button onClick={handlePrint} variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              {t('common.print')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div id="payroll-print-content" className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="text-center font-bold border">{t('payroll.employeeNumber')}</TableHead>
                  <TableHead className="text-center font-bold border">{t('payroll.employeeName')}</TableHead>
                  <TableHead className="text-center font-bold border">{t('payroll.department')}</TableHead>
                  <TableHead className="text-center font-bold border">{t('payroll.baseSalary')}</TableHead>
                  <TableHead className="text-center font-bold border">{t('employees.housingAllowance')}</TableHead>
                  <TableHead className="text-center font-bold border">{t('employees.transportationAllowance')}</TableHead>
                  <TableHead className="text-center font-bold border">{t('employees.foodAllowance')}</TableHead>
                  <TableHead className="text-center font-bold border">{t('employees.otherAllowances')}</TableHead>
                  <TableHead className="text-center font-bold border">{t('payroll.bonus')}</TableHead>
                  <TableHead className="text-center font-bold border bg-red-50">{t('payroll.deductions')}</TableHead>
                  <TableHead className="text-center font-bold border bg-primary/10">{t('payroll.netSalary')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingRecords ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8">
                      {t('common.loading')}
                    </TableCell>
                  </TableRow>
                ) : !payrollRecords || payrollRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8">
                      {t('common.noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  payrollRecords.map((record) => {
                    const housingAllowance = record.employees.housing_allowance || 0;
                    const transportationAllowance = record.employees.transportation_allowance || 0;
                    const foodAllowance = record.employees.food_allowance || 0;
                    const otherAllowances = record.employees.other_allowances || 0;
                    const bonus = record.total_allowances - (housingAllowance + transportationAllowance + foodAllowance + otherAllowances);
                    
                    return (
                      <TableRow key={record.id} className="hover:bg-muted/50">
                        <TableCell className="text-center border">{record.employees.employee_number}</TableCell>
                        <TableCell className="text-center border">{record.employees.full_name}</TableCell>
                        <TableCell className="text-center border">
                          {record.employees.departments 
                            ? (isRTL ? record.employees.departments.name_ar : record.employees.departments.name_en)
                            : '-'
                          }
                        </TableCell>
                        <TableCell className="text-center border font-medium">
                          {record.base_salary.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center border">
                          {housingAllowance.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center border">
                          {transportationAllowance.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center border">
                          {foodAllowance.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center border">
                          {otherAllowances.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center border">
                          {bonus > 0 ? bonus.toLocaleString() : '0'}
                        </TableCell>
                        <TableCell className="text-center border text-red-600">
                          {(record.total_deductions || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center border font-bold text-lg text-primary">
                          {record.net_salary.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center border">
                          {getStatusBadge(record.status)}
                        </TableCell>
                        <TableCell className="text-center border">
                          <div className="flex gap-1 justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(record)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {record.status === 'pending' && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => approvePayrollMutation.mutate(record.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
              {payrollRecords && payrollRecords.length > 0 && (
                <tfoot>
                  <TableRow className="bg-muted font-bold">
                    <TableCell colSpan={3} className="text-center border">
                      {t('common.total')}
                    </TableCell>
                    <TableCell className="text-center border">
                      {payrollRecords.reduce((sum, r) => sum + r.base_salary, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center border text-green-600" colSpan={4}>
                      {payrollRecords.reduce((sum, r) => sum + (r.total_allowances || 0), 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center border text-green-600">
                      {payrollRecords.reduce((sum, r) => sum + r.total_allowances, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center border text-blue-600">
                      {payrollRecords.reduce((sum, r) => sum + r.base_salary + r.total_allowances, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center border text-red-600">
                      {payrollRecords.reduce((sum, r) => sum + r.total_deductions, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center border text-primary text-lg">
                      {payrollRecords.reduce((sum, r) => sum + r.net_salary, 0).toLocaleString()}
                    </TableCell>
                    <TableCell colSpan={2} className="border"></TableCell>
                  </TableRow>
                </tfoot>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Generate Payroll Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('payroll.generatePayroll')}</DialogTitle>
            <DialogDescription>{t('payroll.generateDescription')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t('payroll.selectMonth')}</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('payroll.selectYear')}</Label>
              <Input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                min="2000"
                max="2100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={() => generatePayrollMutation.mutate()}>
              {t('payroll.generate')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payroll Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('payroll.payrollDetails')}</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div id="payroll-print-content" className="space-y-6">
              {/* Header Section */}
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold">{isRTL ? 'كشف راتب' : 'Payroll Statement'}</h2>
                <p className="text-muted-foreground">
                  {months[selectedRecord.month - 1].label} {selectedRecord.year}
                </p>
              </div>

              {/* Employee Information */}
              <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div>
                  <Label className="text-muted-foreground">{t('payroll.employeeName')}</Label>
                  <p className="font-medium text-lg">{selectedRecord.employees.full_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('payroll.employeeNumber')}</Label>
                  <p className="font-medium text-lg">{selectedRecord.employees.employee_number}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('payroll.department')}</Label>
                  <p className="font-medium">
                    {selectedRecord.employees.departments 
                      ? (isRTL ? selectedRecord.employees.departments.name_ar : selectedRecord.employees.departments.name_en)
                      : '-'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">{t('common.status')}</Label>
                  <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
                </div>
              </div>
              
              {/* Salary Breakdown */}
              <div className="space-y-3 border rounded-lg p-4">
                <h3 className="font-semibold text-lg border-b pb-2">
                  {isRTL ? 'تفاصيل الراتب' : 'Salary Breakdown'}
                </h3>
                
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">{t('payroll.baseSalary')}</span>
                  <span className="font-medium text-lg">
                    {selectedRecord.base_salary.toLocaleString()} {isRTL ? 'ر.س' : 'SAR'}
                  </span>
                </div>
                
                <div className="flex justify-between py-2 text-green-600 bg-green-50 px-2 rounded">
                  <span className="font-medium">{t('payroll.totalAllowances')}</span>
                  <span className="font-bold text-lg">
                    +{selectedRecord.total_allowances.toLocaleString()} {isRTL ? 'ر.س' : 'SAR'}
                  </span>
                </div>
                
                <div className="flex justify-between py-2 text-red-600 bg-red-50 px-2 rounded">
                  <span className="font-medium">{t('payroll.totalDeductions')}</span>
                  <span className="font-bold text-lg">
                    -{selectedRecord.total_deductions.toLocaleString()} {isRTL ? 'ر.س' : 'SAR'}
                  </span>
                </div>
                
                <div className="flex justify-between py-3 text-xl font-bold border-t-2 border-primary mt-2 pt-3 bg-primary/5 px-2 rounded">
                  <span>{t('payroll.netSalary')}</span>
                  <span className="text-primary">
                    {selectedRecord.net_salary.toLocaleString()} {isRTL ? 'ر.س' : 'SAR'}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-muted-foreground border-t pt-4">
                <p>{isRTL ? 'تم إنشاء هذا الكشف بواسطة نظام DIG ERP' : 'Generated by DIG ERP System'}</p>
                <p>{new Date().toLocaleDateString(isRTL ? 'ar' : 'en-US')}</p>
              </div>
            </div>
          )}
           <DialogFooter>
            <Button variant="outline" onClick={() => setShowPrintDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              {t('common.print')}
            </Button>
            {selectedRecord?.status === 'pending' && (
              <Button onClick={() => selectedRecord && approvePayrollMutation.mutate(selectedRecord.id)}>
                {t('payroll.approve')}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
