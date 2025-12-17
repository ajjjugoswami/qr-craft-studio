import React, { useState } from 'react';
import { Card, Input, Button, Typography, Divider, message } from 'antd';
import { QrCode, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const { Title, Text, Paragraph } = Typography;

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Redirect to dashboard if already signed in
  React.useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const { signin, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      message.error('Please fill in all required fields');
      return;
    }

    if (!isLogin && !formData.name) {
      message.error('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signin(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      // errors are displayed inside hook via antd message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-500/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <QrCode size={32} className="text-white" />
          </div>
          <Title level={2} className="!mb-1">QR Studio</Title>
          <Text type="secondary">Professional QR Code Generator</Text>
        </div>

        {/* Auth Card */}
        <Card className="shadow-xl border-0" styles={{ body: { padding: '32px' } }}>
          <Title level={3} className="!mb-2 text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Title>
          <Paragraph type="secondary" className="text-center mb-6">
            {isLogin 
              ? 'Sign in to manage your QR codes' 
              : 'Get started with your free account'}
          </Paragraph>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                <Input
                  size="large"
                  prefix={<User size={18} className="text-muted-foreground mr-2" />}
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}

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
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {isLogin && (
              <div className="text-right">
                <Button type="link" className="!p-0 !h-auto text-sm">
                  Forgot password?
                </Button>
              </div>
            )}

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="w-full h-12 text-base font-medium"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>

          <Divider className="!my-6">
            <Text type="secondary" className="text-xs">OR</Text>
          </Divider>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button 
              size="large" 
              className="w-full h-11 flex items-center justify-center gap-2"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              }
            >
              Continue with Google
            </Button>
          </div>

          {/* Toggle Login/Signup */}
          <div className="text-center mt-6">
            <Text type="secondary">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <Button 
              type="link" 
              className="!p-0 !h-auto font-medium"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <Text type="secondary" className="text-xs">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Auth;