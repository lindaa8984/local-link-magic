import { LanguageToggle } from "./LanguageToggle";
import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Header = () => {
  const { language } = useLanguage();

  return (
    <header className="sticky top-0 z-50 glass-effect backdrop-blur-md border-b border-border/50 py-4 px-4 shadow-card transition-smooth">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <Sprout className="h-6 w-6 text-accent group-hover:text-accent/80 transition-smooth group-hover:rotate-12" />
          <span className={`text-xl font-bold text-foreground group-hover:text-primary transition-smooth ${language === 'ar' ? 'font-tajawal' : 'font-inter'}`}>
            Rise Again
          </span>
        </Link>
        <LanguageToggle />
      </div>
    </header>
  );
};
