'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { servicesData } from '@/data/siteData';

export default function ServicesCards() {
  return (
    <section className="bg-[#f7f9fc] pb-14 lg:pb-24 pt-4" id="services">
      <div className="container-custom">
        {/* Heading */}
        <AnimateOnScroll className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-[2px] bg-[#f36c21]" />
            <span className="text-[#f36c21] text-[11px] tracking-[0.25em] uppercase font-semibold">
              Our Expertise
            </span>
            <div className="w-8 h-[2px] bg-[#f36c21]" />
          </div>
          <h2 className="text-[#183964] text-2xl md:text-3xl lg:text-4xl font-bold max-w-2xl mx-auto leading-tight">
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
                    ? 'bg-[#183964] text-white shadow-[0_20px_50px_rgba(24,57,100,0.2)] z-10 border border-transparent'
                    : 'bg-white text-[#183964] border border-[#183964]/10 hover:shadow-[0_20px_40px_rgba(24,57,100,0.08)] hover:border-[#f36c21]/30'
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#183964] via-[#183964]/40 to-transparent" />
                  )}
                  {/* Orange accent on featured */}
                  {service.featured && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#f36c21]" />
                  )}
                </div>

                {/* Content */}
                <div className="p-7 flex-1 flex flex-col">
                  <div className="w-8 h-[3px] bg-[#f36c21] mb-4" />
                  <h3 className="text-xl font-bold mb-3">
                    {service.title}
                  </h3>
                  <p
                    className={`text-[14px] leading-relaxed mb-5 flex-1 ${
                      service.featured ? 'text-white/80' : 'text-[#4b5563]'
                    }`}
                  >
                    {service.description}
                  </p>
                </div>
              </motion.div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
