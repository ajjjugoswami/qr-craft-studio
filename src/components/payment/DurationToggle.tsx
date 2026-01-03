import React from 'react';
import { Switch } from 'antd';

interface DurationToggleProps {
  selectedDuration: 1 | 12;
  onDurationChange: (duration: 1 | 12) => void;
}

const DurationToggle: React.FC<DurationToggleProps> = ({
  selectedDuration,
  onDurationChange
}) => {
  return (
    <div className="flex justify-center items-center mb-10">
      <div className="inline-flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 py-2 px-5 rounded-full">
        <span className={`text-sm font-medium transition-colors ${
          selectedDuration === 1 ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
        }`}>
          Monthly
        </span>
        <Switch
          checked={selectedDuration === 12}
          onChange={(checked) => onDurationChange(checked ? 12 : 1)}
        />
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium transition-colors ${
            selectedDuration === 12 ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
          }`}>
            Yearly
          </span>
          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium px-2 py-0.5 rounded-full">
            Save 20%
          </span>
        </div>
      </div>
    </div>
  );
};

export default DurationToggle;
