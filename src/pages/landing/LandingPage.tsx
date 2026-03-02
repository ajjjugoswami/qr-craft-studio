import Header from "./components/Header";
import TrialBanner from "./components/TrialBanner";
import HeroSection from "./components/HeroSection";
import GeneratorSection from "./components/GeneratorSection";
import HowItWorks from "./components/HowItWorks";
import AnalyticsShowcase from "./components/AnalyticsShowcase";
import WhiteLabelSection from "./components/WhiteLabelSection";
import WatermarkSection from "./components/WatermarkSection";
import QRTypesSection from "./components/QRTypesSection";
import FeaturesSection from "./components/FeaturesSection";
import SecuritySection from "./components/SecuritySection";
import TemplatesShowcase from "./components/TemplatesShowcase";
import UseCasesSection from "./components/UseCasesSection";
import CustomizationSection from "./components/CustomizationSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import SEOHead from "@/components/SEOHead";

const landingStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "QR Studio",
    "description": "Professional QR code generator with custom designs, templates, analytics, and branding. Create QR codes for URLs, vCards, WiFi, social media and more.",
    "url": "https://qr-craft-studio.vercel.app/",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "QR Studio" },
    "featureList": [
      "Custom QR Code Design",
      "Multiple QR Code Types (URL, vCard, WiFi, SMS, Email)",
      "Real-time Analytics & Scan Tracking",
      "White Label & Branding Options",
      "Password Protected QR Codes",
      "High Resolution Export (PNG, WEBP, JPG)",
      "Professional Templates",
      "Real-time Preview"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "QR Studio",
    "url": "https://qr-craft-studio.vercel.app/",
    "logo": "https://qr-craft-studio.vercel.app/logo.png",
    "sameAs": []
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What types of QR codes can I create?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can create QR codes for URLs, vCards, text, WiFi networks, emails, phone numbers, locations, and social media profiles."
        }
      },
      {
        "@type": "Question",
        "name": "Can I customize my QR code appearance?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Choose from professional templates, customize colors, add your logo, adjust patterns, and apply frames to create branded QR codes."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer QR code analytics?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, premium users get detailed analytics including scan counts, geographic locations, device statistics, and time-based heatmaps."
        }
      },
      {
        "@type": "Question",
        "name": "Is QR Studio free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, QR Studio offers a free tier to create and download QR codes. Premium plans unlock advanced features like analytics, white labeling, and unlimited QR codes."
        }
      }
    ]
  }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEOHead
        title="QR Studio - Professional QR Code Generator | Create Custom QR Codes"
        description="Create beautiful, customizable QR codes for URLs, vCards, WiFi, social media and more. Professional QR code generator with templates, analytics, branding & white label options. Free to use."
        path="/"
        structuredData={landingStructuredData}
      />
      {/* Subtle background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-muted rounded-full blur-[80px]" />
      </div>

      <Header />
      <TrialBanner />
      <HeroSection />
      <GeneratorSection />
      <HowItWorks />
      <AnalyticsShowcase />
      <WhiteLabelSection />
      <WatermarkSection />
      <QRTypesSection />
      <FeaturesSection />
      <SecuritySection />
      <TemplatesShowcase />
      <UseCasesSection />
      <CustomizationSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
