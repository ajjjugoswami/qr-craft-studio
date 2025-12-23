import React, { useCallback, useEffect, useRef, useState } from "react";
import { Table, Tag, Typography, Spin, Alert, Button, Input, Space, Tooltip } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { RefreshCw } from 'lucide-react';
import { adminAPI } from "@/lib/api";

const { Title, Text } = Typography;

interface User {
  _id: string;
  id?: string;
  name?: string;
  email?: string;
  createdAt?: string | null;
}

interface QRCode {
  _id: string;
  name?: string;
  type?: string;
  content?: string | null;
  scanCount?: number;
  createdAt?: string | null;
  status?: string;
}

interface AdminUserRow {
  user: User;
  qrcodes: QRCode[];
}

type FetchOptions = { page?: number; limit?: number; search?: string };

// ----- Helpers -----
const formatDate = (v?: string | null) =>
  v ? new Date(v).toLocaleString() : "-";

// ----- Component -----
const AdminData: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminUserRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  const isMounted = useRef(true);

  const loadData = useCallback(
    async (opts: FetchOptions = {}) => {
      const p = opts.page ?? page;
      const l = opts.limit ?? limit;
      const s = opts.search ?? search ?? undefined;

      setLoading(true);
      setError(null);

      try {
        const res = await adminAPI.getUsersData({
          page: p,
          limit: l,
          search: s,
        });
        if (!isMounted.current) return;

        // Support both paginated responses and raw arrays
        const payload = (res?.data ?? res) as any;
        const list: AdminUserRow[] = Array.isArray(payload)
          ? payload
          : payload?.data ?? [];

        setData(list);
        setPage(payload?.page ?? p);
        setLimit(payload?.limit ?? l);
        setTotal(
          payload?.total ??
            (Array.isArray(payload) ? list.length : payload?.count ?? 0)
        );
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load admin data"
        );
      } finally {
        if (isMounted.current) setLoading(false);
      }
    },
    [page, limit, search]
  );

  useEffect(() => {
    isMounted.current = true;
    loadData({ page: 1, limit });
    return () => {
      isMounted.current = false;
    };
  }, [loadData, limit]);

  // Table change (pagination / page size)
  const handleTableChange = (pagination: TablePaginationConfig) => {
    const newPage = pagination.current ?? 1;
    const newLimit = pagination.pageSize ?? limit;
    loadData({ page: Number(newPage), limit: Number(newLimit), search });
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    loadData({ page: 1, search: value });
  };

  // Columns
  const columns: ColumnsType<AdminUserRow> = [
    {
      title: "Name",
      dataIndex: ["user", "name"],
      key: "name",
      render: (val: string | undefined, record: AdminUserRow) => (
        <Text strong>{val ?? record.user?.email ?? "—"}</Text>
      ),
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
      render: (email: string | undefined) => <Text>{email ?? "—"}</Text>,
    },
    {
      title: "Created",
      dataIndex: ["user", "createdAt"],
      key: "createdAt",
      render: (val: string | null | undefined) => (
        <Text type="secondary">{formatDate(val as any)}</Text>
      ),
    },
    {
      title: "QR Codes",
      dataIndex: "qrcodes",
      key: "qrcodes",
      render: (qrs: QRCode[] | undefined) => <Tag>{qrs?.length ?? 0}</Tag>,
    },
  ];

  const renderExpandedRow = (record: AdminUserRow) => {
    const qrs = record.qrcodes ?? [];
    if (qrs.length === 0) return <Text type="secondary">No QR codes</Text>;

    const qrColumns = [
      { title: "Name", dataIndex: "name", key: "name" },
      { title: "Type", dataIndex: "type", key: "type" },
      {
        title: "Content",
        dataIndex: "content",
        key: "content",
        render: (c: any) => <Text copyable>{String(c ?? "")}</Text>,
      },
      { title: "Scans", dataIndex: "scanCount", key: "scanCount" },
      {
        title: "Created",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (v: any) => formatDate(v),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (s: any) => <Tag>{s ?? "—"}</Tag>,
      },
    ];

    return (
      <Table
        size="small"
        pagination={false}
        rowKey={(r: QRCode) => r._id}
        dataSource={qrs}
        columns={qrColumns}
      />
    );
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Title level={4}>Admin: Users & QR Codes</Title>
          <Text type="secondary">
            View user details and the QR codes created by each user.
          </Text>
        </div>

        <div className="flex items-center">
          <Space size="middle" align="center">
            <Input
              placeholder="Search by name or email"
              allowClear
              size="small"
              value={search}
              onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(search); }}
              style={{ width: 260,borderRadius: 0 }}
              aria-label="Search users"
            />

            <Tooltip title="Refresh">
              <Button
                type="default"
                shape="circle"
                icon={<RefreshCw size={14} />}
                onClick={() => loadData({ page: 1, search })}
                loading={loading}
                size="small"
                aria-label="Refresh data"
              />
            </Tooltip>
          </Space>
        </div>
      </div>

      {error && <Alert type="error" message={error} className="mb-4" />}

      {loading ? (
        <div className="py-12 flex items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <Table<AdminUserRow>
          rowKey={(row) =>
            row.user?._id ?? row.user?.id ?? JSON.stringify(row.user)
          }
          dataSource={data}
          columns={columns}
          pagination={{
            current: page,
            pageSize: limit,
            total,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          onChange={handleTableChange}
          expandable={{ expandedRowRender: renderExpandedRow }}
        />
      )}
    </div>
  );
};

export default AdminData;
