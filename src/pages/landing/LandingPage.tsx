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

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
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
