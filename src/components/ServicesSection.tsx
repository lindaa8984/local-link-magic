import { useLanguage } from '@/contexts/LanguageContext';
import { Building2, ArrowRightLeft, Calculator, Truck, Settings, Palette, MessageCircle, ShoppingCart, Monitor } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const services = [
  {
    titleKey: 'service1.title',
    descKey: 'service1.desc',
    icon: Building2,
    color: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    titleKey: 'service2.title',
    descKey: 'service2.desc',
    icon: ArrowRightLeft,
    color: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    titleKey: 'service3.title',
    descKey: 'service3.desc',
    icon: Calculator,
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    titleKey: 'service4.title',
    descKey: 'service4.desc',
    icon: Truck,
    color: 'from-teal-500/20 to-cyan-500/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
  },
  {
    titleKey: 'service5.title',
    descKey: 'service5.desc',
    icon: Settings,
    color: 'from-purple-500/20 to-violet-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    titleKey: 'service6.title',
    descKey: 'service6.desc',
    icon: Palette,
    color: 'from-pink-500/20 to-rose-500/20',
    iconColor: 'text-pink-600 dark:text-pink-400',
  },
  {
    titleKey: 'service7.title',
    descKey: 'service7.desc',
    icon: ShoppingCart,
    color: 'from-indigo-500/20 to-blue-500/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    titleKey: 'service8.title',
    descKey: 'service8.desc',
    icon: Monitor,
    color: 'from-cyan-500/20 to-teal-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
];

const ServicesSection = () => {
  const { t, isRTL } = useLanguage();

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('services.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            {t('services.subtitle')}
          </p>
          <p className="text-primary font-semibold">
            {isRTL ? 'الأنظمة الأساسية التي نبنيها غالباً' : 'Core Systems We Build Most Often'}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={service.titleKey} 
                className="group relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 text-center"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <CardHeader className="relative pb-2">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-8 h-8 ${service.iconColor}`} />
                  </div>
                  <CardTitle className="text-lg font-bold">{t(service.titleKey)}</CardTitle>
                </CardHeader>

                <CardContent className="relative">
                  <CardDescription className="text-sm leading-relaxed">
                    {t(service.descKey)}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={scrollToContact}
            className="group gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            {t('services.cta')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
