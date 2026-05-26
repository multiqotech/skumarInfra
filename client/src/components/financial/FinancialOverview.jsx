import React from 'react';
import AnimateOnScroll from '@/components/AnimateOnScroll';

export default function FinancialOverview({ overview }) {
  if (!overview) return null;

  return (
    <div className="mb-12">
      <AnimateOnScroll>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-[3px] bg-[#FFB800]" />
          <span className="text-[#FFB800] text-[11px] tracking-[0.25em] uppercase font-semibold">
            At a Glance
          </span>
        </div>
        <h2 className="text-gray-900 dark:text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
          {overview.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed max-w-3xl">
          {overview.description}
        </p>
      </AnimateOnScroll>
    </div>
  );
}
