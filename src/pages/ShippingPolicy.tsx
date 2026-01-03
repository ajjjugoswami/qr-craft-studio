import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-foreground mb-8">Shipping Policy</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Digital Product Delivery</h2>
            <p className="text-muted-foreground">
              QR Code Generator is a digital service platform. All our products and services are delivered electronically. 
              There are no physical goods shipped as part of our service offerings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Instant Access</h2>
            <p className="text-muted-foreground">
              Upon successful subscription or purchase, you will receive immediate access to all features included in your 
              chosen plan. Your account will be activated instantly, and you can start creating QR codes right away.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">QR Code Downloads</h2>
            <p className="text-muted-foreground">
              All QR codes generated through our platform can be downloaded instantly in multiple formats including PNG, 
              SVG, and PDF. Downloads are available immediately after QR code generation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Email Confirmations</h2>
            <p className="text-muted-foreground">
              You will receive email confirmations for account creation, subscription purchases, and any changes to your 
              account. Please ensure your email address is correct to receive these important communications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about our delivery process or experience any issues accessing your account, 
              please contact our support team through the <Link to="/contact" className="text-primary hover:underline">Contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
