'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AnimateOnScroll from '@/components/AnimateOnScroll';

export default function BoardDirectorSection() {
  const [directors, setDirectors] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/board-directors`)
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setDirectors(data);
        }
      })
      .catch((err) => {
        console.log('Board directors server offline or empty');
      });
  }, []);

  if (directors.length === 0) return null; // Don't render if no directors

  return (
    <section className="relative bg-white py-14 lg:py-20 overflow-hidden">
      {/* Large watermark text */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none select-none">
        <span className="text-[100px] sm:text-[130px] lg:text-[180px] xl:text-[220px] font-bold text-black/[0.02] uppercase tracking-[0.15em]">
          LEADERSHIP
        </span>
      </div>

      <div className="relative container-custom">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <AnimateOnScroll>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-[3px] bg-[#f36c21]" />
              <span className="text-[#f36c21] text-[11px] tracking-[0.25em] uppercase font-semibold">
                Visionaries
              </span>
            </div>
            <h2 className="text-[#183964] text-2xl md:text-3xl lg:text-4xl font-bold">
              Board of Directors
            </h2>
          </AnimateOnScroll>
        </div>

        {/* Director Cards - Full Width List */}
        <div className="flex flex-col gap-8">
          {directors.map((director, index) => (
            <AnimateOnScroll key={director._id || index} delay={index * 0.1}>
              <div className="group relative overflow-hidden bg-[#f7f9fc] border border-[#183964]/5 rounded-2xl hover:border-[#f36c21]/30 hover:shadow-[0_10px_40px_rgba(24,57,100,0.06)] transition-all duration-500 flex flex-col md:flex-row">
                
                {/* Left Side: Image, Name, Designation */}
                <div className="w-full md:w-[350px] flex-shrink-0 bg-white border-r border-[#183964]/5 flex flex-col items-center justify-center p-8">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-[#183964]/10 group-hover:border-[#f36c21] transition-colors duration-500 mb-6">
                    <Image
                      src={director.image}
                      alt={director.name}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      unoptimized={true}
                    />
                  </div>
                  <h3 className="text-[#183964] text-xl font-bold text-center mb-1">
                    {director.name}
                  </h3>
                  <p className="text-[#f36c21] text-sm uppercase tracking-[0.12em] text-center font-medium">
                    {director.designation}
                  </p>
                </div>

                {/* Right Side: Description */}
                <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                  <div className="w-12 h-[3px] bg-[#f36c21] mb-6" />
                  <p className="text-[#4b5563] text-sm md:text-base leading-relaxed whitespace-pre-line">
                    {director.description || "No description provided."}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
