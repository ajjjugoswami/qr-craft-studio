import React, { useEffect } from 'react';
import { 
  Card, 
  Descriptions, 
  Badge, 
  Button, 
  Table, 
  Typography, 
  Spin, 
  Alert,
  Modal,
  Space,
  Divider
} from 'antd';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download
} from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';
import type { PaymentHistory } from '@/types/payment';

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
    fetchPaymentHistory
  } = usePayment();

  // Fetch payment history on mount if needed
  useEffect(() => {
    if (showPaymentHistory) {
      fetchPaymentHistory();
    }
  }, [showPaymentHistory]);

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
    const statusConfig = {
      active: { status: 'success' as const, color: 'green', icon: <CheckCircle className="w-4 h-4" /> },
      expired: { status: 'error' as const, color: 'red', icon: <XCircle className="w-4 h-4" /> },
      cancelled: { status: 'warning' as const, color: 'orange', icon: <AlertTriangle className="w-4 h-4" /> },
      inactive: { status: 'default' as const, color: 'gray', icon: <XCircle className="w-4 h-4" /> }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <Badge 
        status={config.status}
        text={
          <span className="flex items-center gap-1">
            {config.icon}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        }
      />
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
        <Text copyable={{ text: orderId }}>
          {orderId.slice(-8)}...
        </Text>
      )
    },
    {
      title: 'Plan',
      dataIndex: 'planType',
      key: 'planType',
      render: (planType: string) => (
        <Badge color="blue" text={planType.charAt(0).toUpperCase() + planType.slice(1)} />
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => formatPrice(amount)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          paid: { color: 'success', text: 'Paid' },
          created: { color: 'processing', text: 'Pending' },
          failed: { color: 'error', text: 'Failed' },
          refunded: { color: 'warning', text: 'Refunded' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Badge status={config.color as any} text={config.text} />;
      }
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date)
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: PaymentHistory) => (
        record.status === 'paid' ? (
          <Button 
            size="small" 
            icon={<Download className="w-4 h-4" />}
            onClick={() => {
              // TODO: Implement invoice download
              console.log('Download invoice for:', record._id);
            }}
          >
            Invoice
          </Button>
        ) : null
      )
    }
  ];

  if (subscriptionLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" />
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
    new Date(subscription.endDate).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000; // 7 days

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card title="Current Subscription" extra={
        <Space>
          <CreditCard className="w-5 h-5" />
          <Text strong>Subscription Details</Text>
        </Space>
      }>
        {isExpiredSoon && subscription.status === 'active' && (
          <Alert
            message="Subscription Expiring Soon"
            description={`Your subscription will expire on ${formatDate(subscription.endDate!)}`}
            type="warning"
            showIcon
            className="mb-4"
          />
        )}

        <Descriptions bordered column={2}>
          <Descriptions.Item label="Plan Type">
            <Badge 
              color={subscription.planType === 'free' ? 'default' : 'blue'} 
              text={subscription.planType.charAt(0).toUpperCase() + subscription.planType.slice(1)}
            />
          </Descriptions.Item>
          
          <Descriptions.Item label="Status">
            {getStatusBadge(subscription.status)}
          </Descriptions.Item>

          {subscription.startDate && (
            <Descriptions.Item label="Start Date">
              <Space>
                <Calendar className="w-4 h-4" />
                {formatDate(subscription.startDate)}
              </Space>
            </Descriptions.Item>
          )}

          {subscription.endDate && (
            <Descriptions.Item label="End Date">
              <Space>
                <Calendar className="w-4 h-4" />
                {formatDate(subscription.endDate)}
              </Space>
            </Descriptions.Item>
          )}
        </Descriptions>

        <Divider />

        <Title level={4}>Plan Features</Title>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="QR Codes Limit">
            {subscription.features.maxQRCodes === -1 ? 'Unlimited' : subscription.features.maxQRCodes.toLocaleString()}
          </Descriptions.Item>
          
          <Descriptions.Item label="Scans per QR">
            {subscription.features.maxScansPerQR === -1 ? 'Unlimited' : subscription.features.maxScansPerQR.toLocaleString()}
          </Descriptions.Item>

          <Descriptions.Item label="Advanced Analytics">
            {subscription.features.analytics ? (
              <Badge status="success" text="Available" />
            ) : (
              <Badge status="default" text="Not Available" />
            )}
          </Descriptions.Item>

          <Descriptions.Item label="White Label">
            {subscription.features.whiteLabel ? (
              <Badge status="success" text="Available" />
            ) : (
              <Badge status="default" text="Not Available" />
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Remove Watermark">
            {subscription.features.removeWatermark ? (
              <Badge status="success" text="Available" />
            ) : (
              <Badge status="default" text="Not Available" />
            )}
          </Descriptions.Item>
        </Descriptions>

        {!isFreePlan && subscription.status === 'active' && (
          <div className="mt-6 text-center">
            <Button 
              danger 
              loading={loading}
              onClick={handleCancelSubscription}
            >
              Cancel Subscription
            </Button>
          </div>
        )}
      </Card>

      {/* Payment History */}
      {showPaymentHistory && (
        <Card title="Payment History">
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
              emptyText: 'No payment history found'
            }}
          />
        </Card>
      )}
    </div>
  );
};

export default SubscriptionManagement;