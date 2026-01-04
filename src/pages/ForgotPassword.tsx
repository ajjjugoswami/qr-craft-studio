import React, { useState } from 'react';
import { Card, Input, Button, Typography, message, Divider } from 'antd';
import { ArrowLeft, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';

const { Title, Text } = Typography;

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      message.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      message.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await authAPI.sendResetOTP(email);
      message.success('Password reset code sent to your email');
      
      // Navigate to OTP verification page for password reset
      navigate('/otp-verification', {
        state: {
          email: email,
          type: 'reset'
        }
      });
    } catch (error: any) {
      console.error('Send OTP error:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to send reset code';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="p-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <Title level={2} className="mb-2">
              Reset Password
            </Title>
            <Text className="text-gray-600">
              Enter your email address and we'll send you a verification code to reset your password.
            </Text>
          </div>

          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <Text className="block text-sm font-medium mb-2">Email Address</Text>
              <Input
                size="large"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                prefix={<Mail size={16} />}
                disabled={loading}
                required
              />
            </div>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full"
              loading={loading}
            >
              Send Reset Code
            </Button>
          </form>

          <Divider />

          <div className="text-center">
            <Button
              type="link"
              onClick={() => navigate('/sign-in')}
              icon={<ArrowLeft size={16} />}
            >
              Back to Sign In
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;