import React, { useEffect, useCallback, useMemo, useRef, useState } from "react";
import { Input, Button, message } from "antd";
import { Eye, EyeOff, Shield, Zap } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "@/store";
import { googleSignIn } from "@/store/slices/authSlice";
import { useAuth } from "@/hooks/useAuth";
import LogoLoader from "@/components/common/LogoLoader";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GOOGLE_SCRIPT_ID = "google-gsi";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, signin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const googleButtonContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      setGoogleLoading(true);
      try {
        await dispatch(googleSignIn({ credential: response.credential })).unwrap();
        navigate("/dashboard");
      } finally {
        setGoogleLoading(false);
      }
    },
    [dispatch, navigate]
  );

  const initGoogle = useCallback(() => {
    if (!window.google || !GOOGLE_CLIENT_ID) return;
    if (!googleButtonContainerRef.current) return;

    // Clear any previous render to avoid duplicates on hot reload
    googleButtonContainerRef.current.innerHTML = "";

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    // Render Google's official button (reliable + policy-compliant)
    window.google.accounts.id.renderButton(googleButtonContainerRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      width: 400,
    });
  }, [handleCredentialResponse]);

  useEffect(() => {
    if (user) return;

    // Load script once
    const existing = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;

    if (existing) {
      // If script already loaded, init immediately
      if (window.google) initGoogle();
      else existing.addEventListener("load", initGoogle, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [user, initGoogle]);

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

  const canUseGoogle = useMemo(() => !!GOOGLE_CLIENT_ID, []);


  if (googleLoading) {
    return <LogoLoader fullScreen message="Signing in with Google..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* SEO */}
      <header className="sr-only">
        <h1>Sign in to QR Studio</h1>
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
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Welcome Back
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Today is a new day. It&apos;s your day. You shape it.
            </p>
          </div>

          {/* Features */}
          <div className="flex gap-4 sm:gap-6 mb-6">
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
          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Sign in form">
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
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                className="h-11 rounded-lg"
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
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

          {/* Google button (real button receives the click, custom UI is visual only) */}
          {canUseGoogle ? (
            <div className="relative">
              {/* Visual button */}
              <div
                className="w-full h-11 flex items-center justify-center gap-3 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-foreground text-sm font-medium"
                aria-hidden="true"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
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
              </div>

              {/* Clickable official Google button overlay (must receive the user click) */}
              <div
                className="absolute inset-0 opacity-0"
                aria-label="Sign in with Google"
              >
                <div ref={googleButtonContainerRef} />
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled
              className="w-full h-11 flex items-center justify-center gap-3 rounded-lg border border-border bg-background text-foreground text-sm font-medium opacity-50 cursor-not-allowed"
            >
              Google Sign-In not configured
            </button>
          )}


          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <span className="text-muted-foreground text-sm">Don&apos;t have an account? </span>
            <Link
              to="/signup"
              className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors"
            >
              Sign up
            </Link>
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

export default SignIn;

