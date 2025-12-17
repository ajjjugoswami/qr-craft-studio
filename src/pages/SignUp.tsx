import React, { useState, useEffect } from 'react';
import { Input, Button, message, Spin } from 'antd';
import { Eye, EyeOff, QrCode, Sparkles, Shield, Zap } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import authImage from '@/assets/auth-qr-templates.jpg';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { user, signup, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Spin size="large" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      message.error('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 8) {
      message.error('Password must be at least 8 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      // errors shown in hook
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    message.info('Google sign-up coming soon');
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 h-full flex flex-col">
        {/* Logo Header */}
        <div className="px-6 sm:px-12 lg:px-16 xl:px-20 pt-6">
          <div className="flex items-center gap-2">
           <img src="/logo.png" alt="QR Studio" className="w-16 h-16 object-contain" />
            <span className="text-lg font-bold text-foreground">QR Studio</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-20">
          <div className="max-w-[480px] mx-auto w-full">
            {/* Header */}
            <div className="mb-4">
              <h1 className="text-2xl sm:text-[28px] font-semibold text-foreground mb-2 flex items-center gap-2">
                Create Account 
              </h1>
              <p className="text-[#8A8A8A] text-[13px] leading-relaxed">
                Start your journey today.
                <br className="hidden sm:block" />
                Sign up to create and manage your QR codes.
              </p>
            </div>

            {/* Features */}
            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-1.5 text-xs text-[#8A8A8A]">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#8A8A8A]">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Fast</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Full Name</label>
                <Input
                  size="large"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-10 rounded-lg border-0 bg-[#F0F5FA] placeholder:text-[#A0AEC0] text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Email</label>
                <Input
                  size="large"
                  type="email"
                  placeholder="Example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-10 rounded-lg border-0 bg-[#F0F5FA] placeholder:text-[#A0AEC0] text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Password</label>
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
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  className="h-10 rounded-lg border-0 bg-[#F0F5FA] placeholder:text-[#A0AEC0] text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Confirm Password</label>
                <Input
                  size="large"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  suffix={
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                      className="text-[#A0AEC0] hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  className="h-10 rounded-lg border-0 bg-[#F0F5FA] placeholder:text-[#A0AEC0] text-sm"
                />
              </div>

              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                className="w-full h-10 text-sm font-semibold rounded-lg bg-[#162D3A] hover:bg-[#1a3847] border-none !mt-4"
              >
                Sign up
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-[#E8E8E8]"></div>
              <span className="px-3 text-[#8A8A8A] text-xs">Or</span>
              <div className="flex-1 h-px bg-[#E8E8E8]"></div>
            </div>

            {/* Social Button */}
            <button
              onClick={handleGoogleSignUp}
              className="w-full h-10 flex items-center justify-center gap-2 rounded-lg bg-[#F9F5EB] hover:bg-[#f5f0e3] transition-colors text-foreground text-sm font-medium"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>

            {/* Sign In Link */}
            <div className="text-center mt-4">
              <span className="text-[#8A8A8A] text-sm">Already have an account? </span>
              <Link to="/signin" className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors">
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-[#8A8A8A] text-[11px]">© 2023 ALL RIGHTS RESERVED</p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 p-3 h-full">
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

export default SignUp;
