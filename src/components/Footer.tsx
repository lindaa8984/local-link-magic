import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { LanguageToggle } from "./LanguageToggle";

export const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-foreground text-background py-8 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 gradient-mesh"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className={`text-sm ${language === 'ar' ? 'font-tajawal' : 'font-inter'}`}>
            Rise Again {t('footer.rights')}
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="flex items-center gap-6">
              <Link to="/story" className={`text-sm hover:text-primary transition-smooth ${language === 'ar' ? 'font-tajawal' : 'font-inter'}`}>
                {t('footer.story')}
              </Link>
              <Link to="/#transparency" className={`text-sm hover:text-primary transition-smooth ${language === 'ar' ? 'font-tajawal' : 'font-inter'}`}>
                {t('footer.transparency')}
              </Link>
              <a href="mailto:info@getup.mozharsite.store" className={`text-sm hover:text-primary transition-smooth ${language === 'ar' ? 'font-tajawal' : 'font-inter'}`}>
                {t('footer.contact')}
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a href="mailto:info@getup.mozharsite.store" className={`text-sm text-primary hover:text-primary/80 transition-smooth ${language === 'ar' ? 'font-tajawal' : 'font-inter'}`}>
                info@getup.mozharsite.store
              </a>
              <LanguageToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
