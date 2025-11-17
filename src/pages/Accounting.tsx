import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  TrendingUp,
  Wallet,
  Receipt,
  Building2,
  FileText,
  Calculator,
  CreditCard,
  Plus,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data for different accounting sections
const mockPurchases = [
  { id: 1, supplier: 'شركة التوريدات الحديثة', invoice: 'PUR-001', amount: 15000, date: '2025-01-15', status: 'paid' },
  { id: 2, supplier: 'مؤسسة المواد الأولية', invoice: 'PUR-002', amount: 23500, date: '2025-01-18', status: 'pending' },
  { id: 3, supplier: 'شركة الإمدادات السريعة', invoice: 'PUR-003', amount: 8900, date: '2025-01-20', status: 'paid' },
  { id: 4, supplier: 'موردون آخرون', invoice: 'PUR-004', amount: 12300, date: '2025-01-22', status: 'pending' },
];

const mockSales = [
  { id: 1, customer: 'شركة النجاح التجارية', invoice: 'SAL-001', amount: 28000, date: '2025-01-16', status: 'paid' },
  { id: 2, customer: 'مؤسسة الأمل', invoice: 'SAL-002', amount: 45200, date: '2025-01-19', status: 'pending' },
  { id: 3, customer: 'شركة التطوير', invoice: 'SAL-003', amount: 17600, date: '2025-01-22', status: 'paid' },
  { id: 4, customer: 'عملاء آخرون', invoice: 'SAL-004', amount: 31200, date: '2025-01-24', status: 'pending' },
];

const mockExpenses = [
  { id: 1, category: 'إيجار', description: 'إيجار المكتب - يناير', amount: 12000, date: '2025-01-01' },
  { id: 2, category: 'كهرباء', description: 'فاتورة الكهرباء', amount: 3500, date: '2025-01-10' },
  { id: 3, category: 'صيانة', description: 'صيانة المعدات', amount: 2800, date: '2025-01-15' },
  { id: 4, category: 'مواصلات', description: 'مصاريف النقل', amount: 1500, date: '2025-01-18' },
  { id: 5, category: 'اتصالات', description: 'فواتير الهاتف والإنترنت', amount: 2200, date: '2025-01-20' },
];

const mockPayroll = [
  { id: 1, employee: 'أحمد محمد', position: 'مدير مبيعات', salary: 8000, bonus: 1000, deductions: 500, net: 8500, status: 'paid' },
  { id: 2, employee: 'فاطمة علي', position: 'محاسبة', salary: 6000, bonus: 500, deductions: 300, net: 6200, status: 'pending' },
  { id: 3, employee: 'خالد حسن', position: 'مندوب مبيعات', salary: 5000, bonus: 800, deductions: 250, net: 5550, status: 'paid' },
  { id: 4, employee: 'سارة أحمد', position: 'مشرفة إنتاج', salary: 7000, bonus: 600, deductions: 350, net: 7250, status: 'paid' },
];

const mockTaxReports = [
  { id: 1, period: 'يناير 2025', sales: 145000, purchases: 85000, taxable: 60000, taxAmount: 9000, status: 'pending' },
  { id: 2, period: 'ديسمبر 2024', sales: 132000, purchases: 78000, taxable: 54000, taxAmount: 8100, status: 'submitted' },
  { id: 3, period: 'نوفمبر 2024', sales: 128000, purchases: 72000, taxable: 56000, taxAmount: 8400, status: 'paid' },
];

const mockJournalEntries = [
  { id: 1, date: '2025-01-15', reference: 'JE-001', description: 'قيد افتتاحي', debit: 50000, credit: 50000 },
  { id: 2, date: '2025-01-16', reference: 'JE-002', description: 'مبيعات نقدية', debit: 28000, credit: 28000 },
  { id: 3, date: '2025-01-18', reference: 'JE-003', description: 'مشتريات آجلة', debit: 23500, credit: 23500 },
  { id: 4, date: '2025-01-20', reference: 'JE-004', description: 'سداد رواتب', debit: 27500, credit: 27500 },
];

const mockCashFlow = [
  { id: 1, type: 'receipt', description: 'تحصيل من عميل', amount: 28000, account: 'الخزينة', date: '2025-01-16' },
  { id: 2, type: 'payment', description: 'دفع لمورد', amount: 15000, account: 'البنك', date: '2025-01-17' },
  { id: 3, type: 'receipt', description: 'إيداع نقدي', amount: 45200, account: 'البنك', date: '2025-01-19' },
  { id: 4, type: 'payment', description: 'سحب نقدي', amount: 5000, account: 'الخزينة', date: '2025-01-21' },
];

