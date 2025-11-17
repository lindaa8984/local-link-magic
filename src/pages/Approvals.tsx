import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Calendar, ShoppingCart, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const leaveRequests = [
  {
    id: 1,
    employeeName: 'أحمد محمد',
    department: 'المبيعات',
    type: 'إجازة سنوية',
    startDate: '2025-11-01',
    endDate: '2025-11-05',
    days: 5,
    status: 'pending',
    requestDate: '2025-10-20',
  },
  {
    id: 2,
    employeeName: 'سارة علي',
    department: 'التسويق',
    type: 'إجازة مرضية',
    startDate: '2025-10-30',
    endDate: '2025-10-31',
    days: 2,
    status: 'pending',
    requestDate: '2025-10-28',
  },
  {
    id: 3,
    employeeName: 'محمد حسن',
    department: 'الموارد البشرية',
    type: 'إجازة طارئة',
    startDate: '2025-11-02',
    endDate: '2025-11-02',
    days: 1,
    status: 'pending',
    requestDate: '2025-10-25',
  },
];

const purchaseRequests = [
  {
    id: 1,
    requestedBy: 'خالد أحمد',
    department: 'المشتريات',
    item: 'أجهزة كمبيوتر محمولة',
    quantity: 10,
    amount: 50000,
    priority: 'high',
    status: 'pending',
    requestDate: '2025-10-22',
  },
  {
    id: 2,
    requestedBy: 'فاطمة يوسف',
    department: 'تكنولوجيا المعلومات',
    item: 'خادم سيرفر',
    quantity: 2,
    amount: 80000,
    priority: 'urgent',
    status: 'pending',
    requestDate: '2025-10-24',
  },
  {
    id: 3,
    requestedBy: 'عمر محمود',
    department: 'المبيعات',
    item: 'أثاث مكتبي',
    quantity: 5,
    amount: 15000,
    priority: 'medium',
    status: 'pending',
    requestDate: '2025-10-23',
  },
];

export default function Approvals() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-5xl font-bold font-orbitron tracking-tight text-neon-cyan flex items-center gap-4">
          {t('approvals.title')}
          <Clock className="w-10 h-10 text-primary animate-pulse" />
        </h1>
        <p className="text-muted-foreground text-xl font-inter">{t('approvals.description')}</p>
      </div>

      <Tabs defaultValue="leaves" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-14">
          <TabsTrigger value="leaves" className="text-base font-orbitron">
            <Calendar className="w-5 h-5 mr-2" />
            {t('approvals.leaveRequests')}
          </TabsTrigger>
          <TabsTrigger value="purchases" className="text-base font-orbitron">
            <ShoppingCart className="w-5 h-5 mr-2" />
            {t('approvals.purchaseRequests')}
          </TabsTrigger>
        </TabsList>

        {/* Leave Requests Tab */}
        <TabsContent value="leaves" className="space-y-4">
          {leaveRequests.map((request) => (
            <Card 
              key={request.id}
              className="border-2 border-border/50 bg-gradient-to-br from-card via-card/95 to-card/80 backdrop-blur-xl hover:border-primary/30 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl font-orbitron flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      {request.employeeName}
                    </CardTitle>
                    <div className="flex gap-3 flex-wrap">
                      <Badge variant="outline" className="font-inter">
                        {request.department}
                      </Badge>
                      <Badge className="bg-accent/20 text-accent border-accent/30 font-inter">
                        {request.type}
                      </Badge>
                    </div>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 font-orbitron">
                    <Clock className="w-4 h-4 mr-1" />
                    {t('common.pending')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-inter">
                  <div>
                    <p className="text-muted-foreground">{t('approvals.startDate')}</p>
                    <p className="font-semibold">{request.startDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('approvals.endDate')}</p>
                    <p className="font-semibold">{request.endDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('approvals.days')}</p>
                    <p className="font-semibold">{request.days} {t('approvals.day')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('approvals.requestDate')}</p>
                    <p className="font-semibold">{request.requestDate}</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-orbitron">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t('approvals.approve')}
                  </Button>
                  <Button variant="outline" className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10 font-orbitron">
                    <XCircle className="w-4 h-4 mr-2" />
                    {t('approvals.reject')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Purchase Requests Tab */}
        <TabsContent value="purchases" className="space-y-4">
          {purchaseRequests.map((request) => (
            <Card 
              key={request.id}
              className="border-2 border-border/50 bg-gradient-to-br from-card via-card/95 to-card/80 backdrop-blur-xl hover:border-secondary/30 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl font-orbitron flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-secondary" />
                      {request.item}
                    </CardTitle>
                    <div className="flex gap-3 flex-wrap">
                      <Badge variant="outline" className="font-inter">
                        {request.department}
                      </Badge>
                      <Badge 
                        className={`font-inter ${
                          request.priority === 'urgent' 
                            ? 'bg-red-500/20 text-red-500 border-red-500/30' 
                            : request.priority === 'high'
                            ? 'bg-orange-500/20 text-orange-500 border-orange-500/30'
                            : 'bg-blue-500/20 text-blue-500 border-blue-500/30'
                        }`}
                      >
                        {t(`approvals.priority.${request.priority}`)}
                      </Badge>
                    </div>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 font-orbitron">
                    <Clock className="w-4 h-4 mr-1" />
                    {t('common.pending')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-inter">
                  <div>
                    <p className="text-muted-foreground">{t('approvals.requestedBy')}</p>
                    <p className="font-semibold">{request.requestedBy}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('approvals.quantity')}</p>
                    <p className="font-semibold">{request.quantity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('approvals.amount')}</p>
                    <p className="font-semibold text-primary">{request.amount.toLocaleString()} {t('common.currency')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('approvals.requestDate')}</p>
                    <p className="font-semibold">{request.requestDate}</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-orbitron">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t('approvals.approve')}
                  </Button>
                  <Button variant="outline" className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10 font-orbitron">
                    <XCircle className="w-4 h-4 mr-2" />
                    {t('approvals.reject')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
