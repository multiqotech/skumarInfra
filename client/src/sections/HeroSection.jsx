'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { HiArrowRight, HiPhone } from 'react-icons/hi';
import { heroData, phoneNumber } from '@/data/siteData';

const backgroundImages = [
  "https://res.cloudinary.com/dkhyb43ae/image/upload/v1786433806/svgrvqviydeunhroueod.jpg",
  "https://res.cloudinary.com/dkhyb43ae/image/upload/v1786382859/verkmuql0plwagko4c1u.jpg",
  "https://res.cloudinary.com/dkhyb43ae/image/upload/v1786382924/anuz3x3ehtg5v9pq65x9.jpg",
  "https://res.cloudinary.com/dkhyb43ae/image/upload/v1786382989/ct74izcipaju8h8an2pn.jpg"
];

export default function HeroSection() {
  const [currentBg, setCurrentBg] = useState(0);
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={sectionRef} id="home" className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden bg-white mt-[70px] lg:mt-0">
      {/* Background carousel */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={backgroundImages[currentBg]}
              alt="Construction site background"
              fill
              className="object-cover opacity-100"
              priority
            />
          </motion.div>
        </AnimatePresence>
        {/* Gradient for text readability */}
        <div className="absolute inset-0 w-full bg-gradient-to-r from-black/70 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative container-custom pt-8 pb-12 sm:pt-16 sm:pb-16 lg:pt-24 lg:pb-20 z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div className="max-w-xl z-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="w-10 h-[3px] bg-[#f36c21]" />
              <span
                className="text-[#f36c21] text-[11px] tracking-[0.25em] uppercase font-semibold"
              >
                Since 2011
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold leading-[1.0] mb-3 text-white drop-shadow-xl tracking-tight"
            >
              Comprehensive{' '}
              <span className="text-[#f36c21]">Construction</span>{' '}
              <span className="text-[#f36c21]">Solutions</span> for All
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-white/90 text-[15px] lg:text-[16px] leading-relaxed mb-5 max-w-lg drop-shadow-md"
            >
              {heroData.subtext}
            </motion.p>

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
              <a href="#projects" className="btn-outline border-white text-white hover:bg-white hover:text-[#183964]">
                VIEW PROJECTS
              </a>
            </motion.div>

            {/* Slider dots */}
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
                  className={`h-[4px] transition-all duration-300 ${currentBg === i ? 'w-10 bg-[#f36c21]' : 'w-4 bg-white/30 hover:bg-white/60'
                    } rounded-full`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom convex curve */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0] z-20 translate-y-[1px]">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[35px] sm:h-[50px] lg:h-[70px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z"
            fill="currentColor"
            className="text-white"
          />
          <path
            d="M0,0 C300,120 900,120 1200,0"
            fill="none"
            stroke="#f36c21"
            strokeWidth="4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </section>
  );
}
