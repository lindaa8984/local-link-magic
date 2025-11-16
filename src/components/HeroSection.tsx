import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/hero-image.jpg";

export const HeroSection = () => {
  const { t, language } = useLanguage();

  const scrollToStory = () => {
    const storySection = document.getElementById('story');
    storySection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden gradient-mesh">
      <div className="absolute inset-0 opacity-30">
        <img src={heroImage} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <h1 className={`text-5xl md:text-7xl font-bold mb-8 text-foreground ${language === 'ar' ? 'font-tajawal' : 'font-inter'} drop-shadow-lg animate-fade-in`}>
          {t('hero.title')}
        </h1>
        <p className={`text-xl md:text-3xl text-foreground/80 mb-12 max-w-4xl mx-auto leading-relaxed ${language === 'ar' ? 'font-tajawal' : 'font-inter'} drop-shadow animate-slide-up`}>
          {t('hero.subtitle')}
        </p>
        <Button size="lg" className="text-xl md:text-2xl px-12 md:px-16 py-8 md:py-10 shadow-elegant hover:shadow-hover hover:scale-105 transition-smooth animate-scale-in" onClick={scrollToStory}>
          {t('hero.cta')}
        </Button>
      </div>
    </section>
  );
};
