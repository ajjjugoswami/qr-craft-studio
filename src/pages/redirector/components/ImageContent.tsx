import React, { useState } from 'react';
import { Download, Image as ImageIcon, ZoomIn, ZoomOut, ExternalLink, Share2 } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <ImageIcon className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Image</h2>
            <p className="text-gray-500 mb-6">Unable to load image preview</p>
            <button 
              onClick={() => window.open(content, '_blank')}
              className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Open Original
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-white">Image</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors"
          >
            {isZoomed ? (
              <ZoomOut className="w-5 h-5 text-white" />
            ) : (
              <ZoomIn className="w-5 h-5 text-white" />
            )}
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors"
          >
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Image Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full">
          <div 
            className={`relative flex items-center justify-center overflow-hidden transition-all duration-300 ${
              isZoomed ? 'max-h-[70vh]' : 'max-h-[50vh]'
            }`}
          >
            <img
              src={content}
              alt="QR Code Image"
              className={`w-full h-full object-contain transition-transform duration-300 ${
                isZoomed ? 'cursor-zoom-out scale-110' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
              onError={() => setImageError(true)}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 pb-8">
        <div className="max-w-md mx-auto flex gap-3">
          <button 
            onClick={handleDownload}
            className="flex-1 py-4 bg-white text-purple-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download
          </button>
          <button 
            onClick={() => window.open(content, '_blank')}
            className="flex-1 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-2xl hover:bg-white/30 transition-all flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-5 h-5" />
            Open Original
          </button>
        </div>
      </div>
    </div>
  );
};
