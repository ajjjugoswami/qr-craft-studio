export const getDemoScansOverTime = () => {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return { date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), scans: Math.floor(Math.random() * 80) + 20 };
  });
};

export const demoDeviceData = [
  { name: 'Mobile', value: 65 },
  { name: 'Desktop', value: 25 },
  { name: 'Tablet', value: 10 },
];

export const demoTopQRCodes = [
  { name: 'Promo Card', scans: 420 },
  { name: 'Business Card', scans: 320 },
  { name: 'Event Invite', scans: 210 },
  { name: 'Menu', scans: 150 },
  { name: 'Music Link', scans: 120 },
];

export const demoLocations = [
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
