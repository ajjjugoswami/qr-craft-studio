export interface QRCodeData {
  id: string;
  name: string;
  type: 'url' | 'vcard' | 'text' | 'wifi' | 'email';
  content: string;
  template: QRTemplate;
  styling: QRStyling;
  createdAt: string;
  scans: number;
  status: 'active' | 'inactive';
}

export interface QRTemplate {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  title: string;
  subtitle: string;
}

export interface QRStyling {
  fgColor: string;
  bgColor: string;
  size: number;
  level: 'L' | 'M' | 'Q' | 'H';
  includeMargin: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  website: string;
  address: string;
}

export const defaultStyling: QRStyling = {
  fgColor: '#000000',
  bgColor: '#ffffff',
  size: 200,
  level: 'M',
  includeMargin: true,
};

export const defaultTemplates: QRTemplate[] = [
  {
    id: 'green',
    name: 'Eco Friendly',
    backgroundColor: '#22c55e',
    textColor: '#ffffff',
    title: 'Eco Friendly',
    subtitle: 'Scan for sustainability info',
  },
  {
    id: 'blue',
    name: 'Professional',
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
    title: 'Business Card',
    subtitle: 'Scan to connect',
  },
  {
    id: 'purple',
    name: 'Creative',
    backgroundColor: '#8b5cf6',
    textColor: '#ffffff',
    title: 'My Portfolio',
    subtitle: 'Scan to view my work',
  },
  {
    id: 'orange',
    name: 'Energetic',
    backgroundColor: '#f97316',
    textColor: '#ffffff',
    title: 'Special Offer',
    subtitle: 'Scan for exclusive deals',
  },
  {
    id: 'pink',
    name: 'Elegant',
    backgroundColor: '#ec4899',
    textColor: '#ffffff',
    title: 'Event Invite',
    subtitle: 'Scan for details',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    title: 'Simple QR',
    subtitle: 'Clean and minimal',
  },
];
