import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const CTASection = () => {
  return (
    <section className="py-10 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection>
          <Card className="max-w-2xl mx-auto p-6 md:p-8 text-center bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">
              Ready to Create Your First QR Code?
            </h2>
            <p className="text-xs text-muted-foreground mb-5 max-w-md mx-auto">
              Start for free today. No credit card required. Upgrade anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 justify-center px-4 sm:px-0">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="gap-1.5 text-xs w-full sm:w-auto h-11 sm:h-9"
                >
                  Get Started Free
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
              <a href="#generator" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-xs w-full sm:w-auto h-11 sm:h-9"
                >
                  Try Generator First
                </Button>
              </a>
            </div>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CTASection;
