import React, { useRef } from 'react';
import { Upload, X, Camera, QrCode } from 'lucide-react';
import { 
  FaWhatsapp, 
  FaInstagram, 
  FaFacebookF, 
  FaYoutube, 
  FaLinkedinIn, 
  FaTwitter,
  FaTiktok,
  FaTelegram,
  FaSpotify,
  FaSnapchatGhost,
  FaPinterestP,
  FaDiscord
} from 'react-icons/fa';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { QRStyling } from '../../types/qrcode';
import { cn } from '@/lib/utils';

interface LogoTabProps {
  styling: QRStyling;
  onStyleChange: (styling: QRStyling) => void;
}

// Brand colors for each logo
const BRAND_LOGOS = [
  { id: 'none', type: 'none', label: 'None' },
  { id: 'camera', type: 'icon', label: 'Camera' },
  { id: 'qr', type: 'icon', label: 'QR' },
  { id: 'whatsapp', type: 'brand', color: '#25D366', label: 'WhatsApp' },
  { id: 'instagram', type: 'brand', gradient: ['#833AB4', '#F56040', '#FFDC80'], label: 'Instagram' },
  { id: 'facebook', type: 'brand', color: '#1877F2', label: 'Facebook' },
  { id: 'youtube', type: 'brand', color: '#FF0000', label: 'YouTube' },
  { id: 'linkedin', type: 'brand', color: '#0A66C2', label: 'LinkedIn' },
  { id: 'twitter', type: 'brand', color: '#000000', label: 'X (Twitter)' },
  { id: 'tiktok', type: 'brand', color: '#000000', label: 'TikTok' },
  { id: 'telegram', type: 'brand', color: '#26A5E4', label: 'Telegram' },
  { id: 'spotify', type: 'brand', color: '#1DB954', label: 'Spotify' },
  { id: 'snapchat', type: 'brand', color: '#FFFC00', label: 'Snapchat' },
  { id: 'pinterest', type: 'brand', color: '#E60023', label: 'Pinterest' },
  { id: 'discord', type: 'brand', color: '#5865F2', label: 'Discord' },
  { id: 'scanme1', type: 'text', text: 'SCAN\nME', label: 'Scan Me' },
  { id: 'scanme2', type: 'text', text: 'SCAN\nME', bordered: true, label: 'Scan Me 2' },
];

// Map brand IDs to their icon components for preview
const getBrandIcon = (id: string) => {
  switch (id) {
    case 'whatsapp': return FaWhatsapp;
    case 'instagram': return FaInstagram;
    case 'facebook': return FaFacebookF;
    case 'youtube': return FaYoutube;
    case 'linkedin': return FaLinkedinIn;
    case 'twitter': return FaTwitter;
    case 'tiktok': return FaTiktok;
    case 'telegram': return FaTelegram;
    case 'spotify': return FaSpotify;
    case 'snapchat': return FaSnapchatGhost;
    case 'pinterest': return FaPinterestP;
    case 'discord': return FaDiscord;
    default: return null;
  }
};

