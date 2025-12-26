import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Shield, FileText, Scale, AlertCircle, CreditCard, Ban, RefreshCw, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";

const TermsContent = () => {
  const { language, toggleLanguage, isRTL } = useLanguage();

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
    window.scrollTo(0, 0);
  }, [isRTL, language]);

  const content = {
    ar: {
      pageTitle: "شروط الخدمة | AZLINDA",
      pageDesc: "شروط وأحكام استخدام خدمات AZLINDA - اقرأ شروطنا بعناية قبل استخدام خدماتنا",
      backHome: "العودة للرئيسية",
      companyName: "AZLINDA",
      badge: "الشروط والأحكام",
      title: "شروط الخدمة",
      subtitle: "يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا. استخدامك لخدماتنا يعني موافقتك على هذه الشروط.",
      lastUpdate: "آخر تحديث:",
      questionsTitle: "هل لديك أسئلة؟",
      questionsDesc: "إذا كانت لديك أي استفسارات حول شروط الخدمة، لا تتردد في التواصل معنا",
      contactUs: "تواصل معنا",
      copyright: "AZLINDA. جميع الحقوق محفوظة.",
      sections: [
        {
          icon: FileText,
          title: "مقدمة",
          content: `مرحباً بكم في AZLINDA. باستخدامك لخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. يرجى قراءتها بعناية قبل استخدام أي من خدماتنا.

هذه الشروط تمثل اتفاقية ملزمة قانونياً بينك وبين شركة AZLINDA. نحتفظ بالحق في تعديل هذه الشروط في أي وقت، وسيتم إخطارك بأي تغييرات جوهرية.`
        },
        {
          icon: Shield,
          title: "الخدمات المقدمة",
          content: `نقدم مجموعة متنوعة من الخدمات الرقمية تشمل:

• تطوير المواقع الإلكترونية والتطبيقات
• أنظمة إدارة المبيعات ونقاط البيع (POS)
• أنظمة إدارة المخزون والمستودعات
• حلول التجارة الإلكترونية
• خدمات الاستضافة والدعم الفني

جميع الخدمات تخضع للشروط المحددة في العقد الخاص بكل مشروع.`
        },
        {
          icon: CreditCard,
          title: "الدفع والفوترة",
          content: `• جميع الأسعار المعروضة بالدولار الأمريكي ما لم يُذكر خلاف ذلك
• يجب دفع مقدم 50% قبل بدء العمل على أي مشروع
• الدفعة المتبقية مستحقة عند اكتمال المشروع وقبل التسليم النهائي
• في حالة الاشتراكات الشهرية، يتم الدفع مقدماً في بداية كل دورة فوترة
• التأخر في الدفع قد يؤدي إلى تعليق الخدمات
• جميع المدفوعات غير قابلة للاسترداد بعد بدء العمل على المشروع
• التصور الأولي والنموذج الأولي (Prototype) يُعتبران بداية فعلية للعمل ويتم احتسابهما ضمن التكلفة
• رسوم التصور الأولي والنموذج غير قابلة للاسترداد لأنها تمثل جهداً فكرياً وتقنياً حقيقياً`
        },
        {
          icon: RefreshCw,
          title: "سياسة الاسترداد والإلغاء",
          content: `• يمكن استرداد المبلغ كاملاً إذا تم الإلغاء قبل بدء العمل على المشروع
• بعد بدء العمل، يتم خصم قيمة العمل المنجز من أي مبلغ مسترد
• بعد اكتمال 50% من المشروع، لا يحق للعميل استرداد أي مبالغ
• في حالة الاشتراكات الشهرية، يجب إخطارنا قبل 30 يوماً من الإلغاء
• لا يتم استرداد مبالغ الاستضافة والنطاقات بعد تفعيلها
• التعديلات على المشروع المكتمل تخضع لرسوم إضافية`
        },
        {
          icon: Scale,
          title: "حقوق الملكية الفكرية",
          content: `• تظل جميع حقوق الملكية الفكرية للمنتج النهائي ملكاً للعميل بعد السداد الكامل
• نحتفظ بحق عرض المشروع في معرض أعمالنا ما لم يُتفق على خلاف ذلك
• الأكواد والمكتبات المطورة خصيصاً للعميل تنتقل ملكيتها بالكامل
• المكتبات والأدوات مفتوحة المصدر المستخدمة تخضع لتراخيصها الأصلية
• يحظر على العميل إعادة بيع أو توزيع الكود المصدري دون موافقة كتابية`
        },
        {
          icon: AlertCircle,
          title: "إخلاء المسؤولية",
          content: `• نبذل قصارى جهدنا لتقديم خدمات عالية الجودة، لكننا لا نضمن نتائج تجارية محددة
• لسنا مسؤولين عن أي خسائر ناتجة عن انقطاع الخدمة أو الأخطاء التقنية
• العميل مسؤول عن النسخ الاحتياطي لبياناته
• لسنا مسؤولين عن المحتوى الذي يضيفه العميل إلى موقعه
• مسؤوليتنا القصوى لا تتجاوز قيمة المبالغ المدفوعة مقابل الخدمة
• لا نتحمل مسؤولية أي أضرار غير مباشرة أو تبعية`
        },
        {
          icon: Ban,
          title: "الاستخدام المحظور",
          content: `يُحظر استخدام خدماتنا في:

• أي نشاط غير قانوني أو احتيالي
• انتهاك حقوق الملكية الفكرية للآخرين
• نشر محتوى ضار أو مسيء أو تمييزي
• محاولة اختراق أو تعطيل أنظمتنا
• إرسال رسائل غير مرغوب فيها (Spam)
• أي نشاط يضر بسمعة الشركة

نحتفظ بحق إنهاء الخدمة فوراً في حالة انتهاك هذه الشروط.`
        }
      ]
    },
    en: {
      pageTitle: "Terms of Service | AZLINDA",
      pageDesc: "Terms and conditions for using AZLINDA services - Please read carefully before using our services",
      backHome: "Back to Home",
      companyName: "AZLINDA",
      badge: "Terms & Conditions",
      title: "Terms of Service",
      subtitle: "Please read these terms carefully before using our services. By using our services, you agree to these terms.",
      lastUpdate: "Last updated:",
      questionsTitle: "Have Questions?",
      questionsDesc: "If you have any questions about our terms of service, feel free to contact us",
      contactUs: "Contact Us",
      copyright: "AZLINDA. All rights reserved.",
      sections: [
        {
          icon: FileText,
          title: "Introduction",
          content: `Welcome to AZLINDA. By using our services, you agree to comply with these terms and conditions. Please read them carefully before using any of our services.

These terms represent a legally binding agreement between you and AZLINDA. We reserve the right to modify these terms at any time, and you will be notified of any material changes.`
        },
        {
          icon: Shield,
          title: "Services Provided",
          content: `We offer a variety of digital services including:

• Website and application development
• Sales management and POS systems
• Inventory and warehouse management systems
• E-commerce solutions
• Hosting and technical support services

All services are subject to the terms specified in each project's contract.`
        },
        {
          icon: CreditCard,
          title: "Payment and Billing",
          content: `• All prices are displayed in US Dollars unless otherwise stated
• A 50% deposit is required before work begins on any project
• The remaining payment is due upon project completion and before final delivery
• For monthly subscriptions, payment is due in advance at the beginning of each billing cycle
• Late payment may result in suspension of services
• All payments are non-refundable after work has begun on the project
• Initial concept design and prototype are considered the actual start of work and are included in the cost
• Initial concept and prototype fees are non-refundable as they represent real intellectual and technical effort`
        },
        {
          icon: RefreshCw,
          title: "Refund and Cancellation Policy",
          content: `• Full refund is available if cancelled before work begins on the project
• After work begins, the value of completed work will be deducted from any refund
• After 50% of the project is complete, the client is not entitled to any refund
• For monthly subscriptions, 30 days notice is required before cancellation
• Hosting and domain fees are non-refundable after activation
• Modifications to completed projects are subject to additional fees`
        },
        {
          icon: Scale,
          title: "Intellectual Property Rights",
          content: `• All intellectual property rights to the final product belong to the client after full payment
• We reserve the right to display the project in our portfolio unless otherwise agreed
• Custom code and libraries developed for the client transfer ownership completely
• Open-source libraries and tools used are subject to their original licenses
• The client is prohibited from reselling or distributing the source code without written consent`
        },
        {
          icon: AlertCircle,
          title: "Disclaimer",
          content: `• We do our best to provide high-quality services, but we do not guarantee specific business results
• We are not responsible for any losses resulting from service interruption or technical errors
• The client is responsible for backing up their data
• We are not responsible for content added by the client to their website
• Our maximum liability does not exceed the amounts paid for the service
• We are not liable for any indirect or consequential damages`
        },
        {
          icon: Ban,
          title: "Prohibited Use",
          content: `Use of our services is prohibited for:

• Any illegal or fraudulent activity
• Violation of others' intellectual property rights
• Publishing harmful, offensive, or discriminatory content
• Attempting to hack or disrupt our systems
• Sending spam messages
• Any activity that harms the company's reputation

We reserve the right to terminate service immediately in case of violation of these terms.`
        }
      ]
    }
  };

  const t = content[language];
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <>
      <Helmet>
        <title>{t.pageTitle}</title>
        <meta name="description" content={t.pageDesc} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-gradient-to-l from-primary/10 via-primary/5 to-background border-b border-border/50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <ArrowIcon className="h-5 w-5" />
                <span>{t.backHome}</span>
              </Link>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleLanguage}
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  {language === 'ar' ? 'English' : 'عربي'}
                </Button>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Scale className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-bold text-xl text-foreground">{t.companyName}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t.badge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.subtitle}
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              {t.lastUpdate} {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              {t.sections.map((section, index) => (
                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <section.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                          {index + 1}. {section.title}
                        </h2>
                        <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {section.content}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Contact Section */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6 md:p-8 text-center">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    {t.questionsTitle}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {t.questionsDesc}
                  </p>
                  <Button asChild>
                    <Link to="/#contact">
                      {t.contactUs}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border/50 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {t.copyright}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

const TermsOfService = () => {
  return (
    <LanguageProvider>
      <TermsContent />
    </LanguageProvider>
  );
};

export default TermsOfService;
