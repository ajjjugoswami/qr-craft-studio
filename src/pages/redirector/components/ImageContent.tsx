import React, { useState } from 'react';
import { Button } from 'antd';
import { Download, Image as ImageIcon, ZoomIn, ZoomOut, ExternalLink } from 'lucide-react';

interface ImageContentProps {
  content: string;
}

export const ImageContent: React.FC<ImageContentProps> = ({ content }) => {
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
      // Fallback: open in new tab
      window.open(content, '_blank');
    }
  };

  const handleOpenOriginal = () => {
    window.open(content, '_blank');
  };

  if (imageError) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="bg-primary/10 p-6 text-center">
          <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Image</h2>
        </div>
        <div className="p-6 text-center">
          <p className="text-muted-foreground mb-4">Unable to load image preview</p>
          <Button type="primary" size="large" onClick={handleOpenOriginal} icon={<ExternalLink className="w-4 h-4" />}>
            Open Original
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-primary/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-primary-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Image</h2>
        </div>
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
        >
          {isZoomed ? (
            <ZoomOut className="w-5 h-5 text-foreground" />
          ) : (
            <ZoomIn className="w-5 h-5 text-foreground" />
          )}
        </button>
      </div>

      {/* Image Container */}
      <div 
        className={`relative bg-muted/30 flex items-center justify-center overflow-hidden transition-all duration-300 ${
          isZoomed ? 'max-h-[70vh]' : 'max-h-80'
        }`}
      >
        <img
          src={content}
          alt="QR Code Image"
          className={`w-full h-full object-contain transition-transform duration-300 ${
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
          onError={() => setImageError(true)}
        />
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border flex gap-3">
        <Button 
          type="primary" 
          size="large" 
          className="flex-1" 
          onClick={handleDownload}
          icon={<Download className="w-4 h-4" />}
        >
          Download
        </Button>
        <Button 
          size="large" 
          className="flex-1" 
          onClick={handleOpenOriginal}
          icon={<ExternalLink className="w-4 h-4" />}
        >
          Open Original
        </Button>
      </div>
    </div>
  );
};
