import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import AnimateOnScroll from '@/components/AnimateOnScroll';

export default function FinancialStrengths({ strengths }) {
  if (!strengths || strengths.length === 0) return null;

  return (
    <div className="bg-white dark:bg-[#0C0C0C] border border-gray-200 dark:border-[#2A2A2A] rounded-2xl p-6 md:p-10 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB800]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <AnimateOnScroll>
        <h3 className="text-gray-900 dark:text-white text-xl md:text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[#FFB800]/20 flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-[#FFB800]" />
          </span>
          Key Financial Strengths
        </h3>
      </AnimateOnScroll>

      <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 relative z-10">
        {strengths.map((strength, index) => (
          <AnimateOnScroll key={index} delay={index * 0.1}>
            <div className="flex items-start gap-4 group">
              <div className="mt-1 flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#FFB800] group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="text-gray-900 dark:text-white font-semibold text-base mb-1 group-hover:text-[#FFB800] dark:group-hover:text-[#FFB800] transition-colors">
                  {strength.title}
                </h4>
                {strength.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {strength.description}
                  </p>
                )}
              </div>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </div>
  );
}
