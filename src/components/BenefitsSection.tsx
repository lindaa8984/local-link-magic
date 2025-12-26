import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3, Clock, Headphones, MapPin, Zap, Cloud } from 'lucide-react';

const benefits = [
  { icon: Zap, titleKey: 'benefit2.title', descKey: 'benefit2.desc', color: 'text-yellow-500' },
  { icon: MapPin, titleKey: 'benefit3.title', descKey: 'benefit3.desc', color: 'text-blue-500' },
  { icon: BarChart3, titleKey: 'benefit4.title', descKey: 'benefit4.desc', color: 'text-purple-500' },
  { icon: Clock, titleKey: 'benefit5.title', descKey: 'benefit5.desc', color: 'text-pink-500' },
  { icon: Headphones, titleKey: 'benefit6.title', descKey: 'benefit6.desc', color: 'text-cyan-500' },
  { icon: Cloud, titleKey: 'benefit7.title', descKey: 'benefit7.desc', color: 'text-emerald-500' },
];

const BenefitsSection = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section id="benefits" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('benefits.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('benefits.subtitle')}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.titleKey}
              className="group p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className={`w-7 h-7 ${benefit.color}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-2">
                {t(benefit.titleKey)}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t(benefit.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
