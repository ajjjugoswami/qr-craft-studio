import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Typography, Divider, message } from 'antd';
import { QrCode, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const { Title, Text, Paragraph } = Typography;

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { user, signin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      message.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await signin(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      // errors shown in hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-500/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <QrCode size={32} className="text-white" />
          </div>
          <Title level={2} className="!mb-1">QR Studio</Title>
          <Text type="secondary">Professional QR Code Generator</Text>
        </div>

        <Card className="shadow-xl border-0" styles={{ body: { padding: '32px' } }}>
          <Title level={3} className="!mb-2 text-center">Welcome Back</Title>
          <Paragraph type="secondary" className="text-center mb-6">Sign in to manage your QR codes</Paragraph>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email Address</label>
              <Input
                size="large"
                type="email"
                prefix={<Mail size={18} className="text-muted-foreground mr-2" />}
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <Input
                size="large"
                type={showPassword ? 'text' : 'password'}
                prefix={<Lock size={18} className="text-muted-foreground mr-2" />}
                suffix={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="text-right">
              <Button type="link" className="!p-0 !h-auto text-sm">Forgot password?</Button>
            </div>

            <Button type="primary" htmlType="submit" size="large" loading={loading} className="w-full h-12 text-base font-medium">
              Sign In
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>

          <Divider className="!my-6"><Text type="secondary" className="text-xs">OR</Text></Divider>

          <div className="text-center mt-6">
            <Text type="secondary">Don&apos;t have an account? </Text>
            <Link to="/signup">
              <Button type="link" className="!p-0 !h-auto font-medium">Create account</Button>
            </Link>
          </div>
        </Card>

        <div className="text-center mt-6">
          <Text type="secondary" className="text-xs">By continuing, you agree to our Terms of Service and Privacy Policy</Text>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
