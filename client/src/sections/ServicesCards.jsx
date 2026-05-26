'use client';

import Image from 'next/image';
import { HiArrowRight } from 'react-icons/hi';
import { motion } from 'framer-motion';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { servicesData } from '@/data/siteData';

export default function ServicesCards() {
  return (
    <section className="bg-[#FFFDF9] dark:bg-[#111111] pb-14 lg:pb-24 pt-4" id="services">
      <div className="container-custom">
        {/* Heading */}
        <AnimateOnScroll className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-[2px] bg-[#FFB800]" />
            <span
              className="text-[#FFB800] text-[11px] tracking-[0.25em] uppercase font-semibold"
              
            >
              Our Expertise
            </span>
            <div className="w-8 h-[2px] bg-[#FFB800]" />
          </div>
          <h2
            className="text-[#0C0C0C] dark:text-white text-2xl md:text-3xl lg:text-4xl font-bold max-w-2xl mx-auto leading-tight"
            
          >
            We Assist in Choosing the Perfect Materials for Your Project
          </h2>
        </AnimateOnScroll>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {servicesData.map((service, index) => (
            <AnimateOnScroll key={index} delay={index * 0.15}>
              <motion.div
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 h-full flex flex-col ${
                  service.featured
                    ? 'bg-[#0C0C0C] text-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 border border-transparent dark:border-[#FFB800]/30'
                    : 'bg-[#FDFCF8] dark:bg-[#161616] text-[#0C0C0C] dark:text-white border border-[#EAEAEA] dark:border-[#2A2A2A] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:border-[#FFB800]/30 dark:hover:border-[#FFB800]/30'
                }`}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {service.featured && (
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/40 to-transparent" />
                  )}
                  {/* Yellow accent on featured */}
                  {service.featured && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#FFB800]" />
                  )}
                </div>

                {/* Content */}
                <div className="p-7">
                  <div className="w-8 h-[3px] bg-[#FFB800] mb-4" />
                  <h3
                    className="text-xl font-bold mb-3"
                    
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed mb-5 ${
                      service.featured ? 'text-white/60' : 'text-[#666] dark:text-gray-400'
                    }`}
                  >
                    {service.description}
                  </p>
                  <button
                    className={`inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.15em] transition-colors duration-300 ${
                      service.featured
                        ? 'text-[#FFB800] hover:text-[#FFC933]'
                        : 'text-[#0C0C0C] dark:text-gray-300 hover:text-[#FFB800] dark:hover:text-[#FFB800]'
                    }`}
                    
                  >
                    View More
                    <HiArrowRight className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
