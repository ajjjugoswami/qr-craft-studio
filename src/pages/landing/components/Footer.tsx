import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-6 md:py-8 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="QR Studio"
              className="h-6 w-6 object-contain"
            />
            <span className="font-semibold text-xs">
              QR<span className="text-primary">Studio</span>
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px]">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#analytics"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Analytics
            </a>
            <Link
              to="/privacy-policy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-and-conditions"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/refunds"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Refunds
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} QR Studio. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
