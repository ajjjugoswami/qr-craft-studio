// Analytics Type Definitions

export interface ReferrerData {
  referrer: string;
  count: number;
}

export interface CategorizedReferrers {
  direct: number;
  social: number;
  search: number;
  email: number;
  other: number;
  [key: string]: number;
}

export interface ReferrerAnalyticsData {
  referrers: ReferrerData[];
  categorized: CategorizedReferrers;
}

export interface CityData {
  city: string;
  country: string;
  scans: number;
  count?: number;
  lat: number;
  lng: number;
}

export interface GeographicHeatmapData {
  cityData: CityData[];
  total?: number;
  heatmapData?: Array<{ lat: number; lng: number; weight: number }>;
  totalScansWithCoordinates?: number;
}

export interface HourlyData {
  hour: number | string;
  count?: number;
  scans?: number;
}

export interface DailyData {
  day: string;
  scans: number;
  count?: number;
}

export interface PeakTimesData {
  hourlyData: HourlyData[];
  dailyData?: DailyData[];
  peakHour?: string;
  peakDay?: string;
}

export interface DailyRetentionData {
  date: string;
  uniqueUsers: number;
}

export interface RetentionData {
  totalScans: number;
  uniqueScanners: number;
  newScans: number;
  returningScans: number;
  repeatRate: number;
  dailyRetention?: DailyRetentionData[];
}

export interface AdvancedAnalytics {
  heatmap: GeographicHeatmapData;
  peakTimes: PeakTimesData;
  retention: RetentionData;
  referrers: ReferrerAnalyticsData;
}

export interface ScanData {
  date: string;
  scans: number;
}

export interface DeviceData {
  name: string;
  value: number;
}

export interface QRCodeScanData {
  name: string;
  scans: number;
}

export interface LocationData {
  country: string;
  scans: number;
}

export interface QRTypeData {
  name: string;
  value: number;
}

export interface WeeklyData {
  day: string;
  scans: number;
}

// Helper type for table columns
export type TableColumnType<T> = {
  title: string;
  dataIndex: keyof T;
  key: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: number;
  align?: 'left' | 'right' | 'center';
};

