'use client';

import Image from 'next/image';
import { HiArrowRight } from 'react-icons/hi';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { whyChooseUsData } from '@/data/siteData';

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="grid lg:grid-cols-2 min-h-[550px]">
        {/* Left - Content */}
        <div className="flex items-center py-14 lg:py-20 px-6 lg:px-14 xl:px-20 bg-[#f7f9fc]">
          <AnimateOnScroll>
            <div className="max-w-md">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-[3px] bg-[#f36c21]" />
                <span className="text-[#f36c21] text-[11px] tracking-[0.25em] uppercase font-semibold">
                  Our Advantage
                </span>
              </div>

              <h2 className="text-[#183964] text-3xl lg:text-4xl font-bold mb-5">
                Why choose us?
              </h2>

              <p className="text-[#4b5563] text-[14px] leading-relaxed mb-8">
                {whyChooseUsData.description}
              </p>

              {/* Stats row */}
              <div className="flex gap-6 mb-8">
                {whyChooseUsData.stats.map((stat, i) => (
                  <div key={i} className="text-center bg-white border border-[#183964]/5 px-4 py-3 rounded-lg shadow-sm flex-1">
                    <div className="text-[#f36c21] text-2xl lg:text-3xl font-bold">
                      {stat.value}
                    </div>
                    <div className="text-[#183964] text-[10px] uppercase tracking-[0.15em] mt-1 font-semibold">
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
        <div className="relative min-h-[400px] lg:min-h-full lg:p-10 flex items-center">
          <div className="relative w-full h-full min-h-[350px] lg:min-h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-[#183964]/5">
            <Image
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&h=700&fit=crop"
              alt="Engineer working on site"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
          </div>
          {/* Badge */}
          <div className="absolute bottom-4 left-4 lg:bottom-16 lg:-left-6 bg-[#f36c21] text-white p-6 lg:p-8 rounded-2xl shadow-xl z-10 max-w-[200px] border-4 border-white">
            <div className="text-white text-4xl font-bold mb-1">
              25+
            </div>
            <div className="text-white/90 text-[11px] font-bold uppercase tracking-[0.15em] leading-tight">
              Years of Excellence
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
