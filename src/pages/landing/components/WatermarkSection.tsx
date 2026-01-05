import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Stamp, QrCode, Check } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const features = [
  "Custom text watermark",
  "Upload your own logo watermark",
  "Remove watermark completely",
  "Position & style control",
];

const WatermarkSection = () => {
  return (
    <section className="py-10 md:py-12 lg:py-16 bg-muted/20 border-y border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center max-w-5xl mx-auto">
          {/* Left: Content */}
          <AnimatedSection className="order-2 lg:order-1">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-muted text-foreground/70 px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
                <Stamp className="h-3 w-3" />
                <span>Custom Watermark</span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight">
                Add Your Signature
                <span className="text-primary"> To Every QR Code</span>
              </h2>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Customize or remove the watermark on your QR codes. Add your
                company name, tagline, or remove it entirely.
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
                <Button size="sm" className="gap-1.5 text-xs">
                  Customize Watermark
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          {/* Right: Visual */}
          <AnimatedSection delay={200} className="order-1 lg:order-2">
            <Card className="p-5 bg-background">
              <div className="space-y-3">
                {/* QR with watermark comparison */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="bg-muted/50 rounded-lg p-4 mb-2 relative">
                      <QrCode className="h-16 w-16 mx-auto text-foreground/30" />
                      <div className="absolute bottom-2 left-0 right-0 text-center">
                        <span className="text-[8px] text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded">
                          QR Studio
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Default
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary/5 rounded-lg p-4 mb-2 border border-primary/30 relative">
                      <QrCode className="h-16 w-16 mx-auto text-primary/50" />
                      <div className="absolute bottom-2 left-0 right-0 text-center">
                        <span className="text-[8px] text-primary bg-primary/10 px-1.5 py-0.5 rounded font-medium">
                          Your Brand
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-primary font-medium">
                      Custom
                    </span>
                  </div>
                </div>

                {/* Options preview */}
                <div className="flex items-center justify-center gap-2 pt-2 border-t border-border">
                  <div className="bg-muted rounded px-2 py-1 text-[9px]">Text</div>
                  <div className="bg-muted rounded px-2 py-1 text-[9px]">Logo</div>
                  <div className="bg-primary/10 text-primary rounded px-2 py-1 text-[9px] font-medium">
                    None
                  </div>
                </div>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default WatermarkSection;
