import React from 'react';
import { Form, Input, Select, Typography, Card, Row, Col } from 'antd';
import {
  LinkOutlined,
  UserOutlined,
  WifiOutlined,
  MailOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ContentEditorProps {
  type: 'url' | 'vcard' | 'text' | 'wifi' | 'email';
  content: string;
  onTypeChange: (type: 'url' | 'vcard' | 'text' | 'wifi' | 'email') => void;
  onContentChange: (content: string) => void;
}

const qrTypes = [
  { value: 'url', label: 'URL / Website', icon: <LinkOutlined /> },
  { value: 'vcard', label: 'vCard / Contact', icon: <UserOutlined /> },
  { value: 'text', label: 'Plain Text', icon: <FileTextOutlined /> },
  { value: 'wifi', label: 'WiFi Network', icon: <WifiOutlined /> },
  { value: 'email', label: 'Email', icon: <MailOutlined /> },
];

const ContentEditor: React.FC<ContentEditorProps> = ({
  type,
  content,
  onTypeChange,
  onContentChange,
}) => {
  const [form] = Form.useForm();

  const generateVCardString = (values: Record<string, string>) => {
    return `BEGIN:VCARD
VERSION:3.0
N:${values.lastName || ''};${values.firstName || ''}
FN:${values.firstName || ''} ${values.lastName || ''}
ORG:${values.company || ''}
TITLE:${values.title || ''}
TEL:${values.phone || ''}
EMAIL:${values.email || ''}
URL:${values.website || ''}
ADR:;;${values.address || ''}
END:VCARD`;
  };

  const generateWifiString = (values: Record<string, string>) => {
    return `WIFI:T:${values.encryption || 'WPA'};S:${values.ssid || ''};P:${values.password || ''};;`;
  };

  const generateEmailString = (values: Record<string, string>) => {
    return `mailto:${values.email || ''}?subject=${encodeURIComponent(values.subject || '')}&body=${encodeURIComponent(values.body || '')}`;
  };

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    let generatedContent = '';

    switch (type) {
      case 'vcard':
        generatedContent = generateVCardString(values);
        break;
      case 'wifi':
        generatedContent = generateWifiString(values);
        break;
      case 'email':
        generatedContent = generateEmailString(values);
        break;
      default:
        generatedContent = values.content || '';
    }

    onContentChange(generatedContent);
  };

  const renderContentForm = () => {
    switch (type) {
      case 'url':
        return (
          <Form.Item
            name="content"
            label="Website URL"
            rules={[{ required: true, message: 'Please enter a URL' }]}
          >
            <Input
              placeholder="https://example.com"
              size="large"
              prefix={<LinkOutlined />}
              onChange={(e) => onContentChange(e.target.value)}
            />
          </Form.Item>
        );

      case 'vcard':
        return (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="firstName" label="First Name">
                <Input placeholder="John" onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="lastName" label="Last Name">
                <Input placeholder="Doe" onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Email">
                <Input placeholder="john@example.com" onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone">
                <Input placeholder="+1 234 567 890" onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="company" label="Company">
                <Input placeholder="Company Inc." onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="title" label="Job Title">
                <Input placeholder="Software Engineer" onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="website" label="Website">
                <Input placeholder="https://yourwebsite.com" onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="address" label="Address">
                <Input placeholder="123 Main St, City, Country" onChange={handleFormChange} />
              </Form.Item>
            </Col>
          </Row>
        );

      case 'wifi':
        return (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="ssid" label="Network Name (SSID)">
                <Input placeholder="MyWiFiNetwork" onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="password" label="Password">
                <Input.Password placeholder="Enter password" onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="encryption" label="Encryption">
                <Select defaultValue="WPA" onChange={handleFormChange}>
                  <Select.Option value="WPA">WPA/WPA2</Select.Option>
                  <Select.Option value="WEP">WEP</Select.Option>
                  <Select.Option value="nopass">None</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        );

      case 'email':
        return (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="email" label="Email Address">
                <Input placeholder="recipient@example.com" onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="subject" label="Subject">
                <Input placeholder="Email subject" onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="body" label="Message">
                <TextArea rows={4} placeholder="Email body..." onChange={handleFormChange} />
              </Form.Item>
            </Col>
          </Row>
        );

      case 'text':
      default:
        return (
          <Form.Item name="content" label="Text Content">
            <TextArea
              rows={6}
              placeholder="Enter your text content here..."
              onChange={(e) => onContentChange(e.target.value)}
            />
          </Form.Item>
        );
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <Title level={3}>Enter Your Content</Title>
        <Text type="secondary">Choose the QR code type and fill in the details</Text>
      </div>

      <Card className="max-w-2xl mx-auto">
        <Form form={form} layout="vertical" initialValues={{ content }}>
          <Form.Item label="QR Code Type" className="mb-6">
            <Select
              value={type}
              onChange={onTypeChange}
              size="large"
              options={qrTypes.map((t) => ({
                value: t.value,
                label: (
                  <span className="flex items-center gap-2">
                    {t.icon} {t.label}
                  </span>
                ),
              }))}
            />
          </Form.Item>

          {renderContentForm()}
        </Form>
      </Card>
    </div>
  );
};

export default ContentEditor;
