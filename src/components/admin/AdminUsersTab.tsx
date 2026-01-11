import React, { useCallback, useState, memo } from "react";
import { Table, Tag, Typography, Alert, Button, Input, Space, Tooltip, Popconfirm, Avatar, Modal, Card } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { RefreshCw, User, CreditCard, Search } from 'lucide-react';
import { useDateFormatter } from "@/hooks/useDateFormatter";
import { useAdminData } from "@/hooks/useAdminData";
import type { AdminUserRow, AdminQRCode } from "@/store/slices/adminSlice";
import UserSubscriptionModal from "./UserSubscriptionModal";
import LogoLoader from "@/components/common/LogoLoader";
import { useIsMobile } from "@/hooks/use-mobile";

const { Text } = Typography;

const AdminUsersTab: React.FC = memo(() => {
  const formatter = useDateFormatter();
  const isMobile = useIsMobile();
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

  // Mobile Card View for Users
  const MobileUserCard = ({ record }: { record: AdminUserRow }) => {
    const blocked = record.user?.blocked ?? false;
    const plan = record.user?.subscriptionPlan || 'free';
    const isOnTrial = record.user?.isOnTrial;
    
    const planColors: Record<string, string> = {
      free: 'default',
      basic: 'blue',
      pro: 'gold',
      enterprise: 'purple',
      trial: 'orange'
    };

    return (
      <Card className="mb-3">
        <div className="flex items-start gap-3">
          <Avatar
            size={48}
            src={record.user?.profilePicture}
            icon={<User size={20} />}
            onClick={() => handleAvatarClick(record.user?.profilePicture, record.user?.name)}
            className="cursor-pointer flex-shrink-0"
          >
            {record.user?.name ? record.user.name.charAt(0).toUpperCase() : '?'}
          </Avatar>
          <div className="flex-1 min-w-0">
            <Text strong className="block truncate text-sm">{record.user?.name ?? record.user?.email ?? "—"}</Text>
            <Text type="secondary" className="block truncate text-xs">{record.user?.email}</Text>
            <div className="flex flex-wrap items-center gap-1 mt-2">
              <Tag>{record.qrcodes?.length ?? 0} QRs</Tag>
              <Tag color={planColors[plan]}>{plan}</Tag>
              {isOnTrial && <Tag color="orange">Trial</Tag>}
              {blocked ? <Tag color="red">Blocked</Tag> : <Tag>Active</Tag>}
            </div>
            <Text type="secondary" className="text-xs mt-2 block">
              {formatter.dateTime(record.user?.createdAt as any)}
            </Text>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
          <Button
            size="small"
            icon={<CreditCard size={12} />}
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
          <Button
            size="small"
            type={blocked ? 'default' : 'primary'}
            danger={blocked}
            onClick={() => toggleBlock(record.user._id, blocked)}
          >
            {blocked ? 'Unblock' : 'Block'}
          </Button>
          <Popconfirm
            title="Delete user"
            description="Are you sure?"
            onConfirm={() => deleteUser(record.user._id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button size="small" danger>Delete</Button>
          </Popconfirm>
        </div>
      </Card>
    );
  };

  return (
    <div>
      {/* Search Header - Mobile Responsive */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Text type="secondary" className="text-sm hidden sm:block">
          View user details and the QR codes created by each user.
        </Text>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search..."
            allowClear
            size="middle"
            prefix={<Search size={16} className="text-muted-foreground" />}
            value={localSearch}
            onChange={(e) => setLocalSearch((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSearch(); }}
            className="flex-1 sm:w-60"
            aria-label="Search users"
          />
          <Tooltip title="Refresh">
            <Button
              type="default"
              shape="circle"
              icon={<RefreshCw size={16} />}
              onClick={refresh}
              loading={loading}
              aria-label="Refresh data"
            />
          </Tooltip>
        </div>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <LogoLoader size="sm"/>
        </div>
      ) : isMobile ? (
        /* Mobile Card View */
        <div>
          {users.map((record) => (
            <MobileUserCard key={record.user?._id ?? record.user?.id} record={record} />
          ))}
          {/* Simple pagination for mobile */}
          <div className="flex justify-center gap-2 mt-4">
            <Button 
              disabled={page <= 1} 
              onClick={() => handleTableChange(page - 1, limit)}
              size="small"
            >
              Previous
            </Button>
            <span className="px-3 py-1 text-sm">
              {page} / {Math.ceil(total / limit)}
            </span>
            <Button 
              disabled={page >= Math.ceil(total / limit)} 
              onClick={() => handleTableChange(page + 1, limit)}
              size="small"
            >
              Next
            </Button>
          </div>
        </div>
      ) : (
        /* Desktop Table View */
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
          scroll={{ x: 800 }}
        />
      )}

      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        centered
        width={isMobile ? "100%" : 600}
        destroyOnHidden
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
          refresh();
        }}
      />
    </div>
  );
});

AdminUsersTab.displayName = 'AdminUsersTab';

export default AdminUsersTab;