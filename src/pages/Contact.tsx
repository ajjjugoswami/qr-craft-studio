/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Typography,
  Card,
  Form,
  Input,
  Button,
  Space,
  Row,
  Col,
} from "antd";
import {
  Send,
  Clock,
  HeadphonesIcon,
  Mail,
  User,
  AtSign,
  Hash,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useContacts } from "@/hooks/useContacts";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Contact: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { submitContact } = useContacts();

  const handleSubmit = async (values: { name: string; email: string; subject: string; message: string }) => {
    setLoading(true);
    try {
      await submitContact(values);
      form.resetFields();
    } catch {
      // Error handled in hook
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: <Mail size={24} />,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      contact: "support@qrcraftstudio.com",
      color: "#6366f1",
      action: "mailto:support@qrcraftstudio.com",
    },
    {
      icon: <HeadphonesIcon size={24} />,
      title: "Phone Support",
      description: "Speak directly with our customer service team",
      contact: "+1 (555) 123-4567",
      color: "#f59e0b",
      action: "tel:+15551234567",
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6 animate-fade-in">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title level={1} className="mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Contact Us
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions, feedback, or need help? We're here to assist you every step of the way.
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {/* Contact Methods */}
          <Col xs={24} lg={12}>
            <div className="space-y-6">
              <div>
                <Title level={3} className="mb-6">Get in Touch</Title>
                <Paragraph className="text-gray-600 mb-8">
                  Choose the contact method that works best for you. Our team is ready to help!
                </Paragraph>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {contactMethods.map((method, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4"
                    style={{ borderLeftColor: method.color }}
                    onClick={() =>
                      method.action.startsWith("http") || method.action.startsWith("/")
                        ? (window.location.href = method.action)
                        : window.open(method.action, "_blank")
                    }
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg flex-shrink-0" style={{ backgroundColor: `${method.color}20`, color: method.color }}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <Title level={4} className="mb-1">{method.title}</Title>
                        <Paragraph className="text-gray-600 mb-2 text-sm">{method.description}</Paragraph>
                        <Text strong style={{ color: method.color }}>{method.contact}</Text>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Additional Info */}
              <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <Clock size={20} className="text-primary" />
                  <Title level={5} className="mb-0">Business Hours</Title>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Monday - Friday: 9:00 AM - 6:00 PM EST</div>
                  <div>Saturday: 10:00 AM - 4:00 PM EST</div>
                  <div>Sunday: Closed</div>
                </div>
              </Card>
            </div>
          </Col>

          {/* Contact Form */}
          <Col xs={24} lg={12}>
            <Card className="shadow-lg">
              <div className="mb-6">
                <Title level={3} className="mb-2">Send us a Message</Title>
                <Paragraph className="text-gray-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </Paragraph>
              </div>

              <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Please enter your name" }]}>
                      <Input prefix={<User size={16} className="text-gray-400" />} placeholder="Your full name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="email" label="Email Address" rules={[{ required: true, message: "Please enter your email" }, { type: "email", message: "Please enter a valid email" }]}>
                      <Input prefix={<AtSign size={16} className="text-gray-400" />} placeholder="your@email.com" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="subject" label="Subject" rules={[{ required: true, message: "Please enter a subject" }]}>
                  <Input prefix={<Hash size={16} className="text-gray-400" />} placeholder="What's this about?" />
                </Form.Item>

                <Form.Item name="message" label="Message" rules={[{ required: true, message: "Please enter your message" }]}>
                  <TextArea rows={6} placeholder="Tell us how we can help you..." className="resize-none" />
                </Form.Item>

                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    icon={<Send size={16} />}
                    className="w-full bg-gradient-to-r from-primary to-purple-600 border-none hover:from-primary/90 hover:to-purple-600/90"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default Contact;
