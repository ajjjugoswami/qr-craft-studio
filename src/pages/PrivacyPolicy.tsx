import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect information you provide directly to us, including your name, email address, and any other 
              information you choose to provide when creating an account or using our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns to improve user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">QR Code Analytics</h2>
            <p className="text-muted-foreground">
              When someone scans a QR code created through our platform, we may collect anonymized data such as 
              scan location, device type, and time of scan. This data is used to provide analytics to our users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your personal information against unauthorized 
              access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Data Sharing</h2>
            <p className="text-muted-foreground">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your 
              consent, except as required by law or to provide our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Cookies</h2>
            <p className="text-muted-foreground">
              We use cookies and similar tracking technologies to track activity on our service and hold certain 
              information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Your Rights</h2>
            <p className="text-muted-foreground">
              You have the right to access, update, or delete your personal information at any time through your 
              account settings. You may also request a copy of your data or ask us to delete your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our service is not intended for children under 13. We do not knowingly collect personal information 
              from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the effective date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us through our <Link to="/contact" className="text-primary hover:underline">Contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
