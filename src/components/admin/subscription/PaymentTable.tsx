import React from 'react';
import { Table, Tag, Avatar, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import type { AdminPayment } from '@/store/slices/adminSlice';

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

  const formatCurrency = (amount: number, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount / 100); // Assuming amount is in paisa
  };

  const getPlanColor = (planType: string) => {
    const colors: Record<string, string> = {
      free: 'default',
      basic: 'blue',
      pro: 'purple',
      enterprise: 'gold',
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

  const columns: ColumnsType<AdminPayment> = [
    {
      title: 'User',
      dataIndex: 'userId',
      key: 'user',
      render: (user: AdminPayment['userId']) => (
        <Space>
          <Avatar 
            src={user?.profilePicture} 
            size="small"
          >
            {user?.name?.charAt(0).toUpperCase() || '?'}
          </Avatar>
          <div>
            <div className="font-medium">{user?.name || 'Unknown'}</div>
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
        formatCurrency(amount, record.currency),
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
          <div className="text-xs text-gray-500">
            {record.planDuration} months
          </div>
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
      render: (paymentId: string) => (
        paymentId ? (
          <span className="font-mono text-xs">{paymentId}</span>
        ) : (
          <span className="text-gray-400">Pending</span>
        )
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
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} of ${total} payments`,
      }}
      onChange={(pagination) => 
        onTableChange(pagination.current || 1, pagination.pageSize || limit)
      }
      scroll={{ x: 1000 }}
    />
  );
};

export default PaymentTable;