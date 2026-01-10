import React, { useState } from "react";
import {
  Card,
  Typography,
  Switch,
  Input,
  message,
  Button,
  ColorPicker,
  Tooltip,
  Alert,
} from "antd";
import {
  Palette,
  Save,
  Eye,
  HelpCircle,
  Crown,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePayment } from "@/hooks/usePayment";
import { authAPI } from "@/lib/api";
import type { Color } from "antd/es/color-picker";

const { Title, Text } = Typography;

export interface WhiteLabelConfig {
  enabled: boolean;
  brandName?: string;
  primaryColor?: string;
  loadingText?: string;
  showPoweredBy: boolean;
}

const WhiteLabelSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { subscription, hasFeatureAccess } = usePayment();

  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<WhiteLabelConfig>({
    enabled: user?.whiteLabel?.enabled || false,
    brandName: user?.whiteLabel?.brandName || "",
    primaryColor: user?.whiteLabel?.primaryColor || "#6366f1",
    loadingText: user?.whiteLabel?.loadingText || "",
    showPoweredBy: user?.whiteLabel?.showPoweredBy ?? true,
  });

  // Check if user has access to white label features
  const canUseWhiteLabel = hasFeatureAccess("whiteLabel");

  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", user?.name || "");
      formData.append("whiteLabel", JSON.stringify(config));

      const response = await authAPI.updateProfile(formData);

      if (response.success) {
        updateUser({
          ...response.user,
          whiteLabel: config,
        });
        message.success("White-label settings saved successfully");
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (color: Color) => {
    setConfig((prev) => ({ ...prev, primaryColor: color.toHexString() }));
  };

  return (
    <Card className="shadow-sm">
      {/* Premium Feature Alert for Free Users */}
      {!canUseWhiteLabel && (
        <Alert
          type="info"
          showIcon
          icon={<Crown size={16} />}
          message="Premium Feature"
          description={
            <div className="flex items-center justify-between">
              <span>
                Upgrade to Pro to remove branding and customize your QR code
                redirect pages
              </span>
              <Button
                type="primary"
                size="small"
                icon={<ArrowUpRight size={14} />}
                onClick={() => navigate("/pricing")}
              >
                Upgrade Now
              </Button>
            </div>
          }
          className="mb-6"
        />
      )}

      <div className="flex items-center justify-between mb-4 sm:mb-6">
        {" "}
        <Title
          level={4}
          className="mb-0 flex items-center gap-2 text-base sm:text-lg"
        >
          <Palette size={window.innerWidth < 640 ? 16 : 18} />
          White-Label Settings
          <Tooltip
            title="Customize the appearance of your QR code redirect pages. Remove branding and add your own colors and text for a professional experience."
            color="white"
            overlayInnerStyle={{ color: "#333" }}
          >
            <HelpCircle
              size={14}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-help"
            />
          </Tooltip>
        </Title>
        <Button
          type="primary"
          icon={<Save size={window.innerWidth < 640 ? 14 : 16} />}
          onClick={handleSave}
          loading={loading}
          disabled={!canUseWhiteLabel}
          size={window.innerWidth < 640 ? "small" : "middle"}
          className="text-xs sm:text-sm"
        >
          {window.innerWidth < 640 ? "Save" : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Enable White-Label Toggle */}
        <div
          className={`flex items-center justify-between p-3 sm:p-4 bg-muted/30 rounded-lg border border-border ${
            !canUseWhiteLabel ? "opacity-50" : ""
          }`}
        >
          <div>
            <Text strong className="block text-sm sm:text-base">
              Enable White-Label Mode
            </Text>
            <Text type="secondary" className="text-xs sm:text-sm">
              Apply custom branding to all your QR code redirect pages
              {!canUseWhiteLabel && " (Premium Feature)"}
            </Text>
          </div>
          <Switch
            checked={config.enabled && canUseWhiteLabel}
            onChange={(enabled) => setConfig((prev) => ({ ...prev, enabled }))}
            checkedChildren="ON"
            unCheckedChildren="OFF"
            disabled={!canUseWhiteLabel}
          />
        </div>

        <div
          className={
            !config.enabled || !canUseWhiteLabel
              ? "opacity-50 pointer-events-none"
              : ""
          }
        >
          {/* Brand Name */}
          <div className="mb-4 sm:mb-6">
            <Text strong className="block mb-2 text-sm sm:text-base">
              Brand Name
            </Text>
            <Text type="secondary" className="text-xs sm:text-sm block mb-3">
              Your brand name shown on redirect pages
            </Text>
            <Input
              value={config.brandName}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, brandName: e.target.value }))
              }
              placeholder="e.g., Your Company"
              maxLength={50}
              disabled={!config.enabled || !canUseWhiteLabel}
              size={window.innerWidth < 640 ? "small" : "middle"}
            />
          </div>

          {/* Primary Color */}
          <div className="mb-4 sm:mb-6">
            <Text strong className="block mb-2 text-sm sm:text-base">
              Primary Color
            </Text>
            <Text type="secondary" className="text-xs sm:text-sm block mb-3">
              Accent color used for buttons and loading indicators
            </Text>
            <ColorPicker
              value={config.primaryColor}
              onChange={handleColorChange}
              showText
              disabled={!config.enabled || !canUseWhiteLabel}
            />
          </div>

          {/* Loading Text */}
          <div className="mb-4 sm:mb-6">
            <Text strong className="block mb-2 text-sm sm:text-base">
              Custom Loading Text
            </Text>
            <Text type="secondary" className="text-xs sm:text-sm block mb-3">
              Custom message shown while redirecting (leave empty for default)
            </Text>
            <Input
              value={config.loadingText}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, loadingText: e.target.value }))
              }
              placeholder="e.g., Taking you there..."
              maxLength={50}
              disabled={!config.enabled || !canUseWhiteLabel}
              size={window.innerWidth < 640 ? "small" : "middle"}
            />
          </div>

          {/* Show Powered By */}
          <div className="flex items-center justify-between p-3 sm:p-4 bg-muted/30 rounded-lg border border-border">
            <div>
              <Text strong className="block text-sm sm:text-base">
                Show "Powered By" Badge
              </Text>
              <Text type="secondary" className="text-xs sm:text-sm">
                Display a small attribution on redirect pages
              </Text>
            </div>
            <Switch
              checked={config.showPoweredBy}
              onChange={(showPoweredBy) =>
                setConfig((prev) => ({ ...prev, showPoweredBy }))
              }
              disabled={!config.enabled || !canUseWhiteLabel}
              checkedChildren="Show"
              unCheckedChildren="Hide"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="p-3 sm:p-4 bg-muted/30 rounded-lg border border-border mt-4 sm:mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Eye size={14} />
            <Text strong className="text-sm sm:text-base">
              Preview
            </Text>
          </div>

          <div className="bg-background rounded-lg p-4 sm:p-6 border border-border">
            <div className="flex flex-col items-center text-center">
              {/* Loading indicator preview */}
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-muted mb-3 sm:mb-4 relative"
                style={{
                  borderTopColor: config.enabled
                    ? config.primaryColor
                    : "#6366f1",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                    style={{
                      backgroundColor: config.enabled
                        ? config.primaryColor
                        : "#6366f1",
                    }}
                  />
                </div>
              </div>

              <Text strong className="block text-base sm:text-lg">
                {config.enabled && config.brandName
                  ? config.brandName
                  : "Loading..."}
              </Text>
              <Text type="secondary" className="text-xs sm:text-sm">
                {config.enabled && config.loadingText
                  ? config.loadingText
                  : "Please wait..."}
              </Text>

              {(!config.enabled || config.showPoweredBy) && (
                <Text
                  type="secondary"
                  className="text-xs mt-3 sm:mt-4 opacity-60"
                >
                  Powered by QR Studio
                </Text>
              )}
            </div>
          </div>

          <Text type="secondary" className="block mt-3 text-xs sm:text-sm">
            {config.enabled
              ? "This is how your redirect pages will appear to users"
              : "Enable white-label mode to customize the appearance"}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default WhiteLabelSettings;
