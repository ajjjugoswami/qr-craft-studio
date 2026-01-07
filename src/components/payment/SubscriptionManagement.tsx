import React, { useEffect } from 'react';
import { 
  Card, 
  Descriptions, 
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

const { Title, Text } = Typography;

interface SubscriptionManagementProps {
  showPaymentHistory?: boolean;
}

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({
  showPaymentHistory = true
}) => {
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
    return `₹${amount.toLocaleString('en-IN')}`;
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
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card 
        title={
          <span className="text-base font-semibold text-foreground">Current Subscription</span>
        }
        extra={
          <span className="flex items-center gap-2 text-muted-foreground text-sm">
            <CreditCard className="w-4 h-4" />
            Subscription Details
          </span>
        }
        className="!bg-card !border-border"
        styles={{ header: { borderBottom: '1px solid hsl(var(--border))' }, body: { padding: '24px' } }}
      >
        {isExpiredSoon && subscription.status === 'active' && (
          <Alert
            message="Subscription Expiring Soon"
            description={`Your subscription will expire on ${formatDate(subscription.endDate!)}`}
            type="warning"
            showIcon
            className="mb-6"
          />
        )}

        <Descriptions 
          bordered 
          column={2}
          className="subscription-descriptions"
          labelStyle={{ 
            backgroundColor: 'hsl(var(--muted))', 
            color: 'hsl(var(--muted-foreground))',
            fontWeight: 500,
            fontSize: '13px'
          }}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
            fontSize: '13px'
          }}
        >
          <Descriptions.Item label="Plan Type">
            <span className="capitalize font-medium">{subscription.planType}</span>
          </Descriptions.Item>
          
          <Descriptions.Item label="Status">
            {getStatusBadge(subscription.status)}
          </Descriptions.Item>

          {subscription.startDate && (
            <Descriptions.Item label="Start Date">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {formatDate(subscription.startDate)}
              </span>
            </Descriptions.Item>
          )}

          {subscription.endDate && (
            <Descriptions.Item label="End Date">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {formatDate(subscription.endDate)}
              </span>
            </Descriptions.Item>
          )}
        </Descriptions>

        <Divider className="!border-border" />

        <div className="flex justify-between items-center mb-4">
          <Title level={5} className="!mb-0 !text-foreground !font-semibold">Plan Features</Title>
          {!isFreePlan && (
            <Button 
              size="small"
              type="text"
              loading={loading}
              onClick={refreshSubscriptionFeatures}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              className="!text-muted-foreground hover:!text-foreground"
            >
              Refresh
            </Button>
          )}
        </div>

        <Descriptions 
          bordered 
          column={2} 
          size="small"
          labelStyle={{ 
            backgroundColor: 'hsl(var(--muted))', 
            color: 'hsl(var(--muted-foreground))',
            fontWeight: 500,
            fontSize: '13px'
          }}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
            fontSize: '13px'
          }}
        >
          <Descriptions.Item label="QR Codes Limit">
            <span className="font-medium text-primary">
              {subscription.features.maxQRCodes === -1 ? 'Unlimited' : subscription.features.maxQRCodes.toLocaleString()}
            </span>
          </Descriptions.Item>
          
          <Descriptions.Item label="Scans per QR">
            <span className="font-medium text-primary">
              {subscription.features.maxScansPerQR === -1 ? 'Unlimited' : subscription.features.maxScansPerQR.toLocaleString()}
            </span>
          </Descriptions.Item>

          <Descriptions.Item label="Advanced Analytics">
            {subscription.features.advancedAnalytics ? (
              <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Available
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                Not Available
              </span>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="White Label">
            {subscription.features.whiteLabel ? (
              <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Available
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                Not Available
              </span>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Remove Watermark">
            {subscription.features.removeWatermark ? (
              <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Available
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                Not Available
              </span>
            )}
          </Descriptions.Item>
        </Descriptions>

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
            <span className="text-base font-semibold text-foreground">Payment History</span>
          }
          className="!bg-card !border-border"
          styles={{ header: { borderBottom: '1px solid hsl(var(--border))' }, body: { padding: '0' } }}
        >
          <Table
            columns={paymentColumns}
            dataSource={paymentHistory}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} payments`
            }}
            locale={{
              emptyText: <span className="text-muted-foreground py-8 block">No payment history found</span>
            }}
            className="subscription-table"
          />
        </Card>
      )}
    </div>
  );
};

export default SubscriptionManagement;