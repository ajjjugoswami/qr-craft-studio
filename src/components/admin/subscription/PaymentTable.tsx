import React from 'react';
import { Table, Tag, Avatar, Space, Card, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import { useIsMobile } from '@/hooks/use-mobile';
import type { AdminPayment } from '@/store/slices/adminSlice';
import { formatCurrencyIntl } from '@/utils/currencyFormatter';

interface PaymentTableProps {
  payments: AdminPayment[];
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  onTableChange: (page: number, limit: number) => void;
}

const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  loading,
  page,
  limit,
  total,
  onTableChange,
}) => {
  const formatter = useDateFormatter();
  const isMobile = useIsMobile();

  const getPlanColor = (planType: string) => {
    const colors: Record<string, string> = {
      free: 'default',
      basic: 'blue',
      pro: 'purple',
      enterprise: 'gold',
      trial: 'orange',
    };
    return colors[planType] || 'default';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'success',
      paid: 'success',
      inactive: 'default',
      expired: 'warning',
      cancelled: 'error',
      failed: 'error',
      created: 'processing',
      refunded: 'warning',
    };
    return colors[status] || 'default';
  };

  // Mobile Card View
  const MobilePaymentCard = ({ payment }: { payment: AdminPayment }) => (
    <Card className="mb-2" bodyStyle={{ padding: 12 }}>
      <div className="flex items-start gap-3">
        <Avatar src={payment.userId?.profilePicture} size={36}>
          {payment.userId?.name?.charAt(0).toUpperCase() || '?'}
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{payment.userId?.name || 'Unknown'}</div>
          <div className="text-xs text-muted-foreground truncate">{payment.userId?.email}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold">{formatCurrencyIntl(payment.amount, payment.currency)}</div>
          <Tag color={getStatusColor(payment.status)} className="text-xs capitalize mt-1">
            {payment.status}
          </Tag>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <Tag color={getPlanColor(payment.planType)} className="text-xs capitalize">
            {payment.planType}
          </Tag>
          <span className="text-xs text-muted-foreground">{payment.planDuration}mo</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatter.format(payment.createdAt, { dateStyle: 'medium' })}
        </span>
      </div>
    </Card>
  );

  if (isMobile) {
    return (
      <div>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground text-sm">Loading...</div>
        ) : (
          <>
            {payments.map((payment) => (
              <MobilePaymentCard key={payment._id} payment={payment} />
            ))}
            <div className="flex justify-center gap-2 mt-4">
              <Button
                disabled={page <= 1}
                onClick={() => onTableChange(page - 1, limit)}
                size="small"
              >
                Prev
              </Button>
              <span className="px-3 py-1 text-sm">
                {page} / {Math.ceil(total / limit) || 1}
              </span>
              <Button
                disabled={page >= Math.ceil(total / limit)}
                onClick={() => onTableChange(page + 1, limit)}
                size="small"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }

  const columns: ColumnsType<AdminPayment> = [
    {
      title: 'User',
      dataIndex: 'userId',
      key: 'user',
      render: (user: AdminPayment['userId']) => (
        <Space>
          <Avatar src={user?.profilePicture} size="small">
            {user?.name?.charAt(0).toUpperCase() || '?'}
          </Avatar>
          <div>
            <div className="font-medium text-sm">{user?.name || 'Unknown'}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (orderId: string) => (
        <span className="font-mono text-xs">{orderId}</span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: AdminPayment) =>
        formatCurrencyIntl(amount, record.currency),
    },
    {
      title: 'Plan',
      dataIndex: 'planType',
      key: 'planType',
      render: (planType: string, record: AdminPayment) => (
        <div>
          <Tag color={getPlanColor(planType)} className="capitalize">
            {planType}
          </Tag>
          <div className="text-xs text-gray-500">{record.planDuration} months</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="capitalize">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Payment ID',
      dataIndex: 'paymentId',
      key: 'paymentId',
      render: (paymentId: string) =>
        paymentId ? (
          <span className="font-mono text-xs">{paymentId}</span>
        ) : (
          <span className="text-gray-400">Pending</span>
        ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatter.format(date, { dateStyle: 'medium' }),
    },
  ];

  return (
    <Table<AdminPayment>
      rowKey="_id"
      dataSource={payments}
      columns={columns}
      loading={loading}
      pagination={{
        current: page,
        pageSize: limit,
        total: total,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} payments`,
      }}
      onChange={(pagination) =>
        onTableChange(pagination.current || 1, pagination.pageSize || limit)
      }
      scroll={{ x: 1000 }}
    />
  );
};

export default PaymentTable;