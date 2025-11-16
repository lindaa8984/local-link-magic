import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";

export const FundingProgressSection = () => {
  const { t, language } = useLanguage();
  
  const goal = 4000;
  const raised = 30;
  const progress = (raised / goal) * 100;

  return (
    <section id="funding" className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-b from-muted to-background">
      <div className="max-w-5xl mx-auto w-full">
        <h2 className={`text-5xl md:text-7xl font-bold text-center mb-16 md:mb-20 text-foreground ${language === 'ar' ? 'font-tajawal' : 'font-inter'} animate-fade-in`}>
          {t('funding.title')}
        </h2>
        <div className="relative group animate-scale-in">
          <div className="absolute -inset-1 gradient-primary rounded-3xl opacity-30 group-hover:opacity-50 blur-lg transition-smooth"></div>
          <Card className="relative p-8 md:p-16 shadow-card hover:shadow-hover transition-smooth border-0 bg-card/95 backdrop-blur-sm rounded-3xl">
            <div className="grid md:grid-cols-3 gap-6 md:gap-10 mb-12 md:mb-16">
              <div className="text-center p-6 md:p-10 gradient-primary rounded-2xl shadow-card transform hover:scale-105 hover:shadow-hover transition-smooth">
                <p className={`text-base md:text-xl text-primary-foreground/90 mb-3 md:mb-4 ${language === 'ar' ? 'font-tajawal' : 'font-inter'}`}>
                  {t('funding.goal')}
                </p>
                <p className={`text-4xl md:text-6xl font-bold text-primary-foreground ${language === 'ar' ? 'font-tajawal' : 'font-inter'}`}>
                  ${goal.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-6 md:p-10 gradient-secondary rounded-2xl shadow-card transform hover:scale-105 hover:shadow-hover transition-smooth">
                <p className={`text-base md:text-xl text-secondary-foreground/90 mb-3 md:mb-4 ${language === 'ar' ? 'font-tajawal' : 'font-inter'}`}>
                  {t('funding.raised')}
                </p>
                <p className={`text-4xl md:text-6xl font-bold text-secondary-foreground ${language === 'ar' ? 'font-tajawal' : 'font-inter'}`}>
                  ${raised.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-6 md:p-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-card transform hover:scale-105 hover:shadow-hover transition-smooth">
                <p className={`text-base md:text-xl text-white/90 mb-3 md:mb-4 ${language === 'ar' ? 'font-tajawal' : 'font-inter'}`}>
                  {t('funding.progress')}
                </p>
                <p className={`text-4xl md:text-6xl font-bold text-white ${language === 'ar' ? 'font-tajawal' : 'font-inter'}`}>
                  {progress.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="mb-12 md:mb-16">
              <Progress value={progress} className="h-6 md:h-8 shadow-inner rounded-full" />
            </div>
            <a href="https://www.paypal.com/ncp/payment/446XTQG7FHVA2" target="_blank" rel="noopener noreferrer" className="block w-full">
              <Button size="lg" className="w-full text-xl md:text-3xl py-10 md:py-14 shadow-card hover:shadow-elegant hover:scale-105 transition-smooth bg-gradient-to-r from-primary to-primary-glow rounded-2xl font-bold">
                {t('funding.donate')}
              </Button>
            </a>
          </Card>
        </div>
      </div>
    </section>
  );
};
