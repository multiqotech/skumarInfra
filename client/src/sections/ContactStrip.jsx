'use client';

import { HiPhone } from 'react-icons/hi';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { contactStripData } from '@/data/siteData';

export default function ContactStrip() {
  return (
    <section className="bg-[#f0f4f8] py-14 lg:py-16 border-y border-[#183964]/5" id="about">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-14 items-start">

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
