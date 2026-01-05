import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layers, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import AnimatedSection from "./AnimatedSection";
import MobileCarousel from "./MobileCarousel";
import LandingQRCode from "./LandingQRCode";

const categories = [
  {
    name: "Business",
    bgColor: "from-slate-800 to-slate-900",
    qrColor: "#94a3b8",
    dotType: "classy-rounded" as const,
  },
  {
    name: "Restaurant",
    bgColor: "from-amber-700 to-amber-900",
    qrColor: "#fbbf24",
    dotType: "rounded" as const,
  },
  {
    name: "Events",
    bgColor: "from-purple-600 to-fuchsia-700",
    qrColor: "#e879f9",
    dotType: "dots" as const,
  },
  {
    name: "Social",
    bgColor: "from-pink-500 to-rose-600",
    qrColor: "#fda4af",
    dotType: "extra-rounded" as const,
  },
  {
    name: "Luxury",
    bgColor: "from-amber-500 to-yellow-600",
    qrColor: "#fef3c7",
    dotType: "classy" as const,
  },
  {
    name: "Tech",
    bgColor: "from-cyan-500 to-blue-600",
    qrColor: "#a5f3fc",
    dotType: "square" as const,
  },
];

const TemplateCard = ({ category }: { category: typeof categories[0] }) => (
  <div
    className={`bg-gradient-to-br ${category.bgColor} rounded-xl p-5 text-center aspect-[4/3] flex flex-col items-center justify-center h-full shadow-lg hover:shadow-xl transition-shadow duration-300`}
  >
    <div className="mb-3">
      <LandingQRCode
        data="https://qrstudio.app"
        color={category.qrColor}
        size={70}
        dotType={category.dotType}
        cornerSquareType="extra-rounded"
        cornerDotType="dot"
      />
    </div>
    <span className="text-xs font-semibold text-white/90">
      {category.name}
    </span>
  </div>
);

const TemplatesShowcase = () => {
  const isMobile = useIsMobile();

  return (
    <section className="py-10 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-1.5 bg-muted text-foreground/70 px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
              <Layers className="h-3 w-3" />
              <span>100+ Templates</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">
              Professional Templates for
              <span className="text-primary"> Every Industry</span>
            </h2>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto">
              Choose from our curated collection of stunning QR code card
              templates designed for restaurants, events, business cards, and
              more.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={150}>
          {isMobile ? (
            <MobileCarousel itemClassName="basis-1/2 min-w-[140px]">
              {categories.map((category, index) => (
                <TemplateCard key={index} category={category} />
              ))}
            </MobileCarousel>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto mb-6">
              {categories.map((category, index) => (
                <TemplateCard key={index} category={category} />
              ))}
            </div>
          )}
        </AnimatedSection>

        <AnimatedSection delay={300}>
          <div className="text-center mt-6">
            <Link to="/signup">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                Browse All Templates
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default TemplatesShowcase;
