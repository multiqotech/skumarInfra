'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CareerHero() {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-elem', 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop" 
          alt="Construction Site" 
          className="w-full h-full object-cover"
        />
        {/* Light overlay for text readability without blurring the image */}
        <div className="absolute inset-0 bg-white/60" />
        {/* Fade to background color at the very bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f7f9fc] to-transparent" />
      </div>

      <div className="container-custom relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="hero-elem inline-block px-4 py-1.5 bg-[#f36c21]/20 text-[#f36c21] border border-[#f36c21]/30 rounded-full text-sm font-semibold tracking-wider uppercase backdrop-blur-sm shadow-sm">
            Join Our Team
          </span>
          <h1 className="hero-elem text-5xl md:text-7xl font-bold text-[#183964] tracking-tight drop-shadow-md" style={{ fontFamily: 'var(--font-heading)' }}>
            Build <span className="text-[#f36c21]">Landmark</span> <br className="hidden md:block"/> Infrastructure With Us
          </h1>
          <p className="hero-elem text-lg md:text-xl text-[#4b5563] max-w-2xl mx-auto leading-relaxed font-medium">
            We are looking for passionate engineers, architects, and professionals to shape the future of construction. Discover opportunities to grow and make an impact.
          </p>
          <div className="hero-elem pt-8">
            <a href="#jobs" className="btn-primary shadow-[0_10px_30px_rgba(243,108,33,0.3)]">
              View Open Positions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
