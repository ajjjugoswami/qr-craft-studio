import React from 'react';
import { Table, Tag, Avatar, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import type { AdminSubscription } from '@/store/slices/adminSlice';
import { useIsMobile } from '@/hooks/use-mobile';

const { Text } = Typography;

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

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground text-sm">Loading...</div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">No subscriptions found</div>
        ) : (
          subscriptions.map((sub) => (
            <div key={sub._id} className="bg-card border border-border rounded-xl p-3">
              <div className="flex items-center gap-3 mb-2">
                <Avatar 
                  src={sub.userId?.profilePicture} 
                  size="small"
                >
                  {sub.userId?.name?.charAt(0).toUpperCase() || '?'}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <Text className="font-medium text-sm block truncate">{sub.userId?.name || 'Unknown'}</Text>
                  <Text type="secondary" className="text-xs truncate block">{sub.userId?.email}</Text>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Tag color={getPlanColor(sub.planType)} className="capitalize text-xs !m-0">
                  {sub.planType}
                </Tag>
                <Tag color={getStatusColor(sub.status)} className="capitalize text-xs !m-0">
                  {sub.status}
                </Tag>
                <Text type="secondary" className="text-xs ml-auto">
                  {sub.startDate ? formatter.format(sub.startDate, { dateStyle: 'short' }) : 'N/A'}
                </Text>
              </div>
            </div>
          ))
        )}
        {/* Pagination */}
        {total > limit && (
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => onTableChange(page - 1, limit)}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs rounded-lg bg-muted disabled:opacity-40"
            >
              Prev
            </button>
            <span className="px-3 py-1.5 text-xs text-muted-foreground">{page} / {Math.ceil(total / limit)}</span>
            <button
              onClick={() => onTableChange(page + 1, limit)}
              disabled={page >= Math.ceil(total / limit)}
              className="px-3 py-1.5 text-xs rounded-lg bg-muted disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }

  const columns: ColumnsType<AdminSubscription> = [
    {
      title: 'User',
      dataIndex: 'userId',
      key: 'user',
      render: (user: AdminSubscription['userId']) => (
        <div className="flex items-center gap-2">
          <Avatar 
            src={user?.profilePicture} 
            size="small"
          >
            {user?.name?.charAt(0).toUpperCase() || '?'}
          </Avatar>
          <div>
            <div className="font-medium text-xs">{user?.name || 'Unknown'}</div>
            <div className="text-[10px] text-gray-500">{user?.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Plan',
      dataIndex: 'planType',
      key: 'planType',
      render: (planType: string) => (
        <Tag color={getPlanColor(planType)} className="capitalize text-xs">
          {planType}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="capitalize text-xs">
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto -mx-3 sm:mx-0">
      <Table<AdminSubscription>
        rowKey="_id"
        dataSource={subscriptions}
        columns={columns}
        loading={loading}
        size="middle"
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: (total, range) => 
            <span className="text-xs">{range[0]}-{range[1]} of {total}</span>,
          size: 'default',
        }}
        onChange={(pagination) => 
          onTableChange(pagination.current || 1, pagination.pageSize || limit)
        }
        className="text-xs"
      />
    </div>
  );
};

export default SubscriptionTable;