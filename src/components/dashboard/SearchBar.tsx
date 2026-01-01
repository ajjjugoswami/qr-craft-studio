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
        prefix={<Search size={16} className="text-muted-foreground" />}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 sm:w-48 md:w-64"
        allowClear
      />
      <Segmented
        value={viewMode}
        onChange={(value) => onViewModeChange(value as 'list' | 'grid')}
        options={[
          {
            label: (
              <div className="flex items-center gap-2">
                <List size={16} />
                <span className="hidden sm:inline">List</span>
              </div>
            ),
            value: 'list',
          },
          {
            label: (
              <div className="flex items-center gap-2">
                <LayoutGrid size={16} />
                <span className="hidden sm:inline">Grid</span>
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
