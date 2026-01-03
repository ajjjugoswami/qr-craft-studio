import React from 'react';
import { Home, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PricingPlans from '@/components/payment/PricingPlans';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Home size={16} />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-2">
                <CreditCard size={16} />
                Pricing
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground">
            Upgrade your QR code experience with advanced features, unlimited scans, 
            and powerful analytics. Choose the plan that fits your needs.
          </p>
        </div>

        {/* Pricing Plans */}
        <PricingPlans />
      </div>
    </DashboardLayout>
  );
};

export default PricingPage;
