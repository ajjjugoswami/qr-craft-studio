import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

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

    const timer = setTimeout(() => {
      nprogress.done();
    }, 200); 

    return () => {
      clearTimeout(timer);
      nprogress.done();
    };
  }, [location.pathname]);

  return null;
};

export default RouteChangeListener;