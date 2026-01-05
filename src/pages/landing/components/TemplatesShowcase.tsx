import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layers, ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import Marquee from "./Marquee";
import LandingQRCode from "./LandingQRCode";
import { LANDING_LOGOS } from "./LandingLogos";

const templates = [
  {
    name: "Business",
    qrColor: "#1e293b",
    dotType: "classy-rounded" as const,
    logo: LANDING_LOGOS.business,
  },
  {
    name: "Restaurant",
    qrColor: "#d97706",
    dotType: "rounded" as const,
    logo: LANDING_LOGOS.restaurant,
  },
  {
    name: "Events",
    qrColor: "#9333ea",
    dotType: "dots" as const,
    logo: LANDING_LOGOS.events,
  },
  {
    name: "Social",
    qrColor: "#25D366",
    dotType: "extra-rounded" as const,
    logo: LANDING_LOGOS.social,
  },
  {
    name: "Luxury",
    qrColor: "#b45309",
    dotType: "classy" as const,
    logo: LANDING_LOGOS.luxury,
  },
  {
    name: "Tech",
    qrColor: "#0891b2",
    dotType: "square" as const,
    logo: LANDING_LOGOS.tech,
  },
  {
    name: "Instagram",
    qrColor: "#E1306C",
    dotType: "rounded" as const,
    logo: LANDING_LOGOS.instagram,
  },
  {
    name: "YouTube",
    qrColor: "#FF0000",
    dotType: "extra-rounded" as const,
    logo: LANDING_LOGOS.youtube,
  },
  {
    name: "LinkedIn",
    qrColor: "#0A66C2",
    dotType: "classy-rounded" as const,
    logo: LANDING_LOGOS.linkedin,
  },
  {
    name: "X (Twitter)",
    qrColor: "#000000",
    dotType: "rounded" as const,
    logo: LANDING_LOGOS.twitter,
  },
  {
    name: "Facebook",
    qrColor: "#1877F2",
    dotType: "dots" as const,
    logo: LANDING_LOGOS.facebook,
  },
  {
    name: "Spotify",
    qrColor: "#1DB954",
    dotType: "extra-rounded" as const,
    logo: LANDING_LOGOS.spotify,
  },
];

const TemplateCard = ({ template }: { template: typeof templates[0] }) => (
  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 min-w-[120px]">
    <div className="rounded-lg overflow-hidden shadow-md">
      <LandingQRCode
        data="https://qrstudio.app"
        color={template.qrColor}
        size={90}
        dotType={template.dotType}
        cornerSquareType="extra-rounded"
        cornerDotType="dot"
        logo={template.logo}
      />
    </div>
    <span className="text-xs font-medium text-muted-foreground">
      {template.name}
    </span>
  </div>
);

const TemplatesShowcase = () => {
  return (
    <section className="py-10 md:py-12 lg:py-16 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center gap-1.5 bg-muted text-foreground/70 px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
              <Layers className="h-3 w-3" />
              <span>100+ Templates</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">
              Professional Templates for
              <span className="text-primary"> Every Industry</span>
            </h2>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto">
              Choose from our curated collection of stunning QR code templates
              designed for restaurants, events, business cards, and more.
            </p>
          </div>
        </AnimatedSection>
      </div>

      <AnimatedSection delay={150}>
        <Marquee speed={30} pauseOnHover>
          {templates.map((template, index) => (
            <TemplateCard key={index} template={template} />
          ))}
        </Marquee>
      </AnimatedSection>

      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection delay={300}>
          <div className="text-center mt-8">
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
