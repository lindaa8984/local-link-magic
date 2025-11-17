import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ModuleSetting {
  id: string;
  module_key: string;
  module_name_en: string;
  module_name_ar: string;
  parent_module_key: string | null;
  is_enabled: boolean;
  display_order: number;
  icon: string | null;
}

export function ModuleSettings() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [modules, setModules] = useState<ModuleSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .from('module_settings')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setModules(data || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast({
        title: t('error'),
        description: t('settings.errorLoadingModules'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = async (moduleId: string, currentState: boolean) => {
    setUpdating(moduleId);
    try {
      const { error } = await supabase
        .from('module_settings')
        .update({ is_enabled: !currentState })
        .eq('id', moduleId);

      if (error) throw error;

      setModules(modules.map(m => 
        m.id === moduleId ? { ...m, is_enabled: !currentState } : m
      ));

      toast({
        title: t('success'),
        description: t('settings.moduleUpdated'),
      });
    } catch (error) {
      console.error('Error updating module:', error);
      toast({
        title: t('error'),
        description: t('settings.errorUpdatingModule'),
        variant: 'destructive',
      });
    } finally {
      setUpdating(null);
    }
  };

  const mainModules = modules.filter(m => !m.parent_module_key);
  const getSubModules = (parentKey: string) => 
    modules.filter(m => m.parent_module_key === parentKey);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.moduleManagement')}</CardTitle>
        <CardDescription>
          {t('settings.moduleManagementDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {mainModules.map((mainModule) => {
          const subModules = getSubModules(mainModule.module_key);
          const moduleName = isRTL ? mainModule.module_name_ar : mainModule.module_name_en;

          return (
            <div key={mainModule.id} className="space-y-3">
              {/* Main Module */}
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                <Label 
                  htmlFor={mainModule.module_key}
                  className="flex-1 cursor-pointer text-base font-semibold"
                >
                  {moduleName}
                </Label>
                <Switch
                  id={mainModule.module_key}
                  checked={mainModule.is_enabled}
                  onCheckedChange={() => toggleModule(mainModule.id, mainModule.is_enabled)}
                  disabled={updating === mainModule.id}
                />
              </div>

              {/* Sub Modules */}
              {subModules.length > 0 && (
                <div className={`space-y-2 ${isRTL ? 'mr-6' : 'ml-6'}`}>
                  {subModules.map((subModule) => {
                    const subModuleName = isRTL ? subModule.module_name_ar : subModule.module_name_en;
                    const isParentEnabled = mainModule.is_enabled;

                    return (
                      <div
                        key={subModule.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
                      >
                        <Label
                          htmlFor={subModule.module_key}
                          className={`flex-1 cursor-pointer text-sm ${
                            !isParentEnabled ? 'text-muted-foreground' : ''
                          }`}
                        >
                          {subModuleName}
                        </Label>
                        <Switch
                          id={subModule.module_key}
                          checked={subModule.is_enabled && isParentEnabled}
                          onCheckedChange={() => toggleModule(subModule.id, subModule.is_enabled)}
                          disabled={updating === subModule.id || !isParentEnabled}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
