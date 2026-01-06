import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import AnimatedSection from "./AnimatedSection";
import Marquee from "./Marquee";

const stats = [
  { value: "5K+", label: "QR Codes Created" },
  { value: "2K+", label: "Happy Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

const HeroSection = () => {
  const isMobile = useIsMobile();

  return (
    <section className="relative pt-40 pb-6 md:pt-36 md:pb-12 lg:pt-40 lg:pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge - Hide on mobile to save space */}
          <AnimatedSection>
            <div className="hidden sm:inline-flex items-center gap-2 bg-muted/80 border border-border text-foreground/80 px-3 py-1.5 rounded-full text-xs font-medium mb-4 md:mb-5">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              Trusted by many businesses worldwide
            </div>
          </AnimatedSection>

          {/* Main Headline - Smaller on mobile */}
          <AnimatedSection delay={100}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-2 sm:mb-3 md:mb-4 leading-[1.15]">
              Create Stunning
              <span className="block text-primary">QR Codes in Seconds</span>
            </h1>
          </AnimatedSection>

          {/* Subheadline - Shorter on mobile */}
          <AnimatedSection delay={200}>
            <p className="text-sm md:text-sm text-muted-foreground max-w-xl mx-auto mb-4 sm:mb-6 md:mb-8 leading-relaxed px-2">
              <span className="sm:hidden">Create beautiful, trackable QR codes with custom designs.</span>
              <span className="hidden sm:inline">Design beautiful, trackable QR codes with custom colors, logos, and templates. Perfect for marketing, events, and business.</span>
            </p>
          </AnimatedSection>

          {/* CTA Buttons - Compact on mobile */}
          <AnimatedSection delay={300}>
            <div className="flex flex-col gap-2 px-4 sm:px-0 sm:flex-row sm:gap-2 justify-center mb-6 sm:mb-8 md:mb-10">
              <a href="#generator" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="px-6 gap-2 group w-full sm:w-auto text-sm h-10 sm:h-10"
                >
                  Create Free QR Code
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </a>
              <Link to="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-6 gap-2 w-full sm:w-auto text-sm h-10 sm:h-10"
                >
                  <Play className="h-4 w-4" />
                  See How It Works
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          {/* Stats */}
          <AnimatedSection delay={400}>
            {isMobile ? (
              /* Mobile: Marquee */
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />
                <Marquee speed={25} className="py-2">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 shrink-0"
                    >
                      <span className="text-lg font-semibold text-foreground">
                        {stat.value}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </Marquee>
              </div>
            ) : (
              /* Desktop: Grid */
              <div className="grid grid-cols-4 gap-4 max-w-xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xl md:text-2xl font-semibold text-foreground mb-0.5">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
