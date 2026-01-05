import AnimatedSection from "./AnimatedSection";
import FreeQRGenerator from "./FreeQRGenerator";

const GeneratorSection = () => {
  return (
    <section
      id="generator"
      className="py-10 md:py-12 lg:py-16 bg-muted/20 border-y border-border/50"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight">
              Create Your QR Code
            </h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              No signup required. Generate and download your QR code
              instantly.
            </p>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={150}>
          <FreeQRGenerator />
        </AnimatedSection>
      </div>
    </section>
  );
};

export default GeneratorSection;
