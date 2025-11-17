import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Package,
  ShoppingCart,
  TrendingUp,
  FileText,
  Settings,
  Wallet,
  GraduationCap,
  UserPlus,
  DollarSign,
  Clock,
  Receipt,
  Briefcase,
  ChevronRight,
  ChevronDown,
  Shield,
  CreditCard,
  Building2,
  FileSpreadsheet,
  UserCog,
  ClipboardList,
  BarChart3,
  Target,
  Server,
  HardDrive,
  Wifi,
  Wrench,
  Headphones,
  MessageSquare,
  Truck,
  Car,
  CalendarClock,
  MapPin,
  LineChart,
  FileBarChart,
  Store,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const mainMenuItems = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/' },
];

const hierarchicalMenuItems = [
  {
    key: 'hrManagement',
    icon: Users,
    children: [
      { key: 'recruitment', icon: UserPlus, path: '/recruitment' },
      { key: 'employees', icon: Users, path: '/employees' },
      { key: 'payroll', icon: DollarSign, path: '/payroll' },
      { key: 'attendance', icon: Clock, path: '/attendance' },
      { key: 'leaves', icon: Calendar, path: '/leaves' },
      { key: 'training', icon: GraduationCap, path: '/training' },
      { key: 'healthSafety', icon: Shield, path: '/health-safety' },
    ],
  },
  {
    key: 'financialManagement',
    icon: Wallet,
    children: [
      { key: 'accounting', icon: Wallet, path: '/accounting' },
      { key: 'revenues', icon: TrendingUp, path: '/revenues' },
      { key: 'expenses', icon: Receipt, path: '/expenses' },
      { key: 'treasury', icon: DollarSign, path: '/treasury' },
      { key: 'banks', icon: Building2, path: '/banks' },
      { key: 'invoicesPayments', icon: CreditCard, path: '/invoices-payments' },
      { key: 'financialReports', icon: FileSpreadsheet, path: '/financial-reports' },
    ],
  },
  {
    key: 'salesProcurement',
    icon: ShoppingCart,
    children: [
      { key: 'sales', icon: TrendingUp, path: '/sales' },
      { key: 'customers', icon: Users, path: '/customers' },
      { key: 'procurement', icon: ShoppingCart, path: '/procurement' },
      { key: 'suppliers', icon: UserCog, path: '/suppliers' },
      { key: 'inventory', icon: Package, path: '/inventory' },
      { key: 'pos', icon: Store, path: '/pos' },
    ],
  },
  {
    key: 'projectManagement',
    icon: Briefcase,
    children: [
      { key: 'projects', icon: Briefcase, path: '/projects' },
      { key: 'tasks', icon: ClipboardList, path: '/tasks' },
      { key: 'costs', icon: DollarSign, path: '/costs' },
      { key: 'resources', icon: Users, path: '/resources' },
      { key: 'projectReports', icon: FileText, path: '/project-reports' },
    ],
  },
  {
    key: 'contractManagement',
    icon: FileText,
    children: [
      { key: 'customerContracts', icon: Users, path: '/customer-contracts' },
      { key: 'supplierContracts', icon: UserCog, path: '/supplier-contracts' },
      { key: 'maintenanceContracts', icon: Wrench, path: '/maintenance-contracts' },
    ],
  },
  {
    key: 'itManagement',
    icon: Server,
    children: [
      { key: 'usersPermissions', icon: UserCog, path: '/users-permissions' },
      { key: 'backup', icon: HardDrive, path: '/backup' },
      { key: 'devicesNetworks', icon: Wifi, path: '/devices-networks' },
      { key: 'technicalMaintenance', icon: Wrench, path: '/technical-maintenance' },
    ],
  },
  {
    key: 'publicRelations',
    icon: Headphones,
    children: [
      { key: 'tickets', icon: MessageSquare, path: '/tickets' },
      { key: 'complaints', icon: FileText, path: '/complaints' },
      { key: 'customerRecords', icon: Users, path: '/customer-records' },
    ],
  },
  {
    key: 'operationsLogistics',
    icon: Truck,
    children: [
      { key: 'vehicles', icon: Car, path: '/vehicles' },
      { key: 'drivers', icon: Users, path: '/drivers' },
      { key: 'schedules', icon: CalendarClock, path: '/schedules' },
      { key: 'tracking', icon: MapPin, path: '/tracking' },
    ],
  },
  {
    key: 'reportsAnalytics',
    icon: BarChart3,
    children: [
      { key: 'performanceReports', icon: LineChart, path: '/performance-reports' },
      { key: 'kpis', icon: Target, path: '/kpis' },
      { key: 'customReports', icon: FileBarChart, path: '/custom-reports' },
    ],
  },
];

const otherMenuItems = [
  { key: 'reports', icon: FileText, path: '/reports' },
];

const settingsItems = [
  { key: 'settings', icon: Settings, path: '/settings' },
];

