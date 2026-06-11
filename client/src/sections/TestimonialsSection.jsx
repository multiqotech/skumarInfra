'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { HiStar } from 'react-icons/hi';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { testimonialsData } from '@/data/siteData';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(testimonialsData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 640) setItemsPerView(2);
      else setItemsPerView(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  const goNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, [maxIndex, isTransitioning]);

  const goPrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, [maxIndex, isTransitioning]);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  const totalDots = maxIndex + 1;

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

          {/* Navigation Arrows */}
          <AnimateOnScroll delay={0.2}>
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={goPrev}
                className="w-11 h-11 rounded-full border-2 border-[#183964]/20 flex items-center justify-center text-[#183964] hover:bg-[#183964] hover:text-white hover:border-[#183964] transition-all duration-300"
                aria-label="Previous testimonial"
              >
                <HiChevronLeft size={20} />
              </button>
              <button
                onClick={goNext}
                className="w-11 h-11 rounded-full border-2 border-[#183964]/20 flex items-center justify-center text-[#183964] hover:bg-[#f36c21] hover:text-white hover:border-[#f36c21] transition-all duration-300"
                aria-label="Next testimonial"
              >
                <HiChevronRight size={20} />
              </button>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {testimonials.map((t, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-3"
                style={{ width: `${100 / itemsPerView}%` }}
              >
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
                        unoptimized={true}
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
              </div>
            ))}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: totalDots }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsTransitioning(true);
                setCurrentIndex(i);
                setTimeout(() => setIsTransitioning(false), 500);
              }}
              className={`h-[4px] rounded-full transition-all duration-300 ${
                currentIndex === i
                  ? 'w-10 bg-[#f36c21]'
                  : 'w-4 bg-[#183964]/20 hover:bg-[#183964]/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Mobile arrows */}
        <div className="flex md:hidden items-center justify-center gap-3 mt-6">
          <button
            onClick={goPrev}
            className="w-11 h-11 rounded-full border-2 border-[#183964]/20 flex items-center justify-center text-[#183964] hover:bg-[#183964] hover:text-white hover:border-[#183964] transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <HiChevronLeft size={20} />
          </button>
          <button
            onClick={goNext}
            className="w-11 h-11 rounded-full border-2 border-[#f36c21]/20 flex items-center justify-center text-[#183964] hover:bg-[#f36c21] hover:text-white hover:border-[#f36c21] transition-all duration-300"
            aria-label="Next testimonial"
          >
            <HiChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
