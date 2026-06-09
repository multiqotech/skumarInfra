'use client';

import { CheckCircle2 } from 'lucide-react';

export default function JobContent({ job }) {
  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#183964]/10 shadow-[0_20px_50px_rgba(24,57,100,0.05)] space-y-12">
      
      {/* Description */}
      <div>
        <h3 className="text-2xl font-bold text-[#183964] mb-6 border-b border-[#183964]/10 pb-4 inline-block">
          Role Overview
        </h3>
        <div className="prose max-w-none">
          <p className="text-[#4b5563] leading-relaxed text-lg whitespace-pre-wrap font-medium">
            {job.description}
          </p>
        </div>
      </div>

      {/* Responsibilities */}
      {job.responsibilities && job.responsibilities.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-[#183964] mb-6 border-b border-[#183964]/10 pb-4 inline-block">
            Key Responsibilities
          </h3>
          <ul className="space-y-4">
            {job.responsibilities.map((item, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#f36c21] shrink-0 mt-0.5" />
                <span className="text-[#4b5563] leading-relaxed text-lg font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Requirements */}
      {job.requirements && job.requirements.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-[#183964] mb-6 border-b border-[#183964]/10 pb-4 inline-block">
            Requirements
          </h3>
          <ul className="space-y-4">
            {job.requirements.map((item, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#f36c21] shrink-0 mt-0.5" />
                <span className="text-[#4b5563] leading-relaxed text-lg font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Benefits */}
      {job.benefits && job.benefits.length > 0 && (
        <div className="bg-[#f7f9fc] p-8 rounded-2xl border border-[#183964]/10">
          <h3 className="text-2xl font-bold text-[#183964] mb-6 border-b border-[#183964]/10 pb-4 inline-block">
            Perks & Benefits
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {job.benefits.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#f36c21]" />
                <span className="text-[#4b5563] font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-[#183964] mb-4">
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, idx) => (
              <span key={idx} className="px-4 py-2 bg-[#f0f4f8] text-[#183964] rounded-lg text-sm font-bold shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
