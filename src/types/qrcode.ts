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
  // Extended styling options
  titleFontSize?: number;
  subtitleFontSize?: number;
  titleFontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  qrPosition?: 'bottom' | 'center' | 'top';
  borderRadius?: number;
  showGradient?: boolean;
  gradientColor?: string;
  padding?: number;
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
    id: 'professional-dark',
    name: 'Professional Dark',
    backgroundColor: '#1a1a2e',
    textColor: '#ffffff',
    title: 'Business Card',
    subtitle: 'Scan to connect',
    titleFontSize: 24,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#16213e',
    padding: 24,
  },
  {
    id: 'elegant-white',
    name: 'Elegant White',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    title: 'Contact Info',
    subtitle: 'Professional networking',
    titleFontSize: 22,
    subtitleFontSize: 12,
    titleFontWeight: 'semibold',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 20,
    showGradient: false,
    padding: 28,
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    backgroundColor: '#1e40af',
    textColor: '#ffffff',
    title: 'Company Profile',
    subtitle: 'Learn more about us',
    titleFontSize: 20,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 12,
    showGradient: true,
    gradientColor: '#3b82f6',
    padding: 24,
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    backgroundColor: '#1c1917',
    textColor: '#fbbf24',
    title: 'VIP Access',
    subtitle: 'Exclusive content',
    titleFontSize: 26,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 24,
    showGradient: true,
    gradientColor: '#292524',
    padding: 28,
  },
  {
    id: 'fresh-green',
    name: 'Fresh Green',
    backgroundColor: '#065f46',
    textColor: '#ffffff',
    title: 'Eco Friendly',
    subtitle: 'Sustainability matters',
    titleFontSize: 22,
    subtitleFontSize: 13,
    titleFontWeight: 'semibold',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#047857',
    padding: 24,
  },
  {
    id: 'modern-purple',
    name: 'Modern Purple',
    backgroundColor: '#5b21b6',
    textColor: '#ffffff',
    title: 'My Portfolio',
    subtitle: 'View my work',
    titleFontSize: 24,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 20,
    showGradient: true,
    gradientColor: '#7c3aed',
    padding: 24,
  },
  {
    id: 'warm-orange',
    name: 'Warm Orange',
    backgroundColor: '#c2410c',
    textColor: '#ffffff',
    title: 'Special Offer',
    subtitle: 'Limited time deal',
    titleFontSize: 22,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#ea580c',
    padding: 24,
  },
  {
    id: 'soft-pink',
    name: 'Soft Pink',
    backgroundColor: '#be185d',
    textColor: '#ffffff',
    title: 'Event Invite',
    subtitle: 'Join us for something special',
    titleFontSize: 22,
    subtitleFontSize: 12,
    titleFontWeight: 'semibold',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 24,
    showGradient: true,
    gradientColor: '#ec4899',
    padding: 28,
  },
  {
    id: 'ocean-teal',
    name: 'Ocean Teal',
    backgroundColor: '#0f766e',
    textColor: '#ffffff',
    title: 'Website Link',
    subtitle: 'Visit our site',
    titleFontSize: 20,
    subtitleFontSize: 13,
    titleFontWeight: 'semibold',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#14b8a6',
    padding: 24,
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    backgroundColor: '#f8fafc',
    textColor: '#0f172a',
    title: 'Simple QR',
    subtitle: 'Clean and modern',
    titleFontSize: 20,
    subtitleFontSize: 12,
    titleFontWeight: 'medium',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 12,
    showGradient: false,
    padding: 24,
  },
  {
    id: 'slate-modern',
    name: 'Slate Modern',
    backgroundColor: '#334155',
    textColor: '#f1f5f9',
    title: 'Digital Card',
    subtitle: 'Tap to connect',
    titleFontSize: 22,
    subtitleFontSize: 13,
    titleFontWeight: 'semibold',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 20,
    showGradient: true,
    gradientColor: '#475569',
    padding: 24,
  },
  {
    id: 'ruby-red',
    name: 'Ruby Red',
    backgroundColor: '#991b1b',
    textColor: '#ffffff',
    title: 'Hot Deal',
    subtitle: 'Don\'t miss out',
    titleFontSize: 24,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#dc2626',
    padding: 24,
  },
];
