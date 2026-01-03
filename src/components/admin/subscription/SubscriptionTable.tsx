import React from 'react';
import { Table, Tag, Avatar, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import type { AdminSubscription } from '@/store/slices/adminSlice';

interface SubscriptionTableProps {
  subscriptions: AdminSubscription[];
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  onTableChange: (page: number, limit: number) => void;
}

const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  subscriptions,
  loading,
  page,
  limit,
  total,
  onTableChange,
}) => {
  const formatter = useDateFormatter();

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

  const columns: ColumnsType<AdminSubscription> = [
    {
      title: 'User',
      dataIndex: 'userId',
      key: 'user',
      render: (user: AdminSubscription['userId']) => (
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
      title: 'Plan',
      dataIndex: 'planType',
      key: 'planType',
      render: (planType: string) => (
        <Tag color={getPlanColor(planType)} className="capitalize">
          {planType}
        </Tag>
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
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => formatter.format(date, { dateStyle: 'medium' }),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => date ? formatter.format(date, { dateStyle: 'medium' }) : 'N/A',
    },
    {
      title: 'Max QR Codes',
      dataIndex: ['features', 'maxQRCodes'],
      key: 'maxQRCodes',
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatter.format(date, { dateStyle: 'medium' }),
    },
  ];

  return (
    <Table<AdminSubscription>
      rowKey="_id"
      dataSource={subscriptions}
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
          `${range[0]}-${range[1]} of ${total} subscriptions`,
      }}
      onChange={(pagination) => 
        onTableChange(pagination.current || 1, pagination.pageSize || limit)
      }
      scroll={{ x: 800 }}
    />
  );
};

export default SubscriptionTable;