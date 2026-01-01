import { 
  ScanData, 
  DeviceData, 
  QRCodeScanData, 
  LocationData, 
  AdvancedAnalytics 
} from '@/types/analytics';

export const getDemoScansOverTime = (): ScanData[] => {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return { date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), scans: Math.floor(Math.random() * 80) + 20 };
  });
};

export const demoDeviceData: DeviceData[] = [
  { name: 'Mobile', value: 65 },
  { name: 'Desktop', value: 25 },
  { name: 'Tablet', value: 10 },
];

export const demoTopQRCodes: QRCodeScanData[] = [
  { name: 'Promo Card', scans: 420 },
  { name: 'Business Card', scans: 320 },
  { name: 'Event Invite', scans: 210 },
  { name: 'Menu', scans: 150 },
  { name: 'Music Link', scans: 120 },
];

export const demoLocations: LocationData[] = [
  { country: 'India', scans: 450 },
  { country: 'USA', scans: 320 },
  { country: 'UK', scans: 180 },
  { country: 'Germany', scans: 120 },
  { country: 'Canada', scans: 90 },
];

export const getDemoWeeklyData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({ day, scans: Math.floor(Math.random() * 100) + 20 }));
};

// Advanced Analytics Demo Data

export const demoAdvancedAnalytics: AdvancedAnalytics = {
  // Geographic Heatmap Data
  heatmap: {
    cityData: [
      { city: 'Mumbai', country: 'India', scans: 245, lat: 19.0760, lng: 72.8777 },
      { city: 'Delhi', country: 'India', scans: 198, lat: 28.6139, lng: 77.2090 },
      { city: 'New York', country: 'USA', scans: 176, lat: 40.7128, lng: -74.0060 },
      { city: 'London', country: 'UK', scans: 154, lat: 51.5074, lng: -0.1278 },
      { city: 'Bangalore', country: 'India', scans: 132, lat: 12.9716, lng: 77.5946 },
      { city: 'Los Angeles', country: 'USA', scans: 121, lat: 34.0522, lng: -118.2437 },
      { city: 'Toronto', country: 'Canada', scans: 98, lat: 43.6532, lng: -79.3832 },
      { city: 'Berlin', country: 'Germany', scans: 87, lat: 52.5200, lng: 13.4050 },
      { city: 'Sydney', country: 'Australia', scans: 76, lat: -33.8688, lng: 151.2093 },
      { city: 'Paris', country: 'France', scans: 65, lat: 48.8566, lng: 2.3522 },
    ],
    heatmapData: [
      { lat: 19.0760, lng: 72.8777, weight: 245 },
      { lat: 28.6139, lng: 77.2090, weight: 198 },
      { lat: 40.7128, lng: -74.0060, weight: 176 },
      { lat: 51.5074, lng: -0.1278, weight: 154 },
      { lat: 12.9716, lng: 77.5946, weight: 132 },
      { lat: 34.0522, lng: -118.2437, weight: 121 },
      { lat: 43.6532, lng: -79.3832, weight: 98 },
      { lat: 52.5200, lng: 13.4050, weight: 87 },
      { lat: -33.8688, lng: 151.2093, weight: 76 },
      { lat: 48.8566, lng: 2.3522, weight: 65 },
    ],
    totalScansWithCoordinates: 1352,
  },

  // Peak Times Analysis Data
  peakTimes: {
    hourlyData: [
      { hour: 0, scans: 12 },
      { hour: 1, scans: 8 },
      { hour: 2, scans: 5 },
      { hour: 3, scans: 4 },
      { hour: 4, scans: 6 },
      { hour: 5, scans: 10 },
      { hour: 6, scans: 18 },
      { hour: 7, scans: 32 },
      { hour: 8, scans: 45 },
      { hour: 9, scans: 62 },
      { hour: 10, scans: 78 },
      { hour: 11, scans: 85 },
      { hour: 12, scans: 92 },
      { hour: 13, scans: 88 },
      { hour: 14, scans: 95 },
      { hour: 15, scans: 105 },
      { hour: 16, scans: 98 },
      { hour: 17, scans: 87 },
      { hour: 18, scans: 76 },
      { hour: 19, scans: 68 },
      { hour: 20, scans: 54 },
      { hour: 21, scans: 42 },
      { hour: 22, scans: 28 },
      { hour: 23, scans: 18 },
    ],
    dailyData: [
      { day: 'Monday', scans: 823 },
      { day: 'Tuesday', scans: 891 },
      { day: 'Wednesday', scans: 956 },
      { day: 'Thursday', scans: 1032 },
      { day: 'Friday', scans: 987 },
      { day: 'Saturday', scans: 654 },
      { day: 'Sunday', scans: 543 },
    ],
    peakHour: '3 PM',
    peakDay: 'Thursday',
  },

  // Retention Analysis Data
  retention: {
    totalScans: 5886,
    uniqueScanners: 3421,
    newScans: 4234,
    returningScans: 1652,
    repeatRate: 28.07,
    dailyRetention: Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        uniqueUsers: Math.floor(Math.random() * 150) + 80,
      };
    }),
  },

  // Referrer Analysis Data
  referrers: {
    referrers: [
      { referrer: 'Direct', count: 2345 },
      { referrer: 'Instagram', count: 1256 },
      { referrer: 'Facebook', count: 987 },
      { referrer: 'Twitter', count: 654 },
      { referrer: 'LinkedIn', count: 432 },
      { referrer: 'Google Search', count: 321 },
      { referrer: 'WhatsApp', count: 287 },
      { referrer: 'Email', count: 234 },
      { referrer: 'YouTube', count: 176 },
      { referrer: 'Reddit', count: 98 },
      { referrer: 'Pinterest', count: 67 },
      { referrer: 'TikTok', count: 54 },
      { referrer: 'Telegram', count: 43 },
      { referrer: 'Snapchat', count: 32 },
      { referrer: 'Other', count: 124 },
    ],
    categorized: {
      direct: 2345,
      social: 3318,
      search: 321,
      email: 234,
      other: 892,
    },
  },
};
