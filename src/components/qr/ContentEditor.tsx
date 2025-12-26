import React, { useState } from 'react';
import { Form, Input, Select, Typography, Row, Col, Upload, Button, message, Spin } from 'antd';
import {
  LinkOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { QRType } from '../../types/qrcode';
import { uploadsAPI } from '@/lib/api';

const isValidImageUrl = (url?: string) => {
  if (!url || typeof url !== 'string') return false;
  return /^https?:\/\//i.test(url) || /^data:/i.test(url) || /^blob:/i.test(url);
};

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ContentEditorProps {
  type: QRType;
  content: string;
  name: string;
  onNameChange: (name: string) => void;
  onContentChange: (content: string) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  type,
  content,
  name,
  onNameChange,
  onContentChange,
}) => {
  const [form] = Form.useForm();
  const [isUploading, setIsUploading] = useState<boolean>(false);

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
      case 'phone':
        generatedContent = `tel:${values.phone || ''}`;
        break;
      case 'sms':
        generatedContent = `sms:${values.phone || ''}${values.message ? `?body=${encodeURIComponent(values.message)}` : ''}`;
        break;
      case 'location':
        generatedContent = `geo:${values.lat || '0'},${values.lng || '0'}`;
        break;
      case 'instagram':
        generatedContent = `https://instagram.com/${values.username || ''}`;
        break;
      case 'facebook':
        generatedContent = `https://facebook.com/${values.username || ''}`;
        break;
      case 'youtube':
        generatedContent = values.channel || '';
        break;
      case 'whatsapp':
        generatedContent = `https://wa.me/${values.phone || ''}${values.message ? `?text=${encodeURIComponent(values.message)}` : ''}`;
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

      case 'phone':
        return (
          <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
            <Input placeholder="+1 234 567 890" size="large" prefix={<PhoneOutlined />} onChange={handleFormChange} />
          </Form.Item>
        );

      case 'sms':
        return (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                <Input placeholder="+1 234 567 890" size="large" prefix={<PhoneOutlined />} onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="message" label="Pre-filled Message (Optional)">
                <TextArea rows={3} placeholder="Your message..." onChange={handleFormChange} />
              </Form.Item>
            </Col>
          </Row>
        );

      case 'location':
        return (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="lat" label="Latitude" rules={[{ required: true }]}>
                <Input placeholder="40.7128" size="large" prefix={<EnvironmentOutlined />} onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="lng" label="Longitude" rules={[{ required: true }]}>
                <Input placeholder="-74.0060" size="large" onChange={handleFormChange} />
              </Form.Item>
            </Col>
          </Row>
        );

      case 'instagram':
      case 'facebook':
        return (
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input placeholder="yourusername" size="large" addonBefore="@" onChange={handleFormChange} />
          </Form.Item>
        );

      case 'youtube':
        return (
          <Form.Item name="channel" label="YouTube Channel/Video URL" rules={[{ required: true }]}>
            <Input placeholder="https://youtube.com/..." size="large" prefix={<LinkOutlined />} onChange={handleFormChange} />
          </Form.Item>
        );

      case 'whatsapp':
        return (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="phone" label="WhatsApp Number (with country code)" rules={[{ required: true }]}>
                <Input placeholder="1234567890" size="large" prefix={<PhoneOutlined />} onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="message" label="Pre-filled Message (Optional)">
                <TextArea rows={3} placeholder="Hi! I want to..." onChange={handleFormChange} />
              </Form.Item>
            </Col>
          </Row>
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

      case 'image':
        return (
          <Form.Item label="Upload Image">
            <Upload
              accept="image/*"
              showUploadList={false}
              disabled={false}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('Only image files are allowed');
                  return false;
                }
                const isLt2MB = file.size / 1024 / 1024 < 2;
                if (!isLt2MB) {
                  message.error('Image must be smaller than 2MB!');
                  return false;
                }

                // Upload file
                (async () => {
                  setIsUploading(true);
                  const hideMsg = message.loading('Uploading image...', 0);
                  try {
                    const res: any = await uploadsAPI.uploadQRImage(file);
                    if (res && res.success && res.url) {
                      onContentChange(res.url);
                      message.success('Image uploaded');
                    } else {
                      message.error(res?.message || 'Upload failed');
                    }
                  } catch (e: any) {
                    message.error(e?.response?.data?.message || e?.message || 'Upload failed');
                  } finally {
                    hideMsg();
                    setIsUploading(false);
                  }
                })();

                return false; // prevent auto upload
              }}
            >
              <Button size="large" disabled={isUploading}>Select Image</Button>
            </Upload>

            {/* Show spinner while uploading, show image preview only after a successful upload and only when URL is valid */}
            <div className="mt-4">
              {isUploading ? (
                <div className="w-56 h-56 flex items-center justify-center border border-border rounded-md">
                  <Spin />
                </div>
              ) : (
                isValidImageUrl(content) && (
                  <div
                    role="img"
                    aria-label="Uploaded image preview"
                    style={{
                      width: 220,
                      height: 220,
                      borderRadius: 8,
                      backgroundImage: `url(${content})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '1px solid var(--border)',
                    }}
                  />
                )
              )}
            </div>
          </Form.Item>
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
      <div className="mb-6">
        <Title level={4} className="!mb-1">Enter Content</Title>
      </div>

      <Form form={form} layout="vertical" initialValues={{ content }} className="max-w-2xl">
        <Form.Item 
          label="QR Code Title" 
          required
          tooltip="This helps you identify the QR code in your dashboard"
        >
          <Input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="My awesome QR code"
            size="large"
          />
        </Form.Item>

        {renderContentForm()}
      </Form>
    </div>
  );
};

export default ContentEditor;
