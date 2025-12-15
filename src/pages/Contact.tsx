import React from 'react';
import { Typography, Card, Form, Input, Button, message } from 'antd';
import { MailOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';
import DashboardLayout from '../components/layout/DashboardLayout';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Contact: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: Record<string, string>) => {
    console.log('Contact form submitted:', values);
    message.success('Message sent successfully!');
    form.resetFields();
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <Title level={2} className="mb-2">Contact Us</Title>
        <Text type="secondary" className="block mb-8">
          Have questions or feedback? We'd love to hear from you.
        </Text>

        <Card className="max-w-2xl">
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Your name" size="large" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="your@email.com" size="large" />
            </Form.Item>

            <Form.Item
              name="message"
              label="Message"
              rules={[{ required: true, message: 'Please enter your message' }]}
            >
              <TextArea
                rows={6}
                placeholder="How can we help you?"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                Send Message
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Contact;
