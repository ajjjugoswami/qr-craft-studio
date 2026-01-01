import { useMemo, useEffect } from 'react';
import { useQRCodes } from './useQRCodes';
import { useAnalytics } from './useAnalytics';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchAdvancedAnalytics, selectAdvancedAnalytics, selectAdvancedLoading } from '@/store/slices/analyticsSlice';
import { getDemoScansOverTime, demoDeviceData, demoTopQRCodes, demoLocations, demoAdvancedAnalytics } from '@/lib/hardCodeAnalyticsData';

export const useAnalyticsData = (mode: 'real' | 'demo') => {
  const { qrCodes } = useQRCodes();
  const { scans, analytics, loading } = useAnalytics();
  const dispatch = useAppDispatch();
  
  // Get advanced analytics from Redux
  const advancedAnalytics = useAppSelector(selectAdvancedAnalytics);
  const advancedLoading = useAppSelector(selectAdvancedLoading);

  // Fetch combined advanced analytics via Redux only if not already loaded
  useEffect(() => {
    if (mode === 'real' && !advancedAnalytics && !advancedLoading) {
      dispatch(fetchAdvancedAnalytics(undefined));
    }
  }, [mode, dispatch, advancedAnalytics, advancedLoading]);

  const activeQRs = useMemo(() => qrCodes.filter(qr => qr.status === 'active').length, [qrCodes]);

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
    scans.forEach((s: any) => {
      const key = new Date(s.createdAt).toISOString().split('T')[0];
      if (map[key] !== undefined) map[key] += 1;
    });
    return Object.entries(map).map(([date, scans]) => ({ date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), scans }));
  }, [scans, analytics, mode]);

  const weeklyData = useMemo(() => {
    if (mode === 'demo') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days.map(day => ({ day, scans: Math.floor(Math.random() * 100) + 20 }));
    }
    const map: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    scans.forEach((s: any) => {
      const day = new Date(s.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      map[day] = (map[day] || 0) + 1;
    });
    return Object.entries(map).map(([day, scans]) => ({ day, scans }));
  }, [scans, mode]);

  const deviceData = useMemo(() => {
    if (mode === 'demo') return demoDeviceData;
    if (analytics?.analytics?.devices) {
      return Object.entries(analytics.analytics.devices).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
    }
    const counts: Record<string, number> = {};
    scans.forEach((s: any) => { const t = s.device?.type || 'desktop'; counts[t] = (counts[t] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, [scans, analytics, mode]);

  const topQRCodes = useMemo(() => {
    if (mode === 'demo') return demoTopQRCodes;
    if (analytics?.analytics?.topQRCodes) {
      return analytics.analytics.topQRCodes.map((t: any) => ({ name: t.name || 'Untitled', scans: t.count }));
    }
    const groups: Record<string, number> = {};
    scans.forEach((s: any) => { const name = s.qrCode?.name || 'Unknown'; groups[name] = (groups[name] || 0) + 1; });
    return Object.entries(groups).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, scans]) => ({ name, scans }));
  }, [scans, analytics, mode]);

  const qrTypeDistribution = useMemo(() => {
    const counts = qrCodes.reduce((acc, qr) => { acc[qr.type] = (acc[qr.type] || 0) + 1; return acc; }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [qrCodes]);

  const locationData = useMemo(() => {
    if (mode === 'demo') return demoLocations;
    if (analytics?.analytics?.countries) {
      return Object.entries(analytics.analytics.countries).map(([country, scans]) => ({ country, scans }));
    }
    const counts: Record<string, number> = {};
    scans.forEach((s: any) => { const c = s.location?.country || 'Unknown'; counts[c] = (counts[c] || 0) + 1; });
    return Object.entries(counts).map(([country, scans]) => ({ country, scans })).slice(0, 10);
  }, [scans, analytics, mode]);

  const demoScans = useMemo(() => getDemoScansOverTime(), []);
  const demoTotalScans = useMemo(() => demoScans.reduce((acc, d) => acc + d.scans, 0), [demoScans]);
  const displayedTotalScans = mode === 'real' ? (analytics?.totalScans ?? scans.length) : demoTotalScans;
  const avgScansPerQR = qrCodes.length ? Math.round(displayedTotalScans / qrCodes.length) : 0;

  // Use demo data for advanced analytics when in demo mode
  const finalAdvancedAnalytics = mode === 'demo' ? demoAdvancedAnalytics : advancedAnalytics;
  const finalAdvancedLoading = mode === 'demo' ? false : advancedLoading;

  return {
    loading,
    scans,
    qrCodes,
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
