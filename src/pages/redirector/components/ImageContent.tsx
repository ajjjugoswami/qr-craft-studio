import React, { useState } from 'react';
import { Download, Image as ImageIcon, ZoomIn, ZoomOut, ExternalLink, Share2 } from 'lucide-react';
import type { WhiteLabelConfig } from '@/context/authTypes';

interface ImageContentProps {
  content: string;
  whiteLabel?: WhiteLabelConfig | null;
}

export const ImageContent: React.FC<ImageContentProps> = ({ content, whiteLabel }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(content);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-${Date.now()}.${blob.type.split('/')[1] || 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(content, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url: content });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      window.open(content, '_blank');
    }
  };

  if (imageError) {
    return (
      <div className="min-h-[100dvh] h-[100dvh] overflow-hidden bg-stone-100 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center max-w-sm w-full">
            <div className="w-16 h-16 mx-auto bg-stone-100 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-stone-400" />
            </div>
            <h2 className="text-lg font-semibold text-stone-800 mb-2">Image Unavailable</h2>
            <p className="text-stone-500 text-sm mb-6">Unable to load preview</p>
            <button 
              onClick={() => window.open(content, '_blank')}
              className="w-full py-3 bg-stone-900 text-white font-medium rounded-xl flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open Original
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] h-[100dvh] overflow-hidden bg-stone-900 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-medium">Image</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            {isZoomed ? <ZoomOut className="w-4 h-4 text-white" /> : <ZoomIn className="w-4 h-4 text-white" />}
          </button>
          <button onClick={handleShare} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <Share2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="flex-1 flex items-center justify-center p-4 min-h-0">
        <img
          src={content}
          alt="QR Code Image"
          className={`max-w-full max-h-full object-contain rounded-lg transition-transform duration-200 ${isZoomed ? 'scale-110' : ''}`}
          onClick={() => setIsZoomed(!isZoomed)}
          onError={() => setImageError(true)}
        />
      </div>

      {/* Actions */}
      <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex-shrink-0">
        <div className="flex gap-3">
          <button 
            onClick={handleDownload}
            className="flex-1 py-3.5 bg-white text-stone-900 font-medium rounded-xl flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button 
            onClick={() => window.open(content, '_blank')}
            className="flex-1 py-3.5 bg-white/10 text-white font-medium rounded-xl flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open
          </button>
        </div>
        
        {whiteLabel?.showPoweredBy !== false && (
          <p className="text-xs text-white/40 text-center mt-3">
            Powered by QR Studio
          </p>
        )}
      </div>
    </div>
  );
};
