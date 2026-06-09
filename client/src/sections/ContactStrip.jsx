'use client';

import { HiPhone } from 'react-icons/hi';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { contactStripData } from '@/data/siteData';

export default function ContactStrip() {
  return (
    <section className="bg-[#f0f4f8] py-14 lg:py-16 border-y border-[#183964]/5" id="about">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-14 items-start">
          {/* Phone */}
          <AnimateOnScroll delay={0}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#f36c21] rounded-full shadow-lg shadow-[#f36c21]/20 flex items-center justify-center flex-shrink-0">
                <HiPhone className="text-white text-lg" />
              </div>
              <div>
                <p className="text-[#6b7280] text-[10px] uppercase tracking-[0.2em] mb-1">
                  {contactStripData.phoneLabel}
                </p>
                <a
                  href={`tel:${contactStripData.phone.replace(/\s/g, '')}`}
                  className="text-[#183964] text-xl lg:text-2xl font-bold hover:text-[#f36c21] transition-colors"
                >
                  {contactStripData.phone}
                </a>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Intro */}
          <AnimateOnScroll delay={0.15}>
            <p className="text-[#4b5563] text-[14px] leading-relaxed">
              {contactStripData.intro}
            </p>
          </AnimateOnScroll>

          {/* Description */}
          <AnimateOnScroll delay={0.3}>
            <p className="text-[#4b5563] text-[14px] leading-relaxed">
              {contactStripData.description}
            </p>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
