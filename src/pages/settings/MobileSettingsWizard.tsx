import React, { useMemo, useState } from 'react';
import { Alert, Button, Card, Form, Input, Select, Avatar, Upload, message, Segmented, Switch } from 'antd';
import {
  User,
  Palette,
  Shield,
  Droplets,
  Tag,
  ChevronLeft,
  ChevronRight,
  Check,
  Upload as UploadIcon,
  X,
  Sun,
  Moon,
  Monitor,
  Save,
  Crown,
  ArrowUpRight,
  CreditCard,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authAPI } from '@/lib/api';
import { useTheme } from '@/hooks/useTheme';
import { themes, ThemeName, ThemeMode } from '@/context/themeTypes';
import { usePayment } from '@/hooks/usePayment';
import SubscriptionManagement from '@/components/payment/SubscriptionManagement';

const { Option } = Select;

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'hi', label: 'Hindi' },
];

const timezones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'New York' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
];

interface Step {
  key: string;
  title: string;
  icon: React.ReactNode;
  canSave?: boolean;
}

const MobileSettingsWizard: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { currentTheme, mode, setTheme, setMode } = useTheme();
  const { hasFeatureAccess } = usePayment();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [profileForm] = Form.useForm();
  const [securityForm] = Form.useForm();

  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(currentTheme);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

  // Watermark state
  const [removeWatermark, setRemoveWatermark] = useState<boolean>(user?.removeWatermark || false);
  const [watermarkText, setWatermarkText] = useState<string>(user?.watermarkText || 'QR Studio');

  // White-label state (keep shape compatible with existing user.whiteLabel)
  const [whiteLabelEnabled, setWhiteLabelEnabled] = useState<boolean>(user?.whiteLabel?.enabled || false);
  const [whiteLabelBrandName, setWhiteLabelBrandName] = useState<string>(user?.whiteLabel?.brandName || '');

  // Feature access
  const canRemoveWatermark = hasFeatureAccess('removeWatermark');
  const canUseWhiteLabel = hasFeatureAccess('whiteLabel');

  const steps: Step[] = useMemo(
    () => [
      { key: 'profile', title: 'Profile', icon: <User size={16} /> },
      { key: 'theme', title: 'Theme', icon: <Palette size={16} /> },
      { key: 'watermark', title: 'Watermark', icon: <Droplets size={16} /> },
      { key: 'whitelabel', title: 'White-Label', icon: <Tag size={16} /> },
      { key: 'subscription', title: 'Subscription', icon: <CreditCard size={16} />, canSave: false },
      { key: 'security', title: 'Security', icon: <Shield size={16} /> },
    ],
    []
  );

  // Detect system preference for effective mode calculation
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const effectiveMode = mode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : mode;
  const isDarkMode = effectiveMode === 'dark';

  React.useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        name: user.name || '',
        mobile: user.mobile || '',
        country: user.country || '',
        city: user.city || '',
        language: user.language || 'en',
        timezone: user.timezone || 'UTC',
      });

      // keep local states in sync when user changes
      setRemoveWatermark(user.removeWatermark || false);
      setWatermarkText(user.watermarkText || 'QR Studio');
      setWhiteLabelEnabled(user.whiteLabel?.enabled || false);
      setWhiteLabelBrandName(user.whiteLabel?.brandName || '');
    }
  }, [user, profileForm]);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const values = await profileForm.validateFields();

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
        message.success('Profile saved');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTheme = async () => {
    try {
      setLoading(true);
      await setTheme(selectedTheme);
      message.success('Theme saved');
    } catch {
      message.error('Failed to save theme');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWatermark = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('name', user?.name || '');
      formData.append('removeWatermark', String(removeWatermark));
      formData.append('watermarkText', watermarkText);

      const response = await authAPI.updateProfile(formData);
      if (response.success) {
        updateUser({
          ...response.user,
          removeWatermark,
          watermarkText,
        });
        message.success('Watermark saved');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWhiteLabel = async () => {
    try {
      setLoading(true);

      const config = {
        ...(user?.whiteLabel || {}),
        enabled: whiteLabelEnabled,
        brandName: whiteLabelBrandName,
      };

      const formData = new FormData();
      formData.append('name', user?.name || '');
      formData.append('whiteLabel', JSON.stringify(config));

      const response = await authAPI.updateProfile(formData);
      if (response.success) {
        updateUser({
          ...response.user,
          whiteLabel: config,
        });
        message.success('White-label saved');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      const values = await securityForm.validateFields();
      await authAPI.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success('Password changed');
      securityForm.resetFields();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (value: string | number) => {
    const newMode = value as ThemeMode;
    setMode(newMode);
    message.success(`${newMode.charAt(0).toUpperCase() + newMode.slice(1)} mode`);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleSaveCurrentStep = () => {
    const key = steps[currentStep]?.key;
    if (key === 'profile') handleSaveProfile();
    else if (key === 'theme') handleSaveTheme();
    else if (key === 'watermark') handleSaveWatermark();
    else if (key === 'whitelabel') handleSaveWhiteLabel();
    else if (key === 'security') handleChangePassword();
  };

  // Profile Step
  const ProfileStep = () => (
    <div className="mobile-wizard-step space-y-4 settings-compact">
      <div className="flex items-center gap-3 mb-1">
        <div className="relative">
          <Avatar
            size={48}
            src={user?.profilePicture}
            className="bg-primary text-primary-foreground"
            icon={<User size={20} />}
          >
            {user?.name && !user.profilePicture ? getInitials(user.name) : ''}
          </Avatar>
          <Upload
            beforeUpload={(file) => {
              const isImage = file.type.startsWith('image/');
              if (!isImage) {
                message.error('Only images allowed');
                return false;
              }
              setProfilePictureFile(file);
              return false;
            }}
            showUploadList={false}
          >
            <Button
              type="primary"
              size="small"
              shape="circle"
              icon={<UploadIcon size={12} />}
              className="absolute -bottom-1 -right-1 !w-6 !h-6 !min-w-0"
            />
          </Upload>
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">{user?.name || 'User'}</div>
          <div className="text-xs text-muted-foreground">{user?.email}</div>
          {profilePictureFile && (
            <div className="text-xs text-primary mt-1 flex items-center gap-1">
              {profilePictureFile.name.slice(0, 20)}...
              <Button
                type="text"
                size="small"
                icon={<X size={10} />}
                onClick={() => setProfilePictureFile(null)}
                className="!w-4 !h-4 !p-0"
              />
            </div>
          )}
        </div>
      </div>

      <Form form={profileForm} layout="vertical" size="small">
        <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
          <Input placeholder="Your name" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item label="Mobile" name="mobile">
            <Input placeholder="Phone" />
          </Form.Item>
          <Form.Item label="Country" name="country">
            <Input placeholder="Country" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item label="City" name="city">
            <Input placeholder="City" />
          </Form.Item>
          <Form.Item label="Language" name="language">
            <Select>
              {languages.map((l) => (
                <Option key={l.value} value={l.value}>
                  {l.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item label="Timezone" name="timezone">
          <Select showSearch optionFilterProp="label">
            {timezones.map((tz) => (
              <Option key={tz.value} value={tz.value}>
                {tz.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );

  // Theme Step
  const ThemeStep = () => (
    <div className="mobile-wizard-step space-y-4">
      <div className="text-sm font-medium mb-2">Appearance</div>
      <Segmented
        value={mode}
        onChange={handleModeChange}
        block
        size="middle"
        options={[
          {
            label: (
              <div className="flex items-center gap-1.5 py-1">
                <Sun size={14} />
                <span className="text-xs">Light</span>
              </div>
            ),
            value: 'light',
          },
          {
            label: (
              <div className="flex items-center gap-1.5 py-1">
                <Moon size={14} />
                <span className="text-xs">Dark</span>
              </div>
            ),
            value: 'dark',
          },
          {
            label: (
              <div className="flex items-center gap-1.5 py-1">
                <Monitor size={14} />
                <span className="text-xs">System</span>
              </div>
            ),
            value: 'system',
          },
        ]}
      />

      <div className="text-sm font-medium mb-2 mt-4">Color Theme</div>
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(themes)
          .slice(0, 12)
          .map(([key, theme]) => {
            const isGradient = key.startsWith('gradient_');
            const isSelected = selectedTheme === key;

            const background = isGradient
              ? `linear-gradient(135deg, hsl(${theme.colors.primary}) 0%, hsl(${theme.colors.accent}) 100%)`
              : isDarkMode
                ? `hsl(${theme.colors.primary} / 0.15)`
                : `hsl(${theme.colors.primaryLight})`;

            return (
              <div
                key={key}
                className={`relative p-2 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                }`}
                style={{ background }}
                onClick={() => setSelectedTheme(key as ThemeName)}
              >
                {isSelected && (
                  <div className="absolute top-1 right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                    <Check size={8} className="text-primary-foreground" />
                  </div>
                )}
                <div className="text-center">
                  <div className="flex justify-center gap-0.5 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `hsl(${theme.colors.primary})` }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `hsl(${theme.colors.accent})` }} />
                  </div>
                  <span className="text-[10px] font-medium">{theme.label}</span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );

  const WatermarkStep = () => (
    <div className="mobile-wizard-step space-y-4 settings-compact">
      {!canRemoveWatermark && (
        <Alert
          type="info"
          showIcon
          icon={<Crown size={16} />}
          message="Premium Feature"
          description={
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs">Upgrade to Pro to remove watermarks</span>
              <Button type="primary" size="small" icon={<ArrowUpRight size={14} />} onClick={() => navigate('/pricing')}>
                Upgrade
              </Button>
            </div>
          }
        />
      )}

      <div className={`rounded-lg border border-border p-3 bg-muted/30 ${!canRemoveWatermark ? 'opacity-60' : ''}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-medium">Remove watermark</div>
            <div className="text-xs text-muted-foreground">Turn off watermark for all QR codes</div>
          </div>
          <Switch checked={removeWatermark && canRemoveWatermark} onChange={setRemoveWatermark} disabled={!canRemoveWatermark} />
        </div>
      </div>

      <div className={removeWatermark && canRemoveWatermark ? 'opacity-50 pointer-events-none' : ''}>
        <div className="text-sm font-medium mb-1">Watermark text</div>
        <Input
          value={watermarkText}
          onChange={(e) => setWatermarkText(e.target.value)}
          maxLength={30}
          disabled={(removeWatermark && canRemoveWatermark) || !canRemoveWatermark}
          placeholder="e.g., Your Brand"
        />
        <div className="text-[11px] text-muted-foreground mt-1">{watermarkText.length}/30</div>
      </div>
    </div>
  );

  const WhiteLabelStep = () => (
    <div className="mobile-wizard-step space-y-4 settings-compact">
      {!canUseWhiteLabel && (
        <Alert
          type="info"
          showIcon
          icon={<Crown size={16} />}
          message="Premium Feature"
          description={
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs">Upgrade to Pro to enable white-label</span>
              <Button type="primary" size="small" icon={<ArrowUpRight size={14} />} onClick={() => navigate('/pricing')}>
                Upgrade
              </Button>
            </div>
          }
        />
      )}

      <div className={`rounded-lg border border-border p-3 bg-muted/30 ${!canUseWhiteLabel ? 'opacity-60' : ''}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-medium">Enable white-label</div>
            <div className="text-xs text-muted-foreground">Remove branding on redirect pages</div>
          </div>
          <Switch checked={whiteLabelEnabled && canUseWhiteLabel} onChange={setWhiteLabelEnabled} disabled={!canUseWhiteLabel} />
        </div>
      </div>

      <div className={!whiteLabelEnabled || !canUseWhiteLabel ? 'opacity-50 pointer-events-none' : ''}>
        <div className="text-sm font-medium mb-1">Brand name</div>
        <Input value={whiteLabelBrandName} onChange={(e) => setWhiteLabelBrandName(e.target.value)} maxLength={50} placeholder="Your brand" />
      </div>
    </div>
  );

  const SubscriptionStep = () => (
    <div className="mobile-wizard-step space-y-3">
      <SubscriptionManagement showPaymentHistory={false} />
    </div>
  );

  // Security Step
  const SecurityStep = () => (
    <div className="mobile-wizard-step space-y-4 settings-compact">
      <div className="text-sm font-medium mb-2 flex items-center gap-2">
        <Shield size={16} />
        Change Password
      </div>

      <Form form={securityForm} layout="vertical" size="small">
        <Form.Item name="currentPassword" label="Current Password" rules={[{ required: true, message: 'Required' }]}>
          <Input.Password placeholder="Current password" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: 'Required' },
            { min: 8, message: 'Min 8 characters' },
          ]}
        >
          <Input.Password placeholder="New password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Required' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                return Promise.reject(new Error('Passwords must match'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm password" />
        </Form.Item>
      </Form>
    </div>
  );

  const renderStep = () => {
    const key = steps[currentStep]?.key;
    if (key === 'profile') return <ProfileStep />;
    if (key === 'theme') return <ThemeStep />;
    if (key === 'watermark') return <WatermarkStep />;
    if (key === 'whitelabel') return <WhiteLabelStep />;
    if (key === 'subscription') return <SubscriptionStep />;
    if (key === 'security') return <SecurityStep />;
    return null;
  };

  const canSave = steps[currentStep]?.canSave !== false;

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)]">
      {/* Step indicator */}
      <div className="mb-4">
        <div className="mobile-step-indicator">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={`mobile-step-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            />
          ))}
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            {steps[currentStep].icon}
            {steps[currentStep].title}
          </div>
          <div className="text-xs text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </div>

      {/* Step content */}
      <Card className="flex-1 !p-3" bodyStyle={{ padding: 12 }}>
        {renderStep()}
      </Card>

      {/* Navigation */}
      <div className="mobile-wizard-nav flex items-center gap-2">
        <Button
          onClick={handlePrev}
          disabled={currentStep === 0}
          icon={<ChevronLeft size={14} />}
          className="flex-1"
        >
          Back
        </Button>

        <Button
          type="primary"
          onClick={handleSaveCurrentStep}
          loading={loading}
          icon={<Save size={14} />}
          className="flex-1"
          disabled={!canSave}
        >
          Save
        </Button>

        <Button
          type={currentStep === steps.length - 1 ? 'default' : 'primary'}
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="flex-1"
        >
          Next
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
};

export default MobileSettingsWizard;

