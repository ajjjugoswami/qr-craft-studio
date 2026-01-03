import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CancellationsAndRefunds = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-foreground mb-8">Cancellations and Refunds</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Subscription Cancellation</h2>
            <p className="text-muted-foreground">
              You may cancel your subscription at any time through your account settings. Upon cancellation, you will 
              continue to have access to your paid features until the end of your current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Refund Policy</h2>
            <p className="text-muted-foreground">
              We offer a 7-day money-back guarantee for new subscriptions. If you are not satisfied with our service, 
              you may request a full refund within 7 days of your initial purchase.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">How to Request a Refund</h2>
            <p className="text-muted-foreground">
              To request a refund, please contact our support team through the <Link to="/contact" className="text-primary hover:underline">Contact page</Link> with 
              your account email and reason for the refund request. We will process your request within 5-7 business days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Non-Refundable Items</h2>
            <p className="text-muted-foreground">
              The following are not eligible for refunds:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Subscriptions after the 7-day refund period</li>
              <li>Partial month usage</li>
              <li>Add-on purchases or one-time credits</li>
              <li>Accounts terminated for Terms of Service violations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Refund Processing</h2>
            <p className="text-muted-foreground">
              Approved refunds will be credited to your original payment method within 5-10 business days, depending 
              on your payment provider's processing time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Plan Downgrades</h2>
            <p className="text-muted-foreground">
              If you downgrade your plan, the change will take effect at the start of your next billing cycle. 
              No prorated refunds are provided for downgrades.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Questions?</h2>
            <p className="text-muted-foreground">
              If you have any questions about our cancellation or refund policies, please reach out through our <Link to="/contact" className="text-primary hover:underline">Contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CancellationsAndRefunds;
