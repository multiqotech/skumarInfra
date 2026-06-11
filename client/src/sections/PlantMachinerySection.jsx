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

  return (
    <section className="relative bg-white py-14 lg:py-20 overflow-hidden border-t border-[#183964]/5" id="plant-machinery">
      {/* Large watermark text */}
      <div className="absolute bottom-10 left-10 whitespace-nowrap pointer-events-none select-none">
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

        {/* Equipment Cards - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <AnimateOnScroll key={item._id || index} delay={index * 0.1}>
              <div className="group relative overflow-hidden bg-[#f7f9fc] border border-[#183964]/5 rounded-2xl hover:border-[#f36c21]/30 hover:shadow-[0_15px_40px_rgba(24,57,100,0.08)] hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
                
                {/* Top badges */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-sm ${
                    item.type === 'Plant' ? 'bg-[#183964] text-white' : 'bg-[#f36c21] text-white'
                  }`}>
                    {item.type}
                  </span>
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <span className="px-3 py-1.5 text-[11px] font-bold bg-white/90 backdrop-blur-sm text-[#183964] rounded-lg border border-[#183964]/10 shadow-sm">
                    Qty: {item.quantity}
                  </span>
                </div>

                {/* Image Section */}
                <div className="relative w-full h-56 overflow-hidden bg-white">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    unoptimized={true}
                  />
                  {/* Subtle gradient at bottom for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#f7f9fc] via-transparent to-transparent"></div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col relative z-10">
                  <h3 className="text-[#183964] text-xl font-bold mb-3 group-hover:text-[#f36c21] transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="w-12 h-[3px] bg-[#f36c21] mb-4 transition-all duration-300 group-hover:w-1/2" />
                  <p className="text-[#4b5563] text-sm leading-relaxed whitespace-pre-line flex-1 line-clamp-3">
                    {item.description || "No description provided."}
                  </p>
                </div>

              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
