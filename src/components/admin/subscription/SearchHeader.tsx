import React from 'react';
import { Typography, Space, Input, Button, Tooltip } from 'antd';
import { RefreshCw, Search } from 'lucide-react';

const { Title, Text } = Typography;

interface SearchHeaderProps {
  title: string;
  description: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
  loading: boolean;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  title,
  description,
  searchValue,
  onSearchChange,
  onSearch,
  onRefresh,
  loading,
}) => {
  return (
    <div className="mb-4 space-y-3">
      <div>
        <Title level={5} className="!mb-0 !text-sm sm:!text-base">{title}</Title>
        <Text type="secondary" className="text-xs sm:text-sm">
          {description}
        </Text>
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search by user name or email"
          allowClear
          size="small"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onSearch(); }}
          className="flex-1"
          prefix={<Search size={14} />}
        />
        <Tooltip title="Refresh">
          <Button
            type="default"
            shape="circle"
            icon={<RefreshCw size={14} />}
            onClick={onRefresh}
            loading={loading}
            size="small"
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default SearchHeader;