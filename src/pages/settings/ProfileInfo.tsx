import React, { useState } from 'react';
import { Card, Typography, Avatar, Button, Form, Input, message, Space, Upload, Select, UploadProps } from 'antd';
import { User, Check, Upload as UploadIcon, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authAPI } from '@/lib/api';

const { Title, Text } = Typography;

const { Option } = Select;

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
];

const timezones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Europe/Berlin', label: 'Berlin' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'Asia/Shanghai', label: 'Shanghai' },
  { value: 'Australia/Sydney', label: 'Sydney' },
];

const ProfileInfo: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [form] = Form.useForm();

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      const isLt1MB = file.size / 1024 / 1024 < 1;
      if (!isLt1MB) {
        message.error('Image must be smaller than 1MB!');
        return false;
      }
      setProfilePictureFile(file);
      return false; // Prevent auto upload
    },
    showUploadList: false,
  };

  // Initialize form with user data
  React.useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name || '',
        mobile: user.mobile || '',
        country: user.country || '',
        city: user.city || '',
        language: user.language || 'en',
        timezone: user.timezone || 'UTC',
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
      
      const formData = new FormData();
      formData.append('name', values.name);
      if (values.mobile) formData.append('mobile', values.mobile);
      if (values.country) formData.append('country', values.country);
      if (values.city) formData.append('city', values.city);
      if (values.language) formData.append('language', values.language);
      if (values.timezone) formData.append('timezone', values.timezone);
      if (profilePictureFile) {
        formData.append('profilePicture', profilePictureFile);
      }

      const response = await authAPI.updateProfile(formData);

      if (response.success) {
        updateUser(response.user);
        setProfilePictureFile(null);
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
          <div className="relative">
            <Avatar
              size={80}
              src={user?.profilePicture}
              className="bg-primary text-primary-foreground text-xl font-semibold"
              icon={<User size={32} />}
            >
              {user?.name && !user.profilePicture ? getInitials(user.name) : ''}
            </Avatar>
            <Upload {...uploadProps} className="absolute -bottom-2 -right-2">
              <Button
                size="small"
                shape="circle"
                icon={<UploadIcon size={14} />}
                className="bg-primary text-primary-foreground border-primary hover:bg-primary/90"
              />
            </Upload>
          </div>
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
            {profilePictureFile && (
              <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                <span>{profilePictureFile.name}</span>
                <Button
                  size="small"
                  type="text"
                  icon={<X size={12} />}
                  onClick={() => setProfilePictureFile(null)}
                  className="text-red-500 hover:text-red-700"
                />
              </div>
            )}
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

            <Form.Item
              label="Language"
              name="language"
            >
              <Select placeholder="Select your language">
                {languages.map(lang => (
                  <Option key={lang.value} value={lang.value}>{lang.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Timezone"
              name="timezone"
            >
              <Select placeholder="Select your timezone">
                {timezones.map(tz => (
                  <Option key={tz.value} value={tz.value}>{tz.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Card>

      
    </div>
  );
};

export default ProfileInfo;