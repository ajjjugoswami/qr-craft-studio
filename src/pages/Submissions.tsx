import React from 'react';
import { Typography, Card, Table, Tag, Button, Popconfirm, Spin } from 'antd';
import { Trash2 } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useContacts } from '@/hooks/useContacts';
import { useAuth } from '@/hooks/useAuth';
import type { ContactSubmission } from '@/store/slices/contactsSlice';

const { Title } = Typography;

const Submissions: React.FC = () => {
  const { user } = useAuth();
  const { contacts, loading, updateStatus, deleteContact } = useContacts();

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    { title: 'Message', dataIndex: 'message', key: 'message', width: 360, ellipsis: true },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'new' ? 'blue' : s === 'read' ? 'green' : 'orange'}>{s}</Tag> },
    { title: 'Received', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => new Date(d).toLocaleString() },
    { 
      title: 'Actions', 
      key: 'actions', 
      render: (_: unknown, record: ContactSubmission) => (
        <div className="flex items-center gap-2">
          {record.status !== 'read' && (
            <Button size="small" onClick={() => updateStatus(record._id, 'read')}>Mark read</Button>
          )}
          <Popconfirm title="Delete submission?" onConfirm={() => deleteContact(record._id)}>
            <Button size="small" danger icon={<Trash2 size={14} />} />
          </Popconfirm>
        </div>
      ) 
    },
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
            <Table columns={columns} dataSource={contacts} rowKey={(r: ContactSubmission) => r._id} />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Submissions;
