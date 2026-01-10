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

const IconAction: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  label: string;
  icon: React.ReactNode;
}> = ({ onClick, disabled, label, icon }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`
        w-10 h-10 rounded-xl border border-border bg-muted/40
        flex items-center justify-center
        transition-colors
        ${disabled ? 'opacity-40' : 'hover:bg-muted'}
      `}
    >
      {icon}
    </button>
  );
};

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
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border px-3 py-2 z-40 lg:hidden safe-area-bottom">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <IconAction
          onClick={onPrev}
          disabled={currentStep === 0}
          label="Back"
          icon={<ChevronLeft size={18} className="text-foreground" />}
        />

        <IconAction
          onClick={onUndo}
          disabled={!canUndo}
          label="Undo"
          icon={<Undo2 size={18} className="text-foreground" />}
        />

        <IconAction
          onClick={onPreview}
          label="Preview"
          icon={<Eye size={18} className="text-foreground" />}
        />

        {isLastStep ? (
          <Button
            type="primary"
            size="middle"
            onClick={onSave}
            loading={saving}
            disabled={saving}
            icon={<Save size={16} />}
            className="flex-1 !font-semibold"
          >
            Save
          </Button>
        ) : (
          <Button
            type="primary"
            size="middle"
            onClick={onNext}
            className="flex-1 !font-semibold"
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileActionBar;