export default function Accounting() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('purchases');

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      paid: 'default',
      pending: 'secondary',
      submitted: 'default',
    };
    return <Badge variant={variants[status] || 'default'}>{status === 'paid' ? 'مدفوع' : status === 'pending' ? 'معلق' : 'مقدم'}</Badge>;
  };

  // Calculate summary statistics
  const purchaseStats = {
    total: mockPurchases.reduce((sum, p) => sum + p.amount, 0),
    paid: mockPurchases.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    pending: mockPurchases.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
  };

  const salesStats = {
    total: mockSales.reduce((sum, s) => sum + s.amount, 0),
    paid: mockSales.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.amount, 0),
    pending: mockSales.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.amount, 0),
  };

  const expenseStats = {
    total: mockExpenses.reduce((sum, e) => sum + e.amount, 0),
    byCategory: mockExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>),
  };

  const payrollStats = {
    total: mockPayroll.reduce((sum, p) => sum + p.net, 0),
    paid: mockPayroll.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.net, 0),
    pending: mockPayroll.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.net, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">{t('nav.accounting')}</h1>
        <p className="text-muted-foreground">{t('accounting.description')}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2">
          <TabsTrigger value="purchases" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">المشتريات</span>
          </TabsTrigger>
          <TabsTrigger value="sales" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">المبيعات</span>
          </TabsTrigger>
          <TabsTrigger value="expenses" className="gap-2">
            <Receipt className="h-4 w-4" />
            <span className="hidden sm:inline">المصروفات</span>
          </TabsTrigger>
          <TabsTrigger value="payroll" className="gap-2">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">الرواتب</span>
          </TabsTrigger>
          <TabsTrigger value="tax" className="gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">الضرائب</span>
          </TabsTrigger>
          <TabsTrigger value="journal" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">القيود</span>
          </TabsTrigger>
          <TabsTrigger value="cash" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">الخزينة</span>
          </TabsTrigger>
          <TabsTrigger value="accounts" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">الحسابات</span>
          </TabsTrigger>
        </TabsList>

        {/* Purchases Tab */}
        <TabsContent value="purchases" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المشتريات</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{purchaseStats.total.toLocaleString()} ر.س</div>
                <p className="text-xs text-muted-foreground">
                  {mockPurchases.length} فاتورة هذا الشهر
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المدفوع</CardTitle>
                <ArrowUpCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{purchaseStats.paid.toLocaleString()} ر.س</div>
                <p className="text-xs text-muted-foreground">
                  {mockPurchases.filter(p => p.status === 'paid').length} فاتورة
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">قيد الانتظار</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{purchaseStats.pending.toLocaleString()} ر.س</div>
                <p className="text-xs text-muted-foreground">
                  {mockPurchases.filter(p => p.status === 'pending').length} فاتورة
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  فواتير المشتريات
                </CardTitle>
                <CardDescription>إدارة جميع فواتير المشتريات والموردين</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                فاتورة جديدة
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الفاتورة</TableHead>
                    <TableHead>المورد</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-medium">{purchase.invoice}</TableCell>
                      <TableCell>{purchase.supplier}</TableCell>
                      <TableCell>{purchase.amount.toLocaleString()} ر.س</TableCell>
                      <TableCell>{purchase.date}</TableCell>
                      <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salesStats.total.toLocaleString()} ر.س</div>
                <p className="text-xs text-muted-foreground">
                  {mockSales.length} فاتورة هذا الشهر
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المحصل</CardTitle>
                <ArrowDownCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{salesStats.paid.toLocaleString()} ر.س</div>
                <p className="text-xs text-muted-foreground">
                  {mockSales.filter(s => s.status === 'paid').length} فاتورة
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">غير محصل</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{salesStats.pending.toLocaleString()} ر.س</div>
                <p className="text-xs text-muted-foreground">
                  {mockSales.filter(s => s.status === 'pending').length} فاتورة
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  فواتير المبيعات
                </CardTitle>
                <CardDescription>إدارة جميع فواتير المبيعات والعملاء</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                فاتورة جديدة
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الفاتورة</TableHead>
                    <TableHead>العميل</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.invoice}</TableCell>
                      <TableCell>{sale.customer}</TableCell>
                      <TableCell>{sale.amount.toLocaleString()} ر.س</TableCell>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{getStatusBadge(sale.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المصروفات</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{expenseStats.total.toLocaleString()} ر.س</div>
                <p className="text-xs text-muted-foreground">
                  {mockExpenses.length} مصروف هذا الشهر
                </p>
              </CardContent>
            </Card>
            {Object.entries(expenseStats.byCategory).slice(0, 3).map(([category, amount]) => (
              <Card key={category}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{category}</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{amount.toLocaleString()} ر.س</div>
                  <p className="text-xs text-muted-foreground">
                    {((amount / expenseStats.total) * 100).toFixed(1)}% من الإجمالي
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  المصروفات اليومية
                </CardTitle>
                <CardDescription>تتبع جميع مصروفات الشركة اليومية</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                مصروف جديد
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التصنيف</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        <Badge variant="secondary">{expense.category}</Badge>
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.amount.toLocaleString()} ر.س</TableCell>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payroll Tab */}
        <TabsContent value="payroll" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الرواتب</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{payrollStats.total.toLocaleString()} ر.س</div>
                <p className="text-xs text-muted-foreground">
                  {mockPayroll.length} موظف
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المصروف</CardTitle>
                <ArrowUpCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{payrollStats.paid.toLocaleString()} ر.س</div>
                <p className="text-xs text-muted-foreground">
                  {mockPayroll.filter(p => p.status === 'paid').length} موظف
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">قيد الانتظار</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{payrollStats.pending.toLocaleString()} ر.س</div>
                <p className="text-xs text-muted-foreground">
                  {mockPayroll.filter(p => p.status === 'pending').length} موظف
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  كشف الرواتب
                </CardTitle>
                <CardDescription>إدارة رواتب الموظفين والحوافز والخصومات</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                صرف راتب
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الموظف</TableHead>
                    <TableHead>الوظيفة</TableHead>
                    <TableHead>الراتب</TableHead>
                    <TableHead>الحوافز</TableHead>
                    <TableHead>الخصومات</TableHead>
                    <TableHead>الصافي</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayroll.map((payroll) => (
                    <TableRow key={payroll.id}>
                      <TableCell className="font-medium">{payroll.employee}</TableCell>
                      <TableCell>{payroll.position}</TableCell>
                      <TableCell>{payroll.salary.toLocaleString()} ر.س</TableCell>
                      <TableCell className="text-green-600">{payroll.bonus.toLocaleString()} ر.س</TableCell>
                      <TableCell className="text-red-600">{payroll.deductions.toLocaleString()} ر.س</TableCell>
                      <TableCell className="font-bold">{payroll.net.toLocaleString()} ر.س</TableCell>
                      <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Tab */}
        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  الإقرارات الضريبية
                </CardTitle>
                <CardDescription>متابعة ضريبة القيمة المضافة والإقرارات الدورية</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                إقرار جديد
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الفترة</TableHead>
                    <TableHead>المبيعات</TableHead>
                    <TableHead>المشتريات</TableHead>
                    <TableHead>الوعاء الضريبي</TableHead>
                    <TableHead>الضريبة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTaxReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.period}</TableCell>
                      <TableCell>{report.sales.toLocaleString()} ر.س</TableCell>
                      <TableCell>{report.purchases.toLocaleString()} ر.س</TableCell>
                      <TableCell>{report.taxable.toLocaleString()} ر.س</TableCell>
                      <TableCell className="font-bold">{report.taxAmount.toLocaleString()} ر.س</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><FileText className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Journal Entries Tab */}
        <TabsContent value="journal" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  القيود اليومية
                </CardTitle>
                <CardDescription>تسجيل القيود المحاسبية والعمليات المالية</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                قيد جديد
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>المرجع</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>المدين</TableHead>
                    <TableHead>الدائن</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockJournalEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell className="font-medium">{entry.reference}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell className="text-green-600">{entry.debit.toLocaleString()} ر.س</TableCell>
                      <TableCell className="text-red-600">{entry.credit.toLocaleString()} ر.س</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cash" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  الخزينة والبنوك
                </CardTitle>
                <CardDescription>متابعة حركة النقدية والحسابات البنكية</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                حركة جديدة
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>النوع</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>الحساب</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCashFlow.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Badge variant={transaction.type === 'receipt' ? 'default' : 'secondary'}>
                          {transaction.type === 'receipt' ? 'قبض' : 'صرف'}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className={transaction.type === 'receipt' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.amount.toLocaleString()} ر.س
                      </TableCell>
                      <TableCell>{transaction.account}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chart of Accounts Tab */}
        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  شجرة الحسابات
                </CardTitle>
                <CardDescription>عرض الدليل المحاسبي وشجرة الحسابات (يتم إدارتها من الإعدادات)</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4 glass-premium">
                  <h3 className="font-bold flex items-center gap-2 mb-3 text-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                    الأصول
                  </h3>
                  <div className="mr-6 space-y-2 text-sm">
                    <div className="p-2 rounded hover:bg-muted/50">- الأصول المتداولة</div>
                    <div className="p-2 rounded hover:bg-muted/50">- الأصول الثابتة</div>
                    <div className="p-2 rounded hover:bg-muted/50">- الأصول غير الملموسة</div>
                  </div>
                </div>
                <div className="rounded-lg border p-4 glass-premium">
                  <h3 className="font-bold flex items-center gap-2 mb-3 text-lg">
                    <Receipt className="h-5 w-5 text-secondary" />
                    الخصوم
                  </h3>
                  <div className="mr-6 space-y-2 text-sm">
                    <div className="p-2 rounded hover:bg-muted/50">- الخصوم المتداولة</div>
                    <div className="p-2 rounded hover:bg-muted/50">- الخصوم طويلة الأجل</div>
                  </div>
                </div>
                <div className="rounded-lg border p-4 glass-premium">
                  <h3 className="font-bold flex items-center gap-2 mb-3 text-lg">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    حقوق الملكية
                  </h3>
                  <div className="mr-6 space-y-2 text-sm">
                    <div className="p-2 rounded hover:bg-muted/50">- رأس المال</div>
                    <div className="p-2 rounded hover:bg-muted/50">- الأرباح المحتجزة</div>
                    <div className="p-2 rounded hover:bg-muted/50">- الاحتياطيات</div>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground text-center">
                    لإضافة أو تعديل الحسابات، انتقل إلى <a href="/settings" className="text-primary hover:underline font-medium">الإعدادات</a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
