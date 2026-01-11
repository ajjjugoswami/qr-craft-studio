import React, { useCallback, memo, useState } from "react";
import { Table, Tag, Typography, Alert, Button, Input, Space, Modal, message, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { RefreshCw, Eye, Copy } from "lucide-react";
import { useDateFormatter } from "@/hooks/useDateFormatter";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import type { AuditLog } from "@/store/slices/adminSlice";

const { Title, Text, Paragraph } = Typography;

const AdminAuditLogsTab: React.FC = memo(() => {
  const formatter = useDateFormatter();
  const {
    logs: auditLogs,
    loading: auditLogsLoading,
    error: auditLogsError,
    page: auditLogsPage,
    limit: auditLogsLimit,
    total: auditLogsTotal,
    search: auditLogsSearch,
    handleTableChange: handleAuditLogsTableChange,
    handleSearch: handleAuditLogsSearch,
  } = useAuditLogs();

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const handleCopyJson = useCallback(async () => {
    if (selectedLog) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2));
        message.success('JSON copied to clipboard!');
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = JSON.stringify(selectedLog, null, 2);
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        message.success('JSON copied to clipboard!');
      }
    }
  }, [selectedLog]);

  // Audit logs columns
  const auditLogsColumns: ColumnsType<AuditLog> = [
    {
      title: "Admin",
      dataIndex: ["adminId", "name"],
      key: "admin",
      render: (name: string | undefined, record: AuditLog) => (
        <Text strong>{name || record.adminEmail}</Text>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action: string) => {
        const actionColors = {
          USER_BLOCKED: "red",
          USER_UNBLOCKED: "green",
          USER_DELETED: "red",
          SUBSCRIPTION_UPDATED: "blue",
          USER_SUBSCRIPTION_REFRESHED: "orange",
          SYSTEM_CLEANUP: "purple",
          LIMITS_ENFORCED: "geekblue",
          UPDATE_PLAN_PRICES: "cyan",
        };
        return (
          <Tag
            color={
              actionColors[action as keyof typeof actionColors] || "default"
            }
          >
            {action.replace(/_/g, " ")}
          </Tag>
        );
      },
    },
    {
      title: "Target User",
      dataIndex: ["targetUserId", "name"],
      key: "targetUser",
      render: (name: string | undefined, record: AuditLog) => (
        <Text>{name || record.targetUserEmail || "—"}</Text>
      ),
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (details: any) => {
        if (!details) return "—";
        // compact single-line preview for the table cell
        const compactStr =
          typeof details === "object" ? JSON.stringify(details) : String(details);
        // pretty JSON for tooltip/preview/modal
        const prettyStr =
          typeof details === "object" ? JSON.stringify(details, null, 2) : String(details);
        return (
          <div style={{ maxWidth: 420 }}>
            <Paragraph
              type="secondary"
              ellipsis={{ rows: 1, tooltip: prettyStr }}
              style={{ margin: 0 }}
            >
              {compactStr}
            </Paragraph>
          </div>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val: string | null | undefined) => (
        <Text type="secondary">{formatter.dateTime(val as any)}</Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_: any, record: AuditLog) => (
        <Button
          type="text"
          icon={<Eye size={14} />}
          onClick={() => {
            setSelectedLog(record);
            setDetailModalVisible(true);
          }}
          size="small"
          title="View Details"
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Title level={4}>Audit Logs</Title>
        <Space>
          <Input
            placeholder="Search logs..."
            value={auditLogsSearch}
            onChange={(e) => handleAuditLogsSearch(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Button
            icon={<RefreshCw size={14} />}
            onClick={() => handleAuditLogsSearch(auditLogsSearch)}
            loading={auditLogsLoading}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {auditLogsError && (
        <Alert message={auditLogsError} type="error" showIcon />
      )}

      <Table
        columns={auditLogsColumns}
        dataSource={auditLogs}
        rowKey="_id"
        loading={auditLogsLoading}
        pagination={{
          current: auditLogsPage,
          pageSize: auditLogsLimit,
          total: auditLogsTotal,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} logs`,
        }}
        onChange={handleAuditLogsTableChange}
        size="large"
        scroll={{ x: 'max-content' }}
      />

      <Modal
      destroyOnHidden
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 48,marginTop: -4,marginBottom: 4 }}>
            <span>Audit Log Details</span>
            <div>
              <Tooltip title="Copy JSON">
                <Button
                  type="text"
                  icon={<Copy size={14} />}
                  onClick={handleCopyJson}
                  size="small"
                  aria-label="Copy JSON"
                />
              </Tooltip>
            </div>
          </div>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
        centered
      >
        {selectedLog && (
          <div>
            <pre
              style={{
                padding: '16px',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'monospace',
                overflow: 'auto',
                maxHeight: '500px',
                margin: 0,
                userSelect: 'text',
                cursor: 'text',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
              }}
            >
              {JSON.stringify(selectedLog, null, 2)}
            </pre>
          </div>
        )}
      </Modal>
    </div>
  );
});

AdminAuditLogsTab.displayName = "AdminAuditLogsTab";

export default AdminAuditLogsTab;
