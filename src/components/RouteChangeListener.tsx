import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

nprogress.configure({
  showSpinner: false,
  trickleSpeed: 100,
  minimum: 0.1,
  easing: 'ease-out',
  speed: 300,
});

const RouteChangeListener = () => {
  const location = useLocation();
  const isFirstMount = useRef(true);

  useEffect(() => {
    // Skip progress bar on initial mount
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    nprogress.start();

    // Use requestAnimationFrame to wait for next paint, then idle callback
    const rafId = requestAnimationFrame(() => {
      // Minimum display time of 150ms for visual feedback
      const minDisplayTimer = setTimeout(() => {
        // Use requestIdleCallback if available, otherwise setTimeout
        if ('requestIdleCallback' in window) {
          const idleId = window.requestIdleCallback(
            () => nprogress.done(),
            { timeout: 500 }
          );
          // Store for potential cleanup
          (window as any).__nprogressIdleId = idleId;
        } else {
          nprogress.done();
        }
      }, 150);

      (window as any).__nprogressTimer = minDisplayTimer;
    });

    return () => {
      cancelAnimationFrame(rafId);
      if ((window as any).__nprogressTimer) {
        clearTimeout((window as any).__nprogressTimer);
      }
      if ('cancelIdleCallback' in window && (window as any).__nprogressIdleId) {
        window.cancelIdleCallback((window as any).__nprogressIdleId);
      }
      nprogress.done();
    };
  }, [location.pathname]);

  return null;
};

export default RouteChangeListener;