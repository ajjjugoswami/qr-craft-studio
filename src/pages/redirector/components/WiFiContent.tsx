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
      <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full overflow-hidden p-8 text-center">
          <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <WifiOff className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Invalid WiFi Data</h2>
          <p className="text-gray-500">Unable to parse WiFi network information</p>
        </div>
      </div>
    );
  }

  const getSecurityBadge = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'WPA':
      case 'WPA2':
      case 'WPA3':
        return { label: type.toUpperCase(), color: 'bg-green-100 text-green-700' };
      case 'WEP':
        return { label: 'WEP', color: 'bg-yellow-100 text-yellow-700' };
      default:
        return { label: 'Open', color: 'bg-gray-100 text-gray-600' };
    }
  };

  const security = getSecurityBadge(wifi.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-8 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full" />
          
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Wifi className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">WiFi Network</h2>
            <p className="text-white/80 text-sm mt-1">Connect to join the network</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Network Name */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Wifi className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Network Name</p>
                <p className="text-lg font-bold text-gray-800 truncate">{wifi.ssid}</p>
              </div>
              <button 
                onClick={() => onCopy(wifi.ssid, 'ssid')}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                {copied === 'ssid' ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Password</p>
                {wifi.password ? (
                  <p className="text-lg font-mono font-bold text-gray-800">
                    {showPassword ? wifi.password : '••••••••'}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">No password required</p>
                )}
              </div>
              {wifi.password && (
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <button 
                    onClick={() => onCopy(wifi.password, 'wifipass')}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    {copied === 'wifipass' ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Security Type */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Security</p>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${security.color}`}>
                  {security.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <div className="bg-blue-50 rounded-2xl p-4 text-center">
            <p className="text-blue-800 text-sm">
              Open your device's <strong>WiFi Settings</strong> and connect using the credentials above
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
