import { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Select,
  DatePicker,
  Button,
  message,
  Descriptions,
  Tag,
  Space,
  Divider,
} from 'antd';
import { CrownOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '@/lib/api';

const { Option } = Select;

interface UserSubscriptionModalProps {
  visible: boolean;
  onCancel: () => void;
  userId: string | null;
  userName: string;
  userEmail: string;
  onSuccess?: () => void;
}

interface UserSubscriptionData {
  user: {
    _id: string;
    name: string;
    email: string;
    subscriptionPlan: string;
    subscriptionStatus: string;
    isOnTrial: boolean;
  };
  subscription: {
    planType: keyof typeof planFeatures;
    status: string;
    startDate: string;
    endDate?: string;
    isTrialSubscription?: boolean;
    trialEndDate?: string;
  } | null;
}

const planOptions = [
  { value: 'free', label: 'Free Plan', color: 'default' },
  { value: 'basic', label: 'Basic Plan', color: 'blue' },
  { value: 'pro', label: 'Pro Plan', color: 'gold' },
  { value: 'enterprise', label: 'Enterprise Plan', color: 'purple' },
  { value: 'trial', label: 'Trial Plan (Premium)', color: 'orange' },
] as const;

const planFeatures = {
  free: { maxQRCodes: 5, maxScansPerQR: 20 },
  basic: { maxQRCodes: 50, maxScansPerQR: 1000 },
  pro: { maxQRCodes: 200, maxScansPerQR: 10000 },
  enterprise: { maxQRCodes: -1, maxScansPerQR: -1 },
  trial: { maxQRCodes: -1, maxScansPerQR: -1 }, // Premium unlimited
};

const UserSubscriptionModal: React.FC<UserSubscriptionModalProps> = ({
  visible,
  onCancel,
  userId,
  userName,
  userEmail,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [currentData, setCurrentData] = useState<UserSubscriptionData | null>(
    null
  );

  useEffect(() => {
    if (visible && userId) {
      fetchCurrentSubscription();
    }
  }, [visible, userId]);

  const fetchCurrentSubscription = async () => {
    setDataLoading(true);
    try {
      const { data } = await api.get(
        `/admin/users/${userId}/subscription`
      );

      if (data?.success) {
        setCurrentData(data.data);
        form.setFieldsValue({
          planType: data.data.subscription?.planType ?? 'free',
          endDate: data.data.subscription?.endDate
            ? dayjs(data.data.subscription.endDate)
            : null,
        });
      }
    } catch (err) {
      message.error('Failed to fetch subscription data');
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    if (!userId) return;

    setLoading(true);
    try {
      const payload = {
        planType: values.planType,
        endDate: values.endDate?.toISOString() ?? null,
      };

      const { data } = await api.put(
        `/admin/users/${userId}/subscription`,
        payload
      );

      if (data?.success) {
        message.success('Subscription updated successfully');
        onSuccess?.();
        handleCancel();
      } else {
        message.error(data?.message || 'Update failed');
      }
    } catch {
      message.error('Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setCurrentData(null);
    onCancel();
  };

  const renderCurrentSubscription = () => {
    if (!currentData?.subscription) {
      return (
        <div className="text-center py-4">
          <Tag>No active subscription</Tag>
        </div>
      );
    }

    const { subscription, user } = currentData;
    const features = planFeatures[subscription.planType];

    return (
      <Descriptions
        title={
          <span>
            <UserOutlined /> Current Subscription
          </span>
        }
        bordered
        size="small"
        column={1}
        className="mb-6"
      >
        <Descriptions.Item label="Plan">
          <Tag
            color={
              planOptions.find(p => p.value === subscription.planType)?.color
            }
          >
            {
              planOptions.find(p => p.value === subscription.planType)?.label
            }
          </Tag>
          {user.isOnTrial && <Tag color="orange">Trial</Tag>}
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <Tag color={subscription.status === 'active' ? 'green' : 'red'}>
            {subscription.status}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Limits">
          <Space direction="vertical" size={0}>
            <span>
              QR Codes:{' '}
              {features.maxQRCodes === -1
                ? 'Unlimited'
                : features.maxQRCodes}
            </span>
            <span>
              Scans per QR:{' '}
              {features.maxScansPerQR === -1
                ? 'Unlimited'
                : features.maxScansPerQR.toLocaleString()}
            </span>
          </Space>
        </Descriptions.Item>

        {subscription.endDate && (
          <Descriptions.Item label="End Date">
            {dayjs(subscription.endDate).format('MMMM D, YYYY')}
          </Descriptions.Item>
        )}
      </Descriptions>
    );
  };

  return (
    <Modal
      open={visible}
      title={
        <span>
          <CrownOutlined /> Manage Subscription – {userName}
        </span>
      }
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnHidden
    >
      {dataLoading ? (
        <div className="text-center py-8">Loading subscription data…</div>
      ) : (
        <>
          <div className="mb-4">
            <strong>{userEmail}</strong>
          </div>

          {renderCurrentSubscription()}

          <Divider>Update Subscription</Divider>

          <Form
            form={form}
            layout="vertical"
            initialValues={{ planType: 'free' }}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="planType"
              label="Plan Type"
              rules={[{ required: true }]}
            >
              <Select size="large">
                {planOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    <Space>
                      <Tag color={option.color}>{option.label}</Tag>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(p, c) => p.planType !== c.planType}
            >
              {({ getFieldValue }) =>
                getFieldValue('planType') !== 'free' && (
                  <Form.Item
                    name="endDate"
                    label="End Date (Optional)"
                  >
                    <DatePicker
                      size="large"
                      disabledDate={d =>
                        d && d.isBefore(dayjs().startOf('day'))
                      }
                      suffixIcon={<CalendarOutlined />}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                )
              }
            </Form.Item>

            <div className="flex justify-end gap-2 pt-4">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Subscription
              </Button>
            </div>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default UserSubscriptionModal;
