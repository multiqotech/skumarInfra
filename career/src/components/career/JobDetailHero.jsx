'use client';

import { MapPin, Briefcase, Calendar, Banknote } from 'lucide-react';

export default function JobDetailHero({ job }) {
  const formatSalary = () => {
    if (!job.salary || (!job.salary.min && !job.salary.max)) return 'Not specified';
    if (job.salary.isNegotiable && !job.salary.min && !job.salary.max) return 'Negotiable';
    
    const min = job.salary.min ? job.salary.min.toLocaleString('en-IN') : '';
    const max = job.salary.max ? job.salary.max.toLocaleString('en-IN') : '';
    const currency = job.salary.currency === 'INR' ? '₹' : job.salary.currency;
    
    let text = '';
    if (min && max) text = `${currency}${min} - ${currency}${max}`;
    else if (min) text = `From ${currency}${min}`;
    else if (max) text = `Up to ${currency}${max}`;
    
    if (job.salary.isNegotiable) text += ' (Negotiable)';
    return text;
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[#FFB800]/5 z-0" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[var(--color-dark)] to-transparent z-0" />
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-4 py-1.5 bg-[#FFB800] text-black text-sm font-bold uppercase tracking-wider rounded-md">
              {job.department}
            </span>
            <span className="text-gray-400 text-sm font-medium">
              Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 md:gap-10 text-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#FFB800]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Location</p>
                <p className="font-medium">{job.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-[#FFB800]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Job Type</p>
                <p className="font-medium">{job.employmentType} ({job.jobType})</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#FFB800]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Experience</p>
                <p className="font-medium">{job.experience?.min}-{job.experience?.max} Years</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-[#FFB800]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Salary</p>
                <p className="font-medium">{formatSalary()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
