import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from './ui/button';
import { MessageCircle } from 'lucide-react';

const FinalCTASection = () => {
  const { isRTL } = useLanguage();

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            {isRTL 
              ? 'هل أنت مستعد لاستبدال الفوضى وجداول البيانات بنظام حقيقي؟' 
              : 'Ready to replace spreadsheets and chaos with a real system?'}
          </h2>
          <Button 
            size="lg" 
            onClick={scrollToContact}
            className="group gap-2 text-lg px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            {isRTL ? 'احصل على استشارة مجانية' : 'Get Free Consultation'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;