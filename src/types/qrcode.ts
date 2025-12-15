export type QRType = 
  | 'url' 
  | 'vcard' 
  | 'text' 
  | 'wifi' 
  | 'email' 
  | 'phone' 
  | 'sms' 
  | 'location' 
  | 'instagram' 
  | 'facebook' 
  | 'youtube' 
  | 'whatsapp';

export interface QRCodeData {
  id: string;
  name: string;
  type: QRType;
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

export interface DesignTemplate {
  id: string;
  name: string;
  category: 'business' | 'creative' | 'minimal' | 'vibrant';
  icon: string;
  fgColor: string;
  bgColor: string;
}

export const defaultStyling: QRStyling = {
  fgColor: '#000000',
  bgColor: '#ffffff',
  size: 200,
  level: 'M',
  includeMargin: true,
};

export const designTemplates: DesignTemplate[] = [
  { id: 'classic-black', name: 'Classic Black', category: 'minimal', icon: 'square', fgColor: '#000000', bgColor: '#ffffff' },
  { id: 'modern-gradient', name: 'Modern Gradient', category: 'vibrant', icon: 'sparkles', fgColor: '#8b5cf6', bgColor: '#fef3c7' },
  { id: 'business-pro', name: 'Business Professional', category: 'business', icon: 'building', fgColor: '#1e40af', bgColor: '#f8fafc' },
  { id: 'ocean-breeze', name: 'Ocean Breeze', category: 'creative', icon: 'waves', fgColor: '#0891b2', bgColor: '#ecfeff' },
  { id: 'sunset-vibes', name: 'Sunset Vibes', category: 'vibrant', icon: 'sun', fgColor: '#ea580c', bgColor: '#fff7ed' },
  { id: 'forest-green', name: 'Forest Green', category: 'creative', icon: 'tree', fgColor: '#166534', bgColor: '#f0fdf4' },
  { id: 'minimal-dots', name: 'Minimal Dots', category: 'minimal', icon: 'circle', fgColor: '#374151', bgColor: '#ffffff' },
  { id: 'neon-glow', name: 'Neon Glow', category: 'vibrant', icon: 'bolt', fgColor: '#c026d3', bgColor: '#fdf4ff' },
  { id: 'corporate-blue', name: 'Corporate Blue', category: 'business', icon: 'briefcase', fgColor: '#1d4ed8', bgColor: '#eff6ff' },
  { id: 'candy-pop', name: 'Candy Pop', category: 'creative', icon: 'candy', fgColor: '#db2777', bgColor: '#fdf2f8' },
];

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
