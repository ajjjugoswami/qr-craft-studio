import React from 'react';
import { Switch, Badge } from 'antd';

interface DurationToggleProps {
  selectedDuration: 1 | 12;
  onDurationChange: (duration: 1 | 12) => void;
}

const DurationToggle: React.FC<DurationToggleProps> = ({
  selectedDuration,
  onDurationChange
}) => {
  return (
    <div className="flex justify-center items-center mb-8">
      <div className="inline-flex items-center gap-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl shadow-sm">
        <span className={`transition-colors ${selectedDuration === 1 ? 'font-semibold text-blue-600' : 'text-gray-500'}`}>
          Monthly
        </span>
        <Switch
          checked={selectedDuration === 12}
          onChange={(checked) => onDurationChange(checked ? 12 : 1)}
          className="mx-2"
        />
        <div className="flex items-center gap-2">
          <span className={`transition-colors ${selectedDuration === 12 ? 'font-semibold text-blue-600' : 'text-gray-500'}`}>
            Yearly
          </span>
          <div className="relative">
            <Badge 
              count="20% OFF" 
              style={{ 
                backgroundColor: '#10b981', 
                fontSize: '9px',
                height: '16px',
                lineHeight: '16px',
                borderRadius: '8px',
                padding: '0 6px',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DurationToggle;