import React from 'react';
import AnimateOnScroll from '@/components/AnimateOnScroll';

export default function FinancialOverview({ overview }) {
  if (!overview) return null;

  return (
    <div className="mb-12">
      <AnimateOnScroll>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-[3px] bg-[#f36c21]" />
          <span className="text-[#f36c21] text-[11px] tracking-[0.25em] uppercase font-semibold">
            At a Glance
          </span>
        </div>
        <h2 className="text-[#183964] text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
          {overview.title}
        </h2>
        <p className="text-[#4b5563] text-sm md:text-base leading-relaxed max-w-3xl">
          {overview.description}
        </p>
      </AnimateOnScroll>
    </div>
  );
}
