import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface Leave {
  id: string;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days_count: number;
  status: string;
  reason: string;
  notes: string;
  employees: {
    full_name: string;
    employee_number: string;
  };
}

export default function Leaves() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterEmployee, setFilterEmployee] = useState<string>('all');
  
  const [formData, setFormData] = useState({
    employee_id: '',
    leave_type: 'annual',
    start_date: '',
    end_date: '',
    reason: '',
    notes: ''
  });

  // Fetch leaves
  const { data: leaves = [], isLoading } = useQuery({
    queryKey: ['leaves', filterStatus, filterEmployee],
    queryFn: async () => {
      let query = supabase
        .from('leaves')
        .select('*, employees(full_name, employee_number)')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      if (filterEmployee !== 'all') {
        query = query.eq('employee_id', filterEmployee);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Leave[];
    }
  });

  // Fetch employees for dropdown
  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, full_name, employee_number')
        .eq('status', 'active')
        .order('full_name');
      if (error) throw error;
      return data;
    }
  });

  // Create leave mutation
  const createLeaveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const days = differenceInDays(new Date(data.end_date), new Date(data.start_date)) + 1;
      
      const { error } = await supabase.from('leaves').insert({
        ...data,
        days_count: days,
        status: 'pending'
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      toast.success(t('leaves.leaveCreated'));
      setIsDialogOpen(false);
      setFormData({
        employee_id: '',
        leave_type: 'annual',
        start_date: '',
        end_date: '',
        reason: '',
        notes: ''
      });
    },
    onError: () => {
      toast.error(t('common.error'));
    }
  });

  // Update leave status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('leaves')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      toast.success(t('leaves.statusUpdated'));
    },
    onError: () => {
      toast.error(t('common.error'));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employee_id || !formData.start_date || !formData.end_date) {
      toast.error(t('common.fillRequired'));
      return;
    }
    createLeaveMutation.mutate(formData);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: any }> = {
      pending: { variant: 'secondary', icon: Clock },
      approved: { variant: 'default', icon: CheckCircle },
      rejected: { variant: 'destructive', icon: XCircle }
    };
    
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {t(`leaves.status.${status}`)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('leaves.title')}</h1>
          <p className="text-muted-foreground">{t('leaves.description')}</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('leaves.addLeave')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('leaves.addLeave')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="employee_id">{t('leaves.employee')}</Label>
                <Select
                  value={formData.employee_id}
                  onValueChange={(value) => setFormData({ ...formData, employee_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('leaves.selectEmployee')} />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp: any) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.full_name} ({emp.employee_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="leave_type">{t('leaves.leaveType')}</Label>
                <Select
                  value={formData.leave_type}
                  onValueChange={(value) => setFormData({ ...formData, leave_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">{t('leaves.types.annual')}</SelectItem>
                    <SelectItem value="sick">{t('leaves.types.sick')}</SelectItem>
                    <SelectItem value="emergency">{t('leaves.types.emergency')}</SelectItem>
                    <SelectItem value="unpaid">{t('leaves.types.unpaid')}</SelectItem>
                    <SelectItem value="other">{t('leaves.types.other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">{t('leaves.startDate')}</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="end_date">{t('leaves.endDate')}</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="reason">{t('leaves.reason')}</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="notes">{t('leaves.notes')}</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={createLeaveMutation.isPending}>
                  {createLeaveMutation.isPending ? t('common.saving') : t('common.save')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('leaves.leavesList')}
          </CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <Label>{t('leaves.filterByStatus')}</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('leaves.allStatuses')}</SelectItem>
                  <SelectItem value="pending">{t('leaves.status.pending')}</SelectItem>
                  <SelectItem value="approved">{t('leaves.status.approved')}</SelectItem>
                  <SelectItem value="rejected">{t('leaves.status.rejected')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label>{t('leaves.filterByEmployee')}</Label>
              <Select value={filterEmployee} onValueChange={setFilterEmployee}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('leaves.allEmployees')}</SelectItem>
                  {employees.map((emp: any) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('common.loading')}
            </div>
          ) : leaves.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('common.noData')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('leaves.employee')}</TableHead>
                    <TableHead>{t('leaves.leaveType')}</TableHead>
                    <TableHead>{t('leaves.startDate')}</TableHead>
                    <TableHead>{t('leaves.endDate')}</TableHead>
                    <TableHead>{t('leaves.days')}</TableHead>
                    <TableHead>{t('leaves.status.label')}</TableHead>
                    <TableHead>{t('leaves.reason')}</TableHead>
                    <TableHead>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{leave.employees.full_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {leave.employees.employee_number}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {t(`leaves.types.${leave.leave_type}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(leave.start_date), 'yyyy-MM-dd')}</TableCell>
                      <TableCell>{format(new Date(leave.end_date), 'yyyy-MM-dd')}</TableCell>
                      <TableCell>{leave.days_count} {t('leaves.daysUnit')}</TableCell>
                      <TableCell>{getStatusBadge(leave.status)}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={leave.reason}>
                          {leave.reason || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {leave.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatusMutation.mutate({ id: leave.id, status: 'approved' })}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatusMutation.mutate({ id: leave.id, status: 'rejected' })}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
