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
  if (!url || typeof url !== 'string' || url.trim() === '') return false;
  const trimmed = url.trim();

  // Accept explicit image sources
  if (/^data:image\//i.test(trimmed)) return true;
  if (/^blob:/i.test(trimmed)) return true;

  // Only treat http(s) URLs as images if they look like image files
  if (!/^https?:\/\//i.test(trimmed)) return false;
  return /\.(png|jpe?g|webp|gif|bmp|svg)(\?.*)?$/i.test(trimmed);
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
  const [uploadedPublicId, setUploadedPublicId] = useState<string | null>(null);

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

  const generateMeCardString = (values: Record<string, string>) => {
    return `MECARD:N:${values.lastName || ''},${values.firstName || ''};TEL:${values.phone || ''};EMAIL:${values.email || ''};URL:${values.website || ''};ADR:${values.address || ''};;`;
  };

  const generateWifiString = (values: Record<string, string>) => {
    return `WIFI:T:${values.encryption || 'WPA'};S:${values.ssid || ''};P:${values.password || ''};;`;
  };

  const generateEmailString = (values: Record<string, string>) => {
    return `mailto:${values.email || ''}?subject=${encodeURIComponent(values.subject || '')}&body=${encodeURIComponent(values.body || '')}`;
  };

  const generateEventString = (values: Record<string, string>) => {
    const startDate = values.startDate ? values.startDate.replace(/-/g, '').replace(/:/g, '') + '00' : '';
    const endDate = values.endDate ? values.endDate.replace(/-/g, '').replace(/:/g, '') + '00' : '';
    return `BEGIN:VEVENT
SUMMARY:${values.eventTitle || ''}
LOCATION:${values.eventLocation || ''}
DTSTART:${startDate}
DTEND:${endDate}
DESCRIPTION:${values.eventDescription || ''}
END:VEVENT`;
  };

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    let generatedContent = '';

    switch (type) {
      case 'vcard':
        generatedContent = generateVCardString(values);
        break;
      case 'mecard':
        generatedContent = generateMeCardString(values);
        break;
      case 'wifi':
        generatedContent = generateWifiString(values);
        break;
      case 'email':
        generatedContent = generateEmailString(values);
        break;
      case 'event':
        generatedContent = generateEventString(values);
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
      case 'tiktok':
        generatedContent = `https://tiktok.com/@${values.username || ''}`;
        break;
      case 'twitter':
        generatedContent = `https://x.com/${values.username || ''}`;
        break;
      case 'linkedin':
        generatedContent = values.profileUrl || '';
        break;
      case 'spotify':
        generatedContent = values.spotifyUrl || '';
        break;
      case 'telegram':
        generatedContent = `https://t.me/${values.username || ''}`;
        break;
      case 'paypal':
        generatedContent = `https://paypal.me/${values.username || ''}`;
        break;
      case 'pdf':
      case 'video':
      case 'audio':
        generatedContent = values.fileUrl || '';
        break;
      case 'review':
        generatedContent = values.reviewUrl || '';
        break;
      case 'feedback':
        generatedContent = values.feedbackUrl || '';
        break;
      case 'coupon':
        generatedContent = JSON.stringify({
          code: values.couponCode || '',
          discount: values.discount || '',
          description: values.couponDescription || '',
          validUntil: values.validUntil || ''
        });
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
      case 'tiktok':
      case 'twitter':
      case 'telegram':
      case 'paypal':
        return (
          <Form.Item 
            name="username" 
            label={type === 'paypal' ? 'PayPal.me Username' : type === 'telegram' ? 'Telegram Username' : 'Username'} 
            rules={[{ required: true }]}
          >
            <Input 
              placeholder="yourusername" 
              size="large" 
              addonBefore="@" 
              onChange={handleFormChange} 
            />
          </Form.Item>
        );

      case 'youtube':
        return (
          <Form.Item name="channel" label="YouTube Channel/Video URL" rules={[{ required: true }]}>
            <Input placeholder="https://youtube.com/..." size="large" prefix={<LinkOutlined />} onChange={handleFormChange} />
          </Form.Item>
        );

      case 'linkedin':
        return (
          <Form.Item name="profileUrl" label="LinkedIn Profile URL" rules={[{ required: true }]}>
            <Input placeholder="https://linkedin.com/in/yourprofile" size="large" prefix={<LinkOutlined />} onChange={handleFormChange} />
          </Form.Item>
        );

      case 'spotify':
        return (
          <Form.Item name="spotifyUrl" label="Spotify URL (Artist, Playlist, or Track)" rules={[{ required: true }]}>
            <Input placeholder="https://open.spotify.com/..." size="large" prefix={<LinkOutlined />} onChange={handleFormChange} />
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

      case 'mecard':
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

      case 'event':
        return (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="eventTitle" label="Event Title" rules={[{ required: true }]}>
                <Input placeholder="Team Meeting" onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="startDate" label="Start Date & Time" rules={[{ required: true }]}>
                <Input type="datetime-local" onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label="End Date & Time" rules={[{ required: true }]}>
                <Input type="datetime-local" onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="eventLocation" label="Location">
                <Input placeholder="Conference Room A" onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="eventDescription" label="Description">
                <TextArea rows={3} placeholder="Event details..." onChange={handleFormChange} />
              </Form.Item>
            </Col>
          </Row>
        );

      case 'pdf':
      case 'video':
      case 'audio':
        return (
          <Form.Item 
            name="fileUrl" 
            label={type === 'pdf' ? 'PDF/Document URL' : type === 'video' ? 'Video URL' : 'Audio URL'} 
            rules={[{ required: true }]}
          >
            <Input 
              placeholder={
                type === 'pdf' ? 'https://example.com/document.pdf' : 
                type === 'video' ? 'https://example.com/video.mp4' : 
                'https://example.com/audio.mp3'
              } 
              size="large" 
              prefix={<LinkOutlined />} 
              onChange={handleFormChange} 
            />
          </Form.Item>
        );

      case 'review':
        return (
          <Form.Item name="reviewUrl" label="Google Review URL" rules={[{ required: true }]}>
            <Input 
              placeholder="https://g.page/r/..." 
              size="large" 
              prefix={<LinkOutlined />} 
              onChange={handleFormChange} 
            />
          </Form.Item>
        );

      case 'feedback':
        return (
          <Form.Item name="feedbackUrl" label="Feedback/Survey URL" rules={[{ required: true }]}>
            <Input 
              placeholder="https://forms.google.com/..." 
              size="large" 
              prefix={<LinkOutlined />} 
              onChange={handleFormChange} 
            />
          </Form.Item>
        );

      case 'coupon':
        return (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="couponCode" label="Coupon Code" rules={[{ required: true }]}>
                <Input placeholder="SAVE20" size="large" onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="discount" label="Discount">
                <Input placeholder="20% OFF" size="large" onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="couponDescription" label="Description">
                <TextArea rows={2} placeholder="Valid for all products..." onChange={handleFormChange} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="validUntil" label="Valid Until">
                <Input type="date" onChange={handleFormChange} />
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
                      setUploadedPublicId(res.public_id || null);
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
            <div className="mt-4 flex items-start gap-3">
              {isUploading ? (
                <div className="w-56 h-56 flex items-center justify-center border border-border rounded-md">
                  <Spin />
                </div>
              ) : (
                isValidImageUrl(content) && (
                  <div className="relative">
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

                    {/* Remove button */}
                    <div style={{ position: 'absolute', top: -8, right: -8 }}>
                      <Button
                        size="small"
                        danger
                        onClick={async () => {
                          // confirm before removing
                          const confirm = window.confirm('Remove this image? This will only remove the reference and optionally delete the uploaded image if it was uploaded from this session.');
                          if (!confirm) return;

                          // If we have public id, attempt deletion on server
                          if (uploadedPublicId) {
                            try {
                              const res: any = await uploadsAPI.deleteQRImage(uploadedPublicId);
                              if (res && res.success) {
                                onContentChange('');
                                setUploadedPublicId(null);
                                message.success('Image removed');
                              } else {
                                message.error(res?.message || 'Failed to remove image');
                              }
                            } catch (e: any) {
                              message.error(e?.response?.data?.message || e?.message || 'Failed to remove image');
                            }
                          } else {
                            // No public id known — just clear the reference
                            onContentChange('');
                            message.success('Image reference removed');
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
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
