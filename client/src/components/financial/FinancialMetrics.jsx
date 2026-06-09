import React, { useEffect, useState, useRef } from 'react';
import AnimateOnScroll from '@/components/AnimateOnScroll';

export default function FinancialMetrics({ metrics }) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {metrics.map((metric, index) => (
        <MetricCard key={index} metric={metric} index={index} />
      ))}
    </div>
  );
}

function MetricCard({ metric, index }) {
  const [inView, setInView] = useState(false);
  const cardRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <AnimateOnScroll delay={index * 0.1}>
      <div 
        ref={cardRef}
        className="bg-white border border-[#183964]/5 rounded-2xl p-6 hover:border-[#f36c21]/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(24,57,100,0.06)] shadow-sm"
      >
        <div className="flex items-end justify-between mb-4">
          <h4 className="text-[#183964] font-bold text-lg">{metric.title}</h4>
          <span className="text-[#f36c21] font-black text-3xl">
            {metric.value}{metric.suffix}
          </span>
        </div>
        
        {/* Animated Progress Bar */}
        <div className="w-full bg-[#183964]/10 h-2 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-[#f36c21]/50 to-[#f36c21] rounded-full transition-all duration-1500 ease-out"
            style={{ width: inView ? `${Math.min(Math.max(metric.value, 5), 100)}%` : '0%' }}
          />
        </div>
        
        <p className="text-[#4b5563] text-sm">
          {metric.description}
        </p>
      </div>
    </AnimateOnScroll>
  );
}