const LogoTab: React.FC<LogoTabProps> = ({ styling, onStyleChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onStyleChange({
          ...styling,
          image: result,
          imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.2,
            margin: 0,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (preset: typeof BRAND_LOGOS[0]) => {
    if (preset.type === 'none') {
      onStyleChange({
        ...styling,
        image: undefined,
      });
    } else {
      const svg = generatePresetSvg(preset);
      onStyleChange({
        ...styling,
        image: svg,
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.2,
          margin: 0,
        },
      });
    }
  };

  const generatePresetSvg = (preset: typeof BRAND_LOGOS[0]): string => {
    let svgContent = '';
    
    if (preset.type === 'icon' && preset.id === 'camera') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="6" width="20" height="14" rx="2"/>
          <circle cx="12" cy="13" r="4"/>
          <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/>
        </svg>
      `;
    } else if (preset.type === 'icon' && preset.id === 'qr') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="5" height="5" x="3" y="3" rx="1"/>
          <rect width="5" height="5" x="16" y="3" rx="1"/>
          <rect width="5" height="5" x="3" y="16" rx="1"/>
          <path d="M21 16h-3a2 2 0 0 0-2 2v3"/>
          <path d="M21 21v.01"/>
          <path d="M12 7v3a2 2 0 0 1-2 2H7"/>
          <path d="M3 12h.01"/>
          <path d="M12 3h.01"/>
          <path d="M12 16v.01"/>
          <path d="M16 12h1"/>
          <path d="M21 12v.01"/>
          <path d="M12 21v-1"/>
        </svg>
      `;
    } else if (preset.type === 'brand' && preset.id === 'whatsapp') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
          <rect width="24" height="24" fill="white"/>
          <path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      `;
    } else if (preset.type === 'brand' && preset.id === 'instagram') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
          <rect width="24" height="24" fill="white"/>
          <defs>
            <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
              <stop offset="0%" style="stop-color:#FFDC80"/>
              <stop offset="10%" style="stop-color:#FCAF45"/>
              <stop offset="25%" style="stop-color:#F77737"/>
              <stop offset="45%" style="stop-color:#F56040"/>
              <stop offset="65%" style="stop-color:#FD1D1D"/>
              <stop offset="80%" style="stop-color:#E1306C"/>
              <stop offset="95%" style="stop-color:#C13584"/>
              <stop offset="100%" style="stop-color:#833AB4"/>
            </radialGradient>
          </defs>
          <rect x="1" y="1" width="22" height="22" rx="6" fill="url(#ig-grad)"/>
          <circle cx="12" cy="12" r="4" fill="none" stroke="white" stroke-width="2"/>
          <circle cx="18" cy="6" r="1.5" fill="white"/>
        </svg>
      `;
    } else if (preset.type === 'brand' && preset.id === 'facebook') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
          <rect width="24" height="24" fill="white"/>
          <circle cx="12" cy="12" r="11" fill="#1877F2"/>
          <path fill="white" d="M16.5 13l.5-3h-3v-2c0-.83.41-1.64 1.71-1.64H17V3.53s-1.05-.18-2.06-.18c-2.1 0-3.47 1.27-3.47 3.57V10H8.5v3h2.97v7.25c.6.09 1.21.14 1.83.14s1.23-.05 1.83-.14V13H16.5z"/>
        </svg>
      `;
    } else if (preset.type === 'brand' && preset.id === 'youtube') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
          <rect width="24" height="24" fill="white"/>
          <path fill="#FF0000" d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.81Z"/>
          <path fill="white" d="m9.5 15.5 6.25-3.5L9.5 8.5v7Z"/>
        </svg>
      `;
    } else if (preset.type === 'brand' && preset.id === 'linkedin') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
          <rect width="24" height="24" fill="white"/>
          <rect x="1" y="1" width="22" height="22" rx="3" fill="#0A66C2"/>
          <path fill="white" d="M7 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-1.25 2h2.5v8h-2.5v-8zm4.5 0h2.4v1.1c.35-.67 1.2-1.35 2.5-1.35 2.65 0 3.1 1.75 3.1 4v4.25h-2.5v-3.75c0-.9-.02-2.05-1.25-2.05-1.25 0-1.45.98-1.45 2v3.8h-2.5v-8h-.3z"/>
        </svg>
      `;
    } else if (preset.type === 'brand' && preset.id === 'twitter') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
          <rect width="24" height="24" fill="white"/>
          <circle cx="12" cy="12" r="11" fill="black"/>
          <path fill="white" d="M13.3 10.7L18.5 4.5h-1.2l-4.5 5.4L9 4.5H4.5l5.5 8L4.5 19.5h1.2l4.8-5.6 3.9 5.6h4.5l-5.6-8.8zm-1.7 2l-.6-.8-4.3-6.2h1.9l3.6 5.2.6.8 4.6 6.5h-1.9l-3.9-5.5z"/>
        </svg>
      `;
    } else if (preset.type === 'brand' && preset.id === 'tiktok') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
          <rect width="24" height="24" fill="white"/>
          <path fill="#25F4EE" d="M9.37 10.4v-.9a6.07 6.07 0 0 0-.87-.07 5.63 5.63 0 0 0-3.22 10.24 5.63 5.63 0 0 1 4.09-9.27z"/>
          <path fill="#25F4EE" d="M9.57 17.97a2.85 2.85 0 0 0 2.82-2.53V2.24h2.47a4.65 4.65 0 0 1-.07-.86H11.4v13.18a2.85 2.85 0 0 1-2.82 2.54 2.82 2.82 0 0 1-1.33-.33 2.85 2.85 0 0 0 2.32 1.2z"/>
          <path fill="#25F4EE" d="M18.77 6.41v-.84a4.6 4.6 0 0 1-2.53-.75 4.67 4.67 0 0 0 2.53 1.59z"/>
          <path fill="#FE2C55" d="M16.24 4.82a4.63 4.63 0 0 1-1.13-3.04h-.88a4.68 4.68 0 0 0 2.01 3.04z"/>
          <path fill="#FE2C55" d="M8.5 12.6a2.85 2.85 0 0 0-1.25 5.37 2.83 2.83 0 0 1 2.32-4.5c.29 0 .57.05.84.13v-3.13a6.07 6.07 0 0 0-.87-.07h-.07v2.35a2.83 2.83 0 0 0-.97-.15z"/>
          <path fill="#FE2C55" d="M18.77 6.41v2.26a7.42 7.42 0 0 1-4.34-1.4v6.36a5.63 5.63 0 0 1-8.85 4.63 5.63 5.63 0 0 0 9.92-3.63V8.27a7.42 7.42 0 0 0 4.34 1.4V6.54a4.67 4.67 0 0 1-1.07-.13z"/>
          <path fill="black" d="M14.43 13.63V7.27a7.42 7.42 0 0 0 4.34 1.4V6.41a4.67 4.67 0 0 1-2.53-1.59 4.68 4.68 0 0 1-2.01-3.04h-2.47v13.2a2.85 2.85 0 0 1-5.14 1.65 2.85 2.85 0 0 1 1.25-5.37c.29 0 .57.05.84.13V9.03A5.63 5.63 0 0 0 4.62 19a5.63 5.63 0 0 0 9.81-5.37z"/>
        </svg>
      `;
    } else if (preset.type === 'brand' && preset.id === 'telegram') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
          <rect width="24" height="24" fill="white"/>
          <circle cx="12" cy="12" r="11" fill="#26A5E4"/>
          <path fill="white" d="M17.5 7.5l-2.1 10.1c-.15.7-.6.9-1.2.55l-3.3-2.45-1.6 1.55c-.18.18-.33.33-.67.33l.24-3.35 6.1-5.5c.27-.24-.06-.37-.4-.13l-7.55 4.75-3.25-1c-.7-.22-.72-.7.15-1.05l12.7-4.9c.6-.2 1.1.15.9 1.05z"/>
        </svg>
      `;
    } else if (preset.type === 'brand' && preset.id === 'spotify') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
          <rect width="24" height="24" fill="white"/>
          <circle cx="12" cy="12" r="11" fill="#1DB954"/>
          <path fill="white" d="M16.5 16.2c-.2 0-.3-.1-.5-.2-1.4-.9-3.2-1.3-5.3-1.1-.4.1-.8.1-1.2.2-.3.1-.5 0-.6-.3-.1-.3 0-.5.3-.6.4-.1.9-.2 1.3-.2 2.4-.3 4.4.2 6 1.2.2.1.3.3.2.6-.1.2-.2.4-.2.4zM17.5 13.5c-.2 0-.4-.1-.5-.2-1.7-1-3.9-1.5-6.3-1.2-.5.1-1 .1-1.5.3-.3.1-.6 0-.7-.3s0-.6.3-.7c.5-.2 1.1-.3 1.7-.4 2.7-.4 5.2.2 7.1 1.4.3.2.4.5.2.8-.1.2-.3.3-.3.3zM18.5 10.5c-.2 0-.4-.1-.5-.2-2-1.2-4.7-1.7-7.4-1.4-.6.1-1.2.2-1.8.4-.4.1-.7-.1-.8-.4-.1-.4.1-.7.4-.8.7-.2 1.3-.3 2-.4 3-.4 6 .2 8.3 1.6.3.2.4.6.2.9-.1.2-.3.3-.4.3z"/>
        </svg>
      `;
    } else if (preset.type === 'brand' && preset.id === 'snapchat') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
          <rect width="24" height="24" fill="white"/>
          <path fill="#FFFC00" stroke="black" stroke-width="0.5" d="M12 2C6.5 2 4 5.5 4 8.5v2.5c-.5 0-1 .5-1 1s.5 1 1 1c0 2-1 3.5-3 5 0 0 2 1 6 1 0 .5.5 1 1 1 1 0 1.5-.5 2-.5s1.5.5 2 .5c.5 0 1-.5 1-1 4 0 6-1 6-1-2-1.5-3-3-3-5 .5 0 1-.5 1-1s-.5-1-1-1V8.5C20 5.5 17.5 2 12 2z"/>
        </svg>
      `;
    } else if (preset.type === 'brand' && preset.id === 'pinterest') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
          <rect width="24" height="24" fill="white"/>
          <circle cx="12" cy="12" r="11" fill="#E60023"/>
          <path fill="white" d="M12 5.5c-3.9 0-6 2.8-6 5.6 0 1.4.7 3.1 1.9 3.6.2.1.3 0 .4-.2l.2-.8c0-.1 0-.2-.1-.3-.4-.4-.6-1-.6-1.8 0-2.3 1.7-4.4 4.5-4.4 2.4 0 3.8 1.5 3.8 3.6 0 2.6-1.2 4.8-2.9 4.8-.9 0-1.6-.8-1.4-1.7.2-1.1.7-2.3.7-3.1 0-.7-.4-1.3-1.2-1.3-1 0-1.7 1-1.7 2.3 0 .8.3 1.4.3 1.4l-1.1 4.5c-.3 1.3 0 2.8.1 3 0 .1.1.1.2 0 .1-.1 1.2-1.5 1.6-2.9l.6-2.3c.3.6 1.2 1.1 2.1 1.1 2.8 0 4.7-2.5 4.7-5.9-.1-2.7-2.3-4.7-5.1-4.7z"/>
        </svg>
      `;
    } else if (preset.type === 'brand' && preset.id === 'discord') {
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
          <rect width="24" height="24" fill="white"/>
          <rect x="1" y="1" width="22" height="22" rx="5" fill="#5865F2"/>
          <path fill="white" d="M16.9 7.4A13 13 0 0 0 13.7 6.4a.1.1 0 0 0-.1 0 9 9 0 0 0-.4.9 12 12 0 0 0-3.5 0 8.5 8.5 0 0 0-.4-.9.1.1 0 0 0-.1 0A13 13 0 0 0 6 7.4a.1.1 0 0 0 0 0A13.6 13.6 0 0 0 4.4 15.4a.1.1 0 0 0 0 .1 13.1 13.1 0 0 0 4 2 .1.1 0 0 0 .1 0 9.4 9.4 0 0 0 .8-1.3.1.1 0 0 0 0-.1 8.6 8.6 0 0 1-1.4-.7.1.1 0 0 1 0-.1l.3-.2a.1.1 0 0 1 .1 0 9.3 9.3 0 0 0 8 0 .1.1 0 0 1 .1 0l.3.2a.1.1 0 0 1 0 .2 8.1 8.1 0 0 1-1.4.6.1.1 0 0 0 0 .1 10.5 10.5 0 0 0 .8 1.3.1.1 0 0 0 .1 0 13 13 0 0 0 4-2 .1.1 0 0 0 0-.1 13.5 13.5 0 0 0-1.6-8zm-7.2 6.4a1.5 1.5 0 1 1 1.4-1.5 1.5 1.5 0 0 1-1.4 1.5zm5.3 0a1.5 1.5 0 1 1 1.4-1.5 1.5 1.5 0 0 1-1.4 1.5z"/>
        </svg>
      `;
    } else if (preset.type === 'text') {
      const bordered = preset.bordered;
      svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
          <rect width="100" height="100" fill="white"/>
          ${bordered ? `
            <rect x="5" y="5" width="90" height="90" fill="none" stroke="black" stroke-width="3"/>
            <rect x="2" y="2" width="10" height="10" fill="black"/>
            <rect x="88" y="2" width="10" height="10" fill="black"/>
            <rect x="2" y="88" width="10" height="10" fill="black"/>
            <rect x="88" y="88" width="10" height="10" fill="black"/>
          ` : ''}
          <text x="50" y="40" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="black">SCAN</text>
          <text x="50" y="70" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="black">ME</text>
        </svg>
      `;
    }
    
    return `data:image/svg+xml,${encodeURIComponent(svgContent.trim())}`;
  };

  const isPresetSelected = (preset: typeof BRAND_LOGOS[0]) => {
    if (preset.type === 'none') {
      return !styling.image;
    }
    return false;
  };

  const getIconColor = (preset: typeof BRAND_LOGOS[0]) => {
    if (preset.id === 'snapchat') return '#FFFC00';
    return preset.color || '#000';
  };

  return (
    <div className="pt-4 space-y-6">
      <div>
        <Label className="text-sm font-medium mb-3 block">Logo</Label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {/* Upload Button */}
          <button
            onClick={handleUploadClick}
            className={cn(
              "aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all hover:border-primary hover:bg-primary/5",
              styling.image && !BRAND_LOGOS.some(p => p.type !== 'none' && isPresetSelected(p))
                ? "border-primary bg-primary/10"
                : "border-border"
            )}
          >
            <Upload className="h-5 w-5 text-primary" />
            <span className="text-[10px] text-primary font-medium">Upload</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Preset Options */}
          {BRAND_LOGOS.map((preset) => {
            const BrandIcon = preset.type === 'brand' ? getBrandIcon(preset.id) : null;
            
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className={cn(
                  "aspect-square rounded-lg border-2 flex items-center justify-center transition-all hover:border-primary",
                  isPresetSelected(preset)
                    ? "border-primary bg-primary/10"
                    : "border-border bg-muted/30"
                )}
                title={preset.label}
              >
                {preset.type === 'none' && (
                  <X className="h-6 w-6 text-muted-foreground" />
                )}
                {preset.type === 'icon' && preset.id === 'camera' && (
                  <Camera className="h-6 w-6 text-foreground" />
                )}
                {preset.type === 'icon' && preset.id === 'qr' && (
                  <QrCode className="h-6 w-6 text-foreground" />
                )}
                {preset.type === 'brand' && BrandIcon && (
                  <BrandIcon 
                    className="h-6 w-6" 
                    style={{ color: getIconColor(preset) }}
                  />
                )}
                {preset.type === 'text' && (
                  <div className={cn(
                    "text-[8px] font-bold leading-tight text-center text-foreground",
                    preset.bordered && "border border-foreground p-1"
                  )}>
                    SCAN<br/>ME
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Logo Preview */}
      {styling.image && (
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <img 
            src={styling.image} 
            alt="Logo preview" 
            className="h-12 w-12 object-contain rounded border bg-white"
          />
          <div className="flex-1">
            <p className="text-sm font-medium">Logo selected</p>
            <p className="text-xs text-muted-foreground">Adjust size below</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStyleChange({ ...styling, image: undefined })}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Logo Size Slider */}
      <div>
        <Label className="text-sm text-muted-foreground mb-3 block">
          Logo size: {Math.round((styling.imageOptions?.imageSize || 0.2) * 100)}%
        </Label>
        <Slider
          min={10}
          max={25}
          step={1}
          value={[Math.round((styling.imageOptions?.imageSize || 0.2) * 100)]}
          onValueChange={([value]) =>
            onStyleChange({
              ...styling,
              imageOptions: { 
                hideBackgroundDots: true,
                imageSize: value / 100,
                margin: 0,
              },
            })
          }
          className="w-full"
        />
      </div>

      {/* Info text */}
      <p className="text-xs text-muted-foreground">
        Keep logo size at 25% or less for best scannability. Error correction is automatically set to highest level when logo is added.
      </p>
    </div>
  );
};

export default LogoTab;
