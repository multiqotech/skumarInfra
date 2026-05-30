'use client';

import AnimateOnScroll from '@/components/AnimateOnScroll';
import { verticalsData } from '@/data/siteData';
import {
  FaRoad,
  FaArchway,
  FaWater,
  FaBuilding,
  FaTint,
  FaIndustry,
  FaSolarPanel,
  FaLandmark,
} from 'react-icons/fa';

const iconMap = {
  road: FaRoad,
  bridge: FaArchway,
  water: FaWater,
  building: FaBuilding,
  dam: FaTint,
  industry: FaIndustry,
  solar: FaSolarPanel,
  government: FaLandmark,
};

export default function VerticalsSection() {
  return (
    <section className="bg-white dark:bg-[#09090B] py-14 lg:py-20" id="verticals">
      <div className="container-custom">
        {/* Header */}
        <AnimateOnScroll className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-[2px] bg-[#FFB800]" />
            <span
              className="text-[#FFB800] text-[11px] tracking-[0.25em] uppercase font-semibold"
              
            >
              Our Verticals
            </span>
            <div className="w-8 h-[2px] bg-[#FFB800]" />
          </div>
          <h2
            className="text-zinc-900 dark:text-white text-2xl md:text-3xl lg:text-4xl font-bold max-w-2xl mx-auto mb-3 leading-tight"
            
          >
            Industries We <span className="text-[#FFB800]">Serve</span>
          </h2>
          <p className="text-zinc-600 dark:text-white/45 text-[14px] max-w-xl mx-auto">
            From roads to renewable energy, we deliver excellence across every construction vertical.
          </p>
        </AnimateOnScroll>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {verticalsData.map((vertical, index) => {
            const Icon = iconMap[vertical.icon] || FaBuilding;
            return (
              <AnimateOnScroll key={index} delay={index * 0.07}>
                <div className="group bg-[#FAFAFA] dark:bg-[#18181B] border border-black/5 dark:border-white/10 rounded-2xl p-6 hover:border-[#FFB800]/30 dark:hover:border-[#FFB800]/30 hover:bg-zinc-100 dark:hover:bg-[#18181B] transition-all duration-500 cursor-pointer h-full">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-[#FFB800]/10 border border-[#FFB800]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#FFB800] transition-all duration-500">
                    <Icon className="text-[#FFB800] text-lg group-hover:text-[#09090B] transition-colors duration-500" />
                  </div>

                  <h3
                    className="text-zinc-900 dark:text-white text-[15px] font-bold mb-2 group-hover:text-[#FFB800] dark:group-hover:text-[#FFB800] transition-colors duration-300"
                    
                  >
                    {vertical.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-white/40 text-[13px] leading-relaxed">
                    {vertical.description}
                  </p>

                  <div className="mt-4 w-0 h-[2px] bg-[#FFB800] group-hover:w-10 transition-all duration-500" />
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
