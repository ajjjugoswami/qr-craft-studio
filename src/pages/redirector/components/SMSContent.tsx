import React from 'react';
import { MessageSquare, Phone, Copy, Check, Send, User } from 'lucide-react';
import type { WhiteLabelConfig } from '@/context/authTypes';

interface SMSContentProps {
  content: string;
  copied: string | null;
  onCopy: (text: string, field: string) => void;
  whiteLabel?: WhiteLabelConfig | null;
}

interface SMSData {
  phoneNumber: string;
  message: string;
}

const parseSMSContent = (content: string): SMSData => {
  let phoneNumber = '';
  let message = '';

  if (content.startsWith('sms:') || content.startsWith('SMSTO:')) {
    const cleaned = content.replace(/^(sms:|SMSTO:)/i, '');
    
    if (cleaned.includes('?body=')) {
      const [phone, body] = cleaned.split('?body=');
      phoneNumber = phone;
      message = decodeURIComponent(body || '');
    } else if (cleaned.includes('&body=')) {
      const [phone, body] = cleaned.split('&body=');
      phoneNumber = phone;
      message = decodeURIComponent(body || '');
    } else if (cleaned.includes(':')) {
      const parts = cleaned.split(':');
      phoneNumber = parts[0];
      message = parts.slice(1).join(':');
    } else {
      phoneNumber = cleaned;
    }
  } else {
    phoneNumber = content;
  }

  return { phoneNumber: phoneNumber.trim(), message: message.trim() };
};

export const SMSContent: React.FC<SMSContentProps> = ({ content, copied, onCopy, whiteLabel }) => {
  const { phoneNumber, message } = parseSMSContent(content);

  const primaryColor = whiteLabel?.enabled && whiteLabel.primaryColor ? whiteLabel.primaryColor : '#059669';

  const handleSendSMS = () => {
    let smsUrl = `sms:${phoneNumber}`;
    if (message) {
      smsUrl += `?body=${encodeURIComponent(message)}`;
    }
    window.location.href = smsUrl;
  };

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="min-h-[100dvh] h-[100dvh] overflow-hidden flex flex-col" style={{ backgroundColor: primaryColor }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 text-center flex-shrink-0 sm:p-6">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-2 sm:mb-3">
          <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
        </div>
        <h1 className="text-lg sm:text-xl font-semibold text-white">SMS Message</h1>
      </div>

      {/* Content Card */}
      <div className="flex-1 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex flex-col min-h-0">
        <div className="bg-white rounded-2xl flex-1 flex flex-col overflow-hidden">
          <div className="p-4 space-y-3 flex-1 overflow-auto">
            {/* Phone Number */}
            <div className="bg-stone-50 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${primaryColor}20` }}>
                  <User className="w-5 h-5" style={{ color: primaryColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-stone-500 font-medium">To</p>
                  <p className="text-stone-900 font-semibold truncate">{phoneNumber}</p>
                </div>
                <button 
                  onClick={() => onCopy(phoneNumber, 'phone')}
                  className="p-2 hover:bg-stone-200 rounded-full transition-colors"
                >
                  {copied === 'phone' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-stone-400" />}
                </button>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className="bg-stone-50 rounded-xl p-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-stone-500 font-medium">Message</p>
                    <p className="text-stone-800 text-sm line-clamp-3">{message}</p>
                  </div>
                  <button 
                    onClick={() => onCopy(message, 'message')}
                    className="p-2 hover:bg-stone-200 rounded-full transition-colors flex-shrink-0"
                  >
                    {copied === 'message' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-stone-400" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] space-y-2 flex-shrink-0 border-t border-stone-100">
            <button 
              onClick={handleSendSMS}
              className="w-full py-3.5 text-white font-medium rounded-xl flex items-center justify-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              <Send className="w-4 h-4" />
              Send SMS
            </button>
            <button 
              onClick={handleCall}
              className="w-full py-3.5 bg-stone-100 text-stone-700 font-medium rounded-xl flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call Instead
            </button>
            
            {whiteLabel?.showPoweredBy !== false && (
              <p className="text-xs text-stone-400 text-center mt-2">
                Powered by QR Studio
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
