import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure nprogress
nprogress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
  easing: 'ease',
  speed: 500,
});

const RouteChangeListener = () => {
  const location = useLocation();

  useEffect(() => {
    nprogress.start();

    // Simulate a delay or wait for actual loading
    const timer = setTimeout(() => {
      nprogress.done();
    }, 300); // Adjust delay as needed

    return () => {
      clearTimeout(timer);
      nprogress.done();
    };
  }, [location.pathname]);

  return null;
};

export default RouteChangeListener;