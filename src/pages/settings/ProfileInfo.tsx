import React, { useState, useCallback } from 'react';
import { Card, Typography, Avatar, Button, Form, Input, message, Space, Upload, Select, UploadProps, Modal, Slider, Tooltip } from 'antd';
import { User, Check, Upload as UploadIcon, X, Eye, Crop, HelpCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authAPI } from '@/lib/api';
import Cropper, { Area } from 'react-easy-crop';

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
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  // Americas
  { value: 'America/New_York', label: 'America - New York (Eastern Time)' },
  { value: 'America/Chicago', label: 'America - Chicago (Central Time)' },
  { value: 'America/Denver', label: 'America - Denver (Mountain Time)' },
  { value: 'America/Los_Angeles', label: 'America - Los Angeles (Pacific Time)' },
  { value: 'America/Toronto', label: 'America - Toronto' },
  { value: 'America/Mexico_City', label: 'America - Mexico City' },
  { value: 'America/Sao_Paulo', label: 'America - São Paulo' },
  { value: 'America/Buenos_Aires', label: 'America - Buenos Aires' },
  // Europe
  { value: 'Europe/London', label: 'Europe - London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Europe - Paris (CET)' },
  { value: 'Europe/Berlin', label: 'Europe - Berlin (CET)' },
  { value: 'Europe/Rome', label: 'Europe - Rome' },
  { value: 'Europe/Madrid', label: 'Europe - Madrid' },
  { value: 'Europe/Amsterdam', label: 'Europe - Amsterdam' },
  { value: 'Europe/Stockholm', label: 'Europe - Stockholm' },
  { value: 'Europe/Moscow', label: 'Europe - Moscow' },
  // Asia
  { value: 'Asia/Dubai', label: 'Asia - Dubai (UAE)' },
  { value: 'Asia/Kolkata', label: 'Asia - India (IST)' },
  { value: 'Asia/Mumbai', label: 'Asia - Mumbai (IST)' },
  { value: 'Asia/Delhi', label: 'Asia - Delhi (IST)' },
  { value: 'Asia/Bangalore', label: 'Asia - Bangalore (IST)' },
  { value: 'Asia/Karachi', label: 'Asia - Karachi (Pakistan)' },
  { value: 'Asia/Dhaka', label: 'Asia - Dhaka (Bangladesh)' },
  { value: 'Asia/Bangkok', label: 'Asia - Bangkok (Thailand)' },
  { value: 'Asia/Singapore', label: 'Asia - Singapore' },
  { value: 'Asia/Hong_Kong', label: 'Asia - Hong Kong' },
  { value: 'Asia/Shanghai', label: 'Asia - Shanghai (China)' },
  { value: 'Asia/Tokyo', label: 'Asia - Tokyo (Japan)' },
  { value: 'Asia/Seoul', label: 'Asia - Seoul (South Korea)' },
  { value: 'Asia/Jakarta', label: 'Asia - Jakarta (Indonesia)' },
  { value: 'Asia/Manila', label: 'Asia - Manila (Philippines)' },
  // Australia & Pacific
  { value: 'Australia/Sydney', label: 'Australia - Sydney' },
  { value: 'Australia/Melbourne', label: 'Australia - Melbourne' },
  { value: 'Australia/Brisbane', label: 'Australia - Brisbane' },
  { value: 'Australia/Perth', label: 'Australia - Perth' },
  { value: 'Pacific/Auckland', label: 'Pacific - Auckland (New Zealand)' },
  // Africa
  { value: 'Africa/Cairo', label: 'Africa - Cairo (Egypt)' },
  { value: 'Africa/Johannesburg', label: 'Africa - Johannesburg (South Africa)' },
  { value: 'Africa/Lagos', label: 'Africa - Lagos (Nigeria)' },
  { value: 'Africa/Nairobi', label: 'Africa - Nairobi (Kenya)' },
];

const timeFormats = [
  { value: '12', label: '12-hour (2:30 PM)' },
  { value: '24', label: '24-hour (14:30)' },
];

// Helper function to create cropped image
const createCroppedImage = async (
  imageSrc: string,
  pixelCrop: Area
): Promise<File> => {
  const image = new Image();
  image.src = imageSrc;
  
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], 'profile-picture.jpg', { type: 'image/jpeg' });
          resolve(file);
        } else {
          reject(new Error('Canvas is empty'));
        }
      },
      'image/jpeg',
      0.9
    );
  });
};

