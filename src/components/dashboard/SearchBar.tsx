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
    <div className="flex items-center gap-3 w-full sm:w-auto">
      <Input
        placeholder="Search QR codes..."
        prefix={<Search size={16} className="text-muted-foreground" />}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 min-w-0 sm:w-48 md:w-64"
        allowClear
      />
      <Segmented
        value={viewMode}
        onChange={(value) => onViewModeChange(value as 'list' | 'grid')}
        options={[
          {
            label: (
              <div className="flex items-center justify-center px-1">
                <List size={16} />
              </div>
            ),
            value: 'list',
          },
          {
            label: (
              <div className="flex items-center justify-center px-1">
                <LayoutGrid size={16} />
              </div>
            ),
            value: 'grid',
          },
        ]}
        // className="segmented-animated h-10"
      />
    </div>
  );
};

export default SearchBar;
