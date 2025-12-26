import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Header
    'nav.demos': 'العروض التجريبية',
    'nav.services': 'خدماتنا',
    'nav.projects': 'أعمالنا',
    'nav.benefits': 'المميزات',
    'nav.contact': 'تواصل معنا',
    
    // Hero
    'hero.title': 'حلول برمجية متكاملة',
    'hero.subtitle': 'نصمم وننفذ أنظمة إدارية وبرمجيات مخصصة حسب احتياجات عملك، من تتبع الشحنات إلى إدارة العقارات والحسابات',
    'hero.cta': 'جرب الآن',
    'hero.contact': 'تواصل معنا',
    
    // Demos
    'demos.title': 'العروض التجريبية',
    'demos.subtitle': 'جرب أنظمتنا مباشرة واكتشف الإمكانيات',
    'demos.try': 'جرب الآن',
    'demo1.title': 'نظام الكاشير',
    'demo1.desc': 'نظام نقاط بيع متكامل لإدارة المبيعات والمخزون والفواتير مع واجهة سهلة الاستخدام',
    'demo2.title': 'نموذج متجر إلكتروني',
    'demo2.desc': 'قالب متجر إلكتروني جاهز للتخصيص حسب هويتك البصرية. نقوم بتركيبه وتعديله ليتناسب مع علامتك التجارية',
    
    // Services
    'services.title': 'برامج مخصصة حسب الطلب',
    'services.subtitle': 'نطور برامج وأنظمة إدارية متكاملة تناسب احتياجات عملك الخاصة. من الفكرة إلى التنفيذ، نحن شريكك التقني',
    'services.cta': 'تواصل معنا للاستفسار',
    'service1.title': 'إدارة العقارات والعقود',
    'service1.desc': 'نظام متكامل لإدارة العقارات، العقود، الإيجارات، المستأجرين، والتقارير المالية',
    'service2.title': 'التحويلات المالية',
    'service2.desc': 'نظام صرافة وتحويلات مالية مع إدارة الأرصدة والعملات المتعددة',
    'service3.title': 'نظام الحسابات',
    'service3.desc': 'برنامج محاسبي متكامل للفواتير، المصروفات، والتقارير المالية',
    'service4.title': 'نظام تتبع الشحنات',
    'service4.desc': 'نظام متكامل لتتبع الشحنات مع لوحة تحكم تفاعلية وتقارير مفصلة',
    'service5.title': 'برمجيات مخصصة',
    'service5.desc': 'تطوير أنظمة وتطبيقات حسب متطلباتك الخاصة بالكامل',
    'service6.title': 'تصميم المواقع',
    'service6.desc': 'تصميم وتطوير مواقع احترافية متجاوبة مع جميع الأجهزة',
    'service7.title': 'متاجر إلكترونية',
    'service7.desc': 'إنشاء وتطوير متاجر إلكترونية متكاملة مع بوابات الدفع وإدارة المنتجات',
    'service8.title': 'تطبيقات الويب وسطح المكتب',
    'service8.desc': 'تطوير تطبيقات ويب وسطح مكتب احترافية تعمل على جميع الأنظمة',
    
    // Projects
    'projects.title': 'أعمال حقيقية',
    'projects.subtitle': 'مشاريع تم تنفيذها وتعمل الآن',
    'projects.visit': 'زيارة الموقع',
    'project1.title': 'الماس للتغليف',
    'project1.desc': 'نظام إدارة متكامل لشركة تغليف مع تتبع الطلبات والمخزون',
    'project2.title': 'الأقصى للإلكترونيات',
    'project2.desc': 'نظام إدارة المبيعات والمخزون لمتجر إلكترونيات',
    
    // Benefits
    'benefits.title': 'لماذا تختار أنظمتنا؟',
    'benefits.subtitle': 'حلول مصممة لتسهيل عملك وزيادة إنتاجيتك',
    'benefit1.title': 'تكامل مع Google Sheets',
    'benefit1.desc': 'إدارة البيانات بسهولة من خلال جداول Google المألوفة',
    'benefit2.title': 'قرارات دقيقة دائماً',
    'benefit2.desc': 'بيانات محدثة لحظياً تساعدك على اتخاذ قرارات صائبة',
    'benefit3.title': 'تخصيص كامل',
    'benefit3.desc': 'نخصص النظام حسب هويتك البصرية واحتياجات عملك',
    'benefit4.title': 'اعرف عملك بنقرة واحدة',
    'benefit4.desc': 'تقارير شاملة وتحليلات فورية لفهم أداء عملك',
    'benefit5.title': 'سهولة الاستخدام',
    'benefit5.desc': 'واجهة بسيطة لا تحتاج خبرة تقنية',
    'benefit6.title': 'دعم فني متواصل',
    'benefit6.desc': 'فريق دعم متاح لمساعدتك في أي وقت',
    'benefit7.title': 'أمان كامل للبيانات',
    'benefit7.desc': 'حماية تلقائية ونسخ احتياطي مستمر لجميع بياناتك',
    
    // Contact
    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'نحن هنا لمساعدتك في بناء نظامك المثالي',
    'contact.name': 'الاسم',
    'contact.email': 'البريد الإلكتروني',
    'contact.message': 'رسالتك',
    'contact.send': 'إرسال',
    'contact.whatsapp': 'تواصل عبر واتساب',
    
    // Footer
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.dev': 'تطوير AZLINDA',
  },
  en: {
    // Header
    'nav.demos': 'Demos',
    'nav.services': 'Services',
    'nav.projects': 'Projects',
    'nav.benefits': 'Benefits',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.title': 'Complete Software Solutions',
    'hero.subtitle': 'We design and develop custom management systems tailored to your business needs, from shipment tracking to real estate and accounting',
    'hero.cta': 'Try Now',
    'hero.contact': 'Contact Us',
    
    // Demos
    'demos.title': 'Live Demos',
    'demos.subtitle': 'Try our systems directly and discover the possibilities',
    'demos.try': 'Try Now',
    'demo1.title': 'POS System',
    'demo1.desc': 'Complete point of sale system for managing sales, inventory, and invoices with an easy-to-use interface',
    'demo2.title': 'E-Commerce Store Template',
    'demo2.desc': 'Ready-to-customize online store template. We install and tailor it to match your brand identity and visual style',
    
    // Services
    'services.title': 'Custom Software Solutions',
    'services.subtitle': 'We develop integrated software and management systems tailored to your specific business needs. From concept to execution, we are your tech partner',
    'services.cta': 'Contact Us for Inquiry',
    'service1.title': 'Real Estate Management',
    'service1.desc': 'Complete system for managing properties, contracts, rentals, tenants, and financial reports',
    'service2.title': 'Money Transfer System',
    'service2.desc': 'Exchange and money transfer system with multi-currency balance management',
    'service3.title': 'Accounting System',
    'service3.desc': 'Complete accounting software for invoices, expenses, and financial reports',
    'service4.title': 'Shipment Tracking',
    'service4.desc': 'Complete shipment tracking system with interactive dashboard and detailed reports',
    'service5.title': 'Custom Software',
    'service5.desc': 'Development of systems and applications fully tailored to your specific requirements',
    'service6.title': 'Website Design',
    'service6.desc': 'Professional responsive website design and development for all devices',
    'service7.title': 'E-Commerce Stores',
    'service7.desc': 'Build complete online stores with payment gateways and product management',
    'service8.title': 'Web & Desktop Apps',
    'service8.desc': 'Professional web and desktop application development for all platforms',
    
    // Projects
    'projects.title': 'Real Projects',
    'projects.subtitle': 'Successfully delivered and running projects',
    'projects.visit': 'Visit Website',
    'project1.title': 'Almas Pack',
    'project1.desc': 'Complete management system for packaging company with order and inventory tracking',
    'project2.title': 'Al-Aqsa Electronics',
    'project2.desc': 'Sales and inventory management system for electronics store',
    
    // Benefits
    'benefits.title': 'Why Choose Our Systems?',
    'benefits.subtitle': 'Solutions designed to simplify your work and boost productivity',
    'benefit1.title': 'Google Sheets Integration',
    'benefit1.desc': 'Manage data easily through familiar Google Sheets',
    'benefit2.title': 'Always Accurate Decisions',
    'benefit2.desc': 'Real-time data sync means no delays, no conflicts — always informed',
    'benefit3.title': 'Full Customization',
    'benefit3.desc': 'We customize the system to match your brand and business needs',
    'benefit4.title': 'Know Your Business in One Click',
    'benefit4.desc': 'Comprehensive analytics and instant reports to understand your performance',
    'benefit5.title': 'Easy to Use',
    'benefit5.desc': 'Simple interface, no technical experience needed',
    'benefit6.title': 'Continuous Support',
    'benefit6.desc': 'Support team available to help anytime',
    'benefit7.title': 'Total Data Security',
    'benefit7.desc': 'Automatic backups and full protection for all your business data',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': "We're here to help you build your ideal system",
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send',
    'contact.whatsapp': 'Chat on WhatsApp',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.dev': 'Developed by AZLINDA',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Detect browser/device language
    const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
    // Check if Arabic (ar, ar-SA, ar-EG, etc.)
    if (browserLang.startsWith('ar')) {
      return 'ar';
    }
    // Default to English for all other languages
    return 'en';
  });

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
