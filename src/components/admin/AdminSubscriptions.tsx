import React, { useState } from 'react';
import { Tabs, Alert } from 'antd';
import useAdminSubscriptions from '@/hooks/useAdminSubscriptions';
import StatsCards from './subscription/StatsCards';
import SubscriptionTable from './subscription/SubscriptionTable';
import SearchHeader from './subscription/SearchHeader';
import PaymentTable from './subscription/PaymentTable';
import { useIsMobile } from '@/hooks/use-mobile';

const AdminSubscriptions: React.FC = () => {
  const isMobile = useIsMobile();
  const {
    stats,
    subscriptions,
    payments,
    loading,
    error,
    page,
    limit,
    totalSubs,
    totalPayments,
    search,
    handleSearch,
    handleTableChange,
    refresh,
  } = useAdminSubscriptions();

  const [localSearch, setLocalSearch] = useState(search);
  const [activeTab, setActiveTab] = useState('1');

  const onSearch = () => {
    handleSearch(localSearch);
  };

  const tabItems = [
    {
      key: '1',
      label: 'Subscriptions',
      children: (
        <div>
          <SearchHeader
            title="Active Subscriptions"
            description="View all user subscriptions and their details"
            searchValue={localSearch}
            onSearchChange={setLocalSearch}
            onSearch={onSearch}
            onRefresh={refresh}
            loading={loading}
          />
          <SubscriptionTable
            subscriptions={subscriptions}
            loading={loading}
            page={page}
            limit={limit}
            total={totalSubs}
            onTableChange={handleTableChange}
          />
        </div>
      ),
    },
    {
      key: '2',
      label: 'Payments',
      children: (
        <div>
          <SearchHeader
            title="Payment History"
            description="Track all payment transactions"
            searchValue={localSearch}
            onSearchChange={setLocalSearch}
            onSearch={onSearch}
            onRefresh={refresh}
            loading={loading}
          />
          <PaymentTable
            payments={payments}
            loading={loading}
            page={page}
            limit={limit}
            total={totalPayments}
            onTableChange={handleTableChange}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <StatsCards stats={stats} />
      
      {error && (
        <Alert
          type="error"
          message="Failed to load subscription data"
          description={error}
          className="mb-4"
          showIcon
        />
      )}
      
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size={isMobile ? 'small' : 'large'}
      />
    </div>
  );
};

export default AdminSubscriptions;