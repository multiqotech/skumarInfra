'use client';

import Image from 'next/image';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { engineeringSolutions } from '@/data/siteData';

export default function EngineeringSolutions() {
  return (
    <section className="relative py-14 lg:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white dark:bg-[#0C0C0C]">
        <Image
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=600&fit=crop"
          alt="Construction background"
          fill
          className="object-cover opacity-[0.15] dark:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-[#0C0C0C] via-transparent to-white dark:to-[#0C0C0C]" />
      </div>

      <div className="relative container-custom">
        {/* Heading */}
        <AnimateOnScroll className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-[2px] bg-[#FFB800]" />
            <span
              className="text-[#FFB800] text-[11px] tracking-[0.25em] uppercase font-semibold"
              
            >
              What We Deliver
            </span>
            <div className="w-8 h-[2px] bg-[#FFB800]" />
          </div>
          <h2
            className="text-gray-900 dark:text-white text-2xl md:text-3xl lg:text-4xl font-bold max-w-2xl mx-auto leading-tight drop-shadow-sm dark:drop-shadow-lg"
            
          >
            Dependable Engineering Solutions for Your Project
          </h2>
        </AnimateOnScroll>

        {/* Cards */}
        <div className="flex flex-col gap-8">
          {engineeringSolutions.map((item, index) => (
            <AnimateOnScroll key={index} delay={index * 0.12}>
              <div
                className={`group grid md:grid-cols-2 gap-0 bg-gray-50/80 dark:bg-[#161616]/20 backdrop-blur-md border-2 border-black/5 dark:border-white/10 rounded-3xl overflow-hidden hover:border-[#FFB800]/40 dark:hover:border-[#FFB800]/40 hover:shadow-[0_0_30px_rgba(255,184,0,0.1)] dark:hover:shadow-[0_0_30px_rgba(255,184,0,0.2)] hover:bg-gray-100/80 dark:hover:bg-[#161616]/40 transition-all duration-500 ${
                  index % 2 === 1 ? 'md:[direction:rtl]' : ''
                }`}
              >
                {/* Content */}
                <div className={`p-8 lg:p-10 flex flex-col justify-center ${index % 2 === 1 ? 'md:[direction:ltr]' : ''}`}>
                  <div className="w-8 h-[3px] bg-[#FFB800] mb-4" />
                  <h3
                    className="text-gray-900 dark:text-white text-xl lg:text-2xl font-bold mb-3"
                    
                  >
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-white/50 text-[14px] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Image */}
                <div className={`relative h-56 md:h-auto min-h-[260px] ${index % 2 === 1 ? 'md:[direction:ltr]' : ''}`}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-white/20 dark:bg-[#0C0C0C]/20 group-hover:bg-transparent transition-all duration-500" />
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
