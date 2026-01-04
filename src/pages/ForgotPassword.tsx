import React, { useState } from "react";
import { Input, Button, Typography, message, Breadcrumb } from "antd";
import { Home, Mail, KeyRound, Shield, Zap } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "@/lib/api";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      message.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      message.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await authAPI.sendResetOTP(email);
      message.success("Password reset code sent to your email");

      navigate("/otp-verification", {
        state: {
          email: email,
          type: "reset",
        },
      });
    } catch (error: any) {
      console.error("Send OTP error:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to send reset code";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* SEO */}
      <header className="sr-only">
        <h1>Reset Password - QR Studio</h1>
      </header>

      {/* Logo Header */}
      <div className="px-6 sm:px-8 pt-6">
        <Link to="/" className="flex items-center gap-3 w-fit">
          <img
            src="/logo.png"
            alt="QR Studio logo"
            className="w-10 h-10 object-contain"
          />
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
                    onClick={() => navigate("/sign-in")}
                  >
                    <Home size={16} />
                    Sign In
                  </span>
                ),
              },
              {
                title: (
                  <span className="flex items-center gap-2 text-foreground">
                    <KeyRound size={16} />
                    Reset Password
                  </span>
                ),
              },
            ]}
          />

          {/* Header */}
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 text-center">
              Reset Password
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed text-center">
              Enter your email address and we'll send you a verification code to
              reset your password.
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

          {/* Form */}
          <form
            onSubmit={handleSendOTP}
            className="space-y-4"
            aria-label="Reset password form"
          >
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Email Address
              </label>
              <Input
                size="large"
                type="email"
                placeholder="Example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                prefix={<Mail size={16} />}
                disabled={loading}
                required
                className="h-11 rounded-lg"
              />
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-11 text-sm font-semibold rounded-lg"
            >
              Send Reset Code
            </Button>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 lg:py-6">
        <p className="text-muted-foreground text-xs">
          © 2026 ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
};

export default ForgotPassword;
