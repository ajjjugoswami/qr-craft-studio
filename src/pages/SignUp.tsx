import React, { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import { Eye, EyeOff, Shield, Zap } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import authImage from '@/assets/auth-qr-templates.jpg';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { user, signup } = useAuth();
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
    } catch {
      // errors shown in hook
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    message.info('Google sign-up coming soon');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Logo Header */}
        <div className="px-4 sm:px-8 lg:px-12 xl:px-16 pt-6 lg:pt-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="QR Studio" className="w-12 h-12 lg:w-16 lg:h-16 object-contain" />
            <span className="text-lg lg:text-xl font-bold text-foreground">QR Studio</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-12 xl:px-16 py-8 lg:py-0">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                Create Account
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Start your journey today.
              </p>
            </div>

            {/* Features */}
            <div className="flex gap-4 sm:gap-6 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Fast</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
                <Input
                  size="large"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11 rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                <Input
                  size="large"
                  type="email"
                  placeholder="Example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-11 rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
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
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  className="h-11 rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Confirm Password</label>
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
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  className="h-11 rounded-lg"
                />
              </div>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-11 text-sm font-semibold rounded-lg !mt-4"
              >
                Sign up
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="px-4 text-muted-foreground text-sm">Or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Social Button */}
            <button
              onClick={handleGoogleSignUp}
              className="w-full h-11 flex items-center justify-center gap-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground text-sm font-medium"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </button>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <span className="text-muted-foreground text-sm">Already have an account? </span>
              <Link to="/sign-in" className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors">
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 lg:py-6">
          <p className="text-muted-foreground text-xs">© 2026 ALL RIGHTS RESERVED</p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 p-3 min-h-screen">
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
