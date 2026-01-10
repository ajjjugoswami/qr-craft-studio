import React from 'react';
import { Typography } from 'antd';
import { Check, ChevronRight } from 'lucide-react';

const { Text } = Typography;

interface Step {
  key: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface MobileStepNavigationProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
}

const MobileStepNavigation: React.FC<MobileStepNavigationProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 mb-4">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">
              {currentStep + 1}
            </span>
          </div>
          <div>
            <Text className="text-base font-semibold block leading-tight">
              {steps[currentStep]?.title}
            </Text>
            <Text type="secondary" className="text-xs">
              {steps[currentStep]?.description}
            </Text>
          </div>
        </div>
        <Text type="secondary" className="text-sm">
          {currentStep + 1}/{steps.length}
        </Text>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-1.5 mb-3">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => index <= currentStep && onStepClick(index)}
            className={`flex-1 h-2 rounded-full transition-all ${
              index <= currentStep ? 'bg-primary' : 'bg-muted'
            } ${index < currentStep ? 'cursor-pointer hover:bg-primary/80' : ''}`}
            disabled={index > currentStep}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>

      {/* Step Pills - Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {steps.map((step, index) => (
          <button
            key={step.key}
            onClick={() => index <= currentStep && onStepClick(index)}
            disabled={index > currentStep}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium 
              whitespace-nowrap transition-all flex-shrink-0
              ${index === currentStep 
                ? 'bg-primary text-primary-foreground' 
                : index < currentStep 
                  ? 'bg-primary/10 text-primary cursor-pointer hover:bg-primary/20' 
                  : 'bg-muted text-muted-foreground opacity-60'
              }
            `}
          >
            {index < currentStep ? (
              <Check size={12} className="flex-shrink-0" />
            ) : (
              <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">
                {index + 1}
              </span>
            )}
            {step.title}
            {index === currentStep && (
              <ChevronRight size={12} className="flex-shrink-0 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      <Text type="secondary" className="text-[11px] mt-2 block">
        Use <span className="font-medium text-foreground">Preview</span> and <span className="font-medium text-foreground">Next</span> in the bottom bar.
      </Text>
    </div>
  );
};

export default MobileStepNavigation;
