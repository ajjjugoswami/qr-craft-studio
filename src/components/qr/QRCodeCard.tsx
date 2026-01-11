import React, { useRef, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Tag,
  Typography,
  Tooltip,
  Popconfirm,
  message,
  Modal,
  Dropdown,
  Spin,
} from "antd";
import {
  Edit,
  Download,
  BarChart3,
  Trash2,
  FileImage,
  Image,
  Eye,
  Lock,
  Target,
  CheckCircle,
  XCircle,
  MoreHorizontal,
} from "lucide-react";
import { toPng, toJpeg } from "html-to-image";
import { QRCodeData } from "../../types/qrcode";
import QRCodePreview from "./QRCodePreview";
import QRCodeOnly from "./QRCodeOnly";
import { useAuth } from "../../hooks/useAuth";

const { Text } = Typography;

interface QRCodeCardProps {
  qrCode: QRCodeData;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  viewMode?: "list" | "grid";
}

const typeColors: Record<string, string> = {
  url: "blue",
  vcard: "green",
  text: "orange",
  wifi: "purple",
  email: "cyan",
  phone: "geekblue",
  sms: "lime",
  location: "volcano",
  instagram: "magenta",
  facebook: "blue",
  youtube: "red",
  whatsapp: "green",
};

const QRCodeCard: React.FC<QRCodeCardProps> = React.memo(
  ({ qrCode, onEdit, onDelete, onToggleStatus, viewMode = "list" }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const previewRef = useRef<HTMLDivElement>(null);
    const [downloadModalOpen, setDownloadModalOpen] = useState(false);
    const [downloadingFormat, setDownloadingFormat] = useState<
      "png" | "jpg" | "webp" | null
    >(null);

    // Support both camelCase and legacy snake/lowercase fields from APIs
    const scanLimitValue = (qrCode.scanLimit ?? (qrCode as any).scanlimit) as
      | number
      | null
      | undefined;
    const hasScanLimit =
      typeof scanLimitValue === "number" && scanLimitValue > 0;
    const isProtected =
      typeof qrCode.password === "string" && qrCode.password.trim().length > 0;

    // Watermark settings from user profile
    const showWatermark = !user?.removeWatermark;
    const watermarkText = user?.watermarkText || "QR Studio";

    const handleDownload = useCallback(
      async (format: "png" | "jpg" | "webp") => {
        if (!previewRef.current || downloadingFormat) return;

        setDownloadingFormat(format);
        try {
          await new Promise((resolve) => setTimeout(resolve, 100));

          const node = previewRef.current;
          const fileName = `${qrCode.name}-${Date.now()}`;

          const pixelRatio = window.innerWidth < 640 ? 1 : 2;

          let dataUrl: string;
          if (format === "png") {
            dataUrl = await toPng(node, {
              quality: 1,
              pixelRatio,
              cacheBust: true,
            });
          } else {
            // JPG and WebP use toJpeg with different quality
            dataUrl = await toJpeg(node, {
              quality: format === "webp" ? 0.9 : 0.95,
              pixelRatio,
              cacheBust: true,
              backgroundColor: "#ffffff",
            });

            // For WebP, we need to convert via canvas
            if (format === "webp") {
              const img = new window.Image();
              await new Promise<void>((resolve) => {
                img.onload = () => resolve();
                img.src = dataUrl;
              });
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(img, 0, 0);
                dataUrl = canvas.toDataURL("image/webp", 0.9);
              }
            }
          }

          const link = document.createElement("a");
          link.download = `${fileName}.${format}`;
          link.href = dataUrl;
          link.click();

          message.success(`Downloaded as ${format.toUpperCase()}!`);
          setDownloadModalOpen(false);
        } catch (error) {
          console.error("Download error:", error);
          message.error("Failed to download. Please try again.");
        } finally {
          setDownloadingFormat(null);
        }
      },
      [qrCode.name, downloadingFormat]
    );

    const handleOpenModal = useCallback(() => setDownloadModalOpen(true), []);
    const handleCloseModal = useCallback(() => setDownloadModalOpen(false), []);
    const handleNavigateAnalytics = useCallback(
      () => navigate(`/analytics/${qrCode.id}`),
      [navigate, qrCode.id]
    );
    const handleEdit = useCallback(
      () => onEdit(qrCode.id),
      [onEdit, qrCode.id]
    );
    const handleDelete = useCallback(
      () => onDelete(qrCode.id),
      [onDelete, qrCode.id]
    );
    const handleToggle = useCallback(
      () => onToggleStatus?.(qrCode.id),
      [onToggleStatus, qrCode.id]
    );

    const downloadMenuItems = useMemo(
      () => [
        {
          key: "png",
          label: "PNG (High Quality)",
          icon: <FileImage size={16} />,
          onClick: handleOpenModal,
        },
        {
          key: "jpg",
          label: "JPG (Smaller Size)",
          icon: <Image size={16} />,
          onClick: handleOpenModal,
        },
        {
          key: "webp",
          label: "WebP (Best Compression)",
          icon: <Image size={16} />,
          onClick: handleOpenModal,
        },
      ],
      [handleOpenModal]
    );

    const actionsMenuItems = useMemo(
      () => [
        {
          key: "edit",
          label: "Edit",
          icon: <Edit size={16} />,
          onClick: handleEdit,
        },
        ...(onToggleStatus
          ? [
              {
                key: "toggle-status",
                label: qrCode.status === "active" ? "Deactivate" : "Activate",
                icon:
                  qrCode.status === "active" ? (
                    <XCircle size={16} className="text-red-600" />
                  ) : (
                    <CheckCircle size={16} className="text-green-600" />
                  ),
                onClick: handleToggle,
              },
            ]
          : []),
      ],
      [handleEdit, handleToggle, onToggleStatus, qrCode.status]
    );

    const formatDate = useCallback((dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
    }, []);

    // Grid View Card
    if (viewMode === "grid") {
      return (
        <>
          <Card
            className="qr-card glass-card hover:shadow-lg transition-all duration-200 cursor-pointer group h-full relative"
            styles={{
              body: { padding: "16px", height: "100%", position: "relative" },
            }}
          >
            {/* Top Right Corner Icons */}
            {(isProtected || hasScanLimit) && (
              <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                {isProtected && (
                  <Tooltip title="Password Protected">
                    <div className="p-1.5 bg-amber-100 rounded-full">
                      <Lock size={12} className="text-amber-600" />
                    </div>
                  </Tooltip>
                )}
                {hasScanLimit && (
                  <Tooltip title={`Scan Limit: ${scanLimitValue}`}>
                    <div className="p-1.5 bg-blue-100 rounded-full">
                      <Target size={12} className="text-blue-600" />
                    </div>
                  </Tooltip>
                )}
              </div>
            )}

            {/* QR Preview */}
            <div className="w-full min-h-[120px] sm:min-h-[150px] rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
              <div className="flex items-center justify-center bg-white rounded-lg p-2">
                <QRCodeOnly
                  content={qrCode.content}
                  template={qrCode.template}
                  styling={qrCode.styling}
                  qrId={qrCode.id}
                  size={window.innerWidth < 640 ? 120 : 150}
                  qrType={qrCode.type}
                />
              </div>
            </div>

            {/* Title Row */}
            <div className="mb-2 min-h-[2rem] flex items-center">
              <Text
                strong
                className="text-xs sm:text-sm truncate block text-center w-full leading-tight"
              >
                {qrCode.name}
              </Text>
            </div>

            {/* Info Row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Text className="text-xs text-muted-foreground">
                  {qrCode.scans}
                </Text>
                <Text className="text-xs text-muted-foreground">scans</Text>
              </div>

              <Tag
                color={typeColors[qrCode.type]}
                className="m-0 uppercase text-xs hidden sm:block"
              >
                {qrCode.type}
              </Tag>
              <Tag
                color={qrCode.status === "active" ? "success" : "error"}
                className="m-0 text-xs flex items-center gap-1"
              >
                {qrCode.status === "active" ? (
                  <CheckCircle size={10} />
                ) : (
                  <XCircle size={10} />
                )}
                {qrCode.status}
              </Tag>
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between sm:gap-2 pt-2 border-t border-border">
              <Tooltip title="Preview">
                <button
                  className="p-1.5 sm:p-2 rounded hover:bg-muted transition-colors"
                  onClick={() => setDownloadModalOpen(true)}
                >
                  <Eye size={16} />
                </button>
              </Tooltip>
              <Tooltip title="Analytics">
                <button
                  className="p-1.5 sm:p-2 rounded hover:bg-muted transition-colors"
                  onClick={() => navigate(`/analytics/${qrCode.id}`)}
                >
                  <BarChart3 size={16} />
                </button>
              </Tooltip>
              <Dropdown
                menu={{ items: downloadMenuItems }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Tooltip title="Download">
                  <button className="p-1.5 sm:p-2 rounded hover:bg-muted transition-colors">
                    <Download size={16} />
                  </button>
                </Tooltip>
              </Dropdown>
              <Dropdown
                menu={{ items: actionsMenuItems }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Tooltip title="More Actions">
                  <button className="p-1.5 sm:p-2 rounded hover:bg-muted transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </Tooltip>
              </Dropdown>
            </div>
          </Card>

          {/* Preview Modal */}
          <Modal
            title="QR Code Preview"
            open={downloadModalOpen}
            onCancel={() => setDownloadModalOpen(false)}
            footer={null}
            width={480}
            centered
            className="qr-preview-modal"
            destroyOnHidden
          >
            <div className="flex flex-col items-center py-4 px-2">
              <Spin
                spinning={downloadingFormat !== null}
                tip="Preparing download..."
                className="w-full"
              >
                <div className="flex justify-center">
                  <QRCodePreview
                    ref={previewRef}
                    content={qrCode.content}
                    template={qrCode.template}
                    styling={qrCode.styling}
                    qrId={qrCode.id}
                    qrType={qrCode.type}
                    showWatermark={showWatermark}
                    watermarkText={watermarkText}
                  />
                </div>
              </Spin>

              {/* Watermark indicator */}
              <div className="text-xs text-muted-foreground mt-2">
                {showWatermark
                  ? `Watermark: "${watermarkText}"`
                  : "No watermark"}
              </div>

              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <button
                  onClick={() => handleDownload("png")}
                  disabled={downloadingFormat !== null}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {downloadingFormat === "png" ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  ) : (
                    <FileImage size={18} />
                  )}
                  PNG
                </button>
                <button
                  onClick={() => handleDownload("jpg")}
                  disabled={downloadingFormat !== null}
                  className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
                >
                  {downloadingFormat === "jpg" ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/70 border-t-transparent" />
                  ) : (
                    <Image size={18} />
                  )}
                  JPG
                </button>
                <button
                  onClick={() => handleDownload("webp")}
                  disabled={downloadingFormat !== null}
                  className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
                >
                  {downloadingFormat === "webp" ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/70 border-t-transparent" />
                  ) : (
                    <Image size={18} />
                  )}
                  WebP
                </button>
              </div>
            </div>
          </Modal>
        </>
      );
    }

    // List View Card (original) - Mobile Optimized
    return (
      <>
        <Card
          className="qr-card glass-card mb-3 hover:shadow-md transition-shadow"
          styles={{ body: { padding: "12px 16px" } }}
        >
          <div className="flex items-center gap-3">
            {/* QR Preview Mini */}
            <div
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                background:
                  qrCode.template?.showGradient &&
                  qrCode.template?.gradientColor
                    ? `linear-gradient(135deg, ${qrCode.template.backgroundColor} 0%, ${qrCode.template.gradientColor} 100%)`
                    : qrCode.template?.backgroundColor || "#f3f4f6",
              }}
              onClick={() => setDownloadModalOpen(true)}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded flex items-center justify-center">
                <QRCodeOnly
                  content={qrCode.content}
                  template={qrCode.template}
                  styling={qrCode.styling}
                  qrId={qrCode.id}
                  size={48}
                  qrType={qrCode.type}
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Text strong className="text-sm sm:text-base truncate">
                  {qrCode.name}
                </Text>
                {qrCode.password && (
                  <Tooltip title="Password Protected">
                    <Lock size={12} className="text-amber-500 flex-shrink-0" />
                  </Tooltip>
                )}
                {qrCode.scanLimit && (
                  <Tooltip title={`Scan Limit: ${qrCode.scanLimit}`}>
                    <Target size={12} className="text-blue-500 flex-shrink-0" />
                  </Tooltip>
                )}
              </div>
              <Text
                type="secondary"
                className="text-xs sm:text-sm truncate block hidden sm:block"
              >
                {qrCode.content.substring(0, 40)}
                {qrCode.content.length > 40 && "..."}
              </Text>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                <Text type="secondary" className="text-xs sm:text-sm">
                  <span
                    style={{ color: "hsl(var(--primary))" }}
                    className="font-medium"
                  >
                    {qrCode.scans}
                  </span>{" "}
                  scan{qrCode.scans !== 1 ? "s" : ""}
                </Text>
                <Tag
                  color={qrCode.status === "active" ? "success" : "error"}
                  className="m-0 flex items-center gap-1 text-[10px] sm:text-xs px-1.5 py-0.5"
                >
                  {qrCode.status === "active" ? (
                    <CheckCircle size={8} />
                  ) : (
                    <XCircle size={8} />
                  )}
                  {qrCode.status}
                </Tag>
                <Tag
                  color={typeColors[qrCode.type]}
                  className="uppercase text-[10px] sm:text-xs m-0 px-1.5 py-0.5"
                >
                  {qrCode.type}
                </Tag>
              </div>
            </div>

            {/* Actions - Compact on mobile */}
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              <Tooltip title="Preview">
                <button
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded hover:bg-muted transition-colors"
                  onClick={() => setDownloadModalOpen(true)}
                >
                  <Eye size={14} />
                </button>
              </Tooltip>
              <Tooltip title="Analytics">
                <button
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded hover:bg-muted transition-colors hidden sm:flex"
                  onClick={() => navigate(`/analytics/${qrCode.id}`)}
                >
                  <BarChart3 size={14} />
                </button>
              </Tooltip>
              <Dropdown
                menu={{ items: downloadMenuItems }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Tooltip title="Download">
                  <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded hover:bg-muted transition-colors">
                    <Download size={14} />
                  </button>
                </Tooltip>
              </Dropdown>
              <Dropdown
                menu={{ items: actionsMenuItems }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Tooltip title="More">
                  <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded hover:bg-muted transition-colors">
                    <MoreHorizontal size={14} />
                  </button>
                </Tooltip>
              </Dropdown>
            </div>
          </div>
        </Card>

        {/* Download Preview Modal */}
        <Modal
          title="Download QR Code Template"
          open={downloadModalOpen}
          onCancel={() => setDownloadModalOpen(false)}
          footer={null}
          width="90%"
          centered
          className="qr-preview-modal"
          destroyOnHidden
        >
          <div className="flex flex-col items-center py-4 px-2">
            <Spin
              spinning={downloadingFormat !== null}
              tip="Preparing download..."
              className="w-full"
            >
              <div className="flex justify-center">
                <QRCodePreview
                  ref={previewRef}
                  content={qrCode.content}
                  template={qrCode.template}
                  styling={qrCode.styling}
                  qrId={qrCode.id}
                  qrType={qrCode.type}
                  showWatermark={showWatermark}
                  watermarkText={watermarkText}
                />
              </div>
            </Spin>

            {/* Watermark indicator */}
            <div className="text-xs text-muted-foreground mt-2">
              {showWatermark ? `Watermark: "${watermarkText}"` : "No watermark"}
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <button
                onClick={() => handleDownload("png")}
                disabled={downloadingFormat !== null}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {downloadingFormat === "png" ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <FileImage size={18} />
                )}
                PNG
              </button>
              <button
                onClick={() => handleDownload("jpg")}
                disabled={downloadingFormat !== null}
                className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
              >
                {downloadingFormat === "jpg" ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/70 border-t-transparent" />
                ) : (
                  <Image size={18} />
                )}
                JPG
              </button>
              <button
                onClick={() => handleDownload("webp")}
                disabled={downloadingFormat !== null}
                className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
              >
                {downloadingFormat === "webp" ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/70 border-t-transparent" />
                ) : (
                  <Image size={18} />
                )}
                WebP
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
  }
);

QRCodeCard.displayName = "QRCodeCard";

export default QRCodeCard;
