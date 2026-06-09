'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HiStar, HiArrowRight } from 'react-icons/hi';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { testimonialsData } from '@/data/siteData';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(testimonialsData);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`)
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setTestimonials(data);
        }
      })
      .catch((err) => {
        console.log('Testimonials server offline, using fallback dummy data');
      });
  }, []);

  return (
    <section className="bg-[#f0f4f8] py-14 lg:py-24 border-y border-[#183964]/5" id="testimonials">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <AnimateOnScroll>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-[3px] bg-[#f36c21]" />
              <span className="text-[#f36c21] text-[11px] tracking-[0.25em] uppercase font-semibold">
                Testimonials
              </span>
            </div>
            <h2 className="text-[#183964] text-2xl md:text-3xl lg:text-4xl font-bold">
              Public Cheers For Us!
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.2}>
            <a
              href="#"
              className="hidden md:inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.15em] text-[#183964] hover:text-white transition-colors border-2 border-[#183964] rounded-lg hover:bg-[#183964] px-6 py-3"
            >
              View All Testimonials <HiArrowRight size={14} />
            </a>
          </AnimateOnScroll>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <AnimateOnScroll key={index} delay={index * 0.08}>
              <div className="bg-white rounded-2xl p-8 border border-[#183964]/5 hover:border-[#f36c21]/30 shadow-sm hover:shadow-[0_10px_30px_rgba(24,57,100,0.06)] transition-all duration-500 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {[...Array(t.rating)].map((_, i) => (
                    <HiStar key={i} className="text-[#f36c21] text-[16px]" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-[#4b5563] text-[14px] leading-relaxed mb-8 italic flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-[#183964]/5">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#f36c21]/20">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="object-cover"
                      unoptimized={true} // Allow external Unsplash URLs pasted by admin
                    />
                  </div>
                  <div>
                    <h4 className="text-[#183964] text-[15px] font-bold">
                      {t.name}
                    </h4>
                    <p className="text-[#6b7280] text-[12px] mt-0.5 font-medium">{t.role}</p>
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
