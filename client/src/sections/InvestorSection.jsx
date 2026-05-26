'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AnimateOnScroll from '@/components/AnimateOnScroll';

export default function InvestorSection() {
  const [investors, setInvestors] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/investors`)
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setInvestors(data);
        }
      })
      .catch((err) => {
        console.log('Investors server offline or empty');
      });
  }, []);

  if (investors.length === 0) return null; // Don't render if no investors

  return (
    <section className="relative bg-white dark:bg-[#0C0C0C] py-14 lg:py-20 overflow-hidden">
      {/* Large watermark text */}
      <div
        className="absolute bottom-10 right-10 whitespace-nowrap pointer-events-none select-none"
      >
        <span className="text-[100px] sm:text-[130px] lg:text-[180px] xl:text-[220px] font-bold text-black/[0.03] dark:text-white/[0.02] uppercase tracking-[0.15em]">
          INVESTORS
        </span>
      </div>

      <div className="relative container-custom">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <AnimateOnScroll>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-[3px] bg-[#FFB800]" />
              <span
                className="text-[#FFB800] text-[11px] tracking-[0.25em] uppercase font-semibold"
              >
                Our Backers
              </span>
            </div>
            <h2
              className="text-gray-900 dark:text-white text-2xl md:text-3xl lg:text-4xl font-bold"
            >
              Key Investors
            </h2>
          </AnimateOnScroll>
        </div>

        {/* Investor Cards - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {investors.map((investor, index) => (
            <InvestorCard key={investor._id || index} investor={investor} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function InvestorCard({ investor, index }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const descriptionWords = investor.description ? investor.description.split(' ') : [];
  const shouldTruncate = descriptionWords.length > 20;
  
  const displayDescription = shouldTruncate && !isExpanded 
    ? descriptionWords.slice(0, 20).join(' ') + '...'
    : investor.description;

  return (
    <AnimateOnScroll delay={index * 0.1}>
      <div className="group relative overflow-hidden bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-[#2A2A2A] rounded-2xl hover:border-[#FFB800]/30 dark:hover:border-[#FFB800]/30 hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
        
        {/* Image Section */}
        <div className="relative w-full h-80 overflow-hidden bg-gray-100 dark:bg-[#0a0a0a]">
          <Image
            src={investor.image}
            alt={investor.name}
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            unoptimized={true}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-50 dark:from-[#161616] via-gray-50/70 dark:via-[#161616]/70 to-transparent"></div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:px-8 md:pb-8 flex-1 flex flex-col relative z-10 -mt-8">
          <h3 className="text-gray-900 dark:text-white text-2xl font-bold mb-3 drop-shadow-md group-hover:text-[#FFB800] dark:group-hover:text-[#FFB800] transition-colors">
            {investor.name}
          </h3>
          <div className="w-16 h-[2px] bg-[#FFB800]/50 mb-5 transition-all duration-300 group-hover:w-full group-hover:bg-[#FFB800]" />
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line flex-1">
            {displayDescription || "No description provided."}
          </p>
          
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 self-start text-[#FFB800] text-sm font-semibold hover:underline"
            >
              {isExpanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>

      </div>
    </AnimateOnScroll>
  );
}
