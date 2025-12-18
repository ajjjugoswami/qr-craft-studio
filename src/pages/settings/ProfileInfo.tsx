/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, Typography, Avatar, Button, Form, Input, message, Space } from 'antd';
import { User, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authAPI } from '@/lib/api';

const { Title, Text } = Typography;

const ProfileInfo: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Initialize form with user data
  React.useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name || '',
        mobile: user.mobile || '',
        country: user.country || '',
        city: user.city || '',
      });
    }
  }, [user, form]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const response = await authAPI.updateProfile(values);

      if (response.success) {
        updateUser(response.user);
        message.success('Profile updated successfully');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Information Card */}
      <Card className="shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <Title level={4} className="mb-0 flex items-center gap-2">
            <User size={18} />
            Profile Information
          </Title>
          <Button
            type="primary"
            icon={<Check size={16} />}
            onClick={handleSaveProfile}
            loading={loading}
          >
            Save Changes
          </Button>
        </div>

        <div className="flex items-center space-x-6 mb-6">
          <Avatar
            size={80}
            className="bg-primary text-primary-foreground text-xl font-semibold"
            icon={<User size={32} />}
          >
            {user?.name ? getInitials(user.name) : 'U'}
          </Avatar>
          <div className="flex-1">
            <div className="text-sm text-gray-500 mb-2">
              Member since {new Date().toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
              {user?.isAdmin ? 'Admin' : 'User'}
            </div>
          </div>
        </div>

        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input placeholder="Enter your full name" />
            </Form.Item>

            <Form.Item label="Email">
              <Input value={user?.email} disabled />
            </Form.Item>

            <Form.Item
              label="Mobile Number"
              name="mobile"
            >
              <Input placeholder="Enter your mobile number" />
            </Form.Item>

            <Form.Item
              label="Country"
              name="country"
            >
              <Input placeholder="Enter your country" />
            </Form.Item>

            <Form.Item
              label="City"
              name="city"
            >
              <Input placeholder="Enter your city" />
            </Form.Item>
          </div>
        </Form>
      </Card>

      {/* Account Actions Card */}
      <Card className="shadow-sm">
        <Title level={4} className="mb-4 flex items-center gap-2">
          <User size={18} />
          Account Actions
        </Title>
        <Space direction="vertical" className="w-full">
          <Button type="default" className="w-full justify-start">
            Change Password
          </Button>
          <Button type="default" className="w-full justify-start">
            Download Account Data
          </Button>
          <Button type="default" danger className="w-full justify-start">
            Delete Account
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default ProfileInfo;