'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { HiArrowRight, HiPhone } from 'react-icons/hi';
import { heroData, phoneNumber } from '@/data/siteData';

const backgroundImages = [
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1920&h=1080&fit=crop"
];

export default function HeroSection() {
  const [currentBg, setCurrentBg] = useState(0);
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Parallax effect on scroll
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }, sectionRef);

    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    
    return () => {
      clearInterval(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-[#0C0C0C]">
      {/* Background carousel */}
      <div ref={bgRef} className="absolute inset-[-20%] w-[140%] h-[140%]">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentBg}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={backgroundImages[currentBg]}
              alt="Construction site background"
              fill
              className="object-cover opacity-[0.2] dark:opacity-[0.65]"
              priority
            />
          </motion.div>
        </AnimatePresence>
        {/* Gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent dark:from-[#0C0C0C]/95 dark:via-[#0C0C0C]/60 dark:to-[#0C0C0C]/20" />
      </div>

      {/* Content */}
      <div className="relative container-custom pt-24 pb-16 lg:pt-32 lg:pb-20 z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div className="max-w-xl z-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3 mb-2"
            >
            <div className="w-10 h-[3px] bg-[#FFB800]" />
            <span
              className="text-[#FFB800] text-[11px] tracking-[0.25em] uppercase font-semibold"
            >
              Since 2001
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold leading-[1.08] mb-3 text-gray-900 dark:text-white drop-shadow-xl tracking-tight"
          >
            Comprehensive{' '}
            <span className="text-[#FFB800]">Construction</span>{' '}
            <span className="text-[#FFB800]">Solutions</span> for All
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-gray-700 dark:text-white/80 text-[15px] lg:text-[16px] leading-relaxed mb-5 max-w-lg drop-shadow-md"
          >
            {heroData.subtext}
          </motion.p>

          {/* Phone callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-10 h-10 bg-[#FFB800] rounded-full flex items-center justify-center">
              <HiPhone className="text-[#0C0C0C] text-md" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-white/70 text-[10px] uppercase tracking-[0.2em]">
                Call Us Anytime
              </p>
              <a
                href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                className="text-gray-900 dark:text-white text-xl font-bold hover:text-[#FFB800] transition-colors"
              >
                {phoneNumber}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex items-center gap-4 flex-wrap"
          >
            <a href="#services" className="btn-primary">
              {heroData.cta}
              <HiArrowRight />
            </a>
            <a href="#projects" className="btn-outline !text-gray-900 !border-gray-300 hover:!bg-gray-100 dark:!text-white dark:!border-white/30 dark:hover:!bg-white/5">
              VIEW PROJECTS
            </a>
          </motion.div>

          {/* Slider dots mapped to images */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-2 mt-8"
          >
            {backgroundImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBg(i)}
                className={`h-[4px] transition-all duration-300 ${
                  currentBg === i ? 'w-10 bg-[#FFB800]' : 'w-4 bg-gray-300 hover:bg-gray-400 dark:bg-white/30 dark:hover:bg-white/60'
                } rounded-full`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom massive convex curve (less curved, with yellow border) */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] z-20 translate-y-[1px]">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[35px] sm:h-[50px] lg:h-[70px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          {/* Main light background fill */}
          <path
            d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z"
            fill="currentColor"
            className="text-[#FFFDF9] dark:text-[#111111]"
          />
          {/* Yellow top stroke only */}
          <path
            d="M0,0 C300,120 900,120 1200,0"
            fill="none"
            stroke="#FFB800"
            strokeWidth="4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </section>
  );
}
