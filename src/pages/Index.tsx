import { useEffect } from 'react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import WorkSection from '@/components/WorkSection';
import ServicesSection from '@/components/ServicesSection';
import BenefitsSection from '@/components/BenefitsSection';
import FinalCTASection from '@/components/FinalCTASection';
import SEOSection from '@/components/SEOSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import FloatingCTA from '@/components/FloatingCTA';
import { Helmet } from 'react-helmet-async';

const PageContent = () => {
  const { isRTL, language } = useLanguage();

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRTL, language]);

  return (
    <>
      <Helmet>
        <title>{isRTL ? 'AZLINDA - نبني أفكارك رقمياً' : 'AZLINDA - Ideas. Built Digitally'}</title>
        <meta 
          name="description" 
          content={isRTL 
            ? 'AZLINDA - نبني أنظمة إدارية مخصصة للشركات الصغيرة والمتوسطة: تتبع شحنات، إدارة عقارات، نقاط بيع، ومحاسبة. +5 سنوات خبرة، +50 مشروع منجز.'
            : 'AZLINDA - Custom management systems for SMEs: shipment tracking, real estate, POS, and accounting. 5+ years experience, 50+ projects delivered.'
          } 
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <WorkSection />
          <ServicesSection />
          <BenefitsSection />
          <FinalCTASection />
          <ContactSection />
          <SEOSection />
        </main>
        <Footer />
        <FloatingWhatsApp />
        <FloatingCTA />
      </div>
    </>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <PageContent />
    </LanguageProvider>
  );
};

export default Index;