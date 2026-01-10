import React from 'react';
import { Button } from 'antd';
import { ChevronLeft, ChevronRight, Undo2, Save, Eye } from 'lucide-react';

interface MobileActionBarProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onUndo: () => void;
  onSave: () => void;
  onPreview: () => void;
  canUndo: boolean;
  saving: boolean;
}

const MobileActionBar: React.FC<MobileActionBarProps> = ({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onUndo,
  onSave,
  onPreview,
  canUndo,
  saving,
}) => {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border p-3 z-40 lg:hidden safe-area-bottom">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* Back Button */}
        <Button
          size="large"
          onClick={onPrev}
          disabled={currentStep === 0}
          icon={<ChevronLeft size={18} />}
          className="flex-shrink-0 !px-3"
        />

        {/* Undo Button */}
        <Button
          size="large"
          onClick={onUndo}
          disabled={!canUndo}
          icon={<Undo2 size={18} />}
          className="flex-shrink-0 !px-3"
        />

        {/* Preview Button */}
        <Button
          size="large"
          onClick={onPreview}
          icon={<Eye size={18} />}
          className="flex-shrink-0 !px-3"
        />

        {/* Primary Action */}
        {isLastStep ? (
          <Button
            type="primary"
            size="large"
            onClick={onSave}
            loading={saving}
            disabled={saving}
            icon={<Save size={18} />}
            className="flex-1 !font-semibold"
          >
            Save QR
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            onClick={onNext}
            className="flex-1 !font-semibold"
          >
            <span>Next</span>
            <ChevronRight size={18} className="ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileActionBar;
