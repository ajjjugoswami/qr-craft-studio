import React from 'react';
import { Typography } from 'antd';
import { Check, ChevronRight } from 'lucide-react';

const { Text } = Typography;

interface SettingsItem {
  key: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  premium?: boolean;
}

interface MobileSettingsNavigationProps {
  items: SettingsItem[];
  activeKey: string;
  onItemClick: (key: string) => void;
}

const MobileSettingsNavigation: React.FC<MobileSettingsNavigationProps> = ({
  items,
  activeKey,
  onItemClick,
}) => {
  const activeIndex = items.findIndex(item => item.key === activeKey);

  return (
    <div className="bg-card border border-border rounded-2xl p-4 mb-4">
      {/* Current Settings Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">
              {activeIndex + 1}
            </span>
          </div>
          <div>
            <Text className="text-base font-semibold block leading-tight">
              {items[activeIndex]?.title}
            </Text>
            <Text type="secondary" className="text-xs">
              {items[activeIndex]?.description}
            </Text>
          </div>
        </div>
        <Text type="secondary" className="text-sm">
          {activeIndex + 1}/{items.length}
        </Text>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-1.5 mb-3">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => onItemClick(items[index].key)}
            className={`flex-1 h-2 rounded-full transition-all ${
              index <= activeIndex ? 'bg-primary' : 'bg-muted'
            } cursor-pointer hover:bg-primary/80`}
            aria-label={`Go to ${items[index].title}`}
          />
        ))}
      </div>

      {/* Settings Pills - Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {items.map((item, index) => (
          <button
            key={item.key}
            onClick={() => onItemClick(item.key)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
              whitespace-nowrap transition-all flex-shrink-0
              ${index === activeIndex
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground cursor-pointer hover:bg-primary/20 hover:text-primary'
              }
            `}
          >
            {index < activeIndex ? (
              <Check size={12} className="flex-shrink-0" />
            ) : (
              <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">
                {index + 1}
              </span>
            )}
            {item.title}
            {index === activeIndex && (
              <ChevronRight size={12} className="flex-shrink-0 animate-pulse" />
            )}
          </button>
        ))}
      </div>

 
    </div>
  );
};

export default MobileSettingsNavigation;