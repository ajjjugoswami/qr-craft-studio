import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Palette, Image, Layers, Sparkles } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const customizationOptions = [
  { icon: <Palette className="h-4 w-4" />, label: "Custom Colors" },
  { icon: <Image className="h-4 w-4" />, label: "Logo Upload" },
  { icon: <Layers className="h-4 w-4" />, label: "Pattern Styles" },
  { icon: <Sparkles className="h-4 w-4" />, label: "Frame Options" },
];

const colorPalette = [
  "#000000",
  "#3b82f6",
  "#10b981",
  "#f97316",
  "#ec4899",
  "#8b5cf6",
  "#06b6d4",
  "#ef4444",
];

const patterns = ["Square", "Dots", "Rounded", "Classy"];

const CustomizationSection = () => {
  return (
    <section className="py-10 md:py-12 lg:py-16 bg-muted/20 border-y border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center max-w-5xl mx-auto">
          {/* Left: Content */}
          <AnimatedSection className="order-2 lg:order-1">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-muted text-foreground/70 px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
                <Palette className="h-3 w-3" />
                <span>Full Customization</span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight">
                Make It Uniquely
                <span className="text-primary"> Yours</span>
              </h2>
              <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                Customize every aspect of your QR codes with colors, patterns,
                logos, and frames. Match your brand perfectly.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {customizationOptions.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs group cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105">
                      {item.icon}
                    </div>
                    <span className="group-hover:text-foreground transition-colors">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/signup">
                <Button size="sm" className="gap-1.5 text-xs group">
                  Start Customizing
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          {/* Right: Visual */}
          <AnimatedSection delay={200} className="order-1 lg:order-2">
            <Card className="p-5 bg-background">
              <div className="space-y-4">
                {/* Color palette */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-[10px] text-muted-foreground mb-3">
                    Color Palette
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {colorPalette.map((color, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-110 hover:ring-2 hover:ring-offset-2 hover:ring-primary ${
                          i === 1 ? "ring-2 ring-offset-2 ring-primary" : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Pattern preview */}
                <div className="grid grid-cols-4 gap-2">
                  {patterns.map((pattern, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-lg text-center cursor-pointer transition-all hover:scale-105 ${
                        i === 2
                          ? "bg-primary/10 border border-primary"
                          : "bg-muted/50 border border-transparent hover:border-border"
                      }`}
                    >
                      <div className="w-8 h-8 mx-auto mb-1 bg-foreground/20 rounded" />
                      <span className="text-[9px]">{pattern}</span>
                    </div>
                  ))}
                </div>

                {/* Logo preview */}
                <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary/30 transition-all hover:border-primary cursor-pointer">
                    <Image className="h-5 w-5 text-primary/50" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium">Add Your Logo</div>
                    <div className="text-[10px] text-muted-foreground">
                      Upload PNG, JPG, or SVG
                    </div>
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

export default CustomizationSection;
