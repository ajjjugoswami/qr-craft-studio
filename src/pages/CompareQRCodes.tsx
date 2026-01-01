import React from "react";
import { Card, Typography } from "antd";
import { GitCompare } from "lucide-react";
import { useQRCodes } from "@/hooks/useQRCodes";
import CompareQRCodes from "@/components/analytics/CompareQRCodes";
import DashboardLayout from "@/components/layout/DashboardLayout";

const { Title } = Typography;

const CompareQRCodesPage: React.FC = () => {
  const { qrCodes, loading } = useQRCodes();

  return (
    <DashboardLayout>
      <CompareQRCodes qrCodes={qrCodes} loading={loading} />
    </DashboardLayout>
  );
};

export default CompareQRCodesPage;
