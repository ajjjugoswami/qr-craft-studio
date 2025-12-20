import React, { useState } from "react";
import { Layout, Menu, Avatar, Typography, Drawer, Button } from "antd";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import {
  BarChart3,
  HelpCircle,
  Mail,
  MessageSquare,
  LogOut,
  Settings,
  Menu as MenuIcon,
  Moon,
  Sun,
  X,
  Plus,
  QrCode,
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
  const { isDark, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
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
      key: "/settings",
      icon: <Settings size={18} />,
      label: "Settings",
    },
  ];

  // Show submissions only for admin users
  if (user?.isAdmin) {
    menuItems.push({
      key: "/submissions",
      icon: <MessageSquare size={18} />,
      label: "Submissions",
    });
  }

  const handleMenuClick = (key: string) => {
    navigate(key);
    setMobileMenuOpen(false);
  };

  const bottomNavItems = [
    { key: "/dashboard", icon: <QrCode size={20} />, label: "My QR" },
    { key: "/analytics", icon: <BarChart3 size={20} />, label: "Analytics" },
    { key: "/create", icon: <Plus size={20} />, label: "Create", isCreate: true },
    { key: "/faqs", icon: <HelpCircle size={20} />, label: "Help" },
    { key: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

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

      {/* User Section */}
      <div className="p-3 border-t border-border">
        <div
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors cursor-pointer"
          onClick={() => handleMenuClick("/settings")}
        >
          <Avatar
            className="avatar-primary"
            size={36}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </Avatar>
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

      {/* Theme Toggle & Logout */}
      <div className="p-3 border-t border-border space-y-2">
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 w-full p-3 rounded-xl cursor-pointer border border-border bg-card text-foreground hover:bg-muted transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          <span className="font-medium">{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>

        <button
          onClick={() => signout()}
          className="flex items-center gap-3 w-full p-3 rounded-xl cursor-pointer border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
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
        <div className="flex items-center gap-1">
          <Button
            type="text"
            icon={isDark ? <Sun size={18} /> : <Moon size={18} />}
            onClick={toggleDarkMode}
          />
          <Avatar
            className="avatar-primary cursor-pointer"
            size={32}
            onClick={() => navigate("/settings")}
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
        className="lg:hidden dashboard-mobile-drawer"
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
        <Content className="p-4 md:p-6 min-h-screen pt-16 lg:pt-6 pb-20 lg:pb-6">
          {children}
        </Content>
      </Layout>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.key || 
              (item.key === "/dashboard" && location.pathname === "/");
            
            if (item.isCreate) {
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.key)}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg -mt-4"
                >
                  {item.icon}
                </button>
              );
            }
            
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors ${
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </Layout>
  );
};

export default DashboardLayout;
