import React from 'react';
import { Card, Typography, Button, Tooltip } from 'antd';
import { 
  Plus, 
  QrCode, 
  BarChart2, 
  Settings, 
  Download, 
  Link2, 
  Mail, 
  Phone,
  Wifi,
  User,
  FileText,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  description: string;
  action: () => void;
  color: string;
}

const QuickActionsWidget: React.FC = () => {
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      icon: <Link2 size={20} />,
      label: 'URL QR',
      description: 'Create a URL QR code',
      action: () => navigate('/create?type=url'),
      color: '#6366f1',
    },
    {
      icon: <User size={20} />,
      label: 'vCard',
      description: 'Create a contact QR',
      action: () => navigate('/create?type=vcard'),
      color: '#22c55e',
    },
    {
      icon: <Wifi size={20} />,
      label: 'WiFi',
      description: 'Share WiFi credentials',
      action: () => navigate('/create?type=wifi'),
      color: '#f59e0b',
    },
    {
      icon: <Mail size={20} />,
      label: 'Email',
      description: 'Email QR code',
      action: () => navigate('/create?type=email'),
      color: '#ef4444',
    },
    {
      icon: <Phone size={20} />,
      label: 'Phone',
      description: 'Phone call QR',
      action: () => navigate('/create?type=phone'),
      color: '#8b5cf6',
    },
    {
      icon: <BarChart2 size={20} />,
      label: 'Analytics',
      description: 'View analytics',
      action: () => navigate('/analytics'),
      color: '#06b6d4',
    },
  ];

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-primary" />
          Quick Actions
        </div>
      }
      className="h-full"
      size="small"
    >
      <div className="grid grid-cols-3 gap-2">
        {quickActions.map((action, index) => (
          <Tooltip key={index} title={action.description}>
            <button
              onClick={action.action}
              className="flex flex-col items-center justify-center p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all duration-200 group"
            >
              <div 
                className="mb-1.5 p-2 rounded-full transition-colors"
                style={{ 
                  backgroundColor: `${action.color}15`,
                  color: action.color 
                }}
              >
                {action.icon}
              </div>
              <Text className="text-xs font-medium text-center group-hover:text-primary transition-colors">
                {action.label}
              </Text>
            </button>
          </Tooltip>
        ))}
      </div>
      
      {/* Create New Button */}
      <Button
        type="primary"
        icon={<Plus size={16} />}
        onClick={() => navigate('/create')}
        className="w-full mt-3"
      >
        Create New QR Code
      </Button>
    </Card>
  );
};

export default QuickActionsWidget;
