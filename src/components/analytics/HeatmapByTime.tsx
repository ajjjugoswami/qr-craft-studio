import React, { useMemo } from 'react';
import { Card, Typography, Tooltip } from 'antd';
import { cn } from '@/lib/utils';

const { Text } = Typography;

interface HeatmapByTimeProps {
  scans: Array<{ createdAt: string }>;
  mode: 'real' | 'demo';
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const HeatmapByTime: React.FC<HeatmapByTimeProps> = ({ scans, mode }) => {
  const heatmapData = useMemo(() => {
    // Initialize grid: 7 days x 24 hours
    const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));

    if (mode === 'demo') {
      // Generate demo data with realistic patterns
      for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
          // More scans during weekdays and business hours
          const isWeekday = day >= 1 && day <= 5;
          const isBusinessHour = hour >= 9 && hour <= 18;
          const isPeakHour = hour >= 10 && hour <= 14;
          
          let baseValue = Math.random() * 20;
          if (isWeekday) baseValue += 15;
          if (isBusinessHour) baseValue += 25;
          if (isPeakHour) baseValue += 20;
          
          grid[day][hour] = Math.floor(baseValue);
        }
      }
    } else {
      // Process real scan data
      scans.forEach((scan) => {
        const date = new Date(scan.createdAt);
        const day = date.getDay();
        const hour = date.getHours();
        grid[day][hour]++;
      });
    }

    return grid;
  }, [scans, mode]);

  const maxValue = useMemo(() => {
    return Math.max(...heatmapData.flat(), 1);
  }, [heatmapData]);

  const getIntensity = (value: number) => {
    if (value === 0) return 0;
    return Math.ceil((value / maxValue) * 5);
  };

  const getColor = (intensity: number) => {
    const colors = [
      'bg-muted/30',
      'bg-primary/20',
      'bg-primary/40',
      'bg-primary/60',
      'bg-primary/80',
      'bg-primary',
    ];
    return colors[intensity] || colors[0];
  };

  const totalScans = useMemo(() => {
    return heatmapData.flat().reduce((sum, val) => sum + val, 0);
  }, [heatmapData]);

  const peakTime = useMemo(() => {
    let maxVal = 0;
    let peakDay = 0;
    let peakHour = 0;
    
    heatmapData.forEach((dayData, day) => {
      dayData.forEach((value, hour) => {
        if (value > maxVal) {
          maxVal = value;
          peakDay = day;
          peakHour = hour;
        }
      });
    });

    return { day: DAYS[peakDay], hour: peakHour, value: maxVal };
  }, [heatmapData]);

  return (
    <Card title="Activity Heatmap by Time" className="h-full">
      <div className="space-y-4">
        {/* Stats row */}
        <div className="flex gap-4 text-sm">
          <div>
            <Text type="secondary">Total Scans: </Text>
            <Text strong>{totalScans}</Text>
          </div>
          <div>
            <Text type="secondary">Peak Time: </Text>
            <Text strong>{peakTime.day} {peakTime.hour}:00</Text>
          </div>
        </div>

        {/* Heatmap grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hour labels */}
            <div className="flex mb-1">
              <div className="w-10" />
              {HOURS.filter((h) => h % 3 === 0).map((hour) => (
                <div key={hour} className="flex-1 text-center text-[10px] text-muted-foreground">
                  {hour}:00
                </div>
              ))}
            </div>

            {/* Grid rows */}
            {DAYS.map((day, dayIndex) => (
              <div key={day} className="flex items-center gap-0.5 mb-0.5">
                <div className="w-10 text-xs text-muted-foreground font-medium">{day}</div>
                <div className="flex-1 flex gap-0.5">
                  {HOURS.map((hour) => {
                    const value = heatmapData[dayIndex][hour];
                    const intensity = getIntensity(value);
                    return (
                      <Tooltip
                        key={hour}
                        title={`${day} ${hour}:00 - ${value} scans`}
                      >
                        <div
                          className={cn(
                            'flex-1 h-6 rounded-sm transition-colors cursor-pointer hover:ring-2 hover:ring-primary/50',
                            getColor(intensity)
                          )}
                        />
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4">
              <Text type="secondary" className="text-xs">Less</Text>
              <div className="flex gap-0.5">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={cn('w-4 h-4 rounded-sm', getColor(i))} />
                ))}
              </div>
              <Text type="secondary" className="text-xs">More</Text>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HeatmapByTime;
