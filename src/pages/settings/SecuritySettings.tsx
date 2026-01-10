import React, { useState } from "react";
import { Typography, Card, Form, Input, Button, Switch, message, Tooltip } from "antd";
import { Shield, Key, Smartphone, HelpCircle } from "lucide-react";
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
    <div className="space-y-4 sm:space-y-6">
      {/* Change Password */}
      <Card className="shadow-sm">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Title level={4} className="mb-0 flex items-center gap-2 text-base sm:text-lg">
            <Key size={window.innerWidth < 640 ? 16 : 18} />
            Change Password
          <Tooltip 
            title="Update your account password. Use a strong password with at least 8 characters including letters, numbers, and symbols for better security."
            color="white"
            overlayInnerStyle={{ color: '#333' }}
          >
            <HelpCircle size={14} className="text-muted-foreground hover:text-foreground transition-colors cursor-help" />
            </Tooltip>
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
            icon={<Shield size={window.innerWidth < 640 ? 14 : 16} />}
            onClick={handleChangePassword}
            loading={loading}
            size={window.innerWidth < 640 ? "small" : "middle"}
            className="text-xs sm:text-sm"
          >
            {window.innerWidth < 640 ? "Update" : "Update Password"}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default SecuritySettings;
