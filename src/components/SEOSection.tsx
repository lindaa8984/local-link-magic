import { useLanguage } from '@/contexts/LanguageContext';

const SEOSection = () => {
  const { isRTL } = useLanguage();

  return (
    <section className="py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground leading-relaxed text-center">
            {isRTL 
              ? 'بصفتنا خبراء في تطوير البرمجيات المخصصة، تقدم AZLINDA أنظمة إدارة عالية الأداء مصممة لكفاءة الأعمال. نحن متخصصون في بناء أنظمة نقاط بيع آمنة، وحلول تتبع الشحنات، وبرامج المحاسبة التي تساعد الشركات الصغيرة والمتوسطة على أتمتة سير عملها. تطبيقات الويب القابلة للتوسع لدينا تضمن أن عملك جاهز للنمو.'
              : 'As experts in custom software development, AZLINDA provides high-performance management systems tailored for business efficiency. We specialize in building secure POS systems, shipment tracking solutions, and accounting software that help SMEs automate their workflow. Our scalable web applications ensure your business is ready for growth.'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SEOSection;
