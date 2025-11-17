import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PieChart,
  TrendingUp,
  DollarSign,
  FileText,
  Calendar,
  Download,
  Eye,
  BarChart3,
  LineChart,
  Plus,
} from 'lucide-react';

export default function Reports() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">{t('nav.reports')}</h1>
        <p className="text-muted-foreground">التقارير المالية والإحصائية الشاملة</p>
      </div>

      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 gap-2">
          <TabsTrigger value="financial" className="gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">التقارير المالية</span>
          </TabsTrigger>
          <TabsTrigger value="accounting" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">التقارير المحاسبية</span>
          </TabsTrigger>
          <TabsTrigger value="sales" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">تقارير المبيعات</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">تقارير المخزون</span>
          </TabsTrigger>
          <TabsTrigger value="custom" className="gap-2">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">تقارير مخصصة</span>
          </TabsTrigger>
        </TabsList>

        {/* Financial Reports */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  قائمة الدخل
                </CardTitle>
                <CardDescription>Income Statement - P&L Report</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الفترة:</span>
                    <span className="font-medium">يناير 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">صافي الدخل:</span>
                    <span className="font-bold text-green-600">145,000 ر.س</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    تحميل
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  الميزانية العمومية
                </CardTitle>
                <CardDescription>Balance Sheet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">التاريخ:</span>
                    <span className="font-medium">31 يناير 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">إجمالي الأصول:</span>
                    <span className="font-bold text-blue-600">850,000 ر.س</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    تحميل
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  التدفقات النقدية
                </CardTitle>
                <CardDescription>Cash Flow Statement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الفترة:</span>
                    <span className="font-medium">يناير 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">صافي التدفق:</span>
                    <span className="font-bold text-green-600">58,200 ر.س</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    تحميل
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  تقرير الأرباح والخسائر
                </CardTitle>
                <CardDescription>Profit & Loss Summary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الربع الأول:</span>
                    <span className="font-medium">2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">صافي الربح:</span>
                    <span className="font-bold text-green-600">234,500 ر.س</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    تحميل
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  التحليل المالي
                </CardTitle>
                <CardDescription>Financial Analysis & Ratios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">هامش الربح:</span>
                    <span className="font-medium">18.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">العائد على الاستثمار:</span>
                    <span className="font-bold text-green-600">12.3%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    تحميل
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  تقرير الميزانية
                </CardTitle>
                <CardDescription>Budget vs Actual Report</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الفترة:</span>
                    <span className="font-medium">يناير 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">نسبة التنفيذ:</span>
                    <span className="font-bold text-blue-600">92%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    تحميل
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Accounting Reports */}
        <TabsContent value="accounting" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg">دفتر الأستاذ العام</CardTitle>
                <CardDescription>General Ledger</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    تصدير
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg">ميزان المراجعة</CardTitle>
                <CardDescription>Trial Balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    تصدير
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg">دفتر اليومية</CardTitle>
                <CardDescription>Journal Entries Report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    تصدير
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg">تقرير الضرائب</CardTitle>
                <CardDescription>Tax Report - VAT</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    تصدير
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg">تقرير الحسابات المستحقة</CardTitle>
                <CardDescription>Accounts Receivable Aging</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    تصدير
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg">تقرير الحسابات الدائنة</CardTitle>
                <CardDescription>Accounts Payable Aging</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    تصدير
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Reports */}
        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg">تقرير المبيعات الشهرية</CardTitle>
                <CardDescription>Monthly Sales Summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    تصدير
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg">تقرير المبيعات حسب العميل</CardTitle>
                <CardDescription>Sales by Customer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    تصدير
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg">تقرير المبيعات حسب المنتج</CardTitle>
                <CardDescription>Sales by Product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    تصدير
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Reports */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg">تقرير المخزون الحالي</CardTitle>
                <CardDescription>Current Inventory Report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    تصدير
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg">تقرير حركة المخزون</CardTitle>
                <CardDescription>Inventory Movement Report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    تصدير
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg">تقرير المخزون البطيء</CardTitle>
                <CardDescription>Slow Moving Inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    تصدير
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Custom Reports */}
        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>منشئ التقارير المخصصة</CardTitle>
              <CardDescription>إنشاء تقارير مخصصة حسب احتياجاتك</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <PieChart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">قريباً: أداة إنشاء التقارير المخصصة</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  إنشاء تقرير مخصص
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
