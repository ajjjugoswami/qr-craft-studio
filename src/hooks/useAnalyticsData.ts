import { useMemo, useEffect } from 'react';
import { useQRCodes } from './useQRCodes';
import { useAnalytics } from './useAnalytics';
import { usePayment } from './usePayment';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchAdvancedAnalytics, selectAdvancedAnalytics, selectAdvancedLoading } from '@/store/slices/analyticsSlice';
import { selectStatsTotalActive, selectStatsTotal } from '@/store/slices/statsSlice';
import { getDemoScansOverTime, demoDeviceData, demoTopQRCodes, demoLocations, demoAdvancedAnalytics } from '@/lib/hardCodeAnalyticsData';
import { 
  ScanData, 
  DeviceData, 
  QRCodeScanData, 
  LocationData, 
  QRTypeData, 
  WeeklyData, 
  AdvancedAnalytics 
} from '@/types/analytics';

interface UseAnalyticsDataReturn {
  loading: boolean;
  scans: any[];
  qrCodes: any[];
  totalQRCodes: number;
  activeQRs: number;
  scansOverTime: ScanData[];
  weeklyData: WeeklyData[];
  deviceData: DeviceData[];
  topQRCodes: QRCodeScanData[];
  qrTypeDistribution: QRTypeData[];
  locationData: LocationData[];
  displayedTotalScans: number;
  avgScansPerQR: number;
  advancedAnalytics: AdvancedAnalytics | null;
  advancedLoading: boolean;
}

export const useAnalyticsData = (mode: 'real' | 'demo'): UseAnalyticsDataReturn => {
  const { qrCodes } = useQRCodes();
  const { scans, analytics, loading } = useAnalytics();
  const { hasFeatureAccess } = usePayment();
  const dispatch = useAppDispatch();
  
  // Get advanced analytics from Redux
  const advancedAnalytics = useAppSelector(selectAdvancedAnalytics);
  const advancedLoading = useAppSelector(selectAdvancedLoading);
  
  // Get stats from Redux (same as Dashboard)
  const statsActiveQRs = useAppSelector(selectStatsTotalActive);
  const statsTotal = useAppSelector(selectStatsTotal);
  
  // Check if user has access to advanced analytics
  const canViewAdvancedAnalytics = hasFeatureAccess('advancedAnalytics');

  // Fetch combined advanced analytics via Redux only if user has access and data not loaded
  useEffect(() => {
    if (mode === 'real' && canViewAdvancedAnalytics && !advancedAnalytics && !advancedLoading) {
      dispatch(fetchAdvancedAnalytics(undefined));
    }
  }, [mode, dispatch, advancedAnalytics, advancedLoading, canViewAdvancedAnalytics]);

  // Use stats data for consistency with Dashboard (don't rely on paginated qrCodes)
  const activeQRs = mode === 'demo' 
    ? Math.floor(Math.random() * 15) + 8 // Demo value
    : statsActiveQRs; // Use same data source as Dashboard

  // Scans timeline (last 30 days)
  const scansOverTime = useMemo(() => {
    if (mode === 'demo') return getDemoScansOverTime();

    if (analytics?.analytics?.scansByDate) {
      const map: Record<string, number> = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        map[key] = (analytics.analytics.scansByDate as any)[key] || 0;
      }
      return Object.entries(map).map(([date, scans]) => ({ date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), scans }));
    }

    const map: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      map[key] = 0;
    }
    (scans || []).forEach((s: any) => {
      if (s?.createdAt) {
        const key = new Date(s.createdAt).toISOString().split('T')[0];
        if (map[key] !== undefined) map[key] += 1;
      }
    });
    return Object.entries(map).map(([date, scans]) => ({ date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), scans }));
  }, [scans, analytics, mode]);

  const weeklyData = useMemo(() => {
    if (mode === 'demo') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days.map(day => ({ day, scans: Math.floor(Math.random() * 100) + 20 }));
    }
    const map: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    (scans || []).forEach((s: any) => {
      if (s?.createdAt) {
        const day = new Date(s.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
        map[day] = (map[day] || 0) + 1;
      }
    });
    return Object.entries(map).map(([day, scans]) => ({ day, scans }));
  }, [scans, mode]);

  const deviceData = useMemo(() => {
    if (mode === 'demo') return demoDeviceData;
    if (analytics?.analytics?.devices) {
      return Object.entries(analytics.analytics.devices).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
    }
    const counts: Record<string, number> = {};
    (scans || []).forEach((s: any) => { const t = s?.device?.type || 'desktop'; counts[t] = (counts[t] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, [scans, analytics, mode]);

  const topQRCodes = useMemo(() => {
    if (mode === 'demo') return demoTopQRCodes;
    if (analytics?.analytics?.topQRCodes && Array.isArray(analytics.analytics.topQRCodes)) {
      return analytics.analytics.topQRCodes.map((t: any) => ({ name: t?.name || 'Untitled', scans: t?.count || 0 }));
    }
    const groups: Record<string, number> = {};
    (scans || []).forEach((s: any) => { const name = s?.qrCode?.name || 'Unknown'; groups[name] = (groups[name] || 0) + 1; });
    return Object.entries(groups).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, scans]) => ({ name, scans }));
  }, [scans, analytics, mode]);

  const qrTypeDistribution = useMemo(() => {
    const counts = (qrCodes || []).reduce((acc, qr) => { if (qr?.type) acc[qr.type] = (acc[qr.type] || 0) + 1; return acc; }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [qrCodes]);

  const locationData = useMemo(() => {
    if (mode === 'demo') return demoLocations;
    if (analytics?.analytics?.countries) {
      return Object.entries(analytics.analytics.countries).map(([country, scans]) => ({ country, scans }));
    }
    const counts: Record<string, number> = {};
    (scans || []).forEach((s: any) => { const c = s?.location?.country || 'Unknown'; counts[c] = (counts[c] || 0) + 1; });
    return Object.entries(counts).map(([country, scans]) => ({ country, scans })).slice(0, 10);
  }, [scans, analytics, mode]);

  const demoScans = useMemo(() => getDemoScansOverTime(), []);
  const demoTotalScans = useMemo(() => demoScans.reduce((acc, d) => acc + (d?.scans || 0), 0), [demoScans]);
  // Use analytics.totalScans first (from scan aggregation), fallback to scans array length
  const displayedTotalScans = mode === 'real' ? (analytics?.totalScans ?? (scans || []).length) : demoTotalScans;
  // Use total QR codes from stats for correct calculation
  const totalQRCodesForCalc = mode === 'real' ? (statsTotal || qrCodes.length) : qrCodes.length;
  const avgScansPerQR = totalQRCodesForCalc ? Math.round(displayedTotalScans / totalQRCodesForCalc) : 0;

  // Use demo data for advanced analytics when in demo mode
  const finalAdvancedAnalytics = mode === 'demo' ? demoAdvancedAnalytics : advancedAnalytics;
  const finalAdvancedLoading = mode === 'demo' ? false : advancedLoading;

  return {
    loading,
    scans,
    qrCodes,
    totalQRCodes: mode === 'real' ? statsTotal : qrCodes.length,
    activeQRs,
    scansOverTime,
    weeklyData,
    deviceData,
    topQRCodes,
    qrTypeDistribution,
    locationData,
    displayedTotalScans,
    avgScansPerQR,
    advancedAnalytics: finalAdvancedAnalytics,
    advancedLoading: finalAdvancedLoading,
  };
};
