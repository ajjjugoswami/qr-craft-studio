import React from 'react';
import { MessageSquare, Phone, Copy, Check, Send, User } from 'lucide-react';

interface SMSContentProps {
  content: string;
  copied: string | null;
  onCopy: (text: string, field: string) => void;
}

interface SMSData {
  phoneNumber: string;
  message: string;
}

const parseSMSContent = (content: string): SMSData => {
  // Try to parse sms: URL format
  // Formats: sms:+1234567890, sms:+1234567890?body=message, sms:+1234567890&body=message
  let phoneNumber = '';
  let message = '';

  if (content.startsWith('sms:') || content.startsWith('SMSTO:')) {
    const cleaned = content.replace(/^(sms:|SMSTO:)/i, '');
    
    // Check for body parameter
    if (cleaned.includes('?body=')) {
      const [phone, body] = cleaned.split('?body=');
      phoneNumber = phone;
      message = decodeURIComponent(body || '');
    } else if (cleaned.includes('&body=')) {
      const [phone, body] = cleaned.split('&body=');
      phoneNumber = phone;
      message = decodeURIComponent(body || '');
    } else if (cleaned.includes(':')) {
      // SMSTO format: SMSTO:number:message
      const parts = cleaned.split(':');
      phoneNumber = parts[0];
      message = parts.slice(1).join(':');
    } else {
      phoneNumber = cleaned;
    }
  } else {
    // Plain phone number or other format
    phoneNumber = content;
  }

  return { phoneNumber: phoneNumber.trim(), message: message.trim() };
};

export const SMSContent: React.FC<SMSContentProps> = ({ content, copied, onCopy }) => {
  const { phoneNumber, message } = parseSMSContent(content);

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-center">
          <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow-lg">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">SMS Message</h2>
          <p className="text-white/80 text-sm mt-1">Tap to send a message</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Phone Number */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Recipient</p>
                <p className="text-lg font-semibold text-gray-800">{phoneNumber}</p>
              </div>
              <button 
                onClick={() => onCopy(phoneNumber, 'phone')}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                {copied === 'phone' ? (
                  <Check className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Message</p>
                  <p className="text-gray-800 break-words">{message}</p>
                </div>
                <button 
                  onClick={() => onCopy(message, 'message')}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                >
                  {copied === 'message' ? (
                    <Check className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 space-y-3">
          <button 
            onClick={handleSendSMS}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Send SMS
          </button>
          <button 
            onClick={handleCall}
            className="w-full py-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            Call Instead
          </button>
        </div>
      </div>
    </div>
  );
};
