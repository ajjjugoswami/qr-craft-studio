import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-foreground mb-8">Terms and Conditions</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using QR Code Generator, you accept and agree to be bound by the terms and provisions 
              of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Use of Service</h2>
            <p className="text-muted-foreground">
              You agree to use our service only for lawful purposes and in accordance with these Terms. You are 
              responsible for ensuring that your use of the service complies with all applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Account Registration</h2>
            <p className="text-muted-foreground">
              To access certain features, you must register for an account. You are responsible for maintaining the 
              confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content, features, and functionality of our service are owned by QR Code Generator and are protected 
              by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. User Content</h2>
            <p className="text-muted-foreground">
              You retain ownership of any content you create using our service. However, you grant us a license to 
              store and process your content as necessary to provide our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Prohibited Uses</h2>
            <p className="text-muted-foreground">
              You may not use our service for any illegal or unauthorized purpose, to transmit malware, to infringe 
              on intellectual property rights, or to harass or harm others.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              QR Code Generator shall not be liable for any indirect, incidental, special, consequential, or punitive 
              damages resulting from your use or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. We will notify users of any material changes 
              via email or through our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact</h2>
            <p className="text-muted-foreground">
              For questions about these Terms, please contact us through our <Link to="/contact" className="text-primary hover:underline">Contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
