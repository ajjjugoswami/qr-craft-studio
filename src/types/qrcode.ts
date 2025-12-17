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

export interface CustomField {
  id: string;
  type: 'label' | 'title' | 'subtitle' | 'text' | 'date' | 'time' | 'button' | 'divider' | 'logo';
  value: string;
  style?: {
    fontSize?: number;
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    color?: string;
    backgroundColor?: string;
    letterSpacing?: number;
    italic?: boolean;
    opacity?: number;
    borderRadius?: number;
    padding?: string;
  };
}

export interface ScanData {
  id: string;
  date: string;
  time: string;
  browser: string;
  os: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  deviceVendor: string;
  deviceModel: string;
  ipAddress: string;
  location: {
    city: string;
    region: string;
    country: string;
    lat: number;
    lng: number;
    timezone: string;
  };
}

export interface QRCodeData {
  id: string;
  name: string;
  type: QRType;
  content: string;
  template: QRTemplate;
  styling: QRStyling;
  createdAt: string;
  scans: number;
  scanHistory?: ScanData[];
  status: 'active' | 'inactive';
}

export interface QRTemplate {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  title: string;
  subtitle: string;
  // Custom fields for advanced templates
  customFields?: CustomField[];
  // Extended styling options
  titleFontSize?: number;
  subtitleFontSize?: number;
  titleFontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  subtitleFontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  qrPosition?: 'bottom' | 'center' | 'top' | 'right' | 'left';
  borderRadius?: number;
  showGradient?: boolean;
  gradientColor?: string;
  gradientDirection?: 'to-bottom' | 'to-right' | 'to-bottom-right' | 'to-top-right';
  padding?: number;
  // Advanced styling
  titleLetterSpacing?: number;
  subtitleLetterSpacing?: number;
  showBorder?: boolean;
  borderColor?: string;
  borderWidth?: number;
  shadowIntensity?: 'none' | 'light' | 'medium' | 'strong';
  decorativeStyle?: 'none' | 'circles' | 'dots' | 'lines' | 'geometric' | 'grid';
  accentColor?: string;
  // Layout
  cardLayout?: 'vertical' | 'horizontal';
  qrLabel?: string;
  ctaButton?: {
    text: string;
    backgroundColor: string;
    textColor: string;
    borderRadius?: number;
  };
}

