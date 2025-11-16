import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Story = () => {
  const { t, language } = useLanguage();

  const paragraphs = [
    'storyPage.p1',
    'storyPage.p2',
    'storyPage.p3',
    'storyPage.p4',
    'storyPage.p5',
    'storyPage.p6',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="py-16 px-4 bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <Link to="/">
              <Button variant="ghost" className="mb-8 gap-2">
                {language === 'ar' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                {t('storyPage.back')}
              </Button>
            </Link>
            
            <h1 className={`text-4xl md:text-5xl font-bold mb-8 text-foreground ${language === 'ar' ? 'font-tajawal' : 'font-inter'}`}>
              {t('storyPage.title')}
            </h1>

            <Card className="p-8 md:p-12 shadow-lg">
              <div className="space-y-6">
                {paragraphs.map((key, index) => (
                  <p 
                    key={index} 
                    className={`text-lg leading-relaxed text-foreground/90 ${language === 'ar' ? 'font-tajawal' : 'font-inter'}`}
                  >
                    {t(key)}
                  </p>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-border">
                <a href="https://www.paypal.com/ncp/payment/446XTQG7FHVA2" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                    {t('funding.donate')}
                  </Button>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Story;
