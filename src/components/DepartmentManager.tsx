import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Department {
  id: string;
  name: string;
  name_ar: string;
  name_en: string | null;
  description?: string | null;
  manager_id?: string | null;
  created_at: string | null;
  updated_at: string | null;
  base_salary: number | null;
  is_active: boolean | null;
}

export function DepartmentManager() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    description: '',
  });

  // Fetch departments
  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Department[];
    },
  });

  // Add department mutation
  const addMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('departments')
        .insert([{
          name: data.name,
          name_ar: data.name_ar,
          name_en: data.name,
          description: data.description || null
        }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('تم إضافة القسم بنجاح');
      setFormData({ name: '', name_ar: '', description: '' });
      setIsAdding(false);
    },
    onError: () => {
      toast.error('حدث خطأ في إضافة القسم');
    },
  });

  // Update department mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from('departments')
        .update({
          name: data.name,
          name_ar: data.name_ar,
          name_en: data.name,
          description: data.description || null
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('تم تحديث القسم بنجاح');
      setEditingId(null);
      setFormData({ name: '', name_ar: '', description: '' });
    },
    onError: () => {
      toast.error('حدث خطأ في تحديث القسم');
    },
  });

  // Delete department mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('تم حذف القسم بنجاح');
      setDeleteId(null);
    },
    onError: () => {
      toast.error('حدث خطأ في حذف القسم');
    },
  });

  const handleAdd = () => {
    if (!formData.name || !formData.name_ar) {
      toast.error('يرجى إدخال اسم القسم بالعربية والإنجليزية');
      return;
    }
    addMutation.mutate(formData);
  };

  const handleUpdate = (id: string) => {
    if (!formData.name || !formData.name_ar) {
      toast.error('يرجى إدخال اسم القسم بالعربية والإنجليزية');
      return;
    }
    updateMutation.mutate({ id, data: formData });
  };

  const startEdit = (dept: Department) => {
    setEditingId(dept.id);
    setFormData({
      name: dept.name,
      name_ar: dept.name_ar,
      description: dept.description || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', name_ar: '', description: '' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">إدارة الأقسام</CardTitle>
            <CardDescription>إضافة وتعديل أقسام الشركة</CardDescription>
          </div>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              إضافة قسم
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Department Form */}
        {isAdding && (
          <div className="p-4 border border-border rounded-lg bg-muted/50 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="deptName">اسم القسم (بالإنجليزية)</Label>
                <Input
                  id="deptName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Department Name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deptNameAr">اسم القسم (بالعربية)</Label>
                <Input
                  id="deptNameAr"
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  placeholder="اسم القسم"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deptDesc">الوصف (اختياري)</Label>
              <Input
                id="deptDesc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="وصف القسم"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={addMutation.isPending}>
                <Check className="h-4 w-4 mr-2" />
                {addMutation.isPending ? 'جاري الإضافة...' : 'حفظ'}
              </Button>
              <Button variant="outline" onClick={() => {
                setIsAdding(false);
                setFormData({ name: '', name_ar: '', description: '' });
              }}>
                <X className="h-4 w-4 mr-2" />
                إلغاء
              </Button>
            </div>
          </div>
        )}

        {/* Departments List */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
        ) : departments && departments.length > 0 ? (
          <div className="space-y-2">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                {editingId === dept.id ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>اسم القسم (بالإنجليزية)</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Department Name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>اسم القسم (بالعربية)</Label>
                        <Input
                          value={formData.name_ar}
                          onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                          placeholder="اسم القسم"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>الوصف</Label>
                      <Input
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="وصف القسم"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdate(dept.id)} disabled={updateMutation.isPending} size="sm">
                        <Check className="h-4 w-4 mr-2" />
                        {updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
                      </Button>
                      <Button variant="outline" onClick={cancelEdit} size="sm">
                        <X className="h-4 w-4 mr-2" />
                        إلغاء
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {dept.name_ar} / {dept.name}
                      </h4>
                      {dept.description && (
                        <p className="text-sm text-muted-foreground mt-1">{dept.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(dept)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(dept.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            لا توجد أقسام حالياً. قم بإضافة قسم جديد للبدء.
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
              <AlertDialogDescription>
                سيتم حذف هذا القسم نهائياً. هذا الإجراء لا يمكن التراجع عنه.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
