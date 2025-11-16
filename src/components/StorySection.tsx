import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import storyImage from "@/assets/story-image.jpg";

export const StorySection = () => {
  const { t, language } = useLanguage();

  return (
    <section id="story" className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-b from-background to-muted relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 animate-slide-in-left">
            <div className="relative group">
              <div className="absolute -inset-1 gradient-primary rounded-2xl opacity-25 group-hover:opacity-40 blur transition-smooth"></div>
              <img src={storyImage} alt="Journey illustration" className="relative rounded-2xl shadow-card group-hover:shadow-hover transition-smooth" />
            </div>
          </div>
          <div className="order-1 md:order-2 animate-slide-in-right">
            <h2 className={`text-5xl md:text-6xl font-bold text-foreground mb-8 ${language === 'ar' ? 'font-tajawal' : 'font-inter'}`}>
              {t('story.title')}
            </h2>
            <p className={`text-lg md:text-xl leading-relaxed mb-10 text-muted-foreground ${language === 'ar' ? 'font-tajawal' : 'font-inter'}`}>
              {t('story.summary')}
            </p>
            <Link to="/story">
              <Button variant="default" size="lg" className="text-lg md:text-xl px-10 md:px-12 py-6 md:py-8 shadow-card hover:shadow-hover hover:scale-105 transition-smooth">
                {t('story.readMore')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
