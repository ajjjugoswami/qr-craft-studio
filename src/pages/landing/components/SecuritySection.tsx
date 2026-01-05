import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Shield, Lock, Clock, Check } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const features = [
  "Password-protect your QR codes",
  "Set expiration dates",
  "Limit number of scans",
  "Disable anytime",
];

const SecuritySection = () => {
  return (
    <section className="py-10 md:py-12 lg:py-16 bg-muted/20 border-y border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center max-w-5xl mx-auto">
          {/* Left: Content */}
          <AnimatedSection>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-muted text-foreground/70 px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
                <Shield className="h-3 w-3" />
                <span>Security & Control</span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight">
                Full Control Over
                <span className="text-primary"> Your QR Codes</span>
              </h2>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Protect your content with passwords, set expiration dates, and
                limit the number of scans. You're always in control.
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
                  Secure Your QR Codes
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          {/* Right: Visual */}
          <AnimatedSection delay={200}>
            <Card className="p-5 bg-background">
              <div className="space-y-4">
                {/* Password protection mock */}
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold">
                      Password Protected
                    </span>
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-border">
                    <div className="text-[10px] text-muted-foreground mb-2">
                      Enter password to continue
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-8 bg-muted rounded-md border border-border" />
                      <div className="h-8 px-3 bg-primary rounded-md flex items-center">
                        <span className="text-[10px] text-primary-foreground font-medium">
                          Unlock
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expiration indicator */}
                <div className="flex items-center justify-between bg-background rounded-lg p-3 border border-border">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">Expires in</span>
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    7 days
                  </span>
                </div>

                {/* Scan limit */}
                <div className="bg-background rounded-lg p-3 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs">Scan Limit</span>
                    <span className="text-xs font-semibold">45/100</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[45%] bg-primary rounded-full" />
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

export default SecuritySection;