const ProfileInfo: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [form] = Form.useForm();

  // Crop states
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      const isLt3MB = file.size / 1024 / 1024 < 3;
      if (!isLt3MB) {
        message.error('Image must be smaller than 3MB!');
        return false;
      }
      
      // Read file and open crop modal
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setCropModalVisible(true);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };
      reader.readAsDataURL(file);
      
      return false; // Prevent auto upload
    },
    showUploadList: false,
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;
    
    try {
      const croppedFile = await createCroppedImage(imageToCrop, croppedAreaPixels);
      setProfilePictureFile(croppedFile);
      setCropModalVisible(false);
      setImageToCrop(null);
      message.success('Image cropped successfully');
    } catch (error) {
      message.error('Failed to crop image');
    }
  };

  const handleCropCancel = () => {
    setCropModalVisible(false);
    setImageToCrop(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
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
        timeFormat: user.timeFormat || '12',
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

  const handleAvatarClick = () => {
    if (user?.profilePicture) {
      setPreviewVisible(true);
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', user?.name || '');
      formData.append('mobile', user?.mobile || '');
      formData.append('country', user?.country || '');
      formData.append('city', user?.city || '');
      formData.append('language', user?.language || 'en');
      formData.append('timezone', user?.timezone || 'UTC');
      formData.append('timeFormat', user?.timeFormat || '12');
      formData.append('profilePicture', ''); // Remove profile picture

      const response = await authAPI.updateProfile(formData);

      if (response.success) {
        updateUser(response.user);
        message.success('Profile picture removed successfully');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to remove profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Check if any data has actually changed
      const hasNameChanged = values.name !== (user?.name || '');
      const hasMobileChanged = values.mobile !== (user?.mobile || '');
      const hasCountryChanged = values.country !== (user?.country || '');
      const hasCityChanged = values.city !== (user?.city || '');
      const hasLanguageChanged = values.language !== (user?.language || 'en');
      const hasTimezoneChanged = values.timezone !== (user?.timezone || 'UTC');
      const hasTimeFormatChanged = values.timeFormat !== (user?.timeFormat || '12');
      const hasProfilePictureChanged = !!profilePictureFile;
      
      const hasAnyChanges = hasNameChanged || hasMobileChanged || hasCountryChanged || 
                           hasCityChanged || hasLanguageChanged || hasTimezoneChanged || 
                           hasTimeFormatChanged || hasProfilePictureChanged;
      
      if (!hasAnyChanges) {
        message.info('No changes to save');
        setLoading(false);
        return;
      }
      
      const formData = new FormData();
      formData.append('name', values.name);
      if (values.mobile) formData.append('mobile', values.mobile);
      if (values.country) formData.append('country', values.country);
      if (values.city) formData.append('city', values.city);
      if (values.language) formData.append('language', values.language);
      if (values.timezone) formData.append('timezone', values.timezone);
      if (values.timeFormat) formData.append('timeFormat', values.timeFormat);
      
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
        <div className="flex items-center justify-between gap-2 mb-6">
          <Title level={5} className="!mb-0 flex items-center gap-2">
            <User size={18} />
            Profile Information
            <Tooltip
              title="Manage your personal information, profile picture, and preferences."
              color="white"
              overlayInnerStyle={{ color: '#333' }}
            >
              <HelpCircle size={14} className="text-muted-foreground hover:text-foreground transition-colors cursor-help" />
            </Tooltip>
          </Title>
          <Button
            type="primary"
            icon={<Check size={window.innerWidth < 640 ? 14 : 16} />}
            onClick={handleSaveProfile}
            loading={loading}
            size={window.innerWidth < 640 ? "small" : "middle"}
            className="text-xs sm:text-sm"
          >
            {window.innerWidth < 640 ? "Save" : "Save"}
          </Button>
        </div>

        <div className="flex items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="relative flex-shrink-0">
            {user?.profilePicture ? (
              <div
                className="bg-primary text-primary-foreground font-semibold overflow-hidden rounded-full flex items-center justify-center cursor-pointer"
                onClick={handleAvatarClick}
                style={{
                  width: window.innerWidth < 640 ? '80px' : '64px',
                  height: window.innerWidth < 640 ? '80px' : '64px',
                  minWidth: window.innerWidth < 640 ? '80px' : '64px',
                  minHeight: window.innerWidth < 640 ? '80px' : '64px',
                  backgroundImage: `url(${user.profilePicture})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            ) : (
              <Avatar
                src={user?.profilePicture}
                className="bg-primary text-primary-foreground font-semibold overflow-hidden [&_img]:object-cover [&_img]:object-center"
                icon={<User size={window.innerWidth < 640 ? 32 : 28} />}
                onClick={handleAvatarClick}
                style={{
                  cursor: user?.profilePicture ? 'pointer' : 'default',
                  fontSize: window.innerWidth < 640 ? '20px' : '16px',
                  width: window.innerWidth < 640 ? '80px !important' : '64px !important',
                  height: window.innerWidth < 640 ? '80px !important' : '64px !important',
                  minWidth: window.innerWidth < 640 ? '80px !important' : '64px !important',
                  minHeight: window.innerWidth < 640 ? '80px !important' : '64px !important'
                }}
              >
                {user?.name && !user.profilePicture ? getInitials(user.name) : ''}
              </Avatar>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm text-muted-foreground mb-1">
              Member since {new Date().toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              })}
            </div>
            <div className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-success/10 text-success text-xs font-medium mb-2 sm:mb-3">
              {user?.isAdmin ? 'Admin' : 'User'}
            </div>

            <div className="flex flex-row sm:flex-row sm:items-center gap-2">
              {user?.profilePicture && (
                <Button
                  type="default"
                  danger
                  size={window.innerWidth < 640 ? "small" : "small"}
                  icon={<X size={12} />}
                  onClick={handleRemoveProfilePicture}
                  loading={loading}
                  className="text-xs"
                >
                 Remove
                </Button>
              )}
              <Upload {...uploadProps}>
                <Button
                  type="primary"
                  size={window.innerWidth < 640 ? "small" : "small"}
                  icon={<UploadIcon size={12} />}
                  className="text-xs"
                >
                  {window.innerWidth < 640 ? "Upload" : "Upload Photo"}
                </Button>
              </Upload>
            </div>

            {profilePictureFile && (
              <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <span className="truncate max-w-[150px] sm:max-w-[200px]">{profilePictureFile.name}</span>
                <Button
                  size="small"
                  type="text"
                  icon={<X size={10} />}
                  onClick={() => setProfilePictureFile(null)}
                  className="!p-1"
                  aria-label="Clear selected image"
                />
              </div>
            )}
          </div>
        </div>
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

            <Form.Item label="Mobile Number" name="mobile">
              <Input placeholder="Enter your mobile number" />
            </Form.Item>

            <Form.Item label="Country" name="country">
              <Input placeholder="Enter your country" />
            </Form.Item>

            <Form.Item label="City" name="city">
              <Input placeholder="Enter your city" />
            </Form.Item>

            <Form.Item label="Language" name="language">
              <Select placeholder="Select your language">
                {languages.map((lang) => (
                  <Option key={lang.value} value={lang.value}>
                    {lang.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Timezone" name="timezone">
              <Select placeholder="Select your timezone" showSearch optionFilterProp="label">
                {timezones.map((tz) => (
                  <Option key={tz.value} value={tz.value}>
                    {tz.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Time Format" name="timeFormat">
              <Select placeholder="Select time format">
                {timeFormats.map((tf) => (
                  <Option key={tf.value} value={tf.value}>
                    {tf.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Card>

      <Modal
        open={previewVisible}
        title="Profile Picture"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        centered
        width={600}
        destroyOnHidden
      >
        <img
          alt="Profile Picture"
          style={{ width: '100%', height: 'auto' }}
          src={user?.profilePicture}
        />
      </Modal>

      {/* Crop Modal */}
      <Modal
        open={cropModalVisible}
        title={
          <div className="flex items-center gap-2">
            <Crop size={18} />
            Crop Image
          </div>
        }
        onCancel={handleCropCancel}
        centered
        width={500}
        destroyOnHidden
        footer={
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={handleCropCancel} size="small">
              Cancel
            </Button>
            <Button type="primary" onClick={handleCropSave} size="small">
              Crop & Save
            </Button>
          </div>
        }
      >
        <div className="relative w-full h-[350px] bg-muted/50 rounded-lg overflow-hidden my-4">
          {imageToCrop && (
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              objectFit="contain"
              style={{
                containerStyle: {
                  background: 'hsl(var(--muted) / 0.3)',
                },
              }}
            />
          )}
        </div>
        <div className="mt-4">
          <Text className="block mb-2">Zoom: {Math.round(zoom * 100)}%</Text>
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(value) => setZoom(value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ProfileInfo;