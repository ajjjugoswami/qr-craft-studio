import React, { useState, useEffect, useMemo } from 'react';
import { Button, Typography, message, Spin, Input, Breadcrumb } from 'antd';
import { Home, Mail, Clock, RefreshCw, Lock, Eye, EyeOff, Check, X, Shield, Zap, KeyRound } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import OTPInput from '@/components/common/OTPInput';
import { 
  passwordRequirements, 
  getPasswordStrength, 
  getPasswordStrengthClasses,
  isPasswordStrong 
} from '@/utils/passwordValidation';

const { Title, Text } = Typography;



interface LocationState {
  email?: string;
  name?: string;
  password?: string;
  type?: 'verification' | 'reset';
  newPassword?: string;
}

const OTPVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useAuth();
  const state = location.state as LocationState;
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength calculation
  const passwordStrength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);
  
  // Check if all password requirements are met
  const allRequirementsMet = useMemo(
    () => isPasswordStrong(newPassword),
    [newPassword]
  );

  // Redirect if no email in state
  useEffect(() => {
    if (!state?.email) {
      navigate('/signup', { replace: true });
    }
  }, [state, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      message.error('Please enter a complete 6-digit OTP');
      return;
    }

    if (!state?.email) {
      message.error('Email information missing');
      return;
    }

    // For password reset, validate the new password
    if (state.type === 'reset') {
      if (!newPassword || !confirmPassword) {
        message.error('Please enter and confirm your new password');
        return;
      }
      if (!allRequirementsMet) {
        message.error('Password does not meet all requirements');
        return;
      }
      if (newPassword !== confirmPassword) {
        message.error('Passwords do not match');
        return;
      }
    }

    setLoading(true);
    try {
      if (state.type === 'verification' && state.name && state.password) {
        // Email verification for signup
        const result = await authAPI.verifyEmailOTP(state.email, otp);
        
        if (result.success && result.verificationToken) {
          // Complete signup with verification token
          await signup(state.name, state.email, state.password, result.verificationToken);
          message.success('Account created successfully!');
          navigate('/dashboard');
        } else {
          message.error('Verification failed');
        }
      } else if (state.type === 'reset') {
        // Password reset verification - use locally collected password
        const result = await authAPI.verifyResetOTP(state.email, otp, newPassword);
        
        if (result.success) {
          message.success('Password has been reset successfully!');
          navigate('/sign-in');
        } else {
          message.error('Password reset failed');
        }
      } else {
        message.error('Invalid verification type');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      const errorMessage = error?.response?.data?.message || 'OTP verification failed';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!state?.email) return;

    setResendLoading(true);
    try {
      if (state.type === 'verification') {
        await authAPI.sendVerificationOTP(state.email);
      } else {
        await authAPI.sendResetOTP(state.email);
      }
      message.success('OTP sent successfully');
      setTimeLeft(600);
      setCanResend(false);
      setOtp('');
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to resend OTP';
      message.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoBack = () => {
    if (state?.type === 'verification') {
      navigate('/signup');
    } else {
      navigate('/forgot-password');
    }
  };

  const getTitle = () => {
    return state?.type === 'verification' ? 'Verify Your Email' : 'Reset Password';
  };

  const getDescription = () => {
    return state?.type === 'verification' 
      ? `We've sent a 6-digit verification code to ${state.email}. Please enter it below to verify your email address.`
      : `We've sent a 6-digit code to ${state.email}. Please enter it below to reset your password.`;
  };

  if (!state?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* SEO */}
      <header className="sr-only">
        <h1>{getTitle()} - QR Studio</h1>
      </header>

      {/* Logo Header */}
      <div className="px-6 sm:px-8 pt-6">
        <Link to="/" className="flex items-center gap-3 w-fit">
          <img src="/logo.png" alt="QR Studio logo" className="w-10 h-10 object-contain" />
          <span className="text-lg font-bold text-foreground">QR Studio</span>
        </Link>
      </div>

      <main className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-12 xl:px-16 py-8 lg:py-0">
        <section className="max-w-[32rem] mx-auto w-full">
          {/* Breadcrumb */}
          <Breadcrumb
            className="mb-6"
            items={[
              {
                title: (
                  <span 
                    className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      if (state?.type === 'verification') {
                        navigate('/signup');
                      } else {
                        navigate('/forgot-password');
                      }
                    }}
                  >
                    <Home size={16} />
                    {state?.type === 'verification' ? 'Sign Up' : 'Reset Password'}
                  </span>
                )
              },
              {
                title: (
                  <span className="flex items-center gap-2 text-foreground">
                    {state?.type === 'verification' ? <Mail size={16} /> : <KeyRound size={16} />}
                    {state?.type === 'verification' ? 'Verify Email' : 'Enter Code'}
                  </span>
                )
              }
            ]}
          />

          {/* Header */}
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 text-center">
              {getTitle()}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed text-center">
              {getDescription()}
            </p>
          </div>

          {/* Features */}
          <div className="flex gap-4 sm:gap-6 mb-6 justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4" />
              <span>Fast</span>
            </div>
          </div>

          {/* OTP Input */}

          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block text-center">Enter 6-digit Code</label>
            <OTPInput
              length={6}
              value={otp}
              onChange={setOtp}
              onComplete={setOtp}
              disabled={loading}
              loading={loading}
            />
          </div>

          {/* Password fields for reset flow */}
          {state?.type === 'reset' && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">New Password</label>
                <Input
                  size="large"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  prefix={<Lock size={16} />}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  disabled={loading}
                  className="h-11 rounded-lg"
                />

                {/* Password strength bar */}
                {newPassword && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${getPasswordStrengthClasses(passwordStrength.level).bar}`}
                          style={{ width: `${passwordStrength.percent}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium capitalize ${getPasswordStrengthClasses(passwordStrength.level).text}`}
                      >
                        {passwordStrength.level}
                      </span>
                    </div>

                    {/* Requirements checklist */}
                    <ul className="space-y-1">
                      {passwordRequirements.map((req) => {
                        const passed = req.test(newPassword);
                        return (
                          <li key={req.id} className="flex items-center gap-2 text-xs">
                            {passed ? (
                              <Check className="w-3.5 h-3.5 text-green-500" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-gray-400" />
                            )}
                            <span className={passed ? "text-green-500" : "text-gray-400"}>
                              {req.label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Confirm New Password</label>
                <Input
                  size="large"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  prefix={<Lock size={16} />}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  disabled={loading}
                  className="h-11 rounded-lg"
                />
                
                {/* Password match indicator */}
                {confirmPassword && (
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    {newPassword === confirmPassword ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-green-500">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-red-500">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <Button
            type="primary"
            onClick={handleVerifyOTP}
            loading={loading}
            disabled={state?.type === 'reset' ? 
              (otp.length !== 6 || !newPassword || !confirmPassword || !allRequirementsMet || newPassword !== confirmPassword) : 
              (otp.length !== 6)
            }
            className="w-full h-11 text-sm font-semibold rounded-lg mb-6"
          >
            {state?.type === 'verification' ? 'Verify Email' : 'Reset Password'}
          </Button>

          {/* Timer and Resend */}
          <div className="text-center space-y-4 mb-6">
            {timeLeft > 0 ? (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock size={16} />
                <span className="text-sm">
                  Code expires in {formatTime(timeLeft)}
                </span>
              </div>
            ) : null}
            
            <div>
              <span className="text-muted-foreground text-sm">
                Didn't receive the code?{' '}
              </span>
              <Button
                type="link"
                onClick={handleResendOTP}
                loading={resendLoading}
                disabled={!canResend}
                className="p-0 h-auto text-primary hover:text-primary/80 text-sm font-semibold transition-colors"
                icon={<RefreshCw size={14} />}
              >
                Resend Code
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 lg:py-6">
        <p className="text-muted-foreground text-xs">© 2026 ALL RIGHTS RESERVED</p>
      </footer>
    </div>
  );
};

export default OTPVerification;