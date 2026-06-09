import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import AnimateOnScroll from '@/components/AnimateOnScroll';

export default function FinancialStrengths({ strengths }) {
  if (!strengths || strengths.length === 0) return null;

  return (
    <div className="bg-white border border-[#183964]/5 shadow-[0_10px_30px_rgba(24,57,100,0.04)] rounded-2xl p-6 md:p-10 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#f36c21]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <AnimateOnScroll>
        <h3 className="text-[#183964] text-xl md:text-2xl font-bold mb-8 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[#f36c21]/20 flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-[#f36c21]" />
          </span>
          Key Financial Strengths
        </h3>
      </AnimateOnScroll>

      <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 relative z-10">
        {strengths.map((strength, index) => (
          <AnimateOnScroll key={index} delay={index * 0.1}>
            <div className="flex items-start gap-4 group">
              <div className="mt-1 flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#f36c21] group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="text-[#183964] font-bold text-base mb-1 group-hover:text-[#f36c21] transition-colors">
                  {strength.title}
                </h4>
                {strength.description && (
                  <p className="text-[#4b5563] text-sm leading-relaxed">
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
