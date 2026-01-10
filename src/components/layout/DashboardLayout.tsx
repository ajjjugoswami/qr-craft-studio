import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Layout, Menu, Avatar, Typography, Drawer, Button, Badge, Tooltip } from "antd";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useSubscription } from "@/context/SubscriptionContext";
import {
  BarChart3,
  HelpCircle,
  Mail,
  MessageSquare,
  LogOut,
  Settings,
  Menu as MenuIcon,
  X,
  QrCode,
  Users,
  GitCompare,
  Sun,
  Moon,
  CreditCard,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const { Content } = Layout;
const { Text } = Typography;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signout } = useAuth();
  const { mode, setMode } = useTheme();
  const { subscription, subscriptionLoading, isOnTrial, getTrialDaysRemaining, getPlanDisplayName } = useSubscription();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trialTimeLeft, setTrialTimeLeft] = useState<string>('');

  // Timer for trial countdown
  const updateTimer = useCallback(() => {
    if (!isOnTrial()) {
      setTrialTimeLeft('');
      return;
    }

    const daysLeft = getTrialDaysRemaining();
    if (daysLeft === null || daysLeft <= 0) {
      setTrialTimeLeft('Expired');
      return;
    }

    if (daysLeft === 1) {
      // Show hours and minutes for last day
      const trialEndDate = subscription?.trialEndDate;
      if (trialEndDate) {
        const now = new Date();
        const end = new Date(trialEndDate);
        const diffInMs = end.getTime() - now.getTime();
        if (diffInMs > 0) {
          const hours = Math.floor(diffInMs / (1000 * 60 * 60));
          const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
          setTrialTimeLeft(`${hours}h ${minutes}m`);
        } else {
          setTrialTimeLeft('Expired');
        }
      }
    } else {
      setTrialTimeLeft(`${daysLeft} days`);
    }
  }, [isOnTrial, getTrialDaysRemaining, subscription?.trialEndDate]);

  useEffect(() => {
    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [updateTimer]);

  const toggleThemeMode = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }, [mode, setMode]);

  const themeIcon = useMemo(() => {
    return mode === 'dark' ? <Moon size={18} /> : <Sun size={18} />;
  }, [mode]);

  const themeTooltip = useMemo(() => {
    return mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }, [mode]);

  const menuItems = useMemo(() => {
    const items = [
      {
        key: "/dashboard",
        icon: <QrCode size={18} />,
        label: "My QR codes",
      },
      {
        key: "/analytics",
        icon: <BarChart3 size={18} />,
        label: "Analytics",
      },
      {
        key: "/compare",
        icon: <GitCompare size={18} />,
        label: "Compare QR Codes",
      },
      {
        key: "/pricing",
        icon: <CreditCard size={18} />,
        label: "Pricing",
      },
      {
        key: "/faqs",
        icon: <HelpCircle size={18} />,
        label: "FAQs",
      },
      {
        key: "/contact",
        icon: <Mail size={18} />,
        label: "Contact",
      },
      {
        key: "/settings/profile",
        icon: <Settings size={18} />,
        label: "Settings",
      },
    ];

    // Show admin-only items
    if (user?.isAdmin) {
      items.push({
        key: "/submissions",
        icon: <MessageSquare size={18} />,
        label: "Submissions",
      });
      items.push({
        key: "/admin/users",
        icon: <Users size={18} />,
        label: "Admin Data",
      });
    }

    return items;
  }, [user?.isAdmin]);

  const handleMenuClick = useCallback((key: string) => {
    navigate(key);
    setMobileMenuOpen(false);
  }, [navigate]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo & Brand */}
      <div className="p-4 flex items-center gap-3 border-b border-border">
        <img
          src="/logo.png"
          alt="QR Studio logo"
          className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
        />
        <div className="flex flex-col">
          <Text strong className="text-base lg:text-lg leading-tight">
            QR Studio
          </Text>
          <Text type="secondary" className="text-xs">
            My QR codes
          </Text>
        </div>
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[
          location.pathname === "/" ? "/dashboard" : location.pathname,
        ]}
        items={menuItems}
        onClick={({ key }) => handleMenuClick(key)}
        className="flex-1 border-none mt-2"
      />

      {/* Plan Status */}
      <div className="p-3 border-t border-border">
        <div
          className="p-3 rounded-xl bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
          onClick={() => handleMenuClick("/pricing")}
        >
          <div className="flex items-center justify-between mb-2">
            <Text strong className="text-sm capitalize">
              {isOnTrial() ? 'Trial' : (subscription?.planType || 'Free')} Plan
            </Text>
            {isOnTrial() ? (
              <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 text-xs font-medium">
                {trialTimeLeft}
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                subscription?.status === 'active' 
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                  : 'bg-gray-500/10 text-gray-500'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  subscription?.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                {subscription?.status === 'active' ? 'Active' : (subscription?.status || 'Active')}
              </span>
            )}
          </div>
          {subscription?.planType !== 'enterprise' && (
            <Text className="text-xs text-primary cursor-pointer hover:underline">
              {isOnTrial() ? 'Upgrade to Keep Features →' : subscription?.planType === 'free' || !subscription ? 'Upgrade Plan →' : 'Manage Plan →'}
            </Text>
          )}
        </div>
      </div>

      {/* User Section */}
      <div className="p-3 border-t border-border">
        <div
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors cursor-pointer"
          onClick={() => handleMenuClick("/settings/profile")}
        >
          <Badge dot status="success" offset={[-5, 30]}>
            <Avatar
              className="avatar-primary pulse-avatar"
              size={36}
              src={user?.profilePicture}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
          </Badge>
          <div className="flex flex-col flex-1 min-w-0">
            <Text strong className="text-sm truncate">
              {user?.name ?? "User"}
            </Text>
            <Text type="secondary" className="text-xs truncate">
              {user?.email ?? ""}
            </Text>
          </div>
        </div>
      </div>

      {/* Logout & Theme Toggle */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => signout()}
            className="flex items-center gap-3 flex-1 p-3 rounded-xl cursor-pointer border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
          <Tooltip title={themeTooltip} placement="top">
            <button
              onClick={toggleThemeMode}
              className="flex items-center justify-center p-3 rounded-xl cursor-pointer border border-border hover:bg-muted transition-colors"
            >
              {themeIcon}
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );

  return (
    <Layout className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-card/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button
            type="text"
            icon={<MenuIcon size={20} />}
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center justify-center -ml-2"
          />
          <img src="/logo.png" alt="QR Studio" className="w-8 h-8 object-contain" />
          <Text strong className="text-base">QR Studio</Text>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip title={themeTooltip}>
            <Button
              type="text"
              icon={themeIcon}
              onClick={toggleThemeMode}
              className="flex items-center justify-center"
            />
          </Tooltip>
             <Avatar
              className="avatar-primary cursor-pointer"
              size={48}
              src={user?.profilePicture}
              onClick={() => handleMenuClick("/settings/profile")}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
         </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        title={null}
        placement="left"
        closable={false}
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
        className="lg:hidden dashboard-mobile-drawer p-0"
      >
        <div className="absolute top-3 right-3 z-10">
          <Button
            type="text"
            icon={<X size={20} />}
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
        <SidebarContent />
      </Drawer>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-56 xl:w-60 bg-card border-r border-border z-40">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <Layout className="lg:ml-56 xl:ml-60 bg-background">
        <Content className="px-3 sm:px-4 md:px-6 py-4 min-h-screen pt-16 lg:pt-6 pb-6">
          {children}
        </Content>
      </Layout>

    </Layout>
  );
};

export default React.memo(DashboardLayout);
