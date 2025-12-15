import React from 'react';
import { Typography, Card, Empty } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import DashboardLayout from '../components/layout/DashboardLayout';

const { Title } = Typography;

const Submissions: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <Title level={2} className="mb-8">Contact Submissions</Title>
        <Card className="h-96 flex items-center justify-center">
          <Empty
            image={<MessageOutlined style={{ fontSize: 64, color: 'hsl(var(--muted-foreground))' }} />}
            description="No contact submissions yet"
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Submissions;
