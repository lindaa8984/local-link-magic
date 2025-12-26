import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t, isRTL } = useLanguage();
  const currentYear = new Date().getFullYear();
  const whatsappNumber = '601172411121';
  const email = 'info@azlinda.com';

  return (
    <footer className="py-12 bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <a href="#" className="inline-block mb-4">
              <img src="/azlinda-logo.png" alt="AZLINDA" className="h-16" />
            </a>
            <p className="text-muted-foreground text-sm">
              {isRTL 
                ? 'نقدم حلول برمجية متكاملة لإدارة أعمالك بكفاءة'
                : 'Complete software solutions for efficient business management'
              }
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              {isRTL ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#demos" className="text-muted-foreground hover:text-primary transition-colors">{isRTL ? 'العروض التجريبية' : 'Demos'}</a></li>
              <li><a href="#services" className="text-muted-foreground hover:text-primary transition-colors">{isRTL ? 'الخدمات' : 'Services'}</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">{isRTL ? 'اتصل بنا' : 'Contact'}</a></li>
              <li><Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">{isRTL ? 'شروط الخدمة' : 'Terms of Service'}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              {isRTL ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-green-500 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span dir="ltr">+60 117 241 1121</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-4 h-4" />
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Meta Services for SEO */}
        <div className="text-center text-xs text-muted-foreground mb-6">
          {isRTL 
            ? 'تطوير برمجيات مخصصة | أنظمة نقاط البيع | حلول المحاسبة والتتبع'
            : 'Custom Software Development | POS Systems | Accounting & Tracking Solutions'}
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <span>© {currentYear}</span>
            <span>{t('footer.rights')}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Heart className="w-4 h-4 text-red-500" />
            <span>{t('footer.dev')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
