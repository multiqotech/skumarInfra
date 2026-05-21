'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnimateOnScroll({
  children,
  className = '',
  animation = 'fade-up', // fade-up, fade-in, fade-left, fade-right, scale-up
  delay = 0,
  duration = 0.8,
  stagger = 0,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Default to animating the container itself
    let target = containerRef.current;
    
    // If stagger is provided, try to animate children instead
    if (stagger > 0 && containerRef.current.children.length > 0) {
      target = containerRef.current.children;
    }

    let fromVars = { opacity: 0 };
    let toVars = { 
      opacity: 1, 
      duration: duration,
      delay: delay,
      stagger: stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    };

    switch(animation) {
      case 'fade-up':
        fromVars.y = 50;
        toVars.y = 0;
        break;
      case 'fade-left':
        fromVars.x = 50;
        toVars.x = 0;
        break;
      case 'fade-right':
        fromVars.x = -50;
        toVars.x = 0;
        break;
      case 'scale-up':
        fromVars.scale = 0.9;
        toVars.scale = 1;
        break;
      default:
        // just fade-in
        break;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(target, fromVars, toVars);
    }, containerRef);

    return () => {
      ctx.revert(); // Cleanup GSAP animations
    };
  }, [animation, delay, duration, stagger]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
