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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Clock, 
  UserCheck, 
  UserX, 
  AlertCircle, 
  CheckCircle, 
  Filter,
  Calendar as CalendarIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Employee {
  id: string;
  employee_number: string;
  full_name: string;
  department_id: string | null;
  departments: {
    name_ar: string;
    name_en: string;
  } | null;
}

interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  late_minutes: number;
  early_leave_minutes: number;
  overtime_minutes: number;
  notes: string | null;
  employees: {
    employee_number: string;
    full_name: string;
    departments: {
      name_ar: string;
      name_en: string;
    } | null;
  };
}

export default function Attendance() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const queryClient = useQueryClient();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Fetch departments
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch attendance records
  const { data: attendanceRecords, isLoading } = useQuery({
    queryKey: ['attendance', selectedDate, selectedDepartment, selectedStatus],
    queryFn: async () => {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      let query = supabase
        .from('attendance')
        .select(`
          *,
          employees!inner (
            employee_number,
            full_name,
            department_id,
            departments (
              name_ar,
              name_en
            )
          )
        `)
        .eq('date', dateStr)
        .order('check_in', { ascending: true });

      if (selectedDepartment !== 'all') {
        query = query.eq('employees.department_id', selectedDepartment);
      }

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as AttendanceRecord[];
    },
  });

  // Fetch employees
  const { data: employees } = useQuery({
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
        .eq('status', 'active');
      
      if (error) throw error;
      return data as Employee[];
    },
  });

  // Check in/out mutation
  const checkInOutMutation = useMutation({
    mutationFn: async ({ employeeId, type }: { employeeId: string; type: 'in' | 'out' }) => {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const now = new Date().toISOString();
      
      // Check if record exists
      const { data: existing } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('date', dateStr)
        .maybeSingle();

      if (type === 'in') {
        if (existing) {
          throw new Error(t('attendance.alreadyCheckedIn'));
        }
        
        // Check if late (assuming work starts at 8:00 AM)
        const checkInTime = new Date();
        const workStartTime = new Date();
        workStartTime.setHours(8, 0, 0, 0);
        
        const lateMinutes = checkInTime > workStartTime 
          ? Math.floor((checkInTime.getTime() - workStartTime.getTime()) / 60000)
          : 0;
        
        const status = lateMinutes > 0 ? 'late' : 'present';
        
        const { error } = await supabase
          .from('attendance')
          .insert({
            employee_id: employeeId,
            date: dateStr,
            check_in: now,
            status,
            late_minutes: lateMinutes,
          });

        if (error) throw error;
      } else {
        if (!existing) {
          throw new Error(t('attendance.noCheckInRecord'));
        }
        
        if (existing.check_out) {
          throw new Error(t('attendance.alreadyCheckedOut'));
        }

        // Calculate overtime (assuming work ends at 5:00 PM)
        const checkOutTime = new Date();
        const workEndTime = new Date();
        workEndTime.setHours(17, 0, 0, 0);
        
        const overtimeMinutes = checkOutTime > workEndTime
          ? Math.floor((checkOutTime.getTime() - workEndTime.getTime()) / 60000)
          : 0;

        const { error } = await supabase
          .from('attendance')
          .update({
            check_out: now,
            overtime_minutes: overtimeMinutes,
          })
          .eq('id', existing.id);

        if (error) throw error;
      }
    },
    onSuccess: (_, { type }) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success(
        type === 'in' 
          ? t('attendance.checkInSuccess') 
          : t('attendance.checkOutSuccess')
      );
    },
    onError: (error: any) => {
      toast.error(error.message || t('attendance.error'));
    },
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      present: { 
        label: t('attendance.status.present'), 
        variant: 'default' as const,
        icon: CheckCircle,
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      },
      late: { 
        label: t('attendance.status.late'), 
        variant: 'secondary' as const,
        icon: AlertCircle,
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
      },
      absent: { 
        label: t('attendance.status.absent'), 
        variant: 'destructive' as const,
        icon: UserX,
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
      },
      half_day: { 
        label: t('attendance.status.halfDay'), 
        variant: 'secondary' as const,
        icon: Clock,
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
      },
      sick_leave: { 
        label: t('attendance.status.sickLeave'), 
        variant: 'outline' as const,
        icon: AlertCircle,
        className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
      },
      annual_leave: { 
        label: t('attendance.status.annualLeave'), 
        variant: 'outline' as const,
        icon: UserCheck,
        className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100'
      },
      unpaid_leave: { 
        label: t('attendance.status.unpaidLeave'), 
        variant: 'outline' as const,
        icon: UserX,
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
      },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.present;
    const Icon = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className={statusInfo.className}>
        <Icon className="h-3 w-3 mr-1" />
        {statusInfo.label}
      </Badge>
    );
  };

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return '--:--';
    return format(new Date(timestamp), 'HH:mm');
  };

  // Calculate statistics
  const stats = {
    present: attendanceRecords?.filter(r => r.status === 'present' || r.status === 'late').length || 0,
    absent: attendanceRecords?.filter(r => r.status === 'absent').length || 0,
    late: attendanceRecords?.filter(r => r.status === 'late').length || 0,
    onLeave: attendanceRecords?.filter(r => 
      r.status === 'sick_leave' || r.status === 'annual_leave' || r.status === 'unpaid_leave'
    ).length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('attendance.title')}
          </h1>
          <p className="text-muted-foreground">{t('attendance.description')}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('attendance.stats.present')}
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('attendance.stats.absent')}
            </CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('attendance.stats.late')}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('attendance.stats.onLeave')}
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.onLeave}</div>
          </CardContent>
        </Card>
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
              <Label>{t('attendance.selectDate')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, 'PPP', { locale: isRTL ? ar : undefined })
                    ) : (
                      <span>{t('attendance.selectDate')}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    locale={isRTL ? ar : undefined}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
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
              <Label>{t('common.status')}</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('attendance.allStatuses')}</SelectItem>
                  <SelectItem value="present">{t('attendance.status.present')}</SelectItem>
                  <SelectItem value="late">{t('attendance.status.late')}</SelectItem>
                  <SelectItem value="absent">{t('attendance.status.absent')}</SelectItem>
                  <SelectItem value="half_day">{t('attendance.status.halfDay')}</SelectItem>
                  <SelectItem value="sick_leave">{t('attendance.status.sickLeave')}</SelectItem>
                  <SelectItem value="annual_leave">{t('attendance.status.annualLeave')}</SelectItem>
                  <SelectItem value="unpaid_leave">{t('attendance.status.unpaidLeave')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle>{t('attendance.records')}</CardTitle>
          <CardDescription>{t('attendance.recordsDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">{t('payroll.employeeNumber')}</TableHead>
                <TableHead className="text-center">{t('payroll.employeeName')}</TableHead>
                <TableHead className="text-center">{t('payroll.department')}</TableHead>
                <TableHead className="text-center">{t('attendance.checkIn')}</TableHead>
                <TableHead className="text-center">{t('attendance.checkOut')}</TableHead>
                <TableHead className="text-center">{t('attendance.lateMinutes')}</TableHead>
                <TableHead className="text-center">{t('attendance.overtime')}</TableHead>
                <TableHead className="text-center">{t('common.status')}</TableHead>
                <TableHead className="text-center">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    {t('common.loading')}
                  </TableCell>
                </TableRow>
              ) : attendanceRecords?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    {t('common.noData')}
                  </TableCell>
                </TableRow>
              ) : (
                attendanceRecords?.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="text-center">
                      {record.employees.employee_number}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {record.employees.full_name}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.employees.departments 
                        ? (isRTL ? record.employees.departments.name_ar : record.employees.departments.name_en)
                        : '--'
                      }
                    </TableCell>
                    <TableCell className="text-center">
                      {formatTime(record.check_in)}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatTime(record.check_out)}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.late_minutes > 0 ? (
                        <span className="text-yellow-600 font-medium">
                          {record.late_minutes} {t('attendance.minutes')}
                        </span>
                      ) : (
                        '--'
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.overtime_minutes > 0 ? (
                        <span className="text-green-600 font-medium">
                          {record.overtime_minutes} {t('attendance.minutes')}
                        </span>
                      ) : (
                        '--'
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(record.status)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        {!record.check_out && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => 
                              checkInOutMutation.mutate({ 
                                employeeId: record.employee_id, 
                                type: 'out' 
                              })
                            }
                          >
                            {t('attendance.checkOut')}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Check-In Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t('attendance.quickCheckIn')}</CardTitle>
          <CardDescription>{t('attendance.quickCheckInDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {employees?.slice(0, 6).map((employee) => {
              const hasCheckedIn = attendanceRecords?.some(
                r => r.employee_id === employee.id
              );
              const record = attendanceRecords?.find(r => r.employee_id === employee.id);
              
              return (
                <Card key={employee.id} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">{employee.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {employee.employee_number}
                        </p>
                      </div>
                      {hasCheckedIn && record && (
                        getStatusBadge(record.status)
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        disabled={hasCheckedIn}
                        onClick={() => 
                          checkInOutMutation.mutate({ 
                            employeeId: employee.id, 
                            type: 'in' 
                          })
                        }
                      >
                        {t('attendance.checkIn')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        disabled={!hasCheckedIn || !!record?.check_out}
                        onClick={() => 
                          checkInOutMutation.mutate({ 
                            employeeId: employee.id, 
                            type: 'out' 
                          })
                        }
                      >
                        {t('attendance.checkOut')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
