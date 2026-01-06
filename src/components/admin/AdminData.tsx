import React, { useCallback, useState, memo } from "react";
import { Table, Tag, Typography, Spin, Alert, Button, Input, Space, Tooltip, Popconfirm, Avatar, Modal, Tabs } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { RefreshCw, User, Users, CreditCard } from 'lucide-react';
import { useDateFormatter } from "@/hooks/useDateFormatter";
import { useAdminData } from "@/hooks/useAdminData";
import type { AdminUserRow, AdminQRCode } from "@/store/slices/adminSlice";
import AdminSubscriptions from "./AdminSubscriptions";
import UserSubscriptionModal from "./UserSubscriptionModal";

const { Title, Text } = Typography;

// ----- Component -----
const AdminData: React.FC = memo(() => {
  const formatter = useDateFormatter();
  const {
    users,
    loading,
    error,
    page,
    limit,
    total,
    search,
    handleTableChange,
    handleSearch,
    toggleBlock,
    deleteUser,
    refresh,
  } = useAdminData();

  const [localSearch, setLocalSearch] = useState(search);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewTitle, setPreviewTitle] = useState<string>("");
  
  // Subscription modal state
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  const handleAvatarClick = useCallback((profilePicture: string | undefined, userName: string | undefined) => {
    if (profilePicture) {
      setPreviewImage(profilePicture);
      setPreviewTitle(userName || "Profile Picture");
      setPreviewVisible(true);
    }
  }, []);

  const onSearch = useCallback(() => {
    handleSearch(localSearch);
  }, [handleSearch, localSearch]);

  const onTableChange = useCallback((pagination: TablePaginationConfig) => {
    const newPage = pagination.current ?? 1;
    const newLimit = pagination.pageSize ?? limit;
    handleTableChange(newPage, newLimit);
  }, [handleTableChange, limit]);

  // Columns
  const columns: ColumnsType<AdminUserRow> = [
    {
      title: "Profile",
      dataIndex: ["user", "profilePicture"],
      key: "profilePicture",
      width: 80,
      render: (profilePicture: string | undefined, record: AdminUserRow) => (
        <Avatar
          size={40}
          src={profilePicture}
          icon={<User size={20} />}
          style={{ cursor: profilePicture ? 'pointer' : 'default' }}
          onClick={() => handleAvatarClick(profilePicture, record.user?.name)}
        >
          {record.user?.name ? record.user.name.charAt(0).toUpperCase() : '?'}
        </Avatar>
      ),
    },
    {
      title: "Name",
      dataIndex: ["user", "name"],
      key: "name",
      render: (val: string | undefined, record: AdminUserRow) => (
        <Text strong>{val ?? record.user?.email ?? "—"}</Text>
      ),
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
      render: (email: string | undefined) => <Text>{email ?? "—"}</Text>,
    },
    {
      title: "Created",
      dataIndex: ["user", "createdAt"],
      key: "createdAt",
      render: (val: string | null | undefined) => (
        <Text type="secondary">{formatter.dateTime(val as any)}</Text>
      ),
    },
    {
      title: "QR Codes",
      dataIndex: "qrcodes",
      key: "qrcodes",
      render: (qrs: AdminQRCode[] | undefined) => <Tag>{qrs?.length ?? 0}</Tag>,
    },
    {
      title: "Plan",
      key: "subscriptionPlan",
      render: (_: any, record: AdminUserRow) => {
        const plan = record.user?.subscriptionPlan || 'free';
        const isOnTrial = record.user?.isOnTrial;
        
        const planColors = {
          free: 'default',
          basic: 'blue',
          pro: 'gold',
          enterprise: 'purple',
          trial: 'orange'
        };
        
        // If planType is 'trial', only show Trial tag
        if (plan === 'trial') {
          return <Tag color="orange">Trial</Tag>;
        }
        
        return (
          <Space direction="vertical" size={0}>
            <Tag color={planColors[plan as keyof typeof planColors]}>
              {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </Tag>
            {isOnTrial && <Tag color="orange" >Trial</Tag>}
          </Space>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: AdminUserRow) => (
        record.user?.blocked ? <Tag color="red">Blocked</Tag> : <Tag>Active</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: AdminUserRow) => {
        const blocked = record.user?.blocked ?? false;
        return (
          <Space>
            <Tooltip title="Manage Subscription">
              <Button
                type="default"
                icon={<CreditCard size={14} />}
                onClick={() => {
                  setSelectedUser({
                    id: record.user._id,
                    name: record.user?.name || '',
                    email: record.user?.email || ''
                  });
                  setSubscriptionModalVisible(true);
                }}
              >
                Plan
              </Button>
            </Tooltip>
            
            <Button
              type={blocked ? 'default' : 'primary'}
              danger={blocked}
              onClick={() => toggleBlock(record.user._id, blocked)}
            >
              {blocked ? 'Unblock' : 'Block'}
            </Button>

            <Popconfirm
              title="Delete user"
              description="Are you sure you want to delete this user? This will delete their QR codes." 
              onConfirm={() => deleteUser(record.user._id)}
              okText="Delete"
              cancelText="Cancel"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const renderExpandedRow = useCallback((record: AdminUserRow) => {
    const qrs = record.qrcodes ?? [];
    if (qrs.length === 0) return <Text type="secondary">No QR codes</Text>;

    const qrColumns = [
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Type", dataIndex: "type", key: "type" },
      {
        title: "Content",
        dataIndex: "content",
        key: "content",
        render: (c: any) => <Text copyable>{String(c ?? "")}</Text>,
      },
      { title: "Scans", dataIndex: "scanCount", key: "scanCount" },
      {
        title: "Created",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (v: any) => formatter.dateTime(v),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (s: any) => <Tag>{s ?? "—"}</Tag>,
      },
    ];

    return (
      <Table
        size="small"
        pagination={false}
        rowKey={(r: AdminQRCode) => r._id}
        dataSource={qrs}
        columns={qrColumns}
      />
    );
  }, [formatter]);

  const renderUsersTab = () => (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Text type="secondary">
            View user details and the QR codes created by each user.
          </Text>
        </div>

        <div className="flex items-center">
          <Space size="middle" align="center">
            <Input
              placeholder="Search by name or email"
              allowClear
              size="small"
              value={localSearch}
              onChange={(e) => setLocalSearch((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSearch(); }}
              style={{ width: 260, borderRadius: 0 }}
              aria-label="Search users"
            />

            <Tooltip title="Refresh">
              <Button
                type="default"
                shape="circle"
                icon={<RefreshCw size={14} />}
                onClick={refresh}
                loading={loading}
                size="small"
                aria-label="Refresh data"
              />
            </Tooltip>
          </Space>
        </div>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      {loading ? (
        <div className="py-12 flex items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <Table<AdminUserRow>
          rowKey={(row) =>
            row.user?._id ?? row.user?.id ?? JSON.stringify(row.user)
          }
          dataSource={users}
          columns={columns}
          pagination={{
            current: page,
            pageSize: limit,
            total,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          onChange={onTableChange}
          expandable={{ expandedRowRender: renderExpandedRow }}
        />
      )}
    </div>
  );

  const tabItems = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2">
          <Users size={16} />
          Users & QR Codes
        </span>
      ),
      children: renderUsersTab(),
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2">
          <CreditCard size={16} />
          Subscriptions & Payments
        </span>
      ),
      children: <AdminSubscriptions />,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <Title level={3}>Admin Dashboard</Title>
        
      </div>

      <Tabs
        defaultActiveKey="1"
        items={tabItems}
        size="large"
        className="admin-tabs"
      />

      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        centered
        width={600}
      >
        <img
          alt={previewTitle}
          style={{ width: '100%', height: 'auto' }}
          src={previewImage}
        />
      </Modal>

      <UserSubscriptionModal
        visible={subscriptionModalVisible}
        onCancel={() => {
          setSubscriptionModalVisible(false);
          setSelectedUser(null);
        }}
        userId={selectedUser?.id || null}
        userName={selectedUser?.name || ''}
        userEmail={selectedUser?.email || ''}
        onSuccess={() => {
          refresh(); // Refresh the user data after successful update
        }}
      />
    </div>
  );
});

AdminData.displayName = 'AdminData';

export default AdminData;
