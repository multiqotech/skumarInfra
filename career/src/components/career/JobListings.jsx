'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Search, MapPin, Briefcase, Filter } from 'lucide-react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function JobListings() {
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    location: '',
  });

  // Debounced search for API
  const [apiFilters, setApiFilters] = useState(filters);

  const { data: filterOptions } = useQuery({
    queryKey: ['job-filters'],
    queryFn: async () => {
      const res = await axios.get(`${API}/api/career/filters`);
      return res.data;
    },
  });

  const { data: jobData, isLoading } = useQuery({
    queryKey: ['jobs', apiFilters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (apiFilters.search) params.append('search', apiFilters.search);
      if (apiFilters.department) params.append('department', apiFilters.department);
      if (apiFilters.location) params.append('location', apiFilters.location);
      
      const res = await axios.get(`${API}/api/career/jobs?${params.toString()}`);
      return res.data;
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setApiFilters(filters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setApiFilters(newFilters);
  };

  return (
    <section id="jobs" className="py-24 bg-[#f7f9fc]">
      <div className="container-custom">
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-[#183964] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Open <span className="text-[#f36c21]">Positions</span>
          </h2>
          
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#183964]/10 shadow-[0_10px_40px_rgba(24,57,100,0.05)] flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <input 
                type="text"
                placeholder="Search job title or keywords..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full bg-[#f7f9fc] border border-[#183964]/10 pl-12 pr-4 py-3.5 text-[#183964] rounded-xl focus:border-[#f36c21] focus:outline-none focus:ring-2 focus:ring-[#f36c21]/20 transition-all"
              />
              <Search className="w-5 h-5 text-[#6b7280] absolute left-4 top-1/2 -translate-y-1/2" />
            </form>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative min-w-[200px]">
                <select 
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="w-full bg-[#f7f9fc] border border-[#183964]/10 pl-10 pr-4 py-3.5 text-[#183964] rounded-xl focus:border-[#f36c21] focus:outline-none focus:ring-2 focus:ring-[#f36c21]/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Departments</option>
                  {filterOptions?.departments?.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <Briefcase className="w-4 h-4 text-[#6b7280] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="relative min-w-[200px]">
                <select 
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full bg-[#f7f9fc] border border-[#183964]/10 pl-10 pr-4 py-3.5 text-[#183964] rounded-xl focus:border-[#f36c21] focus:outline-none focus:ring-2 focus:ring-[#f36c21]/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Locations</option>
                  {filterOptions?.locations?.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <MapPin className="w-4 h-4 text-[#6b7280] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Job Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-[#183964]/10 animate-pulse shadow-sm">
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-4" />
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-8" />
                <div className="h-10 w-32 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : jobData?.jobs?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#183964]/10 shadow-sm">
            <Filter className="w-12 h-12 text-[#6b7280] mx-auto mb-4" />
            <p className="text-xl text-[#183964] font-semibold mb-2">No jobs found</p>
            <p className="text-[#6b7280]">Try adjusting your filters or search criteria.</p>
            <button 
              onClick={() => handleFilterChange('search', '') || handleFilterChange('department', '') || handleFilterChange('location', '')}
              className="mt-6 text-[#f36c21] hover:underline font-semibold"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobData?.jobs?.map((job) => (
              <Link 
                href={`/${job.slug}`} 
                key={job._id}
                className="group bg-white p-8 rounded-2xl border border-[#183964]/10 hover:border-[#f36c21] hover:shadow-[0_15px_40px_rgba(243,108,33,0.1)] transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-[#f0f4f8] text-[#183964] text-xs font-bold rounded-full uppercase tracking-wider">
                      {job.department}
                    </span>
                    <span className="text-[#6b7280] text-sm font-medium">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#183964] mb-4 group-hover:text-[#f36c21] transition-colors line-clamp-2">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-[#4b5563] text-sm mb-6 font-medium">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#f36c21]"/> {job.location}</span>
                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-[#f36c21]"/> {job.employmentType}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-[#183964]/10">
                  <span className="text-sm font-semibold text-[#183964]">
                    Experience: {job.experience?.min}-{job.experience?.max} yrs
                  </span>
                  <span className="text-[#f36c21] font-bold group-hover:translate-x-2 transition-transform flex items-center gap-2">
                    Apply Now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
