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
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0C]/90 via-[#0C0C0C]/70 to-[#0C0C0C]" />
      </div>

      <div className="container-custom relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="hero-elem inline-block px-4 py-1.5 bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/30 rounded-full text-sm font-semibold tracking-wider uppercase backdrop-blur-sm">
            Join Our Team
          </span>
          <h1 className="hero-elem text-5xl md:text-7xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Build <span className="text-[#FFB800]">Landmark</span> <br className="hidden md:block"/> Infrastructure With Us
          </h1>
          <p className="hero-elem text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We are looking for passionate engineers, architects, and professionals to shape the future of construction. Discover opportunities to grow and make an impact.
          </p>
          <div className="hero-elem pt-8">
            <a href="#jobs" className="btn-primary">
              View Open Positions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
