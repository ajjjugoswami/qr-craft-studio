import React from 'react';
import { Button } from 'antd';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface MobileSettingsActionBarProps {
  currentIndex: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  onPreview?: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  previewLabel?: string;
}

const MobileSettingsActionBar: React.FC<MobileSettingsActionBarProps> = ({
  currentIndex,
  totalItems,
  onPrevious,
  onNext,
  onPreview,
  canGoPrevious,
  canGoNext,
  previewLabel = 'Preview',
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border p-4 safe-area-bottom">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
        {/* Previous Button */}
        <Button
          type="default"
          size="large"
          icon={<ChevronLeft size={18} />}
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="flex-1 max-w-[120px]"
        >
          Previous
        </Button>

        {/* Preview Button (optional) */}
        {onPreview && (
          <Button
            type="default"
            size="large"
            icon={<Eye size={18} />}
            onClick={onPreview}
            className="flex-1 max-w-[120px]"
          >
            {previewLabel}
          </Button>
        )}

        {/* Next Button */}
        <Button
          type="primary"
          size="large"
          onClick={onNext}
          disabled={!canGoNext}
          className="flex-1 max-w-[120px]"
        >
          {currentIndex === totalItems - 1 ? 'Finish' : 'Next'}
          {currentIndex < totalItems - 1 && <ChevronRight size={18} className="ml-1" />}
        </Button>
      </div>
    </div>
  );
};

export default MobileSettingsActionBar;