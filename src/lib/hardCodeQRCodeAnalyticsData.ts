import type { ScanData } from '../types/qrcode';

export const generateMockScanData = (count = 15): ScanData[] => {
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Samsung Browser', 'Mobile Chrome', 'Mobile Safari'];
  const oses = ['iOS 17.2', 'iOS 18.0', 'Android 14', 'Windows 11', 'macOS 14', 'Android 13'];
  const devices: Array<'mobile' | 'tablet' | 'desktop'> = ['mobile', 'tablet', 'desktop'];
  const vendors = ['Apple', 'Samsung', 'Google', 'Dell', 'HP', 'OnePlus', 'Xiaomi'];
  const models = ['iPhone 15', 'iPhone 14', 'Galaxy S24', 'Pixel 8', 'iPad Pro', 'MacBook Pro', 'Windows PC'];
  const locations = [
    { city: 'Kaithal', region: 'HR', country: 'IN', lat: 29.8015, lng: 76.4, timezone: 'Asia/Kolkata' },
    { city: 'New Delhi', region: 'DL', country: 'IN', lat: 28.6139, lng: 77.209, timezone: 'Asia/Kolkata' },
    { city: 'Mumbai', region: 'MH', country: 'IN', lat: 19.076, lng: 72.8777, timezone: 'Asia/Kolkata' },
    { city: 'New York', region: 'NY', country: 'US', lat: 40.7128, lng: -74.006, timezone: 'America/New_York' },
    { city: 'London', region: 'ENG', country: 'UK', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London' },
  ];

  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    const deviceType = devices[Math.floor(Math.random() * devices.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];

    return {
      id: `scan-${i + 1}`,
      date: date.toLocaleDateString('en-GB'),
      time: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'am' : 'pm'}`,
      browser: browsers[Math.floor(Math.random() * browsers.length)] + ` ${Math.floor(Math.random() * 50) + 100}.0.${Math.floor(Math.random() * 10000)}.${Math.floor(Math.random() * 1000)}`,
      os: oses[Math.floor(Math.random() * oses.length)],
      deviceType,
      deviceVendor: vendors[Math.floor(Math.random() * vendors.length)],
      deviceModel: models[Math.floor(Math.random() * models.length)],
      ipAddress: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      location,
    } as ScanData;
  });
};

export const getDemoQRCodeAnalytics = () => {
  // Provide shapes similar to backend `analytics.analytics` fields used in QRAnalytics
  const devices = { mobile: 65, desktop: 25, tablet: 10 };
  const browsers = { Chrome: 48, Safari: 26, Firefox: 12, Edge: 8, 'Mobile Chrome': 4, 'Mobile Safari': 2 };
  const countries = { India: 48, USA: 28, UK: 10, Germany: 8, Canada: 6 };

  // scansByDate last 7 days
  const scansByDate: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    scansByDate[d.toISOString().split('T')[0]] = Math.floor(Math.random() * 80) + 10;
  }

  const totalScans = Object.values(scansByDate).reduce((a, b) => a + b, 0);

  return {
    analytics: {
      devices,
      browsers,
      countries,
      scansByDate,
    },
    totalScans,
  };
};

export default {
  generateMockScanData,
  getDemoQRCodeAnalytics,
};
