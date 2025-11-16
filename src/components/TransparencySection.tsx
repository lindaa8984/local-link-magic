import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle2 } from "lucide-react";
import transparencyImage from "@/assets/transparency-image.jpg";

export const TransparencySection = () => {
  const { t, language } = useLanguage();

  const items = [
    { amount: '$2,000', key: 'transparency.debt' },
    { amount: '$1,200', key: 'transparency.residency' },
    { amount: '$250', key: 'transparency.development' },
    { amount: '$300', key: 'transparency.hosting' },
    { amount: '$250', key: 'transparency.living' },
  ];

  return (
    <section id="transparency" className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-br from-primary-dark to-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 gradient-mesh"></div>
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className={`text-5xl md:text-6xl font-bold text-center mb-6 md:mb-8 ${language === 'ar' ? 'font-tajawal' : 'font-inter'} animate-fade-in`}>
          {t('transparency.title')}
        </h2>
        <p className={`text-xl md:text-2xl mb-12 md:mb-16 text-center text-primary-foreground/90 ${language === 'ar' ? 'font-tajawal' : 'font-inter'} animate-slide-up`}>
          {t('transparency.intro')}
        </p>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {items.map((item, index) => (
            <div key={index} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-white to-accent rounded-2xl opacity-20 group-hover:opacity-40 blur transition-smooth"></div>
                <Card className="relative p-6 md:p-8 glass-effect backdrop-blur-md hover:bg-white/95 transition-smooth hover:scale-105 shadow-card hover:shadow-hover border-0">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-8 w-8 md:h-10 md:w-10 text-accent flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="text-3xl md:text-4xl font-bold text-primary mb-2 md:mb-3">{item.amount}</div>
                      <p className={`${language === 'ar' ? 'font-tajawal' : 'font-inter'} text-base md:text-xl text-foreground/80`}>
                        {t(item.key)}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
