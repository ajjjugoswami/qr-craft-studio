import React from 'react';
import { Card, Empty, Button } from 'antd';
import { SearchX, X } from 'lucide-react';

interface NoSearchResultsProps {
  searchTerm: string;
  onClearSearch: () => void;
}

const NoSearchResults: React.FC<NoSearchResultsProps> = ({ searchTerm, onClearSearch }) => {
  return (
    <Card className="py-12 md:py-16 glass-card">
      <Empty
        image={
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <SearchX size={32} className="text-primary" />
            </div>
          </div>
        }
        description={
          <div className="text-center space-y-3">
            <p className="text-base md:text-lg font-semibold text-foreground">
              No QR codes found
            </p>
            <p className="text-sm text-muted-foreground">
              No results match your search for <span className="font-semibold">"{searchTerm}"</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search terms or clear the search to see all QR codes
            </p>
            <Button
              type="primary"
              icon={<X size={16} />}
              onClick={onClearSearch}
              className="mt-2"
            >
              Clear Search
            </Button>
          </div>
        }
      />
    </Card>
  );
};

export default NoSearchResults;
