import React from 'react';
import { Typography, Card, Table, Tag, Button, Popconfirm, Space, Avatar } from 'antd';
import { Trash2, Mail, MessageSquare, User } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useContacts } from '@/hooks/useContacts';
import { useAuth } from '@/hooks/useAuth';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import { useIsMobile } from '@/hooks/use-mobile';
import type { ContactSubmission } from '@/store/slices/contactsSlice';
import LogoLoader from '@/components/common/LogoLoader';

const { Title } = Typography;

const Submissions: React.FC = () => {
  const { user } = useAuth();
  const { contacts, loading, updateStatus, deleteContact } = useContacts();
  const formatter = useDateFormatter();
  const isMobile = useIsMobile();

  // Mobile Card View for Contact Submissions
  const MobileContactCard = ({ contact }: { contact: ContactSubmission }) => (
    <Card className="mb-3" bodyStyle={{ padding: 16 }}>
      <div className="space-y-3">
        {/* Header with name and status */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar size={40} icon={<User size={20} />} className="bg-primary/10" />
            <div>
              <div className="font-medium text-sm">{contact.name}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail size={12} />
                {contact.email}
              </div>
            </div>
          </div>
          <Tag color={contact.status === 'new' ? 'blue' : contact.status === 'read' ? 'green' : 'orange'} className="text-xs">
            {contact.status}
          </Tag>
        </div>

        {/* Subject */}
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-1">Subject</div>
          <div className="text-sm font-medium">{contact.subject}</div>
        </div>

        {/* Message */}
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
            <MessageSquare size={12} />
            Message
          </div>
          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md max-h-24 overflow-y-auto">
            {contact.message}
          </div>
        </div>

        {/* Footer with date and actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground">
            {formatter.dateTime(contact.createdAt)}
          </div>
          <div className="flex items-center gap-2">
            {contact.status !== 'read' && (
              <Button size="small" onClick={() => updateStatus(contact._id, 'read')}>
                Mark read
              </Button>
            )}
            <Popconfirm title="Delete submission?" onConfirm={() => deleteContact(contact._id)}>
              <Button size="small" danger icon={<Trash2 size={14} />} />
            </Popconfirm>
          </div>
        </div>
      </div>
    </Card>
  );

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    { title: 'Message', dataIndex: 'message', key: 'message', width: 360, ellipsis: true },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'new' ? 'blue' : s === 'read' ? 'green' : 'orange'}>{s}</Tag> },
    { title: 'Received', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => formatter.dateTime(d) },
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
            <div className="flex items-center justify-center py-12"><LogoLoader size="sm" /></div>
          ) : isMobile ? (
            <div className="space-y-1">
              {contacts.map((contact) => (
                <MobileContactCard key={contact._id} contact={contact} />
              ))}
            </div>
          ) : (
            <Table columns={columns} dataSource={contacts} rowKey={(r: ContactSubmission) => r._id} />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Submissions;
