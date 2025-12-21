import React, { useState, useEffect } from "react";
import { Input, Button, message } from "antd";
import {
  Eye,
  EyeOff,
  Palette,
  QrCode,
  Scan,
  Share2,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import authImage from "@/assets/auth-qr-templates.jpg";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { user, signin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      message.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await signin(formData.email, formData.password);
      navigate("/dashboard");
    } catch {
      // errors shown in hook
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    message.info("Google sign-in coming soon");
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-background overflow-hidden gap-8 lg:gap-12">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Logo Header */}
        <div className="px-4 sm:px-8 lg:px-12 xl:px-16 pt-6 lg:pt-8">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="QR Studio"
              className="w-12 h-12 lg:w-16 lg:h-16 object-contain"
            />
            <span className="text-lg lg:text-xl font-bold text-foreground">
              QR Studio
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-12 xl:px-16 py-8 lg:py-0">
          <div className="max-w-[32rem] mx-auto w-full">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                Welcome Back
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Today is a new day. It's your day. You shape it.
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
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Email
                </label>
                <Input
                  size="large"
                  type="email"
                  placeholder="Example@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="h-11 rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Password
                </label>
                <Input
                  size="large"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
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

              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-11 text-sm font-semibold rounded-lg"
              >
                Sign in
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
              onClick={handleGoogleSignIn}
              className="w-full h-11 flex items-center justify-center gap-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground text-sm font-medium"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <span className="text-muted-foreground text-sm">
                Don't have an account?{" "}
              </span>
              <Link
                to="/signup"
                className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 lg:py-6">
          <p className="text-muted-foreground text-xs">
            © 2026 ALL RIGHTS RESERVED
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex w-5/12 p-4">
        <div className="relative w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[3rem] overflow-hidden p-8">
          {/* Animated gradient orbs */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/15 rounded-full blur-[100px] animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/15 rounded-full blur-[80px] animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/4 right-1/4 w-48 h-48 bg-amber-500/10 rounded-full blur-[60px] animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />

          {/* Mesh gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/40" />

          {/* Animated dot grid pattern */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>

          {/* Decorative floating rings */}
          <div className="absolute top-16 left-16 w-32 h-32 border border-white/10 rounded-full" />
          <div className="absolute top-20 left-20 w-24 h-24 border border-emerald-500/20 rounded-full" />
          <div className="absolute bottom-24 right-16 w-40 h-40 border border-white/5 rounded-full" />
          <div className="absolute bottom-28 right-20 w-32 h-32 border border-violet-500/15 rounded-full" />

          {/* Floating QR Cards with 3D effect */}
          <div className="absolute top-20 left-12 transform hover:scale-105 transition-all duration-500 group">
            <div className="w-28 h-28 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl shadow-2xl shadow-violet-500/30 transform rotate-[-12deg] group-hover:rotate-[-6deg] transition-transform duration-500 p-4">
              <div className="w-full h-full bg-white/20 rounded-xl backdrop-blur-sm grid grid-cols-4 gap-1 p-2">
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-sm ${
                      [0, 1, 4, 5, 10, 11, 14, 15, 6, 9].includes(i)
                        ? "bg-white/90"
                        : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-violet-400/50 rounded-full blur-lg" />
          </div>

          <div className="absolute top-32 right-16 transform hover:scale-105 transition-all duration-500 group">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl shadow-2xl shadow-orange-500/30 transform rotate-[15deg] group-hover:rotate-[8deg] transition-transform duration-500 flex items-center justify-center">
              <div className="w-14 h-14 bg-white/25 rounded-xl backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-amber-400/50 rounded-full blur-md" />
          </div>

          <div className="absolute bottom-48 left-8 transform hover:scale-105 transition-all duration-500 group">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl shadow-2xl shadow-cyan-500/30 transform rotate-[8deg] group-hover:rotate-[14deg] transition-transform duration-500 flex items-center justify-center">
              <QrCode className="w-10 h-10 text-white/90" />
            </div>
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-cyan-400/50 rounded-full blur-md" />
          </div>

          <div className="absolute bottom-32 right-12 transform hover:scale-105 transition-all duration-500 group">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl shadow-blue-500/30 transform rotate-[-8deg] group-hover:rotate-[-3deg] transition-transform duration-500 p-4">
              <div className="w-full h-full bg-white/20 rounded-xl backdrop-blur-sm grid grid-cols-5 gap-1 p-2">
                {[...Array(25)].map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-sm ${
                      [
                        0, 1, 2, 5, 10, 15, 20, 21, 22, 4, 9, 14, 19, 24, 23,
                        12,
                      ].includes(i)
                        ? "bg-white/90"
                        : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-400/50 rounded-full blur-lg" />
          </div>

          {/* Floating particles */}
          <div
            className="absolute top-1/4 left-1/3 w-3 h-3 bg-emerald-400 rounded-full animate-bounce shadow-lg shadow-emerald-400/50"
            style={{ animationDelay: "0s", animationDuration: "2s" }}
          />
          <div
            className="absolute top-1/2 right-1/3 w-2 h-2 bg-violet-400 rounded-full animate-bounce shadow-lg shadow-violet-400/50"
            style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}
          />
          <div
            className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-amber-400 rounded-full animate-bounce shadow-lg shadow-amber-400/50"
            style={{ animationDelay: "1s", animationDuration: "2s" }}
          />
          <div
            className="absolute top-2/3 left-2/3 w-3 h-3 bg-cyan-400 rounded-full animate-bounce shadow-lg shadow-cyan-400/50"
            style={{ animationDelay: "1.5s", animationDuration: "3s" }}
          />

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
            {/* Phone Mockup */}
            <div className="relative group">
              {/* Multi-layer glow effect */}
              <div className="absolute -inset-12 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-violet-500/10 rounded-[5rem] blur-3xl group-hover:blur-[40px] transition-all duration-700" />
              <div className="absolute -inset-6 bg-gradient-to-b from-emerald-500/20 to-transparent rounded-[4rem] blur-2xl" />

              {/* Phone Frame */}
              <div className="relative w-56 h-[440px] bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800 rounded-[2.5rem] p-1.5 shadow-2xl border border-slate-500/30 group-hover:shadow-emerald-500/20 transition-shadow duration-500">
                {/* Side buttons */}
                <div className="absolute -left-1 top-20 w-1 h-6 bg-slate-500 rounded-l-full" />
                <div className="absolute -left-1 top-32 w-1 h-10 bg-slate-500 rounded-l-full" />
                <div className="absolute -right-1 top-24 w-1 h-12 bg-slate-500 rounded-r-full" />

                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-full z-20 flex items-center justify-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                  <div className="w-1 h-1 bg-slate-600 rounded-full" />
                </div>

                {/* Screen */}
                <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
                  {/* App Header */}
                  <div className="bg-gradient-to-r from-emerald-500 via-emerald-500 to-teal-500 px-4 py-5 pt-8">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 bg-white/25 rounded-lg flex items-center justify-center backdrop-blur-sm">
                          <QrCode className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-white font-semibold text-xs">
                          QR Studio
                        </span>
                      </div>
                      <div className="w-5 h-5 bg-white/25 rounded-full backdrop-blur-sm" />
                    </div>
                    <h2 className="text-white text-sm font-bold">
                      Create QR Codes
                    </h2>
                    <p className="text-white/70 text-[10px]">
                      Design beautiful codes instantly
                    </p>
                  </div>

                  {/* QR Preview Card */}
                  <div className="px-3 py-3 -mt-3">
                    <div className="bg-white rounded-2xl p-3 shadow-lg border border-slate-100">
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-3 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white rounded-lg p-1.5 shadow-inner border border-slate-200">
                          {/* Stylized QR Code */}
                          <div className="w-full h-full grid grid-cols-7 gap-0.5">
                            {[...Array(49)].map((_, i) => {
                              const corners = [
                                0, 1, 2, 7, 14, 8, 9, 16, 4, 5, 6, 11, 12, 13,
                                20, 42, 43, 44, 49, 35, 36, 28, 29, 21,
                              ];
                              return (
                                <div
                                  key={i}
                                  className={`rounded-[1px] ${
                                    corners.includes(i) || Math.random() > 0.6
                                      ? "bg-slate-800"
                                      : "bg-slate-200"
                                  }`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 mt-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <span className="text-[10px] text-slate-500 font-medium">
                          mywebsite.com
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-3 grid grid-cols-4 gap-1.5">
                    {[
                      {
                        icon: Scan,
                        label: "Scan",
                        color: "bg-emerald-50 text-emerald-600",
                      },
                      {
                        icon: Palette,
                        label: "Style",
                        color: "bg-violet-50 text-violet-600",
                      },
                      {
                        icon: Share2,
                        label: "Share",
                        color: "bg-blue-50 text-blue-600",
                      },
                      {
                        icon: QrCode,
                        label: "New",
                        color: "bg-amber-50 text-amber-600",
                      },
                    ].map(({ icon: Icon, label, color }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center gap-1"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[8px] text-slate-500 font-medium">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Recent Section */}
                  <div className="px-3 mt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-[10px] font-semibold text-slate-700">
                        Recent
                      </h3>
                      <span className="text-[8px] text-emerald-600 font-medium">
                        View all
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {[
                        "from-emerald-400 to-teal-500",
                        "from-violet-400 to-purple-500",
                        "from-orange-400 to-amber-500",
                        "from-blue-400 to-indigo-500",
                      ].map((gradient, i) => (
                        <div
                          key={i}
                          className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg shadow-sm flex items-center justify-center`}
                        >
                          <div className="w-5 h-5 bg-white/30 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 mt-8 justify-center px-4">
              {[
                { label: "Custom Styles", icon: Palette },
                { label: "Analytics", icon: Sparkles },
                { label: "Easy Sharing", icon: Share2 },
              ].map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300 cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  {label}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-6 px-4">
              {[
                { value: "5K+", label: "QR Codes" },
                { value: "2K+", label: "Users" },
                { value: "4.9★", label: "Rating" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-lg font-bold text-white">{value}</div>
                  <div className="text-[10px] text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
