import React from 'react';
import { Input, Segmented } from 'antd';
import { Search, LayoutGrid, List } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <Input
        placeholder="Search..."
        prefix={<Search size={14} className="text-muted-foreground" />}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 min-w-0 sm:w-40 md:w-56 !text-xs"
        allowClear
        size="small"
      />
      <Segmented
        value={viewMode}
        onChange={(value) => onViewModeChange(value as 'list' | 'grid')}
        size="small"
        options={[
          {
            label: (
              <div className="flex items-center justify-center px-0.5">
                <List size={14} />
              </div>
            ),
            value: 'list',
          },
          {
            label: (
              <div className="flex items-center justify-center px-0.5">
                <LayoutGrid size={14} />
              </div>
            ),
            value: 'grid',
          },
        ]}
        className="segmented-animated"
      />
    </div>
  );
};

export default SearchBar;
