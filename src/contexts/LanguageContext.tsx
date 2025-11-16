import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ar: {
    // Hero Section
    'hero.title': 'انهض مجددًا لبداية جديدة',
    'hero.subtitle': 'مررت بظروف وضغوط مالية كبيرة، لكنني أعمل بجهد لبناء طريقي من جديد عبر تطوير المواقع والأنظمة.',
    'hero.cta': 'اقرأ قصتي أولًا',
    
    // Story Section
    'story.title': 'قصتي',
    'story.summary': 'كنت أعمل موظفًا ثابتًا قبل أن تتغير حياتي بسبب الحروب والظروف الاقتصادية. فقدت عملي وتراكمت الديون، فانتقلت لبلد آخر لأبدأ من جديد. أعمل الآن في تصميم المواقع والأنظمة، وأسعى لتأسيس مشروع تقني مستدام يمكنني من الاستقلال مجددًا.',
    'story.readMore': 'اقرأ المزيد',
    
    // Project Goal
    'goal.title': 'هدف المشروع',
    'goal.description': 'هدفي إنشاء منصة برمجية متكاملة، وتجديد الإقامة القانونية، وتخفيف الديون التي تعيق عملي.',
    'goal.target': 'الدعم المطلوب: 4000 دولار تشمل تخفيف ضغط الديون وتمويل الاستضافة وتطوير المشروع.',
    
    // Funding Progress
    'funding.title': 'تقدم الدعم',
    'funding.goal': 'الهدف',
    'funding.raised': 'المجموع',
    'funding.progress': 'التقدم',
    'funding.donate': 'تبرع الآن',
    
    // Transparency
    'transparency.title': 'الشفافية',
    'transparency.intro': 'كل مبلغ يُستخدم ضمن الخطة التالية:',
    'transparency.debt': 'لتخفيف ضغط الديون العاجلة',
    'transparency.residency': 'لاستخراج الإقامة القانونية',
    'transparency.development': 'تطوير المنصة البرمجية',
    'transparency.hosting': 'استضافة البريد والمواقع',
    'transparency.living': 'مصاريف معيشة بسيطة',
    
    // Footer
    'footer.rights': '© جميع الحقوق محفوظة',
    'footer.story': 'القصة',
    'footer.transparency': 'الشفافية',
    'footer.contact': 'تواصل',
    
    // Story Page
    'storyPage.title': 'قصتي الكاملة',
    'storyPage.back': 'العودة للصفحة الرئيسية',
    'storyPage.p1': 'كنت موظفًا في شركة كبيرة، حياة مستقرة وراتب ثابت. كل شيء كان يسير على ما يرام حتى بدأت الحروب والصراعات في بلدي. بدأت الشركات بالإغلاق، والاقتصاد ينهار، والفرص تتلاشى.',
    'storyPage.p2': 'فقدت وظيفتي مع مئات الآلاف غيري. لم يكن لدي خيار سوى الاقتراض لتغطية احتياجاتي الأساسية وأسرتي. تراكمت الديون، وأصبحت الحياة أكثر صعوبة يومًا بعد يوم.',
    'storyPage.p3': 'قررت الهجرة إلى بلد آخر أملاً في بداية جديدة. كان القرار صعبًا، لكنه كان الخيار الوحيد المتاح. انتقلت بأقل ما يمكن، وبدأت رحلة البحث عن عمل في بيئة جديدة تمامًا.',
    'storyPage.p4': 'اليوم، أعمل في تطوير المواقع والأنظمة. تعلمت البرمجة بنفسي، وأعمل على بناء مشروعي الخاص - منصة تقنية متكاملة يمكن أن تكون مصدر دخلي المستدام.',
    'storyPage.p5': 'لكن الديون والضغوط المالية لا تزال تعيقني. أحتاج إلى دعم لتجديد إقامتي القانونية، وتمويل تطوير المشروع، وتخفيف بعض الديون العاجلة التي تستنزف جهدي.',
    'storyPage.p6': 'هذا ليس طلب صدقة - إنها فرصة لمساعدتي في الوقوف على قدمي مجددًا. أنا مستعد للعمل الجاد، وكل ما أحتاجه هو دفعة بسيطة لأتمكن من التركيز على بناء مستقبل مستقل.',
  },
  en: {
    // Hero Section
    'hero.title': 'Rise Again to a New Beginning',
    'hero.subtitle': "I've faced tough times and financial pressure, but I'm rebuilding my life through software and web development.",
    'hero.cta': 'Read My Story First',
    
    // Story Section
    'story.title': 'My Story',
    'story.summary': 'I used to have a stable job until conflict and crisis changed everything. I lost my job, moved abroad, and faced growing debts. Now I\'m working on rebuilding my life through developing web and ERP systems to become fully self-reliant again.',
    'story.readMore': 'Read More',
    
    // Project Goal
    'goal.title': 'Project Goal',
    'goal.description': 'My goal is to build a complete tech platform, renew my legal stay, and ease the debts that block my progress.',
    'goal.target': 'The target is $4,000 covering essential debts, hosting, and project development.',
    
    // Funding Progress
    'funding.title': 'Funding Progress',
    'funding.goal': 'Goal',
    'funding.raised': 'Raised',
    'funding.progress': 'Progress',
    'funding.donate': 'Donate Now',
    
    // Transparency
    'transparency.title': 'Transparency',
    'transparency.intro': 'Funds distribution:',
    'transparency.debt': 'to reduce urgent debt pressure',
    'transparency.residency': 'for residency permit application',
    'transparency.development': 'for development platform',
    'transparency.hosting': 'for hosting and emails',
    'transparency.living': 'for basic living costs',
    
    // Footer
    'footer.rights': '© All Rights Reserved',
    'footer.story': 'Story',
    'footer.transparency': 'Transparency',
    'footer.contact': 'Contact',
    
    // Story Page
    'storyPage.title': 'My Full Story',
    'storyPage.back': 'Back to Home',
    'storyPage.p1': 'I was an employee at a large company with a stable life and steady income. Everything was going well until wars and conflicts began in my country. Companies started closing, the economy collapsed, and opportunities vanished.',
    'storyPage.p2': 'I lost my job along with hundreds of thousands of others. I had no choice but to borrow money to cover basic needs for myself and my family. Debts accumulated, and life became harder day by day.',
    'storyPage.p3': 'I decided to migrate to another country hoping for a fresh start. It was a difficult decision, but it was the only option available. I moved with the bare minimum and began the journey of finding work in a completely new environment.',
    'storyPage.p4': 'Today, I work in web and system development. I taught myself programming and am building my own project - a complete tech platform that could be my sustainable income source.',
    'storyPage.p5': 'However, debts and financial pressures still hold me back. I need support to renew my legal residency, fund project development, and ease some urgent debts that drain my energy.',
    'storyPage.p6': 'This is not asking for charity - it\'s an opportunity to help me stand on my feet again. I\'m ready to work hard, and all I need is a small push to focus on building an independent future.',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
