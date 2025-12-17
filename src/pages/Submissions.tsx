import React, { useEffect, useState } from 'react';
import { Typography, Card, Table, Tag, Button, Popconfirm, message, Spin } from 'antd';
import { Trash2 } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { contactAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface ContactRow {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

const { Title } = Typography;

const Submissions: React.FC = () => {
  const { user, signout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ContactRow[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user?.isAdmin) return;
      setLoading(true);
      try {
        const res = await contactAPI.getAll();
        if (!mounted) return;
        setData(res.contacts || []);
      } catch (err: any) {
        if (err?.response?.status === 401) {
          message.error('Session expired');
          signout();
        } else {
          message.error('Failed to load submissions');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [user, signout]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await contactAPI.updateStatus(id, status);
      setData(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      message.success('Status updated');
    } catch (err: any) {
      message.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contactAPI.delete(id);
      setData(prev => prev.filter(r => r._id !== id));
      message.success('Submission deleted');
    } catch (err: any) {
      message.error('Failed to delete submission');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    { title: 'Message', dataIndex: 'message', key: 'message', width: 360, ellipsis: true },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'new' ? 'blue' : s === 'read' ? 'green' : 'orange'}>{s}</Tag> },
    { title: 'Received', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => new Date(d).toLocaleString() },
    { title: 'Actions', key: 'actions', render: (_: any, record: ContactRow) => (
      <div className="flex items-center gap-2">
        {record.status !== 'read' && (
          <Button size="small" onClick={() => handleUpdateStatus(record._id, 'read')}>Mark read</Button>
        )}
        <Popconfirm title="Delete submission?" onConfirm={() => handleDelete(record._id)}>
          <Button size="small" danger icon={<Trash2 size={14} />} />
        </Popconfirm>
      </div>
    ) },
  ];

  if (!user?.isAdmin) {
    return (
      <DashboardLayout>
        <div className="animate-fade-in">
          <Title level={2} className="mb-8">Contact Submissions</Title>
          <Card className="h-96 flex items-center justify-center">
            <div>You do not have permission to view submissions.</div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <Title level={2} className="mb-8">Contact Submissions</Title>

        <Card>
          {loading ? (
            <div className="flex items-center justify-center py-12"><Spin /></div>
          ) : (
            <Table columns={columns} dataSource={data} rowKey={(r: ContactRow) => r._id} />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Submissions;
