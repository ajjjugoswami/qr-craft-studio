import React from 'react';
import { Wifi, WifiOff, Lock, Building, Copy, Check } from 'lucide-react';
import { parseWiFi } from '../utils/contentParsers';

interface WiFiContentProps {
  content: string;
  copied: string | null;
  onCopy: (text: string, field: string) => void;
}

export const WiFiContent: React.FC<WiFiContentProps> = ({ content, copied, onCopy }) => {
  const wifi = parseWiFi(content);
  
  if (!wifi) {
    return (
      <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
        <WifiOff className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Invalid WiFi data</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="bg-primary/10 p-6 text-center">
        <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
          <Wifi className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">WiFi Network</h2>
        <p className="text-sm text-muted-foreground mt-1">Connect to this network</p>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Wifi className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Network Name (SSID)</p>
            <p className="text-foreground font-medium">{wifi.ssid}</p>
          </div>
          <button onClick={() => onCopy(wifi.ssid, 'ssid')} className="p-1 hover:bg-muted rounded">
            {copied === 'ssid' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
          </button>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Lock className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Password</p>
            <p className="text-foreground font-medium font-mono">{wifi.password || '(No password)'}</p>
          </div>
          {wifi.password && (
            <button onClick={() => onCopy(wifi.password, 'wifipass')} className="p-1 hover:bg-muted rounded">
              {copied === 'wifipass' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Building className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Security Type</p>
            <p className="text-foreground font-medium">{wifi.type || 'Open'}</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">Open your WiFi settings and connect manually using the credentials above</p>
      </div>
    </div>
  );
};
