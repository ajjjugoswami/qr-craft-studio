import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Building2, Globe, Check } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const features = [
  "Custom domain support",
  "Remove QR Studio branding",
  "Your logo everywhere",
  "Branded scan pages",
];

const WhiteLabelSection = () => {
  return (
    <section className="py-10 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center max-w-5xl mx-auto">
          {/* Left: Visual */}
          <AnimatedSection>
            <Card className="p-5 bg-muted/30">
              <div className="space-y-4">
                {/* Brand customization preview */}
                <div className="bg-background rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold">Your Brand Name</div>
                      <div className="text-[10px] text-muted-foreground">
                        yourcompany.com
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-6 rounded bg-primary/30" />
                    <div className="h-6 rounded bg-primary/50" />
                    <div className="h-6 rounded bg-primary" />
                  </div>
                </div>

                {/* Custom domain */}
                <div className="bg-background rounded-lg p-3 border border-primary/50">
                  <div className="text-[10px] text-primary mb-1.5 flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Custom Domain
                  </div>
                  <div className="text-xs font-mono bg-primary/10 px-2 py-1.5 rounded text-primary">
                    qr.yourcompany.com
                  </div>
                </div>
              </div>
            </Card>
          </AnimatedSection>

          {/* Right: Content */}
          <AnimatedSection delay={200}>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-muted text-foreground/70 px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
                <Building2 className="h-3 w-3" />
                <span>White Label</span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight">
                Your Brand,
                <span className="text-primary"> Your Platform</span>
              </h2>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Remove all QR Studio branding and make it completely yours.
                Perfect for agencies and enterprises.
              </p>

              <ul className="space-y-2 mb-5">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-xs">
                    <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-primary" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/signup">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  Explore White Label
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default WhiteLabelSection;
