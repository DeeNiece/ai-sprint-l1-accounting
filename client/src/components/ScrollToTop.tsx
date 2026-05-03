import { useEffect } from "react";
import { useLocation } from "wouter";

export function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Scroll to top on every route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'smooth' if you want animated scrolling
    });
  }, [location]); // Triggers whenever the URL hash changes
  
  return null;
}
