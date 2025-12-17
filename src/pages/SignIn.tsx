import React, { useState, useEffect } from 'react';
import { Input, Button, Divider, message, Spin } from 'antd';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import authImage from '@/assets/auth-qr-templates.jpg';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { user, signin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spin size="large" />
      </div>
    );
  }

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

  const handleGoogleSignIn = () => {
    message.info('Google sign-in coming soon');
  };

  const handleFacebookSignIn = () => {
    message.info('Facebook sign-in coming soon');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between px-6 sm:px-12 lg:px-16 xl:px-24 py-8">
        <div className="flex-1 flex flex-col justify-center max-w-[360px] mx-auto w-full">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[28px] font-semibold italic text-foreground mb-3">
              Welcome Back 👋
            </h1>
            <p className="text-[#8A8A8A] text-[15px] leading-relaxed">
              Today is a new day. It's your day. You shape it.
              <br />
              Sign in to start managing your projects.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[13px] font-medium text-foreground mb-1.5 block">
                Email
              </label>
              <Input
                size="large"
                type="email"
                placeholder="Example@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-11 rounded-lg border-0 bg-[#F0F5FA] placeholder:text-[#A0AEC0] text-[14px]"
              />
            </div>

            <div>
              <label className="text-[13px] font-medium text-foreground mb-1.5 block">
                Password
              </label>
              <Input
                size="large"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                suffix={
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="text-[#A0AEC0] hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                className="h-11 rounded-lg border-0 bg-[#F0F5FA] placeholder:text-[#A0AEC0] text-[14px]"
              />
            </div>

            <div className="text-right">
              <button type="button" className="text-[13px] text-primary hover:text-primary/80 font-medium transition-colors">
                Forgot Password?
              </button>
            </div>

            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              className="w-full h-11 text-[15px] font-semibold rounded-lg bg-[#162D3A] hover:bg-[#1a3847] border-none"
            >
              Sign in
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-[#E8E8E8]"></div>
            <span className="px-4 text-[#8A8A8A] text-[13px]">Or</span>
            <div className="flex-1 h-px bg-[#E8E8E8]"></div>
          </div>

          {/* Social Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleSignIn}
              className="w-full h-11 flex items-center justify-center gap-3 rounded-lg bg-[#F9F5EB] hover:bg-[#f5f0e3] transition-colors text-foreground text-[14px] font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            <button
              onClick={handleFacebookSignIn}
              className="w-full h-11 flex items-center justify-center gap-3 rounded-lg bg-[#F9F5EB] hover:bg-[#f5f0e3] transition-colors text-foreground text-[14px] font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Sign in with Facebook
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <span className="text-[#8A8A8A] text-[14px]">Don't you have an account? </span>
            <Link to="/signup" className="text-primary hover:text-primary/80 text-[14px] font-semibold transition-colors">
              Sign up
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8">
          <p className="text-[#8A8A8A] text-[12px]">© 2023 ALL RIGHTS RESERVED</p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 p-3">
        <div className="h-full w-full rounded-3xl overflow-hidden">
          <img 
            src={authImage} 
            alt="QR Code Templates" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
