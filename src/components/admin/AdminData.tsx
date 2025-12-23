import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Spin, Alert } from 'antd';
import { adminAPI } from '@/lib/api';

const { Title, Text } = Typography;

interface AdminUserRow {
  user: any;
  qrcodes: any[];
}

const AdminData: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminUserRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await adminAPI.getUsersData();
        if (!mounted) return;
        setData(res.data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || 'Failed to load admin data');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: ['user', 'name'],
      key: 'name',
      render: (val: string, record: AdminUserRow) => <Text strong>{val || record.user?.email}</Text>,
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
      key: 'email',
    },
    {
      title: 'Created',
      dataIndex: ['user', 'createdAt'],
      key: 'createdAt',
      render: (val: string) => <Text type="secondary">{val ? new Date(val).toLocaleString() : '-'}</Text>,
    },
    {
      title: 'QR Codes',
      dataIndex: 'qrcodes',
      key: 'qrcodes',
      render: (qrs: any[]) => <Tag>{qrs?.length || 0}</Tag>,
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <Title level={4}>Admin: Users & QR Codes</Title>
        <Text type="secondary">View user details and the QR codes created by each user.</Text>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      {loading ? (
        <div className="py-12 flex items-center justify-center"><Spin size="large" /></div>
      ) : (
        <Table
          rowKey={(row: AdminUserRow) => row.user._id}
          dataSource={data}
          columns={columns}
          expandable={{
            expandedRowRender: (record: AdminUserRow) => (
              <div className="space-y-2">
                {record.qrcodes.length === 0 ? (
                  <Text type="secondary">No QR codes</Text>
                ) : (
                  <Table
                    size="small"
                    pagination={false}
                    rowKey={(r) => r._id}
                    dataSource={record.qrcodes}
                    columns={[
                      { title: 'Name', dataIndex: 'name', key: 'name' },
                      { title: 'Type', dataIndex: 'type', key: 'type' },
                      { title: 'Content', dataIndex: 'content', key: 'content', render: (c) => <Text copyable>{String(c)}</Text> },
                      { title: 'Scans', dataIndex: 'scanCount', key: 'scanCount' },
                      { title: 'Created', dataIndex: 'createdAt', key: 'createdAt', render: (v) => (v ? new Date(v).toLocaleString() : '-') },
                      { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag>{s}</Tag> },
                    ]}
                  />
                )}
              </div>
            ),
          }}
        />
      )}
    </div>
  );
};

export default AdminData;