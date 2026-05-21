'use client';

import { HiPhone } from 'react-icons/hi';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { contactStripData } from '@/data/siteData';

export default function ContactStrip() {
  return (
    <section className="bg-[#FFFDF9] py-14 lg:py-16" id="about">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-14 items-start">
          {/* Phone */}
          <AnimateOnScroll delay={0}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#FFB800] flex items-center justify-center flex-shrink-0">
                <HiPhone className="text-[#0C0C0C] text-lg" />
              </div>
              <div>
                <p
                  className="text-[#888] text-[10px] uppercase tracking-[0.2em] mb-1"
                  
                >
                  {contactStripData.phoneLabel}
                </p>
                <a
                  href={`tel:${contactStripData.phone.replace(/\s/g, '')}`}
                  className="text-[#0C0C0C] text-xl lg:text-2xl font-bold hover:text-[#FFB800] transition-colors"
                  
                >
                  {contactStripData.phone}
                </a>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Intro */}
          <AnimateOnScroll delay={0.15}>
            <p className="text-[#555] text-[14px] leading-relaxed">
              {contactStripData.intro}
            </p>
          </AnimateOnScroll>

          {/* Description */}
          <AnimateOnScroll delay={0.3}>
            <p className="text-[#555] text-[14px] leading-relaxed">
              {contactStripData.description}
            </p>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
