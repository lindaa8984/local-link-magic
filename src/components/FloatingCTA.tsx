import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

const FloatingCTA = () => {
  const { isRTL } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  const whatsappNumber = '601172411121';

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling past hero section (about 500px)
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="container mx-auto max-w-lg pointer-events-auto">
        <div className="flex gap-3 bg-background/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-border/50">
          <Button
            asChild
            size="lg"
            className="flex-1 text-base py-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
          >
            <a href="#contact" className="flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              {isRTL ? 'اطلب استشارة مجانية' : 'Get Free Consultation'}
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white py-6 px-6 shadow-lg"
          >
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FloatingCTA;