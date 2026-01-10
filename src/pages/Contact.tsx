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
      contact: "winning11.in@gmail.com",
      color: "#6366f1",
      action: "mailto:winning11.in@gmail.com",
    },
    // Phone support temporarily hidden
    // {
    //   icon: <HeadphonesIcon size={24} />,
    //   title: "Phone Support",
    //   description: "Speak directly with our customer service team",
    //   contact: "+1 (555) 123-4567",
    //   color: "#f59e0b",
    //   action: "tel:+15551234567",
    // },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-3 sm:p-6 animate-fade-in">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-12">
          <Title level={2} className="!text-xl sm:!text-2xl lg:!text-3xl mb-2 sm:mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Contact Us
          </Title>
          <Text type="secondary" className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto block">
            Have questions, feedback, or need help? We're here to assist you.
          </Text>
        </div>

        <Row gutter={[16, 16]}>
          {/* Contact Methods */}
          <Col xs={24} lg={12}>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <Title level={4} className="!text-base sm:!text-lg mb-3 sm:mb-6">Get in Touch</Title>
                <Text type="secondary" className="text-sm sm:text-base mb-4 sm:mb-8 block">
                  Choose the contact method that works best for you.
                </Text>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:gap-4">
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
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 rounded-lg flex-shrink-0" style={{ backgroundColor: `${method.color}20`, color: method.color }}>
                        {method.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Title level={5} className="!text-sm sm:!text-base !mb-1">{method.title}</Title>
                        <Text type="secondary" className="text-xs sm:text-sm block mb-1 sm:mb-2">{method.description}</Text>
                        <Text strong style={{ color: method.color }} className="text-sm sm:text-base break-all">{method.contact}</Text>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Additional Info */}
              <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
                <Title level={5} className="!text-sm sm:!text-base !mb-2 sm:!mb-3">Business Hours</Title>
                <div className="space-y-1 text-xs sm:text-sm">
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
              <div className="mb-4 sm:mb-6">
                <Title level={4} className="!text-base sm:!text-lg !mb-2">Send us a Message</Title>
                <Text type="secondary" className="text-sm">
                  Fill out the form and we'll get back to you soon.
                </Text>
              </div>

              <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
                <Row gutter={[12, 0]}>
                  <Col xs={24} sm={12}>
                    <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Please enter your name" }]}>
                      <Input prefix={<User size={16} className="text-gray-400" />} placeholder="Your name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please enter your email" }, { type: "email", message: "Please enter a valid email" }]}>
                      <Input prefix={<AtSign size={16} className="text-gray-400" />} placeholder="your@email.com" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="subject" label="Subject" rules={[{ required: true, message: "Please enter a subject" }]}>
                  <Input prefix={<Hash size={16} className="text-gray-400" />} placeholder="What's this about?" />
                </Form.Item>

                <Form.Item name="message" label="Message" rules={[{ required: true, message: "Please enter your message" }]}>
                  <TextArea 
                    rows={3} 
                    placeholder="Tell us how we can help..." 
                  />
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
