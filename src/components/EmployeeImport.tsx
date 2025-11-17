import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmployeeImportData {
  employee_number: string;
  full_name: string;
  email: string;
  phone?: string;
  department_id?: string;
  position: string;
  hire_date: string;
  base_salary: number;
  status?: string;
}

export function EmployeeImport() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const importMutation = useMutation({
    mutationFn: async (employees: EmployeeImportData[]) => {
      const { data, error } = await supabase
        .from('employees')
        .insert(employees)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsOpen(false);
      setSelectedFile(null);
      toast.success(t('employees.importSuccess'));
    },
    onError: (error) => {
      toast.error(t('employees.importError'));
      console.error(error);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = () => {
    if (!selectedFile) {
      toast.error(isRTL ? 'الرجاء اختيار ملف' : 'Please select a file');
      return;
    }

    Papa.parse(selectedFile, {
      header: true,
      complete: (results) => {
        try {
          const employees = results.data
            .filter((row: any) => row.employee_number && row.full_name && row.email)
            .map((row: any) => ({
              employee_number: row.employee_number || row['رقم الموظف'],
              full_name: row.full_name || row['الاسم الكامل'],
              email: row.email || row['البريد الإلكتروني'],
              phone: row.phone || row['الهاتف'] || null,
              department_id: row.department_id || row['رقم القسم'] || null,
              position: row.position || row['المنصب'],
              hire_date: row.hire_date || row['تاريخ التعيين'],
              base_salary: parseFloat(row.base_salary || row['الراتب الأساسي']),
              status: row.status || row['الحالة'] || 'active',
            }));

          if (employees.length === 0) {
            toast.error(t('employees.fileFormatError'));
            return;
          }

          importMutation.mutate(employees);
        } catch (error) {
          toast.error(t('employees.fileFormatError'));
          console.error(error);
        }
      },
      error: (error) => {
        toast.error(t('employees.fileFormatError'));
        console.error(error);
      },
    });
  };

  const downloadTemplate = () => {
    const template = isRTL
      ? 'رقم الموظف,الاسم الكامل,البريد الإلكتروني,الهاتف,رقم القسم,المنصب,تاريخ التعيين,الراتب الأساسي,الحالة\n'
      : 'employee_number,full_name,email,phone,department_id,position,hire_date,base_salary,status\n';
    
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'employee_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          {t('employees.importEmployees')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('employees.importTitle')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <FileSpreadsheet className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {t('employees.importDescription')}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="w-full gap-2"
            >
              <Download className="h-4 w-4" />
              {t('employees.downloadTemplate')}
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">{t('employees.selectFile')}</Label>
            <Input
              id="file"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="cursor-pointer"
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                {selectedFile.name}
              </p>
            )}
          </div>

          <Alert>
            <AlertDescription className="text-xs">
              {t('employees.requiredFields')}
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleImport}
              disabled={!selectedFile || importMutation.isPending}
            >
              {importMutation.isPending
                ? (isRTL ? 'جاري الاستيراد...' : 'Importing...')
                : t('employees.uploadFile')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
