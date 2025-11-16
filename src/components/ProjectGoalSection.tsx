import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import goalImage from "@/assets/goal-image.jpg";

export const ProjectGoalSection = () => {
  const { t, language } = useLanguage();

  return (
    <section id="goal" className="min-h-screen flex items-center justify-center py-20 px-4 gradient-mesh relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-left">
            <h2 className={`text-5xl md:text-6xl font-bold text-foreground mb-8 ${language === 'ar' ? 'font-tajawal' : 'font-inter'}`}>
              {t('goal.title')}
            </h2>
            <p className={`text-lg md:text-xl leading-relaxed mb-8 text-muted-foreground ${language === 'ar' ? 'font-tajawal' : 'font-inter'}`}>
              {t('goal.description')}
            </p>
            <div className="relative group">
              <div className="absolute -inset-1 gradient-primary rounded-2xl opacity-50 group-hover:opacity-75 blur transition-smooth"></div>
              <div className="relative p-6 md:p-8 glass-effect rounded-2xl border-l-8 border-primary shadow-card hover:shadow-hover transition-smooth">
                <p className={`text-xl md:text-2xl font-bold text-primary ${language === 'ar' ? 'font-tajawal' : 'font-inter'}`}>
                  {t('goal.target')}
                </p>
              </div>
            </div>
          </div>
          <div className="animate-slide-in-right">
            <div className="relative group">
              <div className="absolute -inset-1 gradient-secondary rounded-2xl opacity-25 group-hover:opacity-40 blur transition-smooth"></div>
              <img src={goalImage} alt="Goal illustration" className="relative rounded-2xl shadow-card group-hover:shadow-hover transition-smooth" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
