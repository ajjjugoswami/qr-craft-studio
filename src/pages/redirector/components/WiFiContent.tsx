import React from 'react';
import { Wifi, WifiOff, Lock, Shield, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { parseWiFi } from '../utils/contentParsers';

interface WiFiContentProps {
  content: string;
  copied: string | null;
  onCopy: (text: string, field: string) => void;
}

export const WiFiContent: React.FC<WiFiContentProps> = ({ content, copied, onCopy }) => {
  const wifi = parseWiFi(content);
  const [showPassword, setShowPassword] = React.useState(false);
  
  if (!wifi) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center max-w-sm w-full">
          <div className="w-16 h-16 mx-auto bg-stone-100 rounded-full flex items-center justify-center mb-4">
            <WifiOff className="w-8 h-8 text-stone-400" />
          </div>
          <h2 className="text-lg font-semibold text-stone-800">Invalid WiFi Data</h2>
        </div>
      </div>
    );
  }

  const getSecurityColor = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'WPA':
      case 'WPA2':
      case 'WPA3':
        return 'bg-green-100 text-green-700';
      case 'WEP':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-stone-100 text-stone-600';
    }
  };

  return (
    <div className="min-h-screen bg-cyan-600 flex flex-col">
      {/* Header */}
      <div className="p-6 text-center flex-shrink-0">
        <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
          <Wifi className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-white">WiFi Network</h1>
        <p className="text-white/80 text-sm mt-1">Connect to join</p>
      </div>

      {/* Content Card */}
      <div className="flex-1 px-4 pb-4 flex flex-col min-h-0">
        <div className="bg-white rounded-2xl flex-1 flex flex-col overflow-hidden">
          <div className="p-4 space-y-3 flex-1 overflow-auto">
            {/* Network Name */}
            <div className="bg-stone-50 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Wifi className="w-5 h-5 text-cyan-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-stone-500 font-medium">Network</p>
                  <p className="text-stone-900 font-semibold truncate">{wifi.ssid}</p>
                </div>
                <button 
                  onClick={() => onCopy(wifi.ssid, 'ssid')}
                  className="p-2 hover:bg-stone-200 rounded-full transition-colors"
                >
                  {copied === 'ssid' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-stone-400" />}
                </button>
              </div>
            </div>

            {/* Password */}
            <div className="bg-stone-50 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-stone-500 font-medium">Password</p>
                  {wifi.password ? (
                    <p className="text-stone-900 font-mono font-semibold truncate">
                      {showPassword ? wifi.password : '••••••••'}
                    </p>
                  ) : (
                    <p className="text-stone-400 italic text-sm">No password</p>
                  )}
                </div>
                {wifi.password && (
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 hover:bg-stone-200 rounded-full transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-stone-400" /> : <Eye className="w-4 h-4 text-stone-400" />}
                    </button>
                    <button 
                      onClick={() => onCopy(wifi.password, 'wifipass')}
                      className="p-2 hover:bg-stone-200 rounded-full transition-colors"
                    >
                      {copied === 'wifipass' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-stone-400" />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Security */}
            <div className="bg-stone-50 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-stone-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-stone-500 font-medium">Security</p>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${getSecurityColor(wifi.type)}`}>
                    {wifi.type || 'Open'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 flex-shrink-0 border-t border-stone-100">
            <div className="bg-cyan-50 rounded-xl p-3 text-center">
              <p className="text-cyan-800 text-sm">
                Open <strong>WiFi Settings</strong> to connect
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
