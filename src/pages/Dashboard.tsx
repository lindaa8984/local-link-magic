import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';

const pendingApprovals = [
  {
    key: 'pendingLeaveRequests',
    value: '12',
    icon: Users,
    trend: '+3',
  },
  {
    key: 'pendingPurchaseRequests',
    value: '8',
    icon: Package,
    trend: '+2',
  },
];

const additionalStats = [
  {
    key: 'inventoryValue',
    value: '$2.4M',
    icon: DollarSign,
    trend: '+15%',
  },
  {
    key: 'monthlyRevenue',
    value: '$856K',
    icon: TrendingUp,
    trend: '+23%',
  },
];

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          {t('dashboard.title')}
        </h1>
        <p className="text-muted-foreground">{t('dashboard.overview')}</p>
      </div>

      {/* Pending Approvals - Main Focus */}
      <div className="grid gap-4 md:grid-cols-2">
        {pendingApprovals.map((stat) => {
          const Icon = stat.icon;
          
          return (
            <Card 
              key={stat.key}
              className="hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => navigate('/approvals')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t(`dashboard.${stat.key}`)}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1 text-primary">
                    <ArrowUpRight className="h-3 w-3" />
                    <span className="font-medium">{stat.trend}</span>
                  </div>
                  <span>vs last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Stats - Less Prominent */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {additionalStats.map((stat) => {
          const Icon = stat.icon;
          
          return (
            <Card key={stat.key} className="border-dashed">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {t(`dashboard.${stat.key}`)}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              
              <CardContent>
                <div className="text-lg font-semibold text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-primary">{stat.trend}</span> vs last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">{t('dashboard.recentActivity')}</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Activity Event #{i}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {i} hours ago • User Action
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{t('dashboard.quickActions')}</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <button className="w-full flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-left hover:border-primary/50 hover:bg-muted/50 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {t('employees.addEmployee')}
                </p>
                <p className="text-xs text-muted-foreground">
                  Quick employee registration
                </p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-left hover:border-primary/50 hover:bg-muted/50 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Create Order
                </p>
                <p className="text-xs text-muted-foreground">
                  New purchase order
                </p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
