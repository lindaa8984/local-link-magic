import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Settings as SettingsIcon, Building2, Users, Briefcase, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DepartmentManager } from '@/components/DepartmentManager';
import { ModuleSettings } from '@/components/ModuleSettings';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    company_name: '',
    company_name_ar: '',
    commercial_registration: '',
    tax_number: '',
    address: '',
    city: '',
    country: 'Saudi Arabia',
    phone: '',
    email: '',
    website: '',
    currency: 'SAR',
    timezone: 'Asia/Riyadh',
    working_days: [0, 1, 2, 3, 4],
    working_hours_start: '08:00',
    working_hours_end: '17:00',
    annual_leave_days: 30,
    sick_leave_days: 30,
  });

  // Fetch company settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['company-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setFormData({
          company_name: data.company_name || '',
          company_name_ar: data.company_name_ar || '',
          commercial_registration: data.commercial_registration || '',
          tax_number: data.tax_number || '',
          address: data.address || '',
          city: data.city || '',
          country: data.country || 'Saudi Arabia',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          currency: data.currency || 'SAR',
          timezone: data.timezone || 'Asia/Riyadh',
          working_days: (data.working_days as number[]) || [0, 1, 2, 3, 4],
          working_hours_start: data.working_hours_start || '08:00',
          working_hours_end: data.working_hours_end || '17:00',
          annual_leave_days: data.annual_leave_days || 30,
          sick_leave_days: data.sick_leave_days || 30,
        });
      }
      
      return data;
    },
  });

  // Save settings mutation
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (settings?.id) {
        const { error } = await supabase
          .from('company_settings')
          .update(data)
          .eq('id', settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('company_settings')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-settings'] });
      toast.success('تم حفظ الإعدادات بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ في حفظ الإعدادات');
    },
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('settings.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('settings.description')}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            معلومات الشركة
          </CardTitle>
          <CardDescription>إعدادات شاملة للشركة ونظام ERP</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="text-center py-4">جاري التحميل...</div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="companyName">اسم الشركة (بالإنجليزية)</Label>
                  <Input
                    id="companyName"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="Company Name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="companyNameAr">اسم الشركة (بالعربية)</Label>
                  <Input
                    id="companyNameAr"
                    value={formData.company_name_ar}
                    onChange={(e) => setFormData({ ...formData, company_name_ar: e.target.value })}
                    placeholder="اسم الشركة"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="commercialReg">السجل التجاري</Label>
                  <Input
                    id="commercialReg"
                    value={formData.commercial_registration}
                    onChange={(e) => setFormData({ ...formData, commercial_registration: e.target.value })}
                    placeholder="1234567890"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                  <Input
                    id="taxNumber"
                    value={formData.tax_number}
                    onChange={(e) => setFormData({ ...formData, tax_number: e.target.value })}
                    placeholder="300000000000003"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">العنوان</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="عنوان الشركة الكامل"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="city">المدينة</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="الرياض"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">الهاتف</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+966 XX XXX XXXX"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="info@company.com"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">إعدادات أوقات العمل</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="workStart">بداية الدوام</Label>
                    <Input
                      id="workStart"
                      type="time"
                      value={formData.working_hours_start}
                      onChange={(e) => setFormData({ ...formData, working_hours_start: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="workEnd">نهاية الدوام</Label>
                    <Input
                      id="workEnd"
                      type="time"
                      value={formData.working_hours_end}
                      onChange={(e) => setFormData({ ...formData, working_hours_end: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">إعدادات الإجازات</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="annualLeave">أيام الإجازة السنوية</Label>
                    <Input
                      id="annualLeave"
                      type="number"
                      value={formData.annual_leave_days}
                      onChange={(e) => setFormData({ ...formData, annual_leave_days: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sickLeave">أيام الإجازة المرضية</Label>
                    <Input
                      id="sickLeave"
                      type="number"
                      value={formData.sick_leave_days}
                      onChange={(e) => setFormData({ ...formData, sick_leave_days: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} disabled={saveMutation.isPending} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Module Settings Section */}
      <ModuleSettings />

      {/* Department Management Section */}
      <DepartmentManager />
    </div>
  );
}
