import { Card } from "@/components/ui/card";
import {
  Crown,
  Lock,
  Image,
  Palette,
  BarChart3,
  Zap,
  Shield,
  Clock,
} from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const premiumFeatures = [
  {
    icon: <Image className="h-6 w-6" />,
    title: "Logo Upload",
    description: "Brand your QR codes with custom logos",
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: "50+ Templates",
    description: "Professional designs for every use case",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Advanced Analytics",
    description: "Track scans, locations & devices",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Dynamic QR Codes",
    description: "Update destination anytime",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Password Protection",
    description: "Secure access to your content",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Expiration Control",
    description: "Set dates and scan limits",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-10 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-1.5 bg-muted text-foreground/70 px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
              <Crown className="h-3 w-3" />
              <span>Pro Features</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">
              Professional Tools for
              <span className="text-primary"> Better Results</span>
            </h2>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto">
              Unlock advanced tools to create, track, and optimize your QR
              code campaigns.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {premiumFeatures.map((feature, index) => (
            <AnimatedSection key={index} delay={index * 50}>
              <Card className="p-4 relative group hover:shadow-md transition-shadow duration-200 border-border/80 h-full">
                <div className="absolute top-3 right-3 bg-muted text-muted-foreground text-[9px] font-medium px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <Lock className="h-2 w-2" />
                  Pro
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3 transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
