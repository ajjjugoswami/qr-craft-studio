import React, { useEffect } from 'react';
import { 
  Card, 
  Badge, 
  Button, 
  Table, 
  Typography, 
  Alert,
  Modal,
  Divider
} from 'antd';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  RefreshCw
} from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';
import type { PaymentHistory } from '@/types/payment';
import LogoLoader from '@/components/common/LogoLoader';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatCurrency } from '@/utils/currencyFormatter';

const { Title, Text } = Typography;

interface SubscriptionManagementProps {
  showPaymentHistory?: boolean;
}

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({
  showPaymentHistory = true
}) => {
  const isMobile = useIsMobile();
  const {
    subscription,
    paymentHistory,
    loading,
    subscriptionLoading,
    cancelSubscription,
    fetchPaymentHistory,
    refreshSubscriptionFeatures,
    downloadInvoice
  } = usePayment();

  useEffect(() => {
    if (showPaymentHistory) {
      fetchPaymentHistory();
    }
  }, [fetchPaymentHistory, showPaymentHistory]);

  const handleCancelSubscription = () => {
    Modal.confirm({
      title: 'Cancel Subscription',
      content: 'Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.',
      okText: 'Yes, Cancel',
      okType: 'danger',
      cancelText: 'Keep Subscription',
      onOk: async () => {
        await cancelSubscription();
      }
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { status: 'success' | 'error' | 'warning' | 'default', icon: React.ReactNode }> = {
      active: { status: 'success', icon: <CheckCircle className="w-3.5 h-3.5" /> },
      expired: { status: 'error', icon: <XCircle className="w-3.5 h-3.5" /> },
      cancelled: { status: 'warning', icon: <AlertCircle className="w-3.5 h-3.5" /> },
      inactive: { status: 'default', icon: <XCircle className="w-3.5 h-3.5" /> }
    };

    const config = statusConfig[status] || statusConfig.inactive;
    
    return (
      <span className="inline-flex items-center gap-1.5 text-sm">
        {config.icon}
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const formatPrice = (amount: number) => {
    return formatCurrency(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const paymentColumns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (orderId: string) => (
        <Text copyable={{ text: orderId }} className="font-mono text-xs">
          {orderId.slice(-8)}...
        </Text>
      )
    },
    {
      title: 'Plan',
      dataIndex: 'planType',
      key: 'planType',
      render: (planType: string) => (
        <span className="capitalize text-sm">{planType}</span>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span className="font-medium text-sm">{formatPrice(amount)}</span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig: Record<string, { color: 'success' | 'processing' | 'error' | 'warning', text: string }> = {
          paid: { color: 'success', text: 'Paid' },
          created: { color: 'processing', text: 'Pending' },
          failed: { color: 'error', text: 'Failed' },
          refunded: { color: 'warning', text: 'Refunded' }
        };
        const config = statusConfig[status] || { color: 'default' as const, text: status };
        return <Badge status={config.color} text={<span className="text-sm">{config.text}</span>} />;
      }
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <span className="text-sm text-muted-foreground">{formatDate(date)}</span>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: PaymentHistory) => (
        record.status === 'paid' ? (
          <Button 
            size="small" 
            type="text"
            icon={<Download className="w-4 h-4" />}
            onClick={() => downloadInvoice(record._id)}
            className="!text-muted-foreground hover:!text-foreground"
          >
            Invoice
          </Button>
        ) : null
      )
    }
  ];

  if (subscriptionLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <LogoLoader size="sm" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <Alert
        message="Subscription not found"
        description="Unable to load your subscription details. Please try again."
        type="error"
        showIcon
      />
    );
  }

  const isFreePlan = subscription.planType === 'free';
  const isExpiredSoon = subscription.endDate && 
    new Date(subscription.endDate).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Current Subscription */}
      <Card 
        title={
          <span className="text-sm sm:text-base font-semibold text-foreground">Current Subscription</span>
        }
        extra={
          <span className="flex items-center gap-1.5 text-muted-foreground text-xs sm:text-sm">
            <CreditCard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Subscription Details</span>
          </span>
        }
        className="!bg-card !border-border"
        styles={{ header: { borderBottom: '1px solid hsl(var(--border))' }, body: { padding: isMobile ? '12px' : '20px' } }}
      >
        {isExpiredSoon && subscription.status === 'active' && (
          <Alert
            message="Subscription Expiring Soon"
            description={`Your subscription will expire on ${formatDate(subscription.endDate!)}`}
            type="warning"
            showIcon
            className="mb-4"
          />
        )}

        {/* Mobile-friendly subscription details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-muted/50 rounded-lg p-2.5 sm:p-3">
            <Text type="secondary" className="text-[10px] sm:text-xs block mb-0.5">Plan Type</Text>
            <Text className="font-medium capitalize text-sm sm:text-base">{subscription.planType}</Text>
          </div>
          <div className="bg-muted/50 rounded-lg p-2.5 sm:p-3">
            <Text type="secondary" className="text-[10px] sm:text-xs block mb-0.5">Status</Text>
            <div className="text-sm sm:text-base">{getStatusBadge(subscription.status)}</div>
          </div>
          {subscription.startDate && (
            <div className="bg-muted/50 rounded-lg p-2.5 sm:p-3">
              <Text type="secondary" className="text-[10px] sm:text-xs block mb-0.5">Start Date</Text>
              <Text className="font-medium text-xs sm:text-sm">{formatDate(subscription.startDate)}</Text>
            </div>
          )}
          {subscription.endDate && (
            <div className="bg-muted/50 rounded-lg p-2.5 sm:p-3">
              <Text type="secondary" className="text-[10px] sm:text-xs block mb-0.5">End Date</Text>
              <Text className="font-medium text-xs sm:text-sm">{formatDate(subscription.endDate)}</Text>
            </div>
          )}
        </div>

        <Divider className="!border-border !my-3 sm:!my-4" />

        <div className="flex justify-between items-center mb-3">
          <Title level={5} className="!mb-0 !text-foreground !font-semibold !text-sm sm:!text-base">Plan Features</Title>
          {!isFreePlan && (
            <Button 
              size="small"
              type="text"
              loading={loading}
              onClick={refreshSubscriptionFeatures}
              icon={<RefreshCw className="w-3 h-3" />}
              className="!text-muted-foreground hover:!text-foreground !text-xs"
            >
              Refresh
            </Button>
          )}
        </div>

        {/* Mobile-friendly features grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="bg-muted/50 rounded-lg p-2.5 sm:p-3">
            <Text type="secondary" className="text-[10px] sm:text-xs block mb-0.5">QR Codes Limit</Text>
            <Text className="font-medium text-primary text-sm sm:text-base">
              {subscription.features.maxQRCodes === -1 ? 'Unlimited' : subscription.features.maxQRCodes.toLocaleString()}
            </Text>
          </div>
          <div className="bg-muted/50 rounded-lg p-2.5 sm:p-3">
            <Text type="secondary" className="text-[10px] sm:text-xs block mb-0.5">Scans per QR</Text>
            <Text className="font-medium text-primary text-sm sm:text-base">
              {subscription.features.maxScansPerQR === -1 ? 'Unlimited' : subscription.features.maxScansPerQR.toLocaleString()}
            </Text>
          </div>
          <div className="bg-muted/50 rounded-lg p-2.5 sm:p-3">
            <Text type="secondary" className="text-[10px] sm:text-xs block mb-0.5">Advanced Analytics</Text>
            {subscription.features.advancedAnalytics ? (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs sm:text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Available
              </span>
            ) : (
              <span className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                Not Available
              </span>
            )}
          </div>
          <div className="bg-muted/50 rounded-lg p-2.5 sm:p-3">
            <Text type="secondary" className="text-[10px] sm:text-xs block mb-0.5">White Label</Text>
            {subscription.features.whiteLabel ? (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs sm:text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Available
              </span>
            ) : (
              <span className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                Not Available
              </span>
            )}
          </div>
          <div className="bg-muted/50 rounded-lg p-2.5 sm:p-3 col-span-2 sm:col-span-1">
            <Text type="secondary" className="text-[10px] sm:text-xs block mb-0.5">Remove Watermark</Text>
            {subscription.features.removeWatermark ? (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs sm:text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Available
              </span>
            ) : (
              <span className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                Not Available
              </span>
            )}
          </div>
        </div>

        {/* Temporarily hidden - Cancel Subscription button */}
        {/* {!isFreePlan && subscription.status === 'active' && (
          <div className="mt-6 pt-4 border-t border-border">
            <Button 
              danger 
              type="text"
              loading={loading}
              onClick={handleCancelSubscription}
              className="!text-red-500 hover:!text-red-600 hover:!bg-red-500/10"
            >
              Cancel Subscription
            </Button>
          </div>
        )} */}
      </Card>

      {/* Payment History */}
      {showPaymentHistory && (
        <Card 
          title={
            <span className="text-sm sm:text-base font-semibold text-foreground">Payment History</span>
          }
          className="!bg-card !border-border"
          styles={{ header: { borderBottom: '1px solid hsl(var(--border))' }, body: { padding: isMobile ? '8px' : '0' } }}
        >
          {isMobile ? (
            <div className="space-y-2">
              {paymentHistory.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">No payment history found</div>
              ) : (
                paymentHistory.map((payment) => (
                  <div key={payment._id} className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <Text className="font-medium capitalize text-sm">{payment.planType}</Text>
                      <Badge status={payment.status === 'paid' ? 'success' : 'processing'} text={<span className="text-xs capitalize">{payment.status}</span>} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatPrice(payment.amount)}</span>
                      <span>{formatDate(payment.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <Table
              columns={paymentColumns}
              dataSource={paymentHistory}
              rowKey="_id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} payments`
              }}
              locale={{
                emptyText: <span className="text-muted-foreground py-8 block">No payment history found</span>
              }}
              className="subscription-table text-xs"
              size="small"
            />
          )}
        </Card>
      )}
    </div>
  );
};

export default SubscriptionManagement;