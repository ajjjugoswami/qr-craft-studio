import { Card } from "@/components/ui/card";
import { Sparkles, Target, Palette, Download } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const steps = [
  {
    step: "01",
    icon: <Target className="h-5 w-5" />,
    title: "Choose Your Type",
    description:
      "Select from 12 QR code types including URL, vCard, WiFi, social media, and more.",
  },
  {
    step: "02",
    icon: <Palette className="h-5 w-5" />,
    title: "Customize Design",
    description:
      "Add your logo, pick colors, choose patterns, and apply professional templates.",
  },
  {
    step: "03",
    icon: <Download className="h-5 w-5" />,
    title: "Download & Track",
    description:
      "Export in PNG, WEBP and JPG. Track every scan with real-time analytics.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-10 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center gap-1.5 bg-muted text-foreground/70 px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
              <Sparkles className="h-3 w-3" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">
              Create QR Codes in 3 Easy Steps
            </h2>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto">
              From idea to scannable code in under a minute
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {steps.map((item, index) => (
            <AnimatedSection key={index} delay={index * 100}>
              <Card className="p-5 text-center relative group hover:shadow-md transition-all duration-200 h-full">
                <div className="absolute top-3 right-3 text-[10px] font-bold text-muted-foreground/50">
                  {item.step}
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-sm mb-1.5">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
