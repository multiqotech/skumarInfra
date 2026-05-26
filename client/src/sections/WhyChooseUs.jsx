'use client';

import Image from 'next/image';
import { HiArrowRight } from 'react-icons/hi';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { whyChooseUsData } from '@/data/siteData';

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[550px]">
        {/* Left - Dark Content */}
        <div className="bg-gray-50 dark:bg-[#0C0C0C] flex items-center py-14 lg:py-20 px-6 lg:px-14 xl:px-20">
          <AnimateOnScroll>
            <div className="max-w-md">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-[3px] bg-[#FFB800]" />
                <span
                  className="text-[#FFB800] text-[11px] tracking-[0.25em] uppercase font-semibold"
                  
                >
                  Our Advantage
                </span>
              </div>

              <h2
                className="text-gray-900 dark:text-white text-3xl lg:text-4xl font-bold mb-5"
                
              >
                Why choose us?
              </h2>

              <p className="text-gray-600 dark:text-white/50 text-[14px] leading-relaxed mb-8">
                {whyChooseUsData.description}
              </p>

              {/* Stats row */}
              <div className="flex gap-6 mb-8">
                {whyChooseUsData.stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div
                      className="text-[#FFB800] text-2xl lg:text-3xl font-bold"
                      
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-gray-500 dark:text-white/40 text-[10px] uppercase tracking-[0.15em] mt-1"
                      
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <a href="#contact" className="btn-primary">
                GET STARTED <HiArrowRight />
              </a>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Right - Image */}
        <div className="relative min-h-[400px] lg:min-h-full lg:p-10 flex items-center bg-gray-50 dark:bg-[#0C0C0C]">
          <div className="relative w-full h-full min-h-[350px] lg:min-h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&h=700&fit=crop"
              alt="Engineer working on site"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50/40 dark:from-[#0C0C0C]/40 to-transparent" />
          </div>
          {/* Yellow badge */}
          <div className="absolute bottom-4 left-4 lg:bottom-16 lg:-left-6 bg-[#FFB800] p-6 lg:p-8 rounded-2xl shadow-xl z-10 max-w-[200px]">
            <div
              className="text-[#0C0C0C] text-4xl font-bold mb-1"
              
            >
              25+
            </div>
            <div
              className="text-[#0C0C0C]/80 text-[11px] font-bold uppercase tracking-[0.15em] leading-tight"
              
            >
              Years of Excellence
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
