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
    <section className="bg-white py-14 lg:py-20 border-t border-[#183964]/5" id="verticals">
      <div className="container-custom">
        {/* Header */}
        <AnimateOnScroll className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-[2px] bg-[#f36c21]" />
            <span className="text-[#f36c21] text-[11px] tracking-[0.25em] uppercase font-semibold">
              Our Verticals
            </span>
            <div className="w-8 h-[2px] bg-[#f36c21]" />
          </div>
          <h2 className="text-[#183964] text-2xl md:text-3xl lg:text-4xl font-bold max-w-2xl mx-auto mb-3 leading-tight">
            Industries We <span className="text-[#f36c21]">Serve</span>
          </h2>
          <p className="text-[#4b5563] text-[14px] max-w-xl mx-auto">
            From roads to renewable energy, we deliver excellence across every construction vertical.
          </p>
        </AnimateOnScroll>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {verticalsData.map((vertical, index) => {
            const Icon = iconMap[vertical.icon] || FaBuilding;
            return (
               <AnimateOnScroll key={index} delay={index * 0.07}>
                <div className="group bg-[#f7f9fc] border border-[#183964]/5 rounded-2xl p-6 hover:border-[#f36c21]/30 hover:bg-white hover:shadow-[0_10px_30px_rgba(24,57,100,0.06)] transition-all duration-500 cursor-pointer h-full flex flex-col">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-white border border-[#183964]/5 shadow-sm rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#f36c21] group-hover:border-[#f36c21] transition-all duration-500">
                    <Icon className="text-[#183964] text-lg group-hover:text-white transition-colors duration-500" />
                  </div>

                  <h3 className="text-[#183964] text-[15px] font-bold mb-2 group-hover:text-[#f36c21] transition-colors duration-300">
                    {vertical.title}
                  </h3>
                  <p className="text-[#4b5563] text-[13px] leading-relaxed flex-1">
                    {vertical.description}
                  </p>

                  <div className="mt-5 w-0 h-[2px] bg-[#f36c21] group-hover:w-10 transition-all duration-500" />
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
