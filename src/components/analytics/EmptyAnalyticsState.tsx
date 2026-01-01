import React from 'react';
import { Card, Button, Empty } from 'antd';
import { BarChart3, QrCode, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyAnalyticsStateProps {
  onSwitchToDemo?: () => void;
}

const EmptyAnalyticsState: React.FC<EmptyAnalyticsStateProps> = ({ onSwitchToDemo }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-2xl w-full glass-card">
        <Empty
          image={
            <div className="flex justify-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <BarChart3 size={32} className="text-primary" />
              </div>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse" style={{ animationDelay: '0.2s' }}>
                <QrCode size={32} className="text-primary" />
              </div>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse" style={{ animationDelay: '0.4s' }}>
                <TrendingUp size={32} className="text-primary" />
              </div>
            </div>
          }
          description={
            <div className="text-center space-y-4 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-foreground">
                No Analytics Data Yet
              </h3>
              <p className="text-muted-foreground">
                Start collecting analytics by creating your first QR code and sharing it with your audience. 
                Once people scan your QR codes, you'll see detailed insights here.
              </p>
              
              <div className="pt-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    type="primary" 
                    size="large"
                    onClick={() => navigate('/create')}
                    className="gradient-button"
                  >
                    Create Your First QR
                  </Button>
                  {onSwitchToDemo && (
                    <Button 
                      size="large"
                      icon={<BarChart3 size={18} />}
                      onClick={onSwitchToDemo}
                    >
                      View Demo Analytics
                    </Button>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground pt-2">
                  💡 Tip: Share your QR codes on social media, print materials, or websites to start gathering data
                </p>
              </div>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default EmptyAnalyticsState;
