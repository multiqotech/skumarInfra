'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function HashScroller() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Try to scroll multiple times to ensure we hit the right spot after images load
      const scrollToHash = () => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      };
      
      // Immediate
      scrollToHash();
      // After a short delay (e.g. DOM render)
      setTimeout(scrollToHash, 100);
      // After images likely loaded
      setTimeout(scrollToHash, 500);
      setTimeout(scrollToHash, 1000);
    }
  }, [pathname]);

  return null;
}
