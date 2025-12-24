import React, { useState } from 'react';
import { Typography, Card, Form, Input, Button, Switch, message } from 'antd';
import { Shield, Key, Smartphone } from 'lucide-react';

const { Title, Text } = Typography;

const SecuritySettings: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleToggle2FA = (checked: boolean) => {
    console.log('2FA Toggle:', checked ? 'Enabled' : 'Disabled');
    setTwoFactorEnabled(checked);
    message.success(`Two-Factor Authentication ${checked ? 'enabled' : 'disabled'} (console only)`);
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log('Change Password Request:', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success('Password change logged to console (API not connected)');
      form.resetFields();
    } catch (error) {
      // Validation error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <Card className="shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <Title level={4} className="mb-0 flex items-center gap-2">
            <Smartphone size={18} />
            Two-Factor Authentication
          </Title>
        </div>
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <Text strong>Enable 2FA</Text>
            <Text type="secondary" className="block text-sm">
              Add an extra layer of security to your account
            </Text>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onChange={handleToggle2FA}
          />
        </div>
        {twoFactorEnabled && (
          <div className="mt-4 p-4 border border-dashed border-primary/30 rounded-lg">
            <Text type="secondary" className="text-sm">
              2FA is enabled. In production, you would see a QR code here to scan with your authenticator app.
            </Text>
          </div>
        )}
      </Card>

      {/* Change Password */}
      <Card className="shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <Title level={4} className="mb-0 flex items-center gap-2">
            <Key size={18} />
            Change Password
          </Title>
        </div>
        <Form form={form} layout="vertical" className="max-w-md">
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password placeholder="Enter current password" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter a new password' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>
          <Button
            type="primary"
            icon={<Shield size={16} />}
            onClick={handleChangePassword}
            loading={loading}
          >
            Update Password
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default SecuritySettings;
