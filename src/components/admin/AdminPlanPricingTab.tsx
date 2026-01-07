import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Spin, Typography } from 'antd';
import { DollarSign } from 'lucide-react';
import { adminAPI } from '@/lib/api';

const { Title } = Typography;

interface PlanPrices {
  basic: {
    monthlyPrice: number;
    yearlyPrice: number;
  };
  pro: {
    monthlyPrice: number;
    yearlyPrice: number;
  };
}

const AdminPlanPricingTab: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchCurrentPrices();
  }, []);

  const fetchCurrentPrices = async () => {
    try {
      setFetchLoading(true);
      const response = await adminAPI.getPlanPrices();
      if (response.success) {
        const { basic, pro } = response.prices;
        form.setFieldsValue({
          basicMonthly: basic.monthlyPrice,
          basicYearly: basic.yearlyPrice,
          proMonthly: pro.monthlyPrice,
          proYearly: pro.yearlyPrice,
        });
      }
    } catch (error) {
      message.error('Failed to fetch current prices');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        basic: {
          monthlyPrice: parseInt(values.basicMonthly),
          yearlyPrice: parseInt(values.basicYearly),
        },
        pro: {
          monthlyPrice: parseInt(values.proMonthly),
          yearlyPrice: parseInt(values.proYearly),
        },
      };

      const response = await adminAPI.updatePlanPrices(payload);
      if (response.success) {
        message.success('Plan prices updated successfully');
        fetchCurrentPrices(); // Refresh the form with new values
      } else {
        message.error('Failed to update prices');
      }
    } catch (error) {
      message.error('Failed to update plan prices');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="w-6 h-6 text-gray-600" />
        <Title level={4} className="!mb-0">Plan Pricing Management</Title>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="max-w-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Plan */}
            <div className="space-y-4">
              <Title level={5}>Basic Plan</Title>
              <Form.Item
                label="Monthly Price (₹)"
                name="basicMonthly"
                rules={[
                  { required: true, message: 'Please enter monthly price' },
                  {
                    validator: (_, value) => {
                      const num = parseFloat(value);
                      if (isNaN(num) || num <= 0) {
                        return Promise.reject(new Error('Price must be a positive number'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input type="number" placeholder="149" min="1" />
              </Form.Item>
              <Form.Item
                label="Yearly Price (₹)"
                name="basicYearly"
                rules={[
                  { required: true, message: 'Please enter yearly price' },
                  {
                    validator: (_, value) => {
                      const num = parseFloat(value);
                      if (isNaN(num) || num <= 0) {
                        return Promise.reject(new Error('Price must be a positive number'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input type="number" placeholder="1700" min="1" />
              </Form.Item>
            </div>

            {/* Pro Plan */}
            <div className="space-y-4">
              <Title level={5}>Pro Plan</Title>
              <Form.Item
                label="Monthly Price (₹)"
                name="proMonthly"
                rules={[
                  { required: true, message: 'Please enter monthly price' },
                  {
                    validator: (_, value) => {
                      const num = parseFloat(value);
                      if (isNaN(num) || num <= 0) {
                        return Promise.reject(new Error('Price must be a positive number'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input type="number" placeholder="299" min="1" />
              </Form.Item>
              <Form.Item
                label="Yearly Price (₹)"
                name="proYearly"
                rules={[
                  { required: true, message: 'Please enter yearly price' },
                  {
                    validator: (_, value) => {
                      const num = parseFloat(value);
                      if (isNaN(num) || num <= 0) {
                        return Promise.reject(new Error('Price must be a positive number'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input type="number" placeholder="3500" min="1" />
              </Form.Item>
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
            >
              Update Prices
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AdminPlanPricingTab;