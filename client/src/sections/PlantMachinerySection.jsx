'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AnimateOnScroll from '@/components/AnimateOnScroll';

export default function PlantMachinerySection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plant-machinery`)
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setItems(data);
        }
      })
      .catch((err) => {
        console.log('Plant/Machinery server offline or empty');
      });
  }, []);

  if (items.length === 0) return null;

  const plants = items.filter(item => item.type === 'Plant');
  const machinery = items.filter(item => item.type === 'Machinery');

  const renderGrid = (data, title) => {
    if (data.length === 0) return null;
    return (
      <div className="mb-16 last:mb-0">
        <AnimateOnScroll>
          <h3 className="text-[#183964] text-xl md:text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#f36c21]"></span>
            {title}
          </h3>
        </AnimateOnScroll>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {data.map((item, index) => (
            <AnimateOnScroll key={item._id || index} delay={index * 0.05}>
              <div className="group relative overflow-hidden bg-[#f7f9fc] border border-[#183964]/5 rounded-xl hover:border-[#f36c21]/30 hover:shadow-[0_10px_30px_rgba(24,57,100,0.08)] hover:-translate-y-1.5 transition-all duration-500 h-full flex flex-col">
                
                {/* Image Section */}
                <div className="relative w-full h-36 md:h-40 overflow-hidden bg-white">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    unoptimized={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#f7f9fc] via-transparent to-transparent"></div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex-1 flex flex-col relative z-10">
                  <h4 className="text-[#183964] text-base md:text-lg font-bold mb-2 group-hover:text-[#f36c21] transition-colors line-clamp-2 leading-tight">
                    {item.name}
                  </h4>
                  <div className="w-8 h-[2px] bg-[#f36c21] mb-3 transition-all duration-300 group-hover:w-1/2" />
                  <p className="text-[#4b5563] text-xs md:text-sm leading-relaxed flex-1 line-clamp-3">
                    {item.description || "No description provided."}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="relative bg-white py-14 lg:py-20 overflow-hidden border-t border-[#183964]/5" id="plant-machinery">
      {/* Large watermark text */}
      <div className="absolute top-20 left-10 whitespace-nowrap pointer-events-none select-none">
        <span className="text-[100px] sm:text-[130px] lg:text-[180px] xl:text-[220px] font-bold text-black/[0.02] uppercase tracking-[0.15em]">
          EQUIPMENT
        </span>
      </div>

      <div className="relative container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <AnimateOnScroll>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-[3px] bg-[#f36c21]" />
              <span className="text-[#f36c21] text-[11px] tracking-[0.25em] uppercase font-semibold">
                Our Fleet
              </span>
            </div>
            <h2 className="text-[#183964] text-2xl md:text-3xl lg:text-4xl font-bold">
              Plants & Machinery
            </h2>
          </AnimateOnScroll>
        </div>

        {/* Separated Sections */}
        {renderGrid(plants, "Our Plants")}
        {renderGrid(machinery, "Our Machinery")}
      </div>
    </section>
  );
}
