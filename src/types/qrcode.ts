export type QRType = 
  // Basic
  | 'url' 
  | 'wifi' 
  | 'vcard' 
  | 'mecard'
  | 'email' 
  | 'phone' 
  | 'sms' 
  | 'location' 
  | 'event'
  | 'text'
  // Social & Communication
  | 'whatsapp'
  | 'instagram' 
  | 'facebook' 
  | 'youtube' 
  | 'twitter'
  | 'linkedin'
  | 'spotify'
  | 'telegram'
  | 'tiktok'
  // Media & Files
  | 'pdf'
  | 'video'
  | 'audio'
  | 'image'
  // Business & Marketing
  | 'paypal'
  | 'coupon'
  | 'review'
  | 'feedback';

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
  template: QRTemplate | null;
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
  whiteLabel?: any; // White label config from owner
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
      level: 'H',
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
      },
      cornersDotOptions: { 
        color: '#06b6d4', 
        type: 'dot',
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
  // ===== INSTAGRAM GRADIENT =====
  { 
    id: 'instagram-gradient', 
    name: 'Instagram Vibe', 
    category: 'vibrant', 
    icon: 'heart', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#e1306c', 
      bgColor: '#ffffff', 
      dotsType: 'extra-rounded', 
      dotsGradient: {
        type: 'linear',
        rotation: 45,
        colorStops: [
          { offset: 0, color: '#833ab4' },
          { offset: 0.5, color: '#e1306c' },
          { offset: 1, color: '#fcaf45' }
        ]
      },
      cornersSquareOptions: { 
        color: '#833ab4', 
        type: 'extra-rounded',
        gradient: {
          type: 'linear',
          rotation: 135,
          colorStops: [
            { offset: 0, color: '#833ab4' },
            { offset: 1, color: '#fd1d1d' }
          ]
        }
      },
      cornersDotOptions: { 
        color: '#fcaf45', 
        type: 'dot',
        gradient: {
          type: 'radial',
          colorStops: [
            { offset: 0, color: '#fcaf45' },
            { offset: 1, color: '#e1306c' }
          ]
        }
      }
    } 
  },
  // ===== OCEAN BREEZE =====
  { 
    id: 'ocean-breeze', 
    name: 'Ocean Breeze', 
    category: 'creative', 
    icon: 'waves', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#0891b2', 
      bgColor: '#ecfeff', 
      dotsType: 'rounded', 
      dotsGradient: {
        type: 'linear',
        rotation: 180,
        colorStops: [
          { offset: 0, color: '#06b6d4' },
          { offset: 0.5, color: '#0891b2' },
          { offset: 1, color: '#0e7490' }
        ]
      },
      cornersSquareOptions: { 
        color: '#0e7490', 
        type: 'rounded',
        gradient: {
          type: 'linear',
          rotation: 45,
          colorStops: [
            { offset: 0, color: '#06b6d4' },
            { offset: 1, color: '#0369a1' }
          ]
        }
      }
    } 
  },
  // ===== AURORA BOREALIS =====
  { 
    id: 'aurora-borealis', 
    name: 'Aurora Borealis', 
    category: 'vibrant', 
    icon: 'sparkles', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#22c55e', 
      bgColor: '#0f172a', 
      dotsType: 'dots', 
      dotsGradient: {
        type: 'linear',
        rotation: 135,
        colorStops: [
          { offset: 0, color: '#22c55e' },
          { offset: 0.3, color: '#06b6d4' },
          { offset: 0.6, color: '#8b5cf6' },
          { offset: 1, color: '#ec4899' }
        ]
      },
      cornersSquareOptions: { 
        color: '#22c55e', 
        type: 'extra-rounded',
        gradient: {
          type: 'linear',
          rotation: 90,
          colorStops: [
            { offset: 0, color: '#22c55e' },
            { offset: 1, color: '#06b6d4' }
          ]
        }
      }
    } 
  },
  // ===== ROSE GOLD =====
  { 
    id: 'rose-gold', 
    name: 'Rose Gold', 
    category: 'creative', 
    icon: 'heart', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#be185d', 
      bgColor: '#fdf2f8', 
      dotsType: 'classy-rounded', 
      dotsGradient: {
        type: 'linear',
        rotation: 45,
        colorStops: [
          { offset: 0, color: '#be185d' },
          { offset: 0.5, color: '#db2777' },
          { offset: 1, color: '#f472b6' }
        ]
      },
      cornersSquareOptions: { 
        color: '#be185d', 
        type: 'classy-rounded',
        gradient: {
          type: 'radial',
          colorStops: [
            { offset: 0, color: '#db2777' },
            { offset: 1, color: '#9d174d' }
          ]
        }
      }
    } 
  },
  // ===== MIDNIGHT PURPLE =====
  { 
    id: 'midnight-purple', 
    name: 'Midnight Purple', 
    category: 'vibrant', 
    icon: 'star', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#a855f7', 
      bgColor: '#1e1b4b', 
      dotsType: 'rounded', 
      dotsGradient: {
        type: 'linear',
        rotation: 135,
        colorStops: [
          { offset: 0, color: '#c084fc' },
          { offset: 0.5, color: '#a855f7' },
          { offset: 1, color: '#7c3aed' }
        ]
      },
      cornersSquareOptions: { 
        color: '#a855f7', 
        type: 'extra-rounded',
        gradient: {
          type: 'linear',
          rotation: 45,
          colorStops: [
            { offset: 0, color: '#c084fc' },
            { offset: 1, color: '#6d28d9' }
          ]
        }
      },
      cornersDotOptions: { 
        color: '#c084fc', 
        type: 'dot'
      }
    } 
  },
  // ===== EMERALD SHINE =====
  { 
    id: 'emerald-shine', 
    name: 'Emerald Shine', 
    category: 'creative', 
    icon: 'diamond', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#059669', 
      bgColor: '#ffffff', 
      dotsType: 'classy', 
      dotsGradient: {
        type: 'linear',
        rotation: 90,
        colorStops: [
          { offset: 0, color: '#10b981' },
          { offset: 0.5, color: '#059669' },
          { offset: 1, color: '#047857' }
        ]
      },
      cornersSquareOptions: { 
        color: '#059669', 
        type: 'classy',
        gradient: {
          type: 'radial',
          colorStops: [
            { offset: 0, color: '#10b981' },
            { offset: 1, color: '#065f46' }
          ]
        }
      }
    } 
  },
  // ===== FIRE STORM =====
  { 
    id: 'fire-storm', 
    name: 'Fire Storm', 
    category: 'vibrant', 
    icon: 'fire', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#dc2626', 
      bgColor: '#0a0a0a', 
      dotsType: 'extra-rounded', 
      dotsGradient: {
        type: 'linear',
        rotation: 180,
        colorStops: [
          { offset: 0, color: '#fbbf24' },
          { offset: 0.4, color: '#f97316' },
          { offset: 0.7, color: '#ef4444' },
          { offset: 1, color: '#dc2626' }
        ]
      },
      cornersSquareOptions: { 
        color: '#f97316', 
        type: 'rounded',
        gradient: {
          type: 'linear',
          rotation: 45,
          colorStops: [
            { offset: 0, color: '#fbbf24' },
            { offset: 1, color: '#dc2626' }
          ]
        }
      }
    } 
  },
  // ===== MATRIX GREEN =====
  { 
    id: 'matrix-green', 
    name: 'Matrix Code', 
    category: 'creative', 
    icon: 'cpu', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#22c55e', 
      bgColor: '#000000', 
      dotsType: 'square', 
      dotsGradient: {
        type: 'linear',
        rotation: 180,
        colorStops: [
          { offset: 0, color: '#4ade80' },
          { offset: 0.5, color: '#22c55e' },
          { offset: 1, color: '#16a34a' }
        ]
      },
      cornersSquareOptions: { 
        color: '#22c55e', 
        type: 'square',
        gradient: {
          type: 'linear',
          rotation: 0,
          colorStops: [
            { offset: 0, color: '#4ade80' },
            { offset: 1, color: '#15803d' }
          ]
        }
      }
    } 
  },
  // ===== CYBER BLUE =====
  { 
    id: 'cyber-blue', 
    name: 'Cyber Blue', 
    category: 'business', 
    icon: 'bolt', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#3b82f6', 
      bgColor: '#020617', 
      dotsType: 'rounded', 
      dotsGradient: {
        type: 'linear',
        rotation: 135,
        colorStops: [
          { offset: 0, color: '#60a5fa' },
          { offset: 0.5, color: '#3b82f6' },
          { offset: 1, color: '#1d4ed8' }
        ]
      },
      cornersSquareOptions: { 
        color: '#3b82f6', 
        type: 'extra-rounded',
        gradient: {
          type: 'linear',
          rotation: 45,
          colorStops: [
            { offset: 0, color: '#60a5fa' },
            { offset: 1, color: '#2563eb' }
          ]
        }
      },
      cornersDotOptions: { 
        color: '#60a5fa', 
        type: 'dot'
      }
    } 
  },
  // ===== PLATINUM ELITE =====
  { 
    id: 'platinum-elite', 
    name: 'Platinum Elite', 
    category: 'business', 
    icon: 'crown', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#64748b', 
      bgColor: '#f8fafc', 
      dotsType: 'classy-rounded', 
      dotsGradient: {
        type: 'linear',
        rotation: 135,
        colorStops: [
          { offset: 0, color: '#94a3b8' },
          { offset: 0.5, color: '#64748b' },
          { offset: 1, color: '#475569' }
        ]
      },
      cornersSquareOptions: { 
        color: '#64748b', 
        type: 'classy-rounded',
        gradient: {
          type: 'radial',
          colorStops: [
            { offset: 0, color: '#94a3b8' },
            { offset: 1, color: '#334155' }
          ]
        }
      }
    } 
  },
  // ===== CORAL REEF =====
  { 
    id: 'coral-reef', 
    name: 'Coral Reef', 
    category: 'vibrant', 
    icon: 'waves', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#f43f5e', 
      bgColor: '#fff1f2', 
      dotsType: 'extra-rounded', 
      dotsGradient: {
        type: 'linear',
        rotation: 45,
        colorStops: [
          { offset: 0, color: '#fb7185' },
          { offset: 0.5, color: '#f43f5e' },
          { offset: 1, color: '#e11d48' }
        ]
      },
      cornersSquareOptions: { 
        color: '#f43f5e', 
        type: 'rounded',
        gradient: {
          type: 'linear',
          rotation: 135,
          colorStops: [
            { offset: 0, color: '#fda4af' },
            { offset: 1, color: '#be123c' }
          ]
        }
      }
    } 
  },
  // ===== LAVENDER DREAM =====
  { 
    id: 'lavender-dream', 
    name: 'Lavender Dream', 
    category: 'minimal', 
    icon: 'star', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#a78bfa', 
      bgColor: '#faf5ff', 
      dotsType: 'dots', 
      dotsGradient: {
        type: 'radial',
        colorStops: [
          { offset: 0, color: '#c4b5fd' },
          { offset: 1, color: '#8b5cf6' }
        ]
      },
      cornersSquareOptions: { 
        color: '#a78bfa', 
        type: 'rounded'
      }
    } 
  },
  // ===== TIFFANY BLUE =====
  { 
    id: 'tiffany-blue', 
    name: 'Tiffany Blue', 
    category: 'creative', 
    icon: 'diamond', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#0abab5', 
      bgColor: '#ffffff', 
      dotsType: 'classy', 
      cornersSquareOptions: { 
        color: '#0abab5', 
        type: 'classy-rounded'
      },
      cornersDotOptions: { 
        color: '#0abab5', 
        type: 'dot'
      }
    } 
  },
  // ===== BRONZE METAL =====
  { 
    id: 'bronze-metal', 
    name: 'Bronze Metal', 
    category: 'business', 
    icon: 'crown', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#b45309', 
      bgColor: '#1c1917', 
      dotsType: 'classy-rounded', 
      dotsGradient: {
        type: 'linear',
        rotation: 135,
        colorStops: [
          { offset: 0, color: '#d97706' },
          { offset: 0.5, color: '#b45309' },
          { offset: 1, color: '#92400e' }
        ]
      },
      cornersSquareOptions: { 
        color: '#b45309', 
        type: 'extra-rounded',
        gradient: {
          type: 'radial',
          colorStops: [
            { offset: 0, color: '#d97706' },
            { offset: 1, color: '#78350f' }
          ]
        }
      }
    } 
  },
  // ===== ELECTRIC LIME =====
  { 
    id: 'electric-lime', 
    name: 'Electric Lime', 
    category: 'vibrant', 
    icon: 'bolt', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#84cc16', 
      bgColor: '#0a0a0a', 
      dotsType: 'rounded', 
      dotsGradient: {
        type: 'linear',
        rotation: 45,
        colorStops: [
          { offset: 0, color: '#bef264' },
          { offset: 0.5, color: '#84cc16' },
          { offset: 1, color: '#65a30d' }
        ]
      },
      cornersSquareOptions: { 
        color: '#84cc16', 
        type: 'extra-rounded',
        gradient: {
          type: 'linear',
          rotation: 90,
          colorStops: [
            { offset: 0, color: '#bef264' },
            { offset: 1, color: '#4d7c0f' }
          ]
        }
      }
    } 
  },
  // ===== YOUTUBE RED =====
  { 
    id: 'youtube-red-qr', 
    name: 'YouTube Style', 
    category: 'vibrant', 
    icon: 'fire', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#dc2626', 
      bgColor: '#ffffff', 
      dotsType: 'rounded', 
      cornersSquareOptions: { 
        color: '#dc2626', 
        type: 'rounded'
      },
      cornersDotOptions: { 
        color: '#dc2626', 
        type: 'dot'
      }
    } 
  },
  // ===== FACEBOOK BLUE =====
  { 
    id: 'facebook-blue-qr', 
    name: 'Facebook Style', 
    category: 'business', 
    icon: 'building', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#1877f2', 
      bgColor: '#ffffff', 
      dotsType: 'rounded', 
      cornersSquareOptions: { 
        color: '#1877f2', 
        type: 'rounded'
      },
      cornersDotOptions: { 
        color: '#1877f2', 
        type: 'square'
      }
    } 
  },
  // ===== LINKEDIN BLUE =====
  { 
    id: 'linkedin-blue-qr', 
    name: 'LinkedIn Style', 
    category: 'business', 
    icon: 'briefcase', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#0077b5', 
      bgColor: '#ffffff', 
      dotsType: 'classy', 
      cornersSquareOptions: { 
        color: '#0077b5', 
        type: 'square'
      },
      cornersDotOptions: { 
        color: '#0077b5', 
        type: 'square'
      }
    } 
  },
  // ===== WHATSAPP GREEN =====
  { 
    id: 'whatsapp-green-qr', 
    name: 'WhatsApp Style', 
    category: 'vibrant', 
    icon: 'circle', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#25d366', 
      bgColor: '#ffffff', 
      dotsType: 'extra-rounded', 
      dotsGradient: {
        type: 'linear',
        rotation: 180,
        colorStops: [
          { offset: 0, color: '#25d366' },
          { offset: 1, color: '#128c7e' }
        ]
      },
      cornersSquareOptions: { 
        color: '#25d366', 
        type: 'extra-rounded'
      },
      cornersDotOptions: { 
        color: '#128c7e', 
        type: 'dot'
      }
    } 
  },
  // ===== SPOTIFY GREEN =====
  { 
    id: 'spotify-green-qr', 
    name: 'Spotify Style', 
    category: 'creative', 
    icon: 'circle', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#1db954', 
      bgColor: '#191414', 
      dotsType: 'dots',
      shape: 'circle',
      cornersSquareOptions: { 
        color: '#1db954', 
        type: 'dot'
      },
      cornersDotOptions: { 
        color: '#1db954', 
        type: 'dot'
      }
    } 
  },
  // ===== TWITTER/X BLACK =====
  { 
    id: 'twitter-x-qr', 
    name: 'X / Twitter', 
    category: 'minimal', 
    icon: 'minus', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#000000', 
      bgColor: '#ffffff', 
      dotsType: 'square', 
      cornersSquareOptions: { 
        color: '#000000', 
        type: 'square'
      },
      cornersDotOptions: { 
        color: '#1d9bf0', 
        type: 'square'
      }
    } 
  },
  // ===== PINTEREST RED =====
  { 
    id: 'pinterest-red-qr', 
    name: 'Pinterest Style', 
    category: 'vibrant', 
    icon: 'heart', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#e60023', 
      bgColor: '#ffffff', 
      dotsType: 'classy-rounded',
      shape: 'circle',
      cornersSquareOptions: { 
        color: '#e60023', 
        type: 'classy-rounded'
      },
      cornersDotOptions: { 
        color: '#e60023', 
        type: 'dot'
      }
    } 
  },
  // ===== DEEP SPACE =====
  { 
    id: 'deep-space', 
    name: 'Deep Space', 
    category: 'creative', 
    icon: 'star', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#6366f1', 
      bgColor: '#030712', 
      dotsType: 'dots', 
      dotsGradient: {
        type: 'radial',
        colorStops: [
          { offset: 0, color: '#818cf8' },
          { offset: 0.5, color: '#6366f1' },
          { offset: 1, color: '#4f46e5' }
        ]
      },
      cornersSquareOptions: { 
        color: '#6366f1', 
        type: 'extra-rounded',
        gradient: {
          type: 'linear',
          rotation: 45,
          colorStops: [
            { offset: 0, color: '#a5b4fc' },
            { offset: 1, color: '#4338ca' }
          ]
        }
      }
    } 
  },
  // ===== CHERRY BLOSSOM =====
  { 
    id: 'cherry-blossom', 
    name: 'Cherry Blossom', 
    category: 'creative', 
    icon: 'heart', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#f472b6', 
      bgColor: '#fdf4ff', 
      dotsType: 'extra-rounded', 
      dotsGradient: {
        type: 'linear',
        rotation: 135,
        colorStops: [
          { offset: 0, color: '#f9a8d4' },
          { offset: 0.5, color: '#f472b6' },
          { offset: 1, color: '#ec4899' }
        ]
      },
      cornersSquareOptions: { 
        color: '#f472b6', 
        type: 'classy-rounded'
      }
    } 
  },
  // ===== CARBON FIBER =====
  { 
    id: 'carbon-fiber', 
    name: 'Carbon Fiber', 
    category: 'business', 
    icon: 'square', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#27272a', 
      bgColor: '#fafafa', 
      dotsType: 'square', 
      dotsGradient: {
        type: 'linear',
        rotation: 45,
        colorStops: [
          { offset: 0, color: '#3f3f46' },
          { offset: 0.5, color: '#27272a' },
          { offset: 1, color: '#18181b' }
        ]
      },
      cornersSquareOptions: { 
        color: '#27272a', 
        type: 'square',
        gradient: {
          type: 'radial',
          colorStops: [
            { offset: 0, color: '#52525b' },
            { offset: 1, color: '#09090b' }
          ]
        }
      }
    } 
  },
  // ===== BUBBLEGUM POP =====
  { 
    id: 'bubblegum-pop', 
    name: 'Bubblegum Pop', 
    category: 'vibrant', 
    icon: 'candy', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#f472b6', 
      bgColor: '#fdf4ff', 
      dotsType: 'dots',
      shape: 'circle',
      dotsGradient: {
        type: 'linear',
        rotation: 90,
        colorStops: [
          { offset: 0, color: '#c084fc' },
          { offset: 0.5, color: '#f472b6' },
          { offset: 1, color: '#fb7185' }
        ]
      },
      cornersSquareOptions: { 
        color: '#f472b6', 
        type: 'dot'
      },
      cornersDotOptions: { 
        color: '#c084fc', 
        type: 'dot'
      }
    } 
  },
  // ===== FOREST NIGHT =====
  { 
    id: 'forest-night', 
    name: 'Forest Night', 
    category: 'creative', 
    icon: 'tree', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#22c55e', 
      bgColor: '#14532d', 
      dotsType: 'classy', 
      dotsGradient: {
        type: 'linear',
        rotation: 180,
        colorStops: [
          { offset: 0, color: '#4ade80' },
          { offset: 0.5, color: '#22c55e' },
          { offset: 1, color: '#15803d' }
        ]
      },
      cornersSquareOptions: { 
        color: '#22c55e', 
        type: 'classy'
      }
    } 
  },
  // ===== ROYAL NAVY =====
  { 
    id: 'royal-navy', 
    name: 'Royal Navy', 
    category: 'business', 
    icon: 'building', 
    styling: { 
      ...defaultStyling, 
      fgColor: '#1e3a8a', 
      bgColor: '#f8fafc', 
      dotsType: 'classy-rounded', 
      dotsGradient: {
        type: 'linear',
        rotation: 135,
        colorStops: [
          { offset: 0, color: '#3b82f6' },
          { offset: 0.5, color: '#1e40af' },
          { offset: 1, color: '#1e3a8a' }
        ]
      },
      cornersSquareOptions: { 
        color: '#1e3a8a', 
        type: 'classy-rounded',
        gradient: {
          type: 'radial',
          colorStops: [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#172554' }
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
  // ===== INSTAGRAM GRADIENT =====
  {
    id: 'instagram-gradient',
    name: 'Instagram',
    backgroundColor: '#833ab4',
    textColor: '#ffffff',
    title: '@yourhandle',
    subtitle: 'Follow for daily content',
    customFields: [
      { id: 'label1', type: 'label', value: 'INSTAGRAM', style: { fontSize: 10, letterSpacing: 3, color: '#ffffff', fontWeight: 'bold' } },
      { id: 'logo', type: 'logo', value: 'instagram', style: { fontSize: 32 } },
    ],
    titleFontSize: 26,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 24,
    showGradient: true,
    gradientColor: '#fd1d1d',
    gradientDirection: 'to-bottom-right',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'none',
    accentColor: '#fcaf45',
  },
  // ===== FACEBOOK BLUE =====
  {
    id: 'facebook-blue',
    name: 'Facebook',
    backgroundColor: '#1877f2',
    textColor: '#ffffff',
    title: 'Follow Us',
    subtitle: 'Join our community on Facebook',
    customFields: [
      { id: 'label1', type: 'label', value: 'FACEBOOK', style: { fontSize: 10, letterSpacing: 3, color: '#ffffff', fontWeight: 'bold' } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#0d65d9',
    gradientDirection: 'to-bottom',
    padding: 28,
    shadowIntensity: 'medium',
    decorativeStyle: 'none',
    accentColor: '#ffffff',
  },
  // ===== YOUTUBE RED =====
  {
    id: 'youtube-red',
    name: 'YouTube',
    backgroundColor: '#ff0000',
    textColor: '#ffffff',
    title: 'Subscribe Now',
    subtitle: 'Watch our latest videos',
    customFields: [
      { id: 'label1', type: 'label', value: 'YOUTUBE', style: { fontSize: 10, letterSpacing: 3, color: '#ffffff', fontWeight: 'bold' } },
      { id: 'channel', type: 'text', value: '@YourChannel', style: { fontSize: 16, fontWeight: 'semibold' } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 12,
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
  // ===== LINKEDIN PROFESSIONAL =====
  {
    id: 'linkedin-professional',
    name: 'LinkedIn',
    backgroundColor: '#0077b5',
    textColor: '#ffffff',
    title: 'Connect With Me',
    subtitle: 'Professional networking',
    customFields: [
      { id: 'label1', type: 'label', value: 'LINKEDIN', style: { fontSize: 10, letterSpacing: 3, color: '#ffffff', fontWeight: 'bold' } },
      { id: 'name', type: 'text', value: 'Your Name', style: { fontSize: 18, fontWeight: 'bold' } },
      { id: 'title', type: 'text', value: 'Job Title at Company', style: { fontSize: 13, opacity: 0.9 } },
    ],
    titleFontSize: 22,
    subtitleFontSize: 12,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 12,
    showGradient: true,
    gradientColor: '#005e93',
    gradientDirection: 'to-bottom',
    padding: 28,
    shadowIntensity: 'medium',
    decorativeStyle: 'none',
    accentColor: '#ffffff',
  },
  // ===== WHATSAPP GREEN =====
  {
    id: 'whatsapp-green',
    name: 'WhatsApp',
    backgroundColor: '#25d366',
    textColor: '#ffffff',
    title: 'Chat With Us',
    subtitle: 'Quick support via WhatsApp',
    customFields: [
      { id: 'label1', type: 'label', value: 'WHATSAPP', style: { fontSize: 10, letterSpacing: 3, color: '#ffffff', fontWeight: 'bold' } },
      { id: 'phone', type: 'text', value: '+1 234 567 890', style: { fontSize: 16, fontWeight: 'semibold' } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 20,
    showGradient: true,
    gradientColor: '#128c7e',
    gradientDirection: 'to-bottom',
    padding: 28,
    shadowIntensity: 'medium',
    decorativeStyle: 'none',
    accentColor: '#ffffff',
  },
  // ===== X/TWITTER DARK =====
  {
    id: 'twitter-x-dark',
    name: 'X / Twitter',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    title: '@handle',
    subtitle: 'Follow for updates',
    customFields: [
      { id: 'label1', type: 'label', value: 'X', style: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#1a1a1a',
    gradientDirection: 'to-bottom',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'none',
    accentColor: '#1d9bf0',
  },
  // ===== PINTEREST RED =====
  {
    id: 'pinterest-red',
    name: 'Pinterest',
    backgroundColor: '#e60023',
    textColor: '#ffffff',
    title: 'Follow Our Boards',
    subtitle: 'Get inspired with our pins',
    customFields: [
      { id: 'label1', type: 'label', value: 'PINTEREST', style: { fontSize: 10, letterSpacing: 3, color: '#ffffff', fontWeight: 'bold' } },
    ],
    titleFontSize: 22,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 20,
    showGradient: true,
    gradientColor: '#bd001f',
    gradientDirection: 'to-bottom',
    padding: 28,
    shadowIntensity: 'medium',
    decorativeStyle: 'none',
    accentColor: '#ffffff',
  },
  // ===== BISTRO ELEGANCE (Restaurant) =====
  {
    id: 'restaurant-bistro',
    name: 'Bistro Elegance',
    backgroundColor: '#1f1f1f',
    textColor: '#f5e6d3',
    title: 'Le Bistro',
    subtitle: 'Fine Dining Experience',
    customFields: [
      { id: 'label1', type: 'label', value: 'SCAN FOR MENU', style: { fontSize: 10, letterSpacing: 3, color: '#c9a86c', fontWeight: 'bold' } },
      { id: 'hours', type: 'text', value: 'Open Daily 11AM - 10PM', style: { fontSize: 12, opacity: 0.8 } },
    ],
    titleFontSize: 32,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 8,
    showGradient: true,
    gradientColor: '#2a2a2a',
    gradientDirection: 'to-bottom',
    padding: 32,
    showBorder: true,
    borderColor: '#c9a86c',
    borderWidth: 2,
    shadowIntensity: 'strong',
    decorativeStyle: 'lines',
    accentColor: '#c9a86c',
  },
  // ===== CAFE MODERN (Restaurant) =====
  {
    id: 'restaurant-cafe-modern',
    name: 'Modern Café',
    backgroundColor: '#f5f0e8',
    textColor: '#2d2d2d',
    title: 'The Coffee House',
    subtitle: 'Artisan Coffee & Treats',
    customFields: [
      { id: 'label1', type: 'label', value: 'VIEW MENU', style: { fontSize: 10, letterSpacing: 2, backgroundColor: '#6b4423', color: '#ffffff', padding: '6px 16px', borderRadius: 20, fontWeight: 'bold' } },
    ],
    titleFontSize: 26,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: false,
    padding: 28,
    showBorder: true,
    borderColor: '#d4c4a8',
    borderWidth: 1,
    shadowIntensity: 'light',
    decorativeStyle: 'none',
    accentColor: '#6b4423',
  },
  // ===== SUSHI BAR (Restaurant) =====
  {
    id: 'restaurant-sushi',
    name: 'Sushi Bar',
    backgroundColor: '#1a1a2e',
    textColor: '#ffffff',
    title: '寿司',
    subtitle: 'Premium Sushi Experience',
    customFields: [
      { id: 'name', type: 'text', value: 'SAKURA SUSHI', style: { fontSize: 18, letterSpacing: 4, fontWeight: 'bold' } },
      { id: 'label1', type: 'label', value: 'SCAN TO ORDER', style: { fontSize: 10, letterSpacing: 2, color: '#e74c3c', fontWeight: 'bold' } },
    ],
    titleFontSize: 40,
    subtitleFontSize: 13,
    titleFontWeight: 'normal',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 12,
    showGradient: true,
    gradientColor: '#16213e',
    gradientDirection: 'to-bottom',
    padding: 28,
    showBorder: true,
    borderColor: '#e74c3c',
    borderWidth: 1,
    shadowIntensity: 'strong',
    decorativeStyle: 'geometric',
    accentColor: '#e74c3c',
  },
  // ===== PIZZERIA (Restaurant) =====
  {
    id: 'restaurant-pizzeria',
    name: 'Pizzeria',
    backgroundColor: '#c41e3a',
    textColor: '#ffffff',
    title: 'La Pizzeria',
    subtitle: 'Authentic Italian Pizza',
    customFields: [
      { id: 'label1', type: 'label', value: 'SINCE 1985', style: { fontSize: 10, letterSpacing: 2, color: '#ffd700', fontWeight: 'bold' } },
      { id: 'cta', type: 'text', value: 'Order Online', style: { fontSize: 14, fontWeight: 'semibold' } },
    ],
    titleFontSize: 28,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#8b0000',
    gradientDirection: 'to-bottom',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'none',
    accentColor: '#ffd700',
  },
  // ===== FOOD TRUCK (Restaurant) =====
  {
    id: 'restaurant-foodtruck',
    name: 'Food Truck',
    backgroundColor: '#ff6b35',
    textColor: '#ffffff',
    title: 'Street Eats',
    subtitle: 'Fresh • Fast • Delicious',
    customFields: [
      { id: 'location', type: 'text', value: '📍 Find us downtown!', style: { fontSize: 14, fontWeight: 'medium' } },
    ],
    titleFontSize: 28,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    fontFamily: 'Space Grotesk',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 20,
    showGradient: true,
    gradientColor: '#f7931e',
    gradientDirection: 'to-bottom-right',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'dots',
    accentColor: '#ffffff',
  },
  // ===== BAR & LOUNGE (Restaurant) =====
  {
    id: 'restaurant-bar',
    name: 'Bar & Lounge',
    backgroundColor: '#0d0d0d',
    textColor: '#d4af37',
    title: 'THE LOUNGE',
    subtitle: 'Cocktails & Live Music',
    customFields: [
      { id: 'hours', type: 'text', value: 'Open 6PM - 2AM', style: { fontSize: 12, color: '#ffffff', opacity: 0.8 } },
      { id: 'label1', type: 'label', value: 'RESERVATIONS', style: { fontSize: 10, letterSpacing: 2, color: '#d4af37', fontWeight: 'bold' } },
    ],
    titleFontSize: 26,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    titleLetterSpacing: 4,
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 8,
    showGradient: true,
    gradientColor: '#1a1a1a',
    gradientDirection: 'to-bottom',
    padding: 32,
    showBorder: true,
    borderColor: '#d4af37',
    borderWidth: 1,
    shadowIntensity: 'strong',
    decorativeStyle: 'lines',
    accentColor: '#d4af37',
  },
  // ===== CORPORATE PROFESSIONAL =====
  {
    id: 'professional-corporate',
    name: 'Corporate Pro',
    backgroundColor: '#0f172a',
    textColor: '#ffffff',
    title: 'Company Name',
    subtitle: 'Your Trusted Partner',
    customFields: [
      { id: 'website', type: 'text', value: 'www.company.com', style: { fontSize: 13, opacity: 0.8 } },
      { id: 'label1', type: 'label', value: 'SCAN TO CONNECT', style: { fontSize: 9, letterSpacing: 2, color: '#3b82f6', fontWeight: 'bold' } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 12,
    showGradient: true,
    gradientColor: '#1e293b',
    gradientDirection: 'to-bottom',
    padding: 28,
    showBorder: true,
    borderColor: '#334155',
    borderWidth: 1,
    shadowIntensity: 'medium',
    decorativeStyle: 'none',
    accentColor: '#3b82f6',
  },
  // ===== LAW FIRM =====
  {
    id: 'professional-lawfirm',
    name: 'Law Firm',
    backgroundColor: '#1a1a2e',
    textColor: '#c9b037',
    title: 'Smith & Associates',
    subtitle: 'Attorneys at Law',
    customFields: [
      { id: 'label1', type: 'label', value: 'ESTABLISHED 1990', style: { fontSize: 9, letterSpacing: 2, color: '#c9b037', fontWeight: 'medium' } },
      { id: 'contact', type: 'text', value: 'Schedule a Consultation', style: { fontSize: 12, color: '#ffffff', opacity: 0.9 } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 8,
    showGradient: true,
    gradientColor: '#0f0f1a',
    gradientDirection: 'to-bottom',
    padding: 32,
    showBorder: true,
    borderColor: '#c9b037',
    borderWidth: 2,
    shadowIntensity: 'strong',
    decorativeStyle: 'none',
    accentColor: '#c9b037',
  },
  // ===== MEDICAL PROFESSIONAL =====
  {
    id: 'professional-medical',
    name: 'Medical Practice',
    backgroundColor: '#ffffff',
    textColor: '#1e3a5f',
    title: 'Dr. Jane Smith',
    subtitle: 'Family Medicine',
    customFields: [
      { id: 'clinic', type: 'text', value: 'Wellness Medical Center', style: { fontSize: 14, fontWeight: 'medium' } },
      { id: 'label1', type: 'label', value: 'BOOK APPOINTMENT', style: { fontSize: 9, letterSpacing: 2, backgroundColor: '#1e3a5f', color: '#ffffff', padding: '6px 14px', borderRadius: 4, fontWeight: 'bold' } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 12,
    showGradient: false,
    padding: 28,
    showBorder: true,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    shadowIntensity: 'light',
    decorativeStyle: 'none',
    accentColor: '#10b981',
  },
  // ===== REAL ESTATE =====
  {
    id: 'professional-realestate',
    name: 'Real Estate',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    title: 'Luxury Homes',
    subtitle: 'Find Your Dream Property',
    customFields: [
      { id: 'agent', type: 'text', value: 'Agent: John Doe', style: { fontSize: 13, opacity: 0.9 } },
      { id: 'label1', type: 'label', value: 'VIEW LISTINGS', style: { fontSize: 9, letterSpacing: 2, color: '#c9a86c', fontWeight: 'bold' } },
    ],
    titleFontSize: 26,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 12,
    showGradient: true,
    gradientColor: '#2a2a2a',
    gradientDirection: 'to-bottom',
    padding: 28,
    showBorder: true,
    borderColor: '#c9a86c',
    borderWidth: 1,
    shadowIntensity: 'strong',
    decorativeStyle: 'none',
    accentColor: '#c9a86c',
  },
  // ===== CONSULTING FIRM =====
  {
    id: 'professional-consulting',
    name: 'Consulting',
    backgroundColor: '#f8fafc',
    textColor: '#0f172a',
    title: 'Strategic Solutions',
    subtitle: 'Business Consulting Services',
    customFields: [
      { id: 'tagline', type: 'text', value: 'Transform. Optimize. Succeed.', style: { fontSize: 12, fontWeight: 'medium', color: '#3b82f6' } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#e2e8f0',
    gradientDirection: 'to-bottom',
    padding: 28,
    showBorder: true,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    shadowIntensity: 'light',
    decorativeStyle: 'geometric',
    accentColor: '#3b82f6',
  },
  // ===== TECH STARTUP =====
  {
    id: 'professional-techstartup',
    name: 'Tech Startup',
    backgroundColor: '#0a0a0a',
    textColor: '#ffffff',
    title: 'InnovateTech',
    subtitle: 'Building the Future',
    customFields: [
      { id: 'label1', type: 'label', value: 'DOWNLOAD APP', style: { fontSize: 9, letterSpacing: 2, backgroundColor: '#6366f1', color: '#ffffff', padding: '6px 14px', borderRadius: 20, fontWeight: 'bold' } },
    ],
    titleFontSize: 28,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Space Grotesk',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 20,
    showGradient: true,
    gradientColor: '#1a1a1a',
    gradientDirection: 'to-bottom',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'grid',
    accentColor: '#6366f1',
  },
  // ===== FITNESS TRAINER =====
  {
    id: 'professional-fitness',
    name: 'Fitness Pro',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    title: 'GET FIT',
    subtitle: 'Personal Training',
    customFields: [
      { id: 'trainer', type: 'text', value: 'Coach Mike', style: { fontSize: 16, fontWeight: 'bold' } },
      { id: 'label1', type: 'label', value: 'BOOK SESSION', style: { fontSize: 9, letterSpacing: 2, backgroundColor: '#ef4444', color: '#ffffff', padding: '6px 14px', borderRadius: 4, fontWeight: 'bold' } },
    ],
    titleFontSize: 32,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    titleLetterSpacing: 4,
    fontFamily: 'Space Grotesk',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 12,
    showGradient: true,
    gradientColor: '#2a2a2a',
    gradientDirection: 'to-bottom',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'lines',
    accentColor: '#ef4444',
  },
  // ===== BEAUTY SALON =====
  {
    id: 'professional-beauty',
    name: 'Beauty Salon',
    backgroundColor: '#fdf2f8',
    textColor: '#831843',
    title: 'Bloom Beauty',
    subtitle: 'Hair • Nails • Spa',
    customFields: [
      { id: 'label1', type: 'label', value: 'BOOK NOW', style: { fontSize: 9, letterSpacing: 2, backgroundColor: '#ec4899', color: '#ffffff', padding: '6px 14px', borderRadius: 20, fontWeight: 'bold' } },
    ],
    titleFontSize: 28,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 20,
    showGradient: true,
    gradientColor: '#fce7f3',
    gradientDirection: 'to-bottom',
    padding: 28,
    showBorder: true,
    borderColor: '#f9a8d4',
    borderWidth: 1,
    shadowIntensity: 'light',
    decorativeStyle: 'circles',
    accentColor: '#ec4899',
  },
  // ===== PHOTOGRAPHY =====
  {
    id: 'professional-photography',
    name: 'Photography',
    backgroundColor: '#18181b',
    textColor: '#ffffff',
    title: 'CAPTURED',
    subtitle: 'Professional Photography',
    customFields: [
      { id: 'name', type: 'text', value: 'by Alex Miller', style: { fontSize: 14, fontWeight: 'medium', opacity: 0.9 } },
      { id: 'label1', type: 'label', value: 'VIEW PORTFOLIO', style: { fontSize: 9, letterSpacing: 2, color: '#fbbf24', fontWeight: 'bold' } },
    ],
    titleFontSize: 30,
    subtitleFontSize: 12,
    titleFontWeight: 'bold',
    titleLetterSpacing: 6,
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 8,
    showGradient: true,
    gradientColor: '#27272a',
    gradientDirection: 'to-bottom',
    padding: 32,
    shadowIntensity: 'strong',
    decorativeStyle: 'none',
    accentColor: '#fbbf24',
  },
  // ===== EXECUTIVE DARK =====
  {
    id: 'professional-executive-dark',
    name: 'Executive Dark',
    backgroundColor: '#0f0f0f',
    textColor: '#ffffff',
    title: 'Your Name',
    subtitle: 'Chief Executive Officer',
    customFields: [
      { id: 'company', type: 'text', value: 'ENTERPRISE CORP', style: { fontSize: 12, letterSpacing: 4, color: '#a0a0a0', fontWeight: 'medium' } },
      { id: 'divider1', type: 'divider', value: '' },
      { id: 'email', type: 'text', value: 'ceo@enterprise.com', style: { fontSize: 12, opacity: 0.8 } },
    ],
    titleFontSize: 28,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 4,
    showGradient: true,
    gradientColor: '#1a1a1a',
    gradientDirection: 'to-bottom',
    padding: 32,
    showBorder: true,
    borderColor: '#333333',
    borderWidth: 1,
    shadowIntensity: 'strong',
    decorativeStyle: 'none',
    accentColor: '#ffffff',
  },
  // ===== MINIMALIST LUXURY =====
  {
    id: 'professional-minimalist-luxury',
    name: 'Minimalist Luxury',
    backgroundColor: '#fafafa',
    textColor: '#1a1a1a',
    title: 'Your Name',
    subtitle: 'Creative Director',
    customFields: [
      { id: 'company', type: 'text', value: 'Studio Name', style: { fontSize: 13, color: '#666666', fontWeight: 'medium' } },
    ],
    titleFontSize: 26,
    subtitleFontSize: 13,
    titleFontWeight: 'semibold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 0,
    showGradient: false,
    padding: 36,
    showBorder: true,
    borderColor: '#e5e5e5',
    borderWidth: 1,
    shadowIntensity: 'none',
    decorativeStyle: 'none',
    accentColor: '#1a1a1a',
  },
  // ===== CORPORATE NAVY =====
  {
    id: 'professional-corporate-navy',
    name: 'Corporate Navy',
    backgroundColor: '#0f172a',
    textColor: '#ffffff',
    title: 'Your Name',
    subtitle: 'Senior Manager',
    customFields: [
      { id: 'company', type: 'text', value: 'Global Industries Inc.', style: { fontSize: 14, color: '#60a5fa', fontWeight: 'semibold' } },
      { id: 'email', type: 'text', value: 'contact@globalind.com', style: { fontSize: 12, opacity: 0.8 } },
      { id: 'phone', type: 'text', value: '+1 (555) 000-0000', style: { fontSize: 12, opacity: 0.8 } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'left',
    qrPosition: 'right',
    cardLayout: 'horizontal',
    borderRadius: 12,
    showGradient: true,
    gradientColor: '#1e293b',
    gradientDirection: 'to-right',
    padding: 24,
    shadowIntensity: 'medium',
    decorativeStyle: 'none',
    accentColor: '#3b82f6',
  },
  // ===== ARCHITECT MODERN =====
  {
    id: 'professional-architect',
    name: 'Architect Modern',
    backgroundColor: '#ffffff',
    textColor: '#171717',
    title: 'STUDIO NAME',
    subtitle: 'Architecture & Design',
    customFields: [
      { id: 'tagline', type: 'text', value: 'Form follows function', style: { fontSize: 12, fontWeight: 'normal', italic: true, color: '#737373' } },
    ],
    titleFontSize: 22,
    subtitleFontSize: 12,
    titleFontWeight: 'bold',
    titleLetterSpacing: 4,
    fontFamily: 'Space Grotesk',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 0,
    showGradient: false,
    padding: 32,
    showBorder: true,
    borderColor: '#171717',
    borderWidth: 2,
    shadowIntensity: 'none',
    decorativeStyle: 'lines',
    accentColor: '#171717',
  },
  // ===== FINANCE GOLD =====
  {
    id: 'professional-finance-gold',
    name: 'Finance Gold',
    backgroundColor: '#1c1917',
    textColor: '#fef3c7',
    title: 'Your Name',
    subtitle: 'Financial Advisor',
    customFields: [
      { id: 'company', type: 'text', value: 'Wealth Partners', style: { fontSize: 14, color: '#d4af37', fontWeight: 'semibold' } },
      { id: 'credentials', type: 'text', value: 'CFP® | CFA', style: { fontSize: 11, letterSpacing: 2, color: '#a3a3a3' } },
    ],
    titleFontSize: 26,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 8,
    showGradient: true,
    gradientColor: '#292524',
    gradientDirection: 'to-bottom',
    padding: 28,
    showBorder: true,
    borderColor: '#d4af37',
    borderWidth: 1,
    shadowIntensity: 'strong',
    decorativeStyle: 'none',
    accentColor: '#d4af37',
  },
  // ===== TECH STARTUP =====
  {
    id: 'professional-tech-startup',
    name: 'Tech Startup',
    backgroundColor: '#09090b',
    textColor: '#ffffff',
    title: 'Your Name',
    subtitle: 'Co-Founder & CTO',
    customFields: [
      { id: 'company', type: 'text', value: 'StartupName.io', style: { fontSize: 16, color: '#22d3ee', fontWeight: 'bold' } },
      { id: 'label1', type: 'label', value: 'WE ARE HIRING', style: { fontSize: 9, letterSpacing: 2, backgroundColor: '#22d3ee', color: '#000000', padding: '4px 12px', borderRadius: 4, fontWeight: 'bold' } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 12,
    titleFontWeight: 'bold',
    fontFamily: 'Space Grotesk',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#18181b',
    gradientDirection: 'to-bottom',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'grid',
    accentColor: '#22d3ee',
  },
  // ===== ATTORNEY AT LAW =====
  {
    id: 'professional-attorney',
    name: 'Attorney at Law',
    backgroundColor: '#1e293b',
    textColor: '#ffffff',
    title: 'Your Name, Esq.',
    subtitle: 'Attorney at Law',
    customFields: [
      { id: 'firm', type: 'text', value: 'Smith & Associates LLP', style: { fontSize: 14, fontWeight: 'semibold' } },
      { id: 'practice', type: 'text', value: 'Corporate Law • Litigation', style: { fontSize: 11, opacity: 0.8 } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 12,
    titleFontWeight: 'bold',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 8,
    showGradient: true,
    gradientColor: '#334155',
    gradientDirection: 'to-bottom',
    padding: 28,
    showBorder: true,
    borderColor: '#94a3b8',
    borderWidth: 1,
    shadowIntensity: 'medium',
    decorativeStyle: 'none',
    accentColor: '#94a3b8',
  },
  // ===== DOCTOR MEDICAL =====
  {
    id: 'professional-doctor',
    name: 'Medical Doctor',
    backgroundColor: '#ffffff',
    textColor: '#0f172a',
    title: 'Dr. Your Name',
    subtitle: 'M.D., FACP',
    customFields: [
      { id: 'specialty', type: 'text', value: 'Internal Medicine', style: { fontSize: 14, color: '#0891b2', fontWeight: 'semibold' } },
      { id: 'hospital', type: 'text', value: 'City Medical Center', style: { fontSize: 12, opacity: 0.8 } },
      { id: 'label1', type: 'label', value: 'BOOK APPOINTMENT', style: { fontSize: 9, letterSpacing: 1, backgroundColor: '#0891b2', color: '#ffffff', padding: '6px 14px', borderRadius: 4, fontWeight: 'bold' } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 12,
    showGradient: false,
    padding: 28,
    showBorder: true,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    shadowIntensity: 'light',
    decorativeStyle: 'none',
    accentColor: '#0891b2',
  },
  // ===== CONSULTANT MODERN =====
  {
    id: 'professional-consultant',
    name: 'Consultant',
    backgroundColor: '#18181b',
    textColor: '#ffffff',
    title: 'YOUR NAME',
    subtitle: 'Strategy Consultant',
    customFields: [
      { id: 'company', type: 'text', value: 'Independent Consulting', style: { fontSize: 12, color: '#a1a1aa' } },
      { id: 'email', type: 'text', value: 'consult@yourname.com', style: { fontSize: 11, opacity: 0.8 } },
    ],
    titleFontSize: 26,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    titleLetterSpacing: 3,
    fontFamily: 'Inter',
    textAlign: 'left',
    qrPosition: 'right',
    cardLayout: 'horizontal',
    borderRadius: 8,
    showGradient: true,
    gradientColor: '#27272a',
    gradientDirection: 'to-right',
    padding: 24,
    shadowIntensity: 'medium',
    decorativeStyle: 'none',
    accentColor: '#f4f4f5',
  },
  // ===== AGENCY CREATIVE =====
  {
    id: 'professional-agency',
    name: 'Creative Agency',
    backgroundColor: '#0a0a0a',
    textColor: '#ffffff',
    title: 'AGENCY NAME',
    subtitle: 'Digital • Branding • Strategy',
    customFields: [
      { id: 'label1', type: 'label', value: "LET'S CREATE", style: { fontSize: 10, letterSpacing: 2, color: '#f97316', fontWeight: 'bold' } },
    ],
    titleFontSize: 28,
    subtitleFontSize: 12,
    titleFontWeight: 'bold',
    titleLetterSpacing: 4,
    fontFamily: 'Space Grotesk',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 0,
    showGradient: true,
    gradientColor: '#171717',
    gradientDirection: 'to-bottom',
    padding: 32,
    showBorder: true,
    borderColor: '#f97316',
    borderWidth: 2,
    shadowIntensity: 'strong',
    decorativeStyle: 'geometric',
    accentColor: '#f97316',
  },
  // ===== REALTOR PREMIUM =====
  {
    id: 'professional-realtor',
    name: 'Realtor Premium',
    backgroundColor: '#14532d',
    textColor: '#ffffff',
    title: 'Your Name',
    subtitle: 'Licensed Real Estate Agent',
    customFields: [
      { id: 'company', type: 'text', value: 'Prime Realty Group', style: { fontSize: 14, color: '#86efac', fontWeight: 'semibold' } },
      { id: 'label1', type: 'label', value: 'VIEW LISTINGS', style: { fontSize: 9, letterSpacing: 2, backgroundColor: '#22c55e', color: '#000000', padding: '6px 14px', borderRadius: 4, fontWeight: 'bold' } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 12,
    titleFontWeight: 'bold',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 12,
    showGradient: true,
    gradientColor: '#166534',
    gradientDirection: 'to-bottom',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'none',
    accentColor: '#22c55e',
  },
  // ===== PROFESSOR ACADEMIC =====
  {
    id: 'professional-professor',
    name: 'Professor',
    backgroundColor: '#7c2d12',
    textColor: '#ffffff',
    title: 'Prof. Your Name',
    subtitle: 'Ph.D. in Computer Science',
    customFields: [
      { id: 'university', type: 'text', value: 'Stanford University', style: { fontSize: 14, fontWeight: 'semibold' } },
      { id: 'dept', type: 'text', value: 'Department of Engineering', style: { fontSize: 12, opacity: 0.9 } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 12,
    titleFontWeight: 'bold',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 8,
    showGradient: true,
    gradientColor: '#9a3412',
    gradientDirection: 'to-bottom',
    padding: 28,
    showBorder: true,
    borderColor: '#fdba74',
    borderWidth: 1,
    shadowIntensity: 'medium',
    decorativeStyle: 'none',
    accentColor: '#fdba74',
  },
  // ===== EVENT PLANNER =====
  {
    id: 'professional-event-planner',
    name: 'Event Planner',
    backgroundColor: '#4a044e',
    textColor: '#ffffff',
    title: 'Your Name',
    subtitle: 'Event Designer',
    customFields: [
      { id: 'company', type: 'text', value: 'Celebrate Events', style: { fontSize: 14, color: '#e879f9', fontWeight: 'semibold' } },
      { id: 'tagline', type: 'text', value: 'Creating unforgettable moments', style: { fontSize: 11, fontWeight: 'normal', italic: true, opacity: 0.9 } },
    ],
    titleFontSize: 26,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#581c87',
    gradientDirection: 'to-bottom',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'circles',
    accentColor: '#d946ef',
  },
  // ===== INVESTOR VC =====
  {
    id: 'professional-investor',
    name: 'Investor VC',
    backgroundColor: '#020617',
    textColor: '#ffffff',
    title: 'Your Name',
    subtitle: 'Managing Partner',
    customFields: [
      { id: 'fund', type: 'text', value: 'Horizon Ventures', style: { fontSize: 15, color: '#a78bfa', fontWeight: 'bold' } },
      { id: 'focus', type: 'text', value: 'Seed & Series A • Fintech', style: { fontSize: 11, opacity: 0.8 } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 12,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 12,
    showGradient: true,
    gradientColor: '#0f172a',
    gradientDirection: 'to-bottom',
    padding: 28,
    showBorder: true,
    borderColor: '#4c1d95',
    borderWidth: 1,
    shadowIntensity: 'strong',
    decorativeStyle: 'grid',
    accentColor: '#8b5cf6',
  },
  // ==========================================
  // LUXURY TEMPLATES
  // ==========================================
  // ===== NOIR DIAMOND =====
  {
    id: 'luxury-noir-diamond',
    name: 'Noir Diamond',
    backgroundColor: '#0a0a0a',
    textColor: '#ffffff',
    title: 'EXCLUSIVE',
    subtitle: 'Luxury Collection',
    customFields: [
      { id: 'brand', type: 'text', value: 'MAISON ÉLITE', style: { fontSize: 18, letterSpacing: 6, fontWeight: 'normal' } },
    ],
    titleFontSize: 14,
    subtitleFontSize: 12,
    titleFontWeight: 'medium',
    titleLetterSpacing: 8,
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 0,
    showGradient: true,
    gradientColor: '#1a1a1a',
    gradientDirection: 'to-bottom',
    padding: 40,
    showBorder: true,
    borderColor: '#404040',
    borderWidth: 1,
    shadowIntensity: 'strong',
    decorativeStyle: 'lines',
    accentColor: '#ffffff',
  },
  // ===== CHAMPAGNE GOLD =====
  {
    id: 'luxury-champagne-gold',
    name: 'Champagne Gold',
    backgroundColor: '#1a1512',
    textColor: '#f5e6c8',
    title: 'PRESTIGE',
    subtitle: 'Members Only',
    customFields: [
      { id: 'brand', type: 'text', value: 'The Gold Standard', style: { fontSize: 16, color: '#d4af37', fontWeight: 'semibold', italic: true } },
    ],
    titleFontSize: 28,
    subtitleFontSize: 12,
    titleFontWeight: 'bold',
    titleLetterSpacing: 6,
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 8,
    showGradient: true,
    gradientColor: '#2a2218',
    gradientDirection: 'to-bottom',
    padding: 32,
    showBorder: true,
    borderColor: '#d4af37',
    borderWidth: 2,
    shadowIntensity: 'strong',
    decorativeStyle: 'geometric',
    accentColor: '#d4af37',
  },
  // ===== ROYAL VELVET =====
  {
    id: 'luxury-royal-velvet',
    name: 'Royal Velvet',
    backgroundColor: '#1a0a2e',
    textColor: '#ffffff',
    title: 'VIP ACCESS',
    subtitle: 'Exclusive Experience',
    customFields: [
      { id: 'label1', type: 'label', value: 'PRIVATE COLLECTION', style: { fontSize: 9, letterSpacing: 3, color: '#c084fc', fontWeight: 'medium' } },
    ],
    titleFontSize: 26,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'center',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#2d1a4a',
    gradientDirection: 'to-bottom',
    padding: 32,
    showBorder: true,
    borderColor: '#7c3aed',
    borderWidth: 1,
    shadowIntensity: 'strong',
    decorativeStyle: 'circles',
    accentColor: '#a78bfa',
  },
  // ===== PLATINUM BLACK =====
  {
    id: 'luxury-platinum-black',
    name: 'Platinum Black',
    backgroundColor: '#0f0f0f',
    textColor: '#e5e5e5',
    title: 'BLACK CARD',
    subtitle: 'Elite Membership',
    customFields: [
      { id: 'tier', type: 'text', value: '◆ PLATINUM ◆', style: { fontSize: 12, letterSpacing: 4, color: '#a3a3a3' } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 12,
    titleFontWeight: 'bold',
    titleLetterSpacing: 4,
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 12,
    showGradient: true,
    gradientColor: '#1f1f1f',
    gradientDirection: 'to-bottom',
    padding: 28,
    showBorder: true,
    borderColor: '#525252',
    borderWidth: 1,
    shadowIntensity: 'strong',
    decorativeStyle: 'none',
    accentColor: '#a3a3a3',
  },
  // ===== ROSE ELEGANCE =====
  {
    id: 'luxury-rose-elegance',
    name: 'Rose Elegance',
    backgroundColor: '#1a0a10',
    textColor: '#fce7f3',
    title: 'ROSE COLLECTION',
    subtitle: 'Timeless Beauty',
    customFields: [
      { id: 'tagline', type: 'text', value: 'Est. 1892', style: { fontSize: 12, color: '#f9a8d4', fontWeight: 'normal', italic: true } },
    ],
    titleFontSize: 24,
    subtitleFontSize: 13,
    titleFontWeight: 'semibold',
    titleLetterSpacing: 3,
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#2a1018',
    gradientDirection: 'to-bottom',
    padding: 32,
    showBorder: true,
    borderColor: '#be185d',
    borderWidth: 1,
    shadowIntensity: 'strong',
    decorativeStyle: 'none',
    accentColor: '#ec4899',
  },
  // ===== EMERALD LUXURY =====
  {
    id: 'luxury-emerald',
    name: 'Emerald Luxury',
    backgroundColor: '#022c22',
    textColor: '#d1fae5',
    title: 'THE EMERALD',
    subtitle: 'Fine Jewelry',
    customFields: [
      { id: 'label1', type: 'label', value: 'SINCE 1945', style: { fontSize: 10, letterSpacing: 3, color: '#10b981', fontWeight: 'medium' } },
    ],
    titleFontSize: 26,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 8,
    showGradient: true,
    gradientColor: '#064e3b',
    gradientDirection: 'to-bottom',
    padding: 32,
    showBorder: true,
    borderColor: '#059669',
    borderWidth: 2,
    shadowIntensity: 'strong',
    decorativeStyle: 'geometric',
    accentColor: '#34d399',
  },
  // ===== IVORY SILK =====
  {
    id: 'luxury-ivory-silk',
    name: 'Ivory Silk',
    backgroundColor: '#faf9f7',
    textColor: '#292524',
    title: 'Maison Laurent',
    subtitle: 'Haute Couture',
    customFields: [
      { id: 'tagline', type: 'text', value: 'Paris • Milan • Tokyo', style: { fontSize: 11, color: '#78716c', letterSpacing: 2 } },
    ],
    titleFontSize: 28,
    subtitleFontSize: 13,
    titleFontWeight: 'normal',
    fontFamily: 'Playfair Display',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 0,
    showGradient: false,
    padding: 36,
    showBorder: true,
    borderColor: '#d6d3d1',
    borderWidth: 1,
    shadowIntensity: 'light',
    decorativeStyle: 'none',
    accentColor: '#78716c',
  },
  // ==========================================
  // VIBRANT TEMPLATES
  // ==========================================
  // ===== NEON NIGHTS =====
  {
    id: 'vibrant-neon-nights',
    name: 'Neon Nights',
    backgroundColor: '#0a0a1a',
    textColor: '#ffffff',
    title: 'GLOW UP',
    subtitle: 'The Ultimate Experience',
    customFields: [
      { id: 'label1', type: 'label', value: '★ LIVE NOW ★', style: { fontSize: 10, letterSpacing: 2, color: '#00ffff', fontWeight: 'bold' } },
    ],
    titleFontSize: 30,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Space Grotesk',
    textAlign: 'center',
    qrPosition: 'center',
    borderRadius: 20,
    showGradient: true,
    gradientColor: '#1a0a2e',
    gradientDirection: 'to-bottom',
    padding: 28,
    showBorder: true,
    borderColor: '#ff00ff',
    borderWidth: 2,
    shadowIntensity: 'strong',
    decorativeStyle: 'grid',
    accentColor: '#00ffff',
  },
  // ===== SUNSET PARADISE =====
  {
    id: 'vibrant-sunset-paradise',
    name: 'Sunset Paradise',
    backgroundColor: '#ff6b35',
    textColor: '#ffffff',
    title: 'SUMMER VIBES',
    subtitle: 'Beach Party 2024',
    customFields: [
      { id: 'date', type: 'date', value: 'July 15 • 6PM', style: { fontSize: 14, fontWeight: 'semibold' } },
    ],
    titleFontSize: 28,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 24,
    showGradient: true,
    gradientColor: '#f7931e',
    gradientDirection: 'to-bottom-right',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'circles',
    accentColor: '#ffd93d',
  },
  // ===== ELECTRIC PULSE =====
  {
    id: 'vibrant-electric-pulse',
    name: 'Electric Pulse',
    backgroundColor: '#0f0f23',
    textColor: '#ffffff',
    title: 'POWER ON',
    subtitle: 'Gaming Tournament',
    customFields: [
      { id: 'prize', type: 'text', value: '$10,000 PRIZE POOL', style: { fontSize: 14, color: '#22d3ee', fontWeight: 'bold' } },
      { id: 'label1', type: 'label', value: 'REGISTER NOW', style: { fontSize: 9, letterSpacing: 2, backgroundColor: '#06b6d4', color: '#000000', padding: '6px 14px', borderRadius: 4, fontWeight: 'bold' } },
    ],
    titleFontSize: 32,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    titleLetterSpacing: 4,
    fontFamily: 'Space Grotesk',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#1a1a3e',
    gradientDirection: 'to-bottom',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'grid',
    accentColor: '#22d3ee',
  },
  // ===== CANDY POP =====
  {
    id: 'vibrant-candy-pop',
    name: 'Candy Pop',
    backgroundColor: '#ff6b9d',
    textColor: '#ffffff',
    title: 'SWEET DEALS',
    subtitle: 'Limited Time Offer!',
    customFields: [
      { id: 'discount', type: 'text', value: '50% OFF', style: { fontSize: 28, fontWeight: 'bold' } },
    ],
    titleFontSize: 22,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 24,
    showGradient: true,
    gradientColor: '#c44569',
    gradientDirection: 'to-bottom-right',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'dots',
    accentColor: '#ffeaa7',
  },
  // ===== TROPICAL BURST =====
  {
    id: 'vibrant-tropical-burst',
    name: 'Tropical Burst',
    backgroundColor: '#00b894',
    textColor: '#ffffff',
    title: 'TROPICAL',
    subtitle: 'Fresh & Natural',
    customFields: [
      { id: 'tagline', type: 'text', value: '🌴 Island Flavors 🌴', style: { fontSize: 14, fontWeight: 'medium' } },
    ],
    titleFontSize: 32,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 20,
    showGradient: true,
    gradientColor: '#00cec9',
    gradientDirection: 'to-bottom-right',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'circles',
    accentColor: '#ffeaa7',
  },
  // ===== GALAXY DREAM =====
  {
    id: 'vibrant-galaxy-dream',
    name: 'Galaxy Dream',
    backgroundColor: '#1a0533',
    textColor: '#ffffff',
    title: 'BEYOND LIMITS',
    subtitle: 'Explore the Universe',
    customFields: [
      { id: 'label1', type: 'label', value: '✦ COSMIC EVENT ✦', style: { fontSize: 10, letterSpacing: 2, color: '#e879f9', fontWeight: 'medium' } },
    ],
    titleFontSize: 26,
    subtitleFontSize: 13,
    titleFontWeight: 'bold',
    fontFamily: 'Space Grotesk',
    textAlign: 'center',
    qrPosition: 'center',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#2d0a4e',
    gradientDirection: 'to-bottom',
    padding: 32,
    shadowIntensity: 'strong',
    decorativeStyle: 'circles',
    accentColor: '#c084fc',
  },
  // ===== RETRO WAVE =====
  {
    id: 'vibrant-retro-wave',
    name: 'Retro Wave',
    backgroundColor: '#2d1b4e',
    textColor: '#ff6ad5',
    title: 'RETROWAVE',
    subtitle: '1985 Forever',
    customFields: [
      { id: 'tagline', type: 'text', value: 'Synthwave Dreams', style: { fontSize: 14, color: '#00ffff', fontWeight: 'medium' } },
    ],
    titleFontSize: 30,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    fontFamily: 'Space Grotesk',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 0,
    showGradient: true,
    gradientColor: '#1a0a2e',
    gradientDirection: 'to-bottom',
    padding: 28,
    showBorder: true,
    borderColor: '#ff6ad5',
    borderWidth: 3,
    shadowIntensity: 'strong',
    decorativeStyle: 'lines',
    accentColor: '#00ffff',
  },
  // ===== FIRE FESTIVAL =====
  {
    id: 'vibrant-fire-festival',
    name: 'Fire Festival',
    backgroundColor: '#1a0a00',
    textColor: '#ffffff',
    title: 'IGNITE',
    subtitle: 'Music Festival 2024',
    customFields: [
      { id: 'dates', type: 'text', value: 'AUG 20-22', style: { fontSize: 18, color: '#ff6b35', fontWeight: 'bold' } },
      { id: 'label1', type: 'label', value: 'GET TICKETS', style: { fontSize: 9, letterSpacing: 2, backgroundColor: '#ef4444', color: '#ffffff', padding: '6px 14px', borderRadius: 4, fontWeight: 'bold' } },
    ],
    titleFontSize: 36,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    titleLetterSpacing: 6,
    fontFamily: 'Space Grotesk',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 16,
    showGradient: true,
    gradientColor: '#2a1400',
    gradientDirection: 'to-bottom',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'geometric',
    accentColor: '#f97316',
  },
  // ===== NEON CLUB =====
  {
    id: 'vibrant-neon-club',
    name: 'Neon Club',
    backgroundColor: '#0a0a0a',
    textColor: '#ffffff',
    title: 'CLUB NIGHT',
    subtitle: 'Every Saturday',
    customFields: [
      { id: 'dj', type: 'text', value: 'DJ ELECTRA', style: { fontSize: 18, color: '#a855f7', fontWeight: 'bold' } },
      { id: 'time', type: 'time', value: '10PM - 4AM', style: { fontSize: 12, color: '#22d3ee' } },
    ],
    titleFontSize: 28,
    subtitleFontSize: 12,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 20,
    showGradient: true,
    gradientColor: '#1a1a1a',
    gradientDirection: 'to-bottom',
    padding: 28,
    showBorder: true,
    borderColor: '#22d3ee',
    borderWidth: 2,
    shadowIntensity: 'strong',
    decorativeStyle: 'grid',
    accentColor: '#a855f7',
  },
  // ===== RAINBOW PRIDE =====
  {
    id: 'vibrant-rainbow-pride',
    name: 'Rainbow Pride',
    backgroundColor: '#ff0080',
    textColor: '#ffffff',
    title: 'CELEBRATE',
    subtitle: 'Love is Love',
    customFields: [
      { id: 'year', type: 'text', value: 'PRIDE 2024', style: { fontSize: 16, fontWeight: 'bold', letterSpacing: 3 } },
    ],
    titleFontSize: 30,
    subtitleFontSize: 14,
    titleFontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    qrPosition: 'bottom',
    borderRadius: 24,
    showGradient: true,
    gradientColor: '#8b00ff',
    gradientDirection: 'to-bottom-right',
    padding: 28,
    shadowIntensity: 'strong',
    decorativeStyle: 'circles',
    accentColor: '#ffd700',
  },
];