export interface QRStyling {
  fgColor: string;
  bgColor: string;
  size: number;
  level: 'L' | 'M' | 'Q' | 'H';
  includeMargin: boolean;
  dotsType: 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
  image?: string;
  imageOptions?: {
    hideBackgroundDots: boolean;
    imageSize: number;
    margin: number;
  };
  cornersSquareOptions?: {
    color: string;
    type: 'dot' | 'square' | 'extra-rounded' | 'rounded' | 'dots' | 'classy' | 'classy-rounded';
  };
  cornersDotOptions?: {
    color: string;
    type: 'dot' | 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded';
  };
  shape?: 'square' | 'circle';
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
  dotsType: 'square',
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 0,
  },
  cornersSquareOptions: {
    color: '#000000',
    type: 'square',
  },
  cornersDotOptions: {
    color: '#000000',
    type: 'square',
  },
  shape: 'square',
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
  // ===== EVENT INVITATION STYLE (like image 1) =====
  {
    id: 'event-invitation-dark',
    name: 'Event Invitation',
    backgroundColor: '#0f0f0f',
    textColor: '#ffffff',
    title: 'Event Name',
    subtitle: 'Join us for an unforgettable celebration!',
    customFields: [
      { id: 'label1', type: 'label', value: "YOU'RE INVITED", style: { fontSize: 12, letterSpacing: 3, color: '#d4af37', fontWeight: 'semibold' } },
      { id: 'date1', type: 'date', value: 'December 25, 2024', style: { fontSize: 14, backgroundColor: '#2a2a2a', padding: '8px 20px', borderRadius: 20 } },
      { id: 'time1', type: 'time', value: '7:00 PM', style: { fontSize: 20, fontWeight: 'bold' } },
      { id: 'location', type: 'text', value: 'Venue Location', style: { fontSize: 14, opacity: 0.9 } },
    ],
    titleFontSize: 28,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    subtitleFontWeight: 'normal',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#1a1a1a',
    gradientDirection: 'to-bottom',
    padding: 32,
    shadowIntensity: 'strong',
    decorativeStyle: 'none',
    accentColor: '#d4af37',
    qrLabel: 'Scan for details',
  },
  // ===== BUSINESS CARD STYLE (like image 2) =====
  {
    id: 'business-card-modern',
    name: 'Business Card',
    backgroundColor: '#1a2332',
    textColor: '#ffffff',
    title: 'Your Name',
    subtitle: 'Job Title',
    customFields: [
      { id: 'company', type: 'text', value: 'Company Name', style: { fontSize: 14, color: '#00d4ff', fontWeight: 'medium' } },
      { id: 'divider1', type: 'divider', value: '' },
      { id: 'email', type: 'text', value: 'email@example.com', style: { fontSize: 13, opacity: 0.9 } },
      { id: 'phone', type: 'text', value: '+1 234 567 890', style: { fontSize: 13, opacity: 0.9 } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    subtitleFontWeight: 'normal',
    fontFamily: 'Inter',
    textAlign: 'left',
    qrPosition: 'right',
    cardLayout: 'horizontal',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#243447',
    gradientDirection: 'to-right',
    padding: 24,
    showBorder: true,
    borderColor: '#2d3d4f',
    borderWidth: 1,
    shadowIntensity: 'medium',
    decorativeStyle: 'none',
    accentColor: '#00d4ff',
  },
  // ===== SOCIAL MEDIA FOLLOW (like image 3) =====
  {
    id: 'social-follow-neon',
    name: 'Social Follow',
    backgroundColor: '#0a1628',
    textColor: '#ffffff',
    title: '@username',
    subtitle: 'Your creative tagline here',
    customFields: [
      { id: 'label1', type: 'label', value: 'FOLLOW ME', style: { fontSize: 11, letterSpacing: 3, color: '#00ff88', fontWeight: 'semibold' } },
    ],
    titleFontSize: 26,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    subtitleFontWeight: 'normal',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'center',
    borderRadius: 20,
    showGradient: true,
    gradientColor: '#0f2847',
    gradientDirection: 'to-bottom',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'grid',
    accentColor: '#00ff88',
    ctaButton: {
      text: 'Scan to Connect',
      backgroundColor: '#00ff88',
      textColor: '#0a1628',
      borderRadius: 24,
    },
  },
  // ===== RESTAURANT MENU =====
  {
    id: 'restaurant-menu',
    name: 'Restaurant Menu',
    backgroundColor: '#2c1810',
    textColor: '#f5e6d3',
    title: 'View Our Menu',
    subtitle: 'Scan to explore our delicious offerings',
    customFields: [
      { id: 'label1', type: 'label', value: 'HUNGRY?', style: { fontSize: 12, letterSpacing: 4, color: '#c9a86c', fontWeight: 'bold' } },
    ],
    titleFontSize: 26,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 12,
    showGradient: true,
    gradientColor: '#1a0f0a',
    gradientDirection: 'to-bottom',
    padding: 28,
    showBorder: true,
    borderColor: '#c9a86c',
    borderWidth: 1,
    shadowIntensity: 'strong',
    decorativeStyle: 'lines',
    accentColor: '#c9a86c',
  },
  // ===== PRODUCT SHOWCASE =====
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    backgroundColor: '#ffffff',
    textColor: '#1a1a1a',
    title: 'Product Name',
    subtitle: 'Discover more about this product',
    customFields: [
      { id: 'price', type: 'text', value: '$99.99', style: { fontSize: 24, fontWeight: 'bold', color: '#e63946' } },
      { id: 'label1', type: 'label', value: 'NEW ARRIVAL', style: { fontSize: 10, letterSpacing: 2, backgroundColor: '#e63946', color: '#ffffff', padding: '4px 12px', borderRadius: 4 } },
    ],
    titleFontSize: 22,
    subtitleFontSize: 12,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: false,
    padding: 24,
    showBorder: true,
    borderColor: '#e5e5e5',
    borderWidth: 1,
    shadowIntensity: 'light',
    decorativeStyle: 'none',
    accentColor: '#e63946',
  },
  // ===== WIFI ACCESS =====
  {
    id: 'wifi-access',
    name: 'WiFi Access',
    backgroundColor: '#1e3a5f',
    textColor: '#ffffff',
    title: 'Free WiFi',
    subtitle: 'Scan to connect instantly',
    customFields: [
      { id: 'network', type: 'text', value: 'Network: GuestWiFi', style: { fontSize: 14, opacity: 0.9 } },
    ],
    titleFontSize: 28,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 20,
    showGradient: true,
    gradientColor: '#2d5a87',
    gradientDirection: 'to-bottom-right',
    padding: 28,
    shadowIntensity: 'medium',
    decorativeStyle: 'circles',
    accentColor: '#64b5f6',
    ctaButton: {
      text: 'Connect Now',
      backgroundColor: '#64b5f6',
      textColor: '#1e3a5f',
      borderRadius: 20,
    },
  },
  // ===== PAYMENT LINK =====
  {
    id: 'payment-link',
    name: 'Payment Link',
    backgroundColor: '#00875a',
    textColor: '#ffffff',
    title: 'Pay Now',
    subtitle: 'Quick & Secure Payment',
    customFields: [
      { id: 'amount', type: 'text', value: 'Amount: $50.00', style: { fontSize: 18, fontWeight: 'bold' } },
    ],
    titleFontSize: 26,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#00a86b',
    gradientDirection: 'to-bottom-right',
    padding: 28,
    shadowIntensity: 'medium',
    decorativeStyle: 'geometric',
    accentColor: '#b8f5d8',
  },
  // ===== MUSIC/SPOTIFY STYLE =====
  {
    id: 'music-spotify',
    name: 'Music Link',
    backgroundColor: '#121212',
    textColor: '#ffffff',
    title: 'Listen Now',
    subtitle: 'Stream on your favorite platform',
    customFields: [
      { id: 'artist', type: 'text', value: 'Artist Name', style: { fontSize: 16, fontWeight: 'semibold' } },
      { id: 'track', type: 'text', value: '"Track Title"', style: { fontSize: 14, opacity: 0.8, italic: true } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 12,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 12,
    showGradient: true,
    gradientColor: '#1db954',
    gradientDirection: 'to-bottom',
    padding: 24,
    shadowIntensity: 'strong',
    decorativeStyle: 'circles',
    accentColor: '#1db954',
  },
  // ===== DISCOUNT COUPON =====
  {
    id: 'discount-coupon',
    name: 'Discount Coupon',
    backgroundColor: '#ff6b35',
    textColor: '#ffffff',
    title: '20% OFF',
    subtitle: 'Use this code at checkout',
    customFields: [
      { id: 'code', type: 'text', value: 'CODE: SAVE20', style: { fontSize: 18, fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: 8 } },
      { id: 'expiry', type: 'text', value: 'Valid until Dec 31, 2024', style: { fontSize: 11, opacity: 0.8 } },
    ],
    titleFontSize: 36,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#f7931e',
    gradientDirection: 'to-bottom-right',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'dots',
    accentColor: '#ffe066',
  },
  // ===== REAL ESTATE =====
  {
    id: 'real-estate',
    name: 'Property Listing',
    backgroundColor: '#1a1a2e',
    textColor: '#ffffff',
    title: 'Dream Home',
    subtitle: 'Virtual Tour Available',
    customFields: [
      { id: 'price', type: 'text', value: '$450,000', style: { fontSize: 22, fontWeight: 'bold', color: '#ffd700' } },
      { id: 'beds', type: 'text', value: '3 Beds • 2 Baths • 1,800 sqft', style: { fontSize: 12, opacity: 0.9 } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 12,
    titleFontWeight: 'bold',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#16213e',
    gradientDirection: 'to-bottom',
    padding: 28,
    showBorder: true,
    borderColor: '#ffd700',
    borderWidth: 1,
    shadowIntensity: 'strong',
    decorativeStyle: 'geometric',
    accentColor: '#ffd700',
  },
  // ===== PORTFOLIO =====
  {
    id: 'portfolio-creative',
    name: 'Portfolio',
    backgroundColor: '#0d0d0d',
    textColor: '#ffffff',
    title: 'View My Work',
    subtitle: 'Designer & Developer',
    customFields: [
      { id: 'name', type: 'text', value: 'John Doe', style: { fontSize: 20, fontWeight: 'bold' } },
    ],
    titleFontSize: 22,
    subtitleFontSize: 13,
    titleFontWeight: 'semibold',
    fontFamily: 'Space Grotesk',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 0,
    showGradient: true,
    gradientColor: '#1a1a1a',
    gradientDirection: 'to-bottom-right',
    padding: 28,
    showBorder: true,
    borderColor: '#ffffff',
    borderWidth: 2,
    shadowIntensity: 'none',
    decorativeStyle: 'lines',
    accentColor: '#ffffff',
  },
  // ===== CONTACT CARD =====
  {
    id: 'contact-card-elegant',
    name: 'Contact Card',
    backgroundColor: '#f8f4ef',
    textColor: '#2d2926',
    title: 'Get in Touch',
    subtitle: 'I would love to hear from you',
    customFields: [
      { id: 'email', type: 'text', value: 'hello@example.com', style: { fontSize: 14, color: '#8b7355' } },
      { id: 'phone', type: 'text', value: '+1 (555) 123-4567', style: { fontSize: 14, color: '#8b7355' } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 13,
    titleFontWeight: 'semibold',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 20,
    showGradient: false,
    padding: 28,
    showBorder: true,
    borderColor: '#d4c4b0',
    borderWidth: 1,
    shadowIntensity: 'light',
    decorativeStyle: 'none',
    accentColor: '#8b7355',
  },
  // ===== YOUTUBE CHANNEL =====
  {
    id: 'youtube-channel',
    name: 'YouTube Channel',
    backgroundColor: '#ff0000',
    textColor: '#ffffff',
    title: 'Subscribe Now',
    subtitle: 'Join our community!',
    customFields: [
      { id: 'channel', type: 'text', value: '@YourChannel', style: { fontSize: 18, fontWeight: 'bold' } },
      { id: 'subs', type: 'text', value: '100K+ Subscribers', style: { fontSize: 12, opacity: 0.9 } },
    ],
    titleFontSize: 26,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#cc0000',
    gradientDirection: 'to-bottom',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'none',
    accentColor: '#ffffff',
  },
  // ===== INSTAGRAM BIO LINK =====
  {
    id: 'instagram-bio',
    name: 'Instagram Bio',
    backgroundColor: '#833ab4',
    textColor: '#ffffff',
    title: 'Link in Bio',
    subtitle: 'All my links in one place',
    customFields: [
      { id: 'handle', type: 'text', value: '@yourusername', style: { fontSize: 16, fontWeight: 'semibold' } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 12,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 20,
    showGradient: true,
    gradientColor: '#fd1d1d',
    gradientDirection: 'to-bottom-right',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'dots',
    accentColor: '#fcb045',
  },
  // ===== WEDDING INVITATION =====
  {
    id: 'wedding-invitation',
    name: 'Wedding Invite',
    backgroundColor: '#fdf6e3',
    textColor: '#5c4033',
    title: 'Sarah & John',
    subtitle: 'Request the pleasure of your company',
    customFields: [
      { id: 'label1', type: 'label', value: 'SAVE THE DATE', style: { fontSize: 11, letterSpacing: 3, color: '#c9a86c' } },
      { id: 'date', type: 'date', value: 'June 15, 2025', style: { fontSize: 16, fontWeight: 'semibold', color: '#8b7355' } },
    ],
    titleFontSize: 32,
    subtitleFontSize: 13,
    titleFontWeight: 'normal',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 0,
    showGradient: false,
    padding: 32,
    showBorder: true,
    borderColor: '#c9a86c',
    borderWidth: 2,
    shadowIntensity: 'light',
    decorativeStyle: 'none',
    accentColor: '#c9a86c',
    qrLabel: 'Scan for RSVP',
  },
  // ===== TICKET/PASS =====
  {
    id: 'event-ticket',
    name: 'Event Ticket',
    backgroundColor: '#6c5ce7',
    textColor: '#ffffff',
    title: 'VIP Access',
    subtitle: 'Present this code at entry',
    customFields: [
      { id: 'event', type: 'text', value: 'Summer Music Festival', style: { fontSize: 16, fontWeight: 'bold' } },
      { id: 'date', type: 'date', value: 'Aug 15, 2024 • 6:00 PM', style: { fontSize: 13 } },
      { id: 'seat', type: 'text', value: 'Section A • Row 5 • Seat 12', style: { fontSize: 12, opacity: 0.9 } },
    ],
    titleFontSize: 26,
    subtitleFontSize: 12,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#a29bfe',
    gradientDirection: 'to-bottom-right',
    padding: 28,
    shadowIntensity: 'medium',
    decorativeStyle: 'geometric',
    accentColor: '#dfe6e9',
  },
  // ===== SIMPLE MINIMAL =====
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    title: 'Scan Me',
    subtitle: 'Quick access link',
    titleFontSize: 20,
    subtitleFontSize: 12,
    titleFontWeight: 'medium',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 12,
    showGradient: false,
    padding: 24,
    showBorder: true,
    borderColor: '#e5e5e5',
    borderWidth: 1,
    shadowIntensity: 'light',
    decorativeStyle: 'none',
  },
  // ===== DARK MINIMAL =====
  {
    id: 'dark-minimal',
    name: 'Dark Minimal',
    backgroundColor: '#0a0a0a',
    textColor: '#ffffff',
    title: 'Scan Me',
    subtitle: 'Quick access link',
    titleFontSize: 20,
    subtitleFontSize: 12,
    titleFontWeight: 'medium',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 12,
    showGradient: false,
    padding: 24,
    showBorder: true,
    borderColor: '#333333',
    borderWidth: 1,
    shadowIntensity: 'none',
    decorativeStyle: 'none',
  },
];
