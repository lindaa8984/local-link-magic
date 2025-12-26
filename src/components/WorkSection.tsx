import { useLanguage } from '@/contexts/LanguageContext';
import { ExternalLink, Globe, Play, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import almasPackImg from '@/assets/almas-pack-screenshot.png';
import alaqsaElectronicsImg from '@/assets/alaqsa-electronics-screenshot.png';
import ecommerceDemo from '@/assets/ecommerce-demo.png';
import posSystemDemo from '@/assets/pos-system-screenshot.png';

interface Project {
  url: string;
  titleKey: string;
  descKey: string;
  typeKey: string;
  purposeKey: string;
  image: string;
  color: string;
  isLive: boolean;
}

const WorkSection = () => {
  const { t, isRTL } = useLanguage();

  const liveProjects: Project[] = [
    {
      url: 'https://almaspack.com',
      titleKey: 'project1.title',
      descKey: 'project1.desc',
      typeKey: isRTL ? 'نظام إدارة متكامل' : 'Complete Management System',
      purposeKey: isRTL ? 'إدارة الطلبات والمخزون لشركة تغليف' : 'Order & inventory management for packaging company',
      image: almasPackImg,
      color: 'from-amber-500/20 to-orange-500/20',
      isLive: true,
    },
    {
      url: 'https://alaqsaelectronics.com',
      titleKey: 'project2.title',
      descKey: 'project2.desc',
      typeKey: isRTL ? 'نظام مبيعات ومخزون' : 'Sales & Inventory System',
      purposeKey: isRTL ? 'إدارة المبيعات والمخزون لمتجر إلكترونيات' : 'Sales & inventory for electronics store',
      image: alaqsaElectronicsImg,
      color: 'from-red-500/20 to-rose-500/20',
      isLive: true,
    },
  ];

  const demoProjects: Project[] = [
    {
      url: 'https://demo1.union-sd.com',
      titleKey: 'demo1.title',
      descKey: 'demo1.desc',
      typeKey: isRTL ? 'نظام نقاط البيع' : 'Point of Sale System',
      purposeKey: isRTL ? 'إدارة المبيعات والفواتير والمخزون' : 'Sales, invoicing & inventory management',
      image: posSystemDemo,
      color: 'from-emerald-500/20 to-teal-500/20',
      isLive: false,
    },
    {
      url: 'https://demo.union-sd.com',
      titleKey: 'demo2.title',
      descKey: 'demo2.desc',
      typeKey: isRTL ? 'قالب متجر إلكتروني' : 'E-Commerce Template',
      purposeKey: isRTL ? 'قالب جاهز للتخصيص حسب هويتك البصرية' : 'Ready template customizable to your brand',
      image: ecommerceDemo,
      color: 'from-orange-500/20 to-amber-500/20',
      isLive: false,
    },
  ];

  const ProjectCard = ({ project, isDemo }: { project: Project; isDemo: boolean }) => (
    <Card 
      className="group relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Preview with Image */}
      <div className="relative h-52 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
        <img 
          src={project.image} 
          alt={t(project.titleKey)} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge */}
        {project.isLive ? (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Live
          </div>
        ) : (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            <Play className="w-3 h-3" />
            Demo
          </div>
        )}
      </div>

      <CardHeader className="relative">
        {/* Project Type Badge */}
        <Badge variant="secondary" className="w-fit mb-2 text-xs">
          {project.typeKey}
        </Badge>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          {project.isLive ? <Globe className="w-5 h-5 text-primary" /> : <Sparkles className="w-5 h-5 text-primary" />}
          {t(project.titleKey)}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative">
        <Button asChild variant={isDemo ? "default" : "secondary"} className="w-full group/btn">
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
            {isDemo ? (isRTL ? 'جرب الآن' : 'Try Now') : t('projects.visit')}
            <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <section id="projects" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {isRTL ? 'أعمالنا ومشاريعنا' : 'Our Work & Projects'}
          </h2>
          <p className="text-lg text-primary font-semibold mb-2">
            {isRTL 
              ? 'موثوق من شركات تستخدم أنظمتنا يومياً' 
              : 'Trusted By Businesses Using Our Systems Daily'}
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isRTL 
              ? 'مشاريع حقيقية تعمل الآن، وعروض تجريبية لتستكشف إمكانياتنا' 
              : 'Live projects running now, and demos to explore our capabilities'}
          </p>
        </div>

        {/* Live Projects */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <h3 className="text-2xl font-bold text-foreground">
              {isRTL ? 'مشاريع فعلية (Live Projects)' : 'Live Projects'}
            </h3>
          </div>
          <p className="text-muted-foreground mb-6 max-w-xl">
            {isRTL 
              ? 'مشاريع تم تنفيذها وتعمل الآن مع عملائنا' 
              : 'Projects delivered and currently running with our clients'}
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {liveProjects.map((project) => (
              <ProjectCard key={project.url} project={project} isDemo={false} />
            ))}
          </div>
        </div>

        {/* Demo Projects */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Play className="w-5 h-5 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">
              {isRTL ? 'عروض تجريبية (Demo Projects)' : 'Demo Projects'}
            </h3>
          </div>
          <p className="text-muted-foreground mb-6 max-w-xl">
            {isRTL 
              ? 'جرب أنظمتنا مباشرة واكتشف الإمكانيات قبل اتخاذ قرارك' 
              : 'Try our systems directly and discover capabilities before deciding'}
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {demoProjects.map((project) => (
              <ProjectCard key={project.url} project={project} isDemo={true} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;