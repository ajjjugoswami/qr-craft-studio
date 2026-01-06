import { Crown, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const TrialBanner = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-14 left-0 right-0 z-40 transition-all duration-200  shadow-sm py-2 sm:py-3 px-4 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md border-border' 
        : 'bg-primary/5 border-primary/30'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          {/* Left Content */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            {/* <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full"> */}
              <span className="font-semibold text-xs sm:text-sm text-primary">FREE TRIAL</span>
            {/* </div> */}
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">3 months premium access</span>
            </div>
          </div>

          {/* Features Only */}
          <div className="flex items-center gap-3 sm:gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-current text-primary" />
              <span className="text-xs">Unlimited codes</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-current text-primary" />
              <span className="text-xs">Analytics</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <Star className="w-3 h-3 fill-current text-primary" />
              <span className="text-xs">No watermark</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialBanner;