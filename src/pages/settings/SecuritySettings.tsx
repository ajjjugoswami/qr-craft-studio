import React, { useState } from "react";
import { Typography, Card, Form, Input, Button, Switch, message } from "antd";
import { Shield, Key, Smartphone } from "lucide-react";
import { authAPI } from "@/lib/api";

const { Title, Text } = Typography;

const SecuritySettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await authAPI.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success("Password changed");
      form.resetFields();
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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
            rules={[
              { required: true, message: "Please enter your current password" },
            ]}
          >
            <Input.Password placeholder="Enter current password" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter a new password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
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
