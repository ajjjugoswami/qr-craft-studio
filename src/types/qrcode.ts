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
  // optional advanced fields
  previewImage?: string | null;
  password?: string | null;
  expirationDate?: string | null;
  scanLimit?: number | null;
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
    gradient?: {
      type: 'linear' | 'radial';
      rotation?: number;
      colorStops: { offset: number; color: string }[];
    };
  };
  cornersDotOptions?: {
    color: string;
    type: 'dot' | 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded';
    gradient?: {
      type: 'linear' | 'radial';
      rotation?: number;
      colorStops: { offset: number; color: string }[];
    };
  };
  shape?: 'square' | 'circle';
  dotsGradient?: {
    type: 'linear' | 'radial';
    rotation?: number;
    colorStops: { offset: number; color: string }[];
  };
  backgroundGradient?: {
    type: 'linear' | 'radial';
    rotation?: number;
    colorStops: { offset: number; color: string }[];
  };
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
  styling: Partial<QRStyling>;
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
  { 
    id: 'classic-black', 
    name: 'Classic Black', 
    category: 'minimal', 
    icon: 'square', 
    styling: { ...defaultStyling, fgColor: '#000000', bgColor: '#ffffff', dotsType: 'square' } 
  },
  { 
    id: 'modern-dots', 
    name: 'Modern Dots', 
    category: 'vibrant', 
    icon: 'sparkles', 
    styling: { ...defaultStyling, fgColor: '#8b5cf6', bgColor: '#fef3c7', dotsType: 'dots' } 
  },
  { 
    id: 'business-rounded', 
    name: 'Business Rounded', 
    category: 'business', 
    icon: 'building', 
    styling: { ...defaultStyling, fgColor: '#1e40af', bgColor: '#f8fafc', dotsType: 'rounded' } 
  },
  { 
    id: 'ocean-classy', 
    name: 'Ocean Classy', 
    category: 'creative', 
    icon: 'waves', 
    styling: { ...defaultStyling, fgColor: '#0891b2', bgColor: '#ecfeff', dotsType: 'classy' } 
  },
  { 
    id: 'sunset-extra-rounded', 
    name: 'Sunset Extra Rounded', 
    category: 'vibrant', 
    icon: 'sun', 
    styling: { ...defaultStyling, fgColor: '#ea580c', bgColor: '#fff7ed', dotsType: 'extra-rounded' } 
  },
  { 
    id: 'forest-classy-rounded', 
    name: 'Forest Classy Rounded', 
    category: 'creative', 
    icon: 'tree', 
    styling: { ...defaultStyling, fgColor: '#166534', bgColor: '#f0fdf4', dotsType: 'classy-rounded' } 
  },
  { 
    id: 'minimal-dots', 
    name: 'Minimal Dots', 
    category: 'minimal', 
    icon: 'circle', 
    styling: { ...defaultStyling, fgColor: '#374151', bgColor: '#ffffff', dotsType: 'dots' } 
  },
  { 
    id: 'tech-circle', 
    name: 'Tech Circle', 
    category: 'business', 
    icon: 'bolt', 
    styling: { ...defaultStyling, fgColor: '#059669', bgColor: '#ffffff', shape: 'circle', dotsType: 'rounded' } 
  },
  { 
    id: 'elegant-frame', 
    name: 'Elegant Frame', 
    category: 'creative', 
    icon: 'briefcase', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#7c3aed', 
      bgColor: '#ffffff', 
      dotsType: 'classy', 
      cornersSquareOptions: { color: '#7c3aed', type: 'extra-rounded' },
      cornersDotOptions: { color: '#7c3aed', type: 'dot' }
    } 
  },
  { 
    id: 'playful-candy', 
    name: 'Playful Candy', 
    category: 'vibrant', 
    icon: 'candy', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#ec4899', 
      bgColor: '#fce7f3', 
      dotsType: 'extra-rounded', 
      cornersSquareOptions: { color: '#ec4899', type: 'rounded' },
      cornersDotOptions: { color: '#ec4899', type: 'rounded' }
    } 
  },
  // More classy templates
  { 
    id: 'luxury-gold', 
    name: 'Luxury Gold', 
    category: 'creative', 
    icon: 'star', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#d4af37', 
      bgColor: '#1a1a1a', 
      dotsType: 'classy-rounded', 
      cornersSquareOptions: { color: '#d4af37', type: 'extra-rounded' },
      cornersDotOptions: { color: '#d4af37', type: 'dot' }
    } 
  },
  { 
    id: 'corporate-blue', 
    name: 'Corporate Blue', 
    category: 'business', 
    icon: 'building', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#1e40af', 
      bgColor: '#f8fafc', 
      dotsType: 'classy', 
      cornersSquareOptions: { color: '#1e40af', type: 'square' },
      cornersDotOptions: { color: '#1e40af', type: 'square' }
    } 
  },
  { 
    id: 'artistic-purple', 
    name: 'Artistic Purple', 
    category: 'creative', 
    icon: 'palette', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#7c3aed', 
      bgColor: '#faf5ff', 
      dotsType: 'extra-rounded', 
      cornersSquareOptions: { color: '#7c3aed', type: 'classy' },
      cornersDotOptions: { color: '#7c3aed', type: 'classy-rounded' }
    } 
  },
  { 
    id: 'retro-green', 
    name: 'Retro Green', 
    category: 'vibrant', 
    icon: 'leaf', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#16a34a', 
      bgColor: '#f0fdf4', 
      dotsType: 'rounded', 
      cornersSquareOptions: { color: '#16a34a', type: 'dots' },
      cornersDotOptions: { color: '#16a34a', type: 'dots' }
    } 
  },
  { 
    id: 'minimalist-white', 
    name: 'Minimalist White', 
    category: 'minimal', 
    icon: 'minus', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#ffffff', 
      bgColor: '#000000', 
      dotsType: 'square', 
      cornersSquareOptions: { color: '#ffffff', type: 'square' },
      cornersDotOptions: { color: '#ffffff', type: 'square' }
    } 
  },
  { 
    id: 'elegant-silver', 
    name: 'Elegant Silver', 
    category: 'creative', 
    icon: 'diamond', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#9ca3af', 
      bgColor: '#f9fafb', 
      dotsType: 'classy-rounded', 
      cornersSquareOptions: { color: '#9ca3af', type: 'extra-rounded' },
      cornersDotOptions: { color: '#9ca3af', type: 'dot' }
    } 
  },
  { 
    id: 'bold-red', 
    name: 'Bold Red', 
    category: 'vibrant', 
    icon: 'fire', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#dc2626', 
      bgColor: '#fef2f2', 
      dotsType: 'extra-rounded', 
      cornersSquareOptions: { color: '#dc2626', type: 'classy-rounded' },
      cornersDotOptions: { color: '#dc2626', type: 'classy-rounded' }
    } 
  },
  { 
    id: 'tech-gradient', 
    name: 'Tech Gradient', 
    category: 'business', 
    icon: 'cpu', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#06b6d4', 
      bgColor: '#ecfeff', 
      dotsType: 'dots', 
      cornersSquareOptions: { color: '#06b6d4', type: 'rounded' },
      cornersDotOptions: { color: '#06b6d4', type: 'rounded' }
    } 
  },
  { 
    id: 'nature-brown', 
    name: 'Nature Brown', 
    category: 'creative', 
    icon: 'tree', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#92400e', 
      bgColor: '#fef7ed', 
      dotsType: 'classy', 
      cornersSquareOptions: { color: '#92400e', type: 'extra-rounded' },
      cornersDotOptions: { color: '#92400e', type: 'dot' }
    } 
  },
  { 
    id: 'ocean-circle', 
    name: 'Ocean Circle', 
    category: 'creative', 
    icon: 'waves', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#0369a1', 
      bgColor: '#f0f9ff', 
      shape: 'circle', 
      dotsType: 'classy-rounded', 
      cornersSquareOptions: { color: '#0369a1', type: 'classy' },
      cornersDotOptions: { color: '#0369a1', type: 'classy' }
    } 
  },
  // Gradient templates
  { 
    id: 'sunset-gradient', 
    name: 'Sunset Gradient', 
    category: 'vibrant', 
    icon: 'fire', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#ea580c', 
      bgColor: '#ffffff', 
      dotsType: 'extra-rounded', 
      dotsGradient: {
        type: 'linear',
        rotation: 45,
        colorStops: [
          { offset: 0, color: '#ea580c' },
          { offset: 1, color: '#dc2626' }
        ]
      },
      cornersSquareOptions: { 
        color: '#ea580c', 
        type: 'extra-rounded',
        gradient: {
          type: 'linear',
          rotation: 45,
          colorStops: [
            { offset: 0, color: '#ea580c' },
            { offset: 1, color: '#dc2626' }
          ]
        }
      },
      cornersDotOptions: { 
        color: '#ea580c', 
        type: 'dot',
        gradient: {
          type: 'radial',
          colorStops: [
            { offset: 0, color: '#ea580c' },
            { offset: 1, color: '#dc2626' }
          ]
        }
      }
    } 
  },
  { 
    id: 'rainbow-dots', 
    name: 'Rainbow Dots', 
    category: 'vibrant', 
    icon: 'palette', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#8b5cf6', 
      bgColor: '#ffffff', 
      dotsType: 'dots', 
      dotsGradient: {
        type: 'linear',
        rotation: 90,
        colorStops: [
          { offset: 0, color: '#ef4444' },
          { offset: 0.25, color: '#f97316' },
          { offset: 0.5, color: '#eab308' },
          { offset: 0.75, color: '#22c55e' },
          { offset: 1, color: '#3b82f6' }
        ]
      }
    } 
  },
  { 
    id: 'neon-glow', 
    name: 'Neon Glow', 
    category: 'vibrant', 
    icon: 'bolt', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#06b6d4', 
      bgColor: '#0f172a', 
      dotsType: 'rounded', 
      backgroundGradient: {
        type: 'radial',
        colorStops: [
          { offset: 0, color: '#0f172a' },
          { offset: 1, color: '#1e293b' }
        ]
      },
      cornersSquareOptions: { 
        color: '#06b6d4', 
        type: 'extra-rounded',
        gradient: {
          type: 'linear',
          rotation: 135,
          colorStops: [
            { offset: 0, color: '#06b6d4' },
            { offset: 1, color: '#0891b2' }
          ]
        }
      }
    } 
  },
  { 
    id: 'golden-luxury', 
    name: 'Golden Luxury', 
    category: 'creative', 
    icon: 'crown', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#d4af37', 
      bgColor: '#1a1a1a', 
      dotsType: 'classy-rounded', 
      dotsGradient: {
        type: 'linear',
        rotation: 45,
        colorStops: [
          { offset: 0, color: '#d4af37' },
          { offset: 0.5, color: '#f59e0b' },
          { offset: 1, color: '#d97706' }
        ]
      },
      cornersSquareOptions: { 
        color: '#d4af37', 
        type: 'extra-rounded',
        gradient: {
          type: 'radial',
          colorStops: [
            { offset: 0, color: '#d4af37' },
            { offset: 1, color: '#b45309' }
          ]
        }
      },
      cornersDotOptions: { 
        color: '#d4af37', 
        type: 'dot',
        gradient: {
          type: 'linear',
          rotation: 90,
          colorStops: [
            { offset: 0, color: '#d4af37' },
            { offset: 1, color: '#f59e0b' }
          ]
        }
      }
    } 
  },
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
  // ===== THEMED TEMPLATES (inspired by creative designs) =====
  // ===== TECH CYBER STYLE =====
  {
    id: 'tech-cyber-neon',
    name: 'Tech Cyber',
    backgroundColor: '#0a0a1a',
    textColor: '#ffffff',
    title: "LET'S CONNECT!",
    subtitle: '@MyAwesome Handle',
    customFields: [
      { id: 'label1', type: 'label', value: 'TECH VIBES', style: { fontSize: 10, letterSpacing: 3, color: '#00ffaa', fontWeight: 'semibold' } },
    ],
    titleFontSize: 26,
    subtitleFontSize: 16,
    titleFontWeight: 'bold',
    subtitleFontWeight: 'semibold',
    fontFamily: 'Space Grotesk',
    textAlign: 'center',
    qrPosition: 'center',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#1a1a3a',
    gradientDirection: 'to-bottom',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'grid',
    accentColor: '#00ffaa',
  },
  // ===== PODCAST EPISODE =====
  {
    id: 'podcast-episode',
    name: 'Podcast Episode',
    backgroundColor: '#2d3a2d',
    textColor: '#ffffff',
    title: 'NEW EPISODE!',
    subtitle: 'Discover Innovation',
    customFields: [
      { id: 'show', type: 'text', value: 'The Daily Dive - "Space Tourism"', style: { fontSize: 14, color: '#4ade80', fontWeight: 'semibold' } },
      { id: 'cta', type: 'text', value: 'All your links in one scan.', style: { fontSize: 12, opacity: 0.8 } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'left',
    qrPosition: 'right',
    cardLayout: 'horizontal',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#1a2a1a',
    gradientDirection: 'to-bottom-right',
    padding: 28,
    shadowIntensity: 'medium',
    decorativeStyle: 'circles',
    accentColor: '#4ade80',
  },
  // ===== PRODUCT LAUNCH TECH FEST =====
  {
    id: 'product-launch-tech',
    name: 'Product Launch',
    backgroundColor: '#0f1419',
    textColor: '#ffffff',
    title: 'PRODUCT LAUNCH!',
    subtitle: 'TECH FEST 2024',
    customFields: [],
    titleFontSize: 24,
    subtitleFontSize: 20,
    titleFontWeight: 'bold',
    subtitleFontWeight: 'bold',
    fontFamily: 'Space Grotesk',
    textAlign: 'center',
    qrPosition: 'center',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#1a2a3a',
    gradientDirection: 'to-bottom',
    padding: 32,
    shadowIntensity: 'strong',
    decorativeStyle: 'geometric',
    accentColor: '#f97316',
    ctaButton: {
      text: 'Explore to Connect',
      backgroundColor: '#22c55e',
      textColor: '#000000',
      borderRadius: 24,
    },
  },
  // ===== DOWNLOAD APP =====
  {
    id: 'download-app',
    name: 'Download App',
    backgroundColor: '#0d4a4a',
    textColor: '#ffffff',
    title: 'DOWNLOAD OUR APP',
    subtitle: 'Available on iOS & Android',
    customFields: [
      { id: 'label1', type: 'label', value: 'WELCOME TO', style: { fontSize: 10, letterSpacing: 2, color: '#5eead4', fontWeight: 'medium' } },
      { id: 'cta', type: 'text', value: 'Scan to get started!', style: { fontSize: 12, opacity: 0.9 } },
    ],
    titleFontSize: 22,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#064e4e',
    gradientDirection: 'to-bottom-right',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'circles',
    accentColor: '#5eead4',
  },
  // ===== ARTISAN GUILD =====
  {
    id: 'artisan-guild',
    name: 'Artisan Guild',
    backgroundColor: '#1a1a1a',
    textColor: '#f5f5dc',
    title: "THE ARTISAN'S GUILD",
    subtitle: 'Crafted with Tradition',
    customFields: [],
    titleFontSize: 22,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 8,
    showGradient: false,
    padding: 32,
    showBorder: true,
    borderColor: '#c9a86c',
    borderWidth: 2,
    shadowIntensity: 'strong',
    decorativeStyle: 'geometric',
    accentColor: '#c9a86c',
  },
  // ===== VELVET LOUNGE =====
  {
    id: 'velvet-lounge',
    name: 'Velvet Lounge',
    backgroundColor: '#0a0a14',
    textColor: '#ffffff',
    title: 'VELVET LOUNGE',
    subtitle: '@VelvetNights Handle',
    customFields: [
      { id: 'tagline', type: 'text', value: 'Velvet Lounge', style: { fontSize: 18, fontWeight: 'normal', color: '#c084fc', italic: true } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    subtitleFontWeight: 'semibold',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'center',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#1a0a2e',
    gradientDirection: 'to-bottom',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'circles',
    accentColor: '#c084fc',
  },
  // ===== COSMIC JOURNEYS =====
  {
    id: 'cosmic-journeys',
    name: 'Cosmic Journeys',
    backgroundColor: '#0a0a1e',
    textColor: '#ffffff',
    title: 'COSMIC JOURNEYS',
    subtitle: 'Explore the Universe',
    customFields: [],
    titleFontSize: 26,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    fontFamily: 'Space Grotesk',
    textAlign: 'center',
    qrPosition: 'center',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#1a1a4a',
    gradientDirection: 'to-bottom',
    padding: 32,
    shadowIntensity: 'strong',
    decorativeStyle: 'circles',
    accentColor: '#818cf8',
  },
  // ===== DRAGON'S HOARD =====
  {
    id: 'dragons-hoard',
    name: "Dragon's Hoard",
    backgroundColor: '#1a0a00',
    textColor: '#ffd700',
    title: "DRAGON'S HOARD",
    subtitle: 'Unlock Ancient Secrets',
    customFields: [],
    titleFontSize: 26,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'center',
    borderRadius: 12,
    showGradient: true,
    gradientColor: '#2a1a0a',
    gradientDirection: 'to-bottom',
    padding: 32,
    showBorder: true,
    borderColor: '#b8860b',
    borderWidth: 2,
    shadowIntensity: 'strong',
    decorativeStyle: 'geometric',
    accentColor: '#ffd700',
  },
  // ===== SILK & SAGE =====
  {
    id: 'silk-sage',
    name: 'Silk & Sage',
    backgroundColor: '#faf8f5',
    textColor: '#2d4a3e',
    title: 'SILK & SAGE',
    subtitle: 'Natural Wellness',
    customFields: [],
    titleFontSize: 28,
    subtitleFontSize: 14,
    titleFontWeight: 'normal',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: false,
    padding: 32,
    shadowIntensity: 'light',
    decorativeStyle: 'none',
    accentColor: '#4ade80',
  },
  // ===== IRON SPARK GARAGE =====
  {
    id: 'iron-spark-garage',
    name: 'Iron Spark Garage',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    title: 'IRON SPARK',
    subtitle: 'Engineered for Performance',
    customFields: [
      { id: 'sub', type: 'text', value: 'GARAGE', style: { fontSize: 20, fontWeight: 'bold' } },
    ],
    titleFontSize: 26,
    subtitleFontSize: 12,
    titleFontWeight: 'bold',
    fontFamily: 'Space Grotesk',
    textAlign: 'center',
    qrPosition: 'center',
    borderRadius: 8,
    showGradient: true,
    gradientColor: '#2a2a2a',
    gradientDirection: 'to-bottom',
    padding: 28,
    showBorder: true,
    borderColor: '#666666',
    borderWidth: 3,
    shadowIntensity: 'strong',
    decorativeStyle: 'lines',
    accentColor: '#f97316',
  },
  // ===== QUICK CHECK-IN =====
  {
    id: 'quick-checkin',
    name: 'Quick Check-in',
    backgroundColor: '#0a1628',
    textColor: '#ffffff',
    title: 'Quick Check-in',
    subtitle: 'Scan for quick check-in',
    customFields: [],
    titleFontSize: 22,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'center',
    borderRadius: 20,
    showGradient: true,
    gradientColor: '#0f2847',
    gradientDirection: 'to-bottom',
    padding: 32,
    shadowIntensity: 'strong',
    decorativeStyle: 'circles',
    accentColor: '#06b6d4',
  },
  // ===== MY WORK PORTFOLIO =====
  {
    id: 'my-work-portfolio',
    name: 'My Work',
    backgroundColor: '#2a1a4a',
    textColor: '#ffffff',
    title: 'MY WORK',
    subtitle: 'Check out my latest projects!',
    customFields: [
      { id: 'label1', type: 'label', value: 'FOLLOW ME', style: { fontSize: 10, letterSpacing: 2, color: '#c084fc', fontWeight: 'medium' } },
    ],
    titleFontSize: 28,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    fontFamily: 'Space Grotesk',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#1a0a3a',
    gradientDirection: 'to-bottom',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'circles',
    accentColor: '#c084fc',
  },
];
