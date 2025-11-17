import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { EmployeeImport } from '@/components/EmployeeImport';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Employee {
  id: string;
  employee_number: string;
  full_name: string;
  department_id: string | null;
  position: string;
  email: string;
  phone: string | null;
  hire_date: string;
  base_salary: number;
  status: string;
  departments: {
    name_ar: string;
    name_en: string;
  } | null;
}

export default function Employees() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee_number: '',
    full_name: '',
    department_id: '',
    position: '',
    email: '',
    phone: '',
    hire_date: '',
    base_salary: '',
    housing_allowance: '',
    transportation_allowance: '',
    food_allowance: '',
    other_allowances: '',
    status: 'active',
  });

  // Fetch employees from database
  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          departments (
            name_ar,
            name_en
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Employee[];
    },
  });

  // Fetch departments for dropdown
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name_ar');
      
      if (error) throw error;
      return data;
    },
  });

  // Add employee mutation
  const addEmployeeMutation = useMutation({
    mutationFn: async (newEmployee: any) => {
      const { data, error } = await supabase
        .from('employees')
        .insert([{
          ...newEmployee,
          base_salary: parseFloat(newEmployee.base_salary),
          housing_allowance: parseFloat(newEmployee.housing_allowance) || 0,
          transportation_allowance: parseFloat(newEmployee.transportation_allowance) || 0,
          food_allowance: parseFloat(newEmployee.food_allowance) || 0,
          other_allowances: parseFloat(newEmployee.other_allowances) || 0,
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsDialogOpen(false);
      setFormData({
        employee_number: '',
        full_name: '',
        department_id: '',
        position: '',
        email: '',
        phone: '',
        hire_date: '',
        base_salary: '',
        housing_allowance: '',
        transportation_allowance: '',
        food_allowance: '',
        other_allowances: '',
        status: 'active',
      });
      toast.success(isRTL ? 'تمت إضافة الموظف بنجاح' : 'Employee added successfully');
    },
    onError: (error) => {
      toast.error(isRTL ? 'خطأ في إضافة الموظف' : 'Error adding employee');
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployeeMutation.mutate(formData);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: t('common.active'), variant: 'default' as const },
      inactive: { label: t('common.inactive'), variant: 'secondary' as const },
      suspended: { label: 'موقوف', variant: 'destructive' as const },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.active;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('employees.title')}
          </h1>
          <p className="text-muted-foreground">
            Manage your organization's employees
          </p>
        </div>
        <div className="flex gap-2">
          {/* <EmployeeImport /> */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t('employees.addEmployee')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('employees.addEmployee')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employee_number">{t('employees.employeeNumber')}</Label>
                  <Input
                    id="employee_number"
                    value={formData.employee_number}
                    onChange={(e) => setFormData({ ...formData, employee_number: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full_name">{t('employees.fullName')}</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('employees.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('employees.phone')}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department_id">{t('employees.department')}</Label>
                  <select
                    id="department_id"
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">{isRTL ? 'اختر القسم' : 'Select Department'}</option>
                    {departments?.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {isRTL ? dept.name_ar : dept.name_en}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">{t('employees.position')}</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hire_date">{t('employees.hireDate')}</Label>
                  <Input
                    id="hire_date"
                    type="date"
                    value={formData.hire_date}
                    onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="base_salary">{isRTL ? 'الراتب الأساسي' : 'Base Salary'}</Label>
                  <Input
                    id="base_salary"
                    type="number"
                    step="0.01"
                    value={formData.base_salary}
                    onChange={(e) => setFormData({ ...formData, base_salary: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Allowances Section */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">
                  {isRTL ? 'البدلات' : 'Allowances'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="housing_allowance">
                      {isRTL ? 'بدل السكن' : 'Housing Allowance'}
                    </Label>
                    <Input
                      id="housing_allowance"
                      type="number"
                      step="0.01"
                      value={formData.housing_allowance}
                      onChange={(e) => setFormData({ ...formData, housing_allowance: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transportation_allowance">
                      {isRTL ? 'بدل المواصلات' : 'Transportation Allowance'}
                    </Label>
                    <Input
                      id="transportation_allowance"
                      type="number"
                      step="0.01"
                      value={formData.transportation_allowance}
                      onChange={(e) => setFormData({ ...formData, transportation_allowance: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="food_allowance">
                      {isRTL ? 'بدل الطعام' : 'Food Allowance'}
                    </Label>
                    <Input
                      id="food_allowance"
                      type="number"
                      step="0.01"
                      value={formData.food_allowance}
                      onChange={(e) => setFormData({ ...formData, food_allowance: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="other_allowances">
                      {isRTL ? 'بدلات أخرى' : 'Other Allowances'}
                    </Label>
                    <Input
                      id="other_allowances"
                      type="number"
                      step="0.01"
                      value={formData.other_allowances}
                      onChange={(e) => setFormData({ ...formData, other_allowances: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={addEmployeeMutation.isPending}>
                  {addEmployeeMutation.isPending ? (isRTL ? 'جاري الإضافة...' : 'Adding...') : t('common.save')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('common.search')}
                className="pl-10"
              />
            </div>
            <Button variant="outline">{t('common.filter')}</Button>
            <Button variant="outline">{t('common.export')}</Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('common.loading')}
            </div>
          ) : !employees || employees.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('common.noData')}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">{t('employees.employeeNumber')}</TableHead>
                  <TableHead className="text-center">{t('employees.fullName')}</TableHead>
                  <TableHead className="text-center">{t('employees.department')}</TableHead>
                  <TableHead className="text-center">{t('employees.position')}</TableHead>
                  <TableHead className="text-center">{t('employees.hireDate')}</TableHead>
                  <TableHead className="text-center">{t('employees.email')}</TableHead>
                  <TableHead className="text-center">{t('employees.status')}</TableHead>
                  <TableHead className="text-center">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium text-center">{employee.employee_number}</TableCell>
                    <TableCell className="text-center">{employee.full_name}</TableCell>
                    <TableCell className="text-center">
                      {employee.departments 
                        ? (isRTL ? employee.departments.name_ar : employee.departments.name_en)
                        : '-'
                      }
                    </TableCell>
                    <TableCell className="text-center">{employee.position}</TableCell>
                    <TableCell className="text-center">
                      {employee.hire_date 
                        ? format(new Date(employee.hire_date), 'dd/MM/yyyy', {
                            locale: isRTL ? ar : undefined
                          })
                        : '-'
                      }
                    </TableCell>
                    <TableCell className="text-center">{employee.email}</TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(employee.status)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm">
                        {t('common.edit')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
