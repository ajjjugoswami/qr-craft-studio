import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
      <div className="inline-flex items-center gap-4 bg-muted/50 border border-border p-2 px-4 rounded-full">
        <span className={cn(
          "text-sm font-medium transition-colors",
          selectedDuration === 1 ? 'text-foreground' : 'text-muted-foreground'
        )}>
          Monthly
        </span>
        <Switch
          checked={selectedDuration === 12}
          onCheckedChange={(checked) => onDurationChange(checked ? 12 : 1)}
        />
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-medium transition-colors",
            selectedDuration === 12 ? 'text-foreground' : 'text-muted-foreground'
          )}>
            Yearly
          </span>
          <Badge variant="secondary" className="text-xs font-medium bg-primary/10 text-primary border-0">
            Save 20%
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default DurationToggle;
