import { Card } from "@/components/ui/card";
import { Target, Building2, Users, CreditCard, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import AnimatedSection from "./AnimatedSection";
import MobileCarousel from "./MobileCarousel";

const useCases = [
  {
    icon: <Building2 className="h-5 w-5" />,
    title: "Restaurants",
    description: "Digital menus, table ordering, WiFi access, and reviews",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Events",
    description: "Ticketing, check-ins, schedules, and networking",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    title: "Retail",
    description: "Product info, promotions, loyalty programs, and payments",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: "Marketing",
    description: "Campaigns, lead capture, social media, and analytics",
    color: "bg-green-500/10 text-green-500",
  },
];

const UseCaseCard = ({ useCase }: { useCase: typeof useCases[0] }) => (
  <Card className="p-4 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
    <div
      className={`h-10 w-10 rounded-xl ${useCase.color} flex items-center justify-center mb-3 transition-transform group-hover:scale-110`}
    >
      {useCase.icon}
    </div>
    <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
      {useCase.title}
    </h3>
    <p className="text-[11px] text-muted-foreground leading-relaxed">
      {useCase.description}
    </p>
  </Card>
);

const UseCasesSection = () => {
  const isMobile = useIsMobile();

  return (
    <section className="py-10 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-1.5 bg-muted text-foreground/70 px-2.5 py-1 rounded-full text-[10px] font-medium mb-3">
              <Target className="h-3 w-3" />
              <span>Use Cases</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">
              Perfect for Every
              <span className="text-primary"> Business Need</span>
            </h2>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto">
              See how businesses across industries use QR Studio to connect
              with their customers.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={150}>
          {isMobile ? (
            <MobileCarousel itemClassName="basis-[75%] min-w-[250px]">
              {useCases.map((useCase, index) => (
                <UseCaseCard key={index} useCase={useCase} />
              ))}
            </MobileCarousel>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {useCases.map((useCase, index) => (
                <UseCaseCard key={index} useCase={useCase} />
              ))}
            </div>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
};

export default UseCasesSection;
