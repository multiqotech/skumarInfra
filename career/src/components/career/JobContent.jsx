'use client';

import { CheckCircle2 } from 'lucide-react';

export default function JobContent({ job }) {
  return (
    <div className="bg-[#141414] rounded-3xl p-8 md:p-12 border border-[var(--color-dark-border)] shadow-2xl space-y-12">
      
      {/* Description */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6 border-b border-[var(--color-dark-border)] pb-4 inline-block">
          Role Overview
        </h3>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
            {job.description}
          </p>
        </div>
      </div>

      {/* Responsibilities */}
      {job.responsibilities && job.responsibilities.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 border-b border-[var(--color-dark-border)] pb-4 inline-block">
            Key Responsibilities
          </h3>
          <ul className="space-y-4">
            {job.responsibilities.map((item, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#FFB800] shrink-0 mt-0.5" />
                <span className="text-gray-300 leading-relaxed text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Requirements */}
      {job.requirements && job.requirements.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 border-b border-[var(--color-dark-border)] pb-4 inline-block">
            Requirements
          </h3>
          <ul className="space-y-4">
            {job.requirements.map((item, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#FFB800] shrink-0 mt-0.5" />
                <span className="text-gray-300 leading-relaxed text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Benefits */}
      {job.benefits && job.benefits.length > 0 && (
        <div className="bg-[var(--color-dark-card)] p-8 rounded-2xl border border-[var(--color-dark-border)]">
          <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4 inline-block">
            Perks & Benefits
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {job.benefits.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FFB800]" />
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, idx) => (
              <span key={idx} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
