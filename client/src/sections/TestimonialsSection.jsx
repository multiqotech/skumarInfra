'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HiStar, HiArrowRight } from 'react-icons/hi';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { testimonialsData } from '@/data/siteData';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(testimonialsData); // Default fallback data

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`)
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        // Fall back to dummy data if DB collection is empty
        if (data && data.length > 0) {
          setTestimonials(data);
        }
      })
      .catch((err) => {
        console.log('Testimonials server offline, using fallback dummy data');
      });
  }, []);

  return (
    <section className="bg-white dark:bg-[#0C0C0C] py-14 lg:py-24" id="testimonials">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <AnimateOnScroll>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-[3px] bg-[#FFB800]" />
              <span
                className="text-[#FFB800] text-[11px] tracking-[0.25em] uppercase font-semibold"
                
              >
                Testimonials
              </span>
            </div>
            <h2
              className="text-gray-900 dark:text-white text-2xl md:text-3xl lg:text-4xl font-bold"
              
            >
              Public Cheers For Us!
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.2}>
            <a
              href="#"
              className="hidden md:inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.15em] text-gray-900 dark:text-white hover:text-[#FFB800] dark:hover:text-[#FFB800] transition-colors border-2 border-gray-900 dark:border-white rounded-lg hover:border-[#FFB800] dark:hover:border-[#FFB800] px-6 py-3"
              
            >
              View All Testimonials <HiArrowRight size={14} />
            </a>
          </AnimateOnScroll>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <AnimateOnScroll key={index} delay={index * 0.08}>
              <div className="bg-gray-50 dark:bg-[#161616] rounded-2xl p-8 border border-gray-200 dark:border-[#2A2A2A] hover:border-[#FFB800]/30 dark:hover:border-[#FFB800]/30 shadow-sm dark:shadow-none hover:shadow-[0_8px_30px_rgba(255,184,0,0.1)] transition-all duration-500 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {[...Array(t.rating)].map((_, i) => (
                    <HiStar key={i} className="text-[#FFB800] text-[16px]" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-600 dark:text-gray-300 text-[14px] leading-relaxed mb-8 italic flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 mt-auto">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#FFB800]/20">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="object-cover"
                      unoptimized={true} // Allow external Unsplash URLs pasted by admin
                    />
                  </div>
                  <div>
                    <h4
                      className="text-gray-900 dark:text-white text-[15px] font-bold"
                      
                    >
                      {t.name}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-[12px] mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