export function AppSidebar() {
  const { t, i18n } = useTranslation();
  const { state } = useSidebar();
  const isRTL = i18n.language === 'ar';
  const isCollapsed = state === 'collapsed';
  
  // Track open/closed state for each hierarchical item
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Fetch module settings
  const { data: moduleSettings } = useQuery({
    queryKey: ['module-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_settings')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Create mapping for module keys to check if enabled
  const moduleMap = new Map(
    moduleSettings?.map(m => [m.module_key, m.is_enabled]) || []
  );

  // Map module keys to hierarchical menu items
  const moduleKeyMap: Record<string, string> = {
    // Main modules
    'hrManagement': 'hr_management',
    'financialManagement': 'finance',
    'salesProcurement': 'sales_procurement',
    'projectManagement': 'project_management',
    'contractManagement': 'contract_management',
    'itManagement': 'it_management',
    'publicRelations': 'public_relations',
    'operationsLogistics': 'operations_logistics',
    'reportsAnalytics': 'reports_analytics',
    
    // HR sub-modules
    'recruitment': 'recruitment',
    'employees': 'employee_data',
    'payroll': 'payroll',
    'attendance': 'attendance',
    'leaves': 'leaves',
    'training': 'training_development',
    'healthSafety': 'health_safety',
    
    // Financial sub-modules
    'accounting': 'accounting',
    'revenues': 'revenues',
    'expenses': 'expenses',
    'treasury': 'treasury',
    'banks': 'banks',
    'invoicesPayments': 'invoicesPayments',
    'financialReports': 'financialReports',
    
    // Sales & Procurement sub-modules
    'sales': 'sales',
    'customers': 'customers',
    'procurement': 'procurement',
    'suppliers': 'suppliers',
    'inventory': 'inventory',
    'pos': 'pos',
    
    // Project Management sub-modules
    'projects': 'projects',
    'tasks': 'tasks',
    'costs': 'costs',
    'resources': 'resources',
    'projectReports': 'projectReports',
    
    // Contract Management sub-modules
    'customerContracts': 'customerContracts',
    'supplierContracts': 'supplierContracts',
    'maintenanceContracts': 'maintenanceContracts',
    
    // IT Management sub-modules
    'usersPermissions': 'usersPermissions',
    'backup': 'backup',
    'devicesNetworks': 'devicesNetworks',
    'technicalMaintenance': 'technicalMaintenance',
    
    // Public Relations sub-modules
    'tickets': 'tickets',
    'complaints': 'complaints',
    'customerRecords': 'customerRecords',
    
    // Operations & Logistics sub-modules
    'vehicles': 'vehicles',
    'drivers': 'drivers',
    'schedules': 'schedules',
    'tracking': 'tracking',
    
    // Reports & Analytics sub-modules
    'performanceReports': 'performanceReports',
    'kpis': 'kpis',
    'customReports': 'customReports',
  };

  // Filter menu items based on module settings
  const isModuleEnabled = (key: string, parentKey?: string): boolean => {
    const moduleKey = moduleKeyMap[key];
    if (!moduleKey) return false; // Hide items without mapping (they need to be in the database)
    
    // Check if the module exists in settings and is enabled
    const isEnabled = moduleMap.get(moduleKey) === true;
    
    // If checking a child item, also verify parent is enabled
    if (parentKey) {
      const parentModuleKey = moduleKeyMap[parentKey];
      if (!parentModuleKey) return false;
      const isParentEnabled = moduleMap.get(parentModuleKey) === true;
      return isEnabled && isParentEnabled;
    }
    
    return isEnabled;
  };

  const filteredHierarchicalItems = hierarchicalMenuItems
    .filter(item => isModuleEnabled(item.key))
    .map(item => ({
      ...item,
      children: item.children.filter(child => isModuleEnabled(child.key, item.key))
    }))
    .filter(item => item.children.length > 0); // Hide parent if no children

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
      : 'hover:bg-sidebar-accent/50';

  return (
    <Sidebar
      collapsible="icon"
      side={isRTL ? 'right' : 'left'}
    >
      <SidebarContent>
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.path} end className={getNavClassName}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{t(`nav.${item.key}`)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Hierarchical Modules */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredHierarchicalItems.map((item) => (
                <SidebarMenuItem key={item.key} className="mb-2">
                  <Collapsible
                    open={openItems[item.key]}
                    onOpenChange={() => toggleItem(item.key)}
                  >
                    <CollapsibleTrigger asChild>
                      <button className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          {!isCollapsed && <span>{t(`nav.${item.key}`)}</span>}
                        </div>
                        {!isCollapsed && (
                          openItems[item.key] ? (
                            <ChevronDown className="h-4 w-4 shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 shrink-0" />
                          )
                        )}
                      </button>
                    </CollapsibleTrigger>
                    {!isCollapsed && (
                      <CollapsibleContent className={`${isRTL ? 'mr-6' : 'ml-6'} mt-1 space-y-1`}>
                        {item.children.map((child) => (
                          <SidebarMenuButton key={child.key} asChild>
                            <NavLink
                              to={child.path}
                              className={getNavClassName}
                            >
                              <child.icon className="h-3 w-3" />
                              <span className="text-sm">{t(`nav.${child.key}`)}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        ))}
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Other Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherMenuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.path} className={getNavClassName}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{t(`nav.${item.key}`)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.path} className={getNavClassName}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{t(`nav.${item.key}`)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
