import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { Menu, X, Sun, Moon } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { mode, setMode } = useTheme();

  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const effectiveMode =
    mode === "system" ? (systemPrefersDark ? "dark" : "light") : mode;

  const toggleTheme = () => {
    setMode(effectiveMode === "dark" ? "light" : "dark");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="QR Studio"
              className="h-8 w-auto object-contain"
            />
            <span className="font-semibold text-base tracking-tight">
              QR<span className="text-primary">Studio</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#generator"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Generator
            </a>
            <a
              href="#features"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#analytics"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Analytics
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 w-8 p-0"
              onClick={toggleTheme}
            >
              {effectiveMode === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Link to="/sign-in">
              <Button variant="ghost" size="sm" className="text-xs h-8">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="text-xs h-8">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <nav className="flex flex-col gap-1">
              <a
                href="#generator"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 hover:bg-muted rounded-lg transition-colors text-xs"
              >
                Generator
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 hover:bg-muted rounded-lg transition-colors text-xs"
              >
                Features
              </a>
              <a
                href="#analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 hover:bg-muted rounded-lg transition-colors text-xs"
              >
                Analytics
              </a>
              <div className="flex gap-2 px-3 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-10 h-8 p-0"
                  onClick={toggleTheme}
                >
                  {effectiveMode === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
                <Link to="/sign-in" className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" className="flex-1">
                  <Button size="sm" className="w-full text-xs">
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
