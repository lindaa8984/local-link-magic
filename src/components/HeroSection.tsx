import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowDown, Award, Users, Briefcase } from 'lucide-react';
import { Button } from './ui/button';
import heroImage from '@/assets/hero-software.jpg';

const HeroSection = () => {
  const { t, isRTL } = useLanguage();

  const trustStats = [
    { 
      icon: Briefcase, 
      value: '50+', 
      label: isRTL ? 'مشروع منجز' : 'Projects Done' 
    },
    { 
      icon: Users, 
      value: '100+', 
      label: isRTL ? 'عميل سعيد' : 'Happy Clients' 
    },
    { 
      icon: Award, 
      value: '5+', 
      label: isRTL ? 'سنوات خبرة' : 'Years Experience' 
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image - Clear and Professional */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Software Development" 
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
        {/* Lighter overlay to show more of the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm text-primary px-4 py-2 rounded-full mb-6 animate-fade-in border border-primary/20">
            <Award className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {isRTL ? '+5 سنوات خبرة في تطوير البرمجيات' : '5+ Years of Software Development'}
            </span>
          </div>

          {/* Main Heading - Clear value proposition */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {isRTL ? 'أنظمة إدارية مخصصة لعملك' : 'Custom Management Systems Built for Your Business'}
          </h1>

          {/* Value Proposition Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground font-normal mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.15s' }}>
            {isRTL 
              ? 'للشركات التي تحتاج تحكماً حقيقياً، وليس برامج جاهزة عامة.' 
              : 'Built for businesses that need real control, not generic software.'}
          </p>

          {/* Trust Stats - Mobile visible */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {trustStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3 bg-card/60 backdrop-blur-sm px-5 py-3 rounded-xl border border-border/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-start">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button - Single prominent button */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" asChild className="text-lg px-10 py-7 shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all">
              <a href="#contact">{isRTL ? 'احصل على استشارة مجانية' : 'Get Free Consultation'}</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </section>
  );
};

export default HeroSection;