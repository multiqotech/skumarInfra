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
    <section id="jobs" className="py-24 bg-[#0C0C0C]">
      <div className="container-custom">
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Open <span className="text-[#FFB800]">Positions</span>
          </h2>
          
          {/* Search & Filter Bar */}
          <div className="bg-[var(--color-dark-card)] p-4 rounded-2xl border border-[var(--color-dark-border)] flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <input 
                type="text"
                placeholder="Search job title or keywords..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full bg-[#141414] border border-[var(--color-dark-border)] pl-12 pr-4 py-3.5 text-white rounded-xl focus:border-[#FFB800] focus:outline-none transition-colors"
              />
              <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
            </form>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative min-w-[200px]">
                <select 
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="w-full bg-[#141414] border border-[var(--color-dark-border)] pl-10 pr-4 py-3.5 text-white rounded-xl focus:border-[#FFB800] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="">All Departments</option>
                  {filterOptions?.departments?.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <Briefcase className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="relative min-w-[200px]">
                <select 
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full bg-[#141414] border border-[var(--color-dark-border)] pl-10 pr-4 py-3.5 text-white rounded-xl focus:border-[#FFB800] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="">All Locations</option>
                  {filterOptions?.locations?.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <MapPin className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Job Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-[var(--color-dark-card)] p-8 rounded-2xl border border-[var(--color-dark-border)] animate-pulse">
                <div className="h-6 w-3/4 bg-gray-700 rounded mb-4" />
                <div className="h-4 w-1/2 bg-gray-700 rounded mb-8" />
                <div className="h-10 w-32 bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        ) : jobData?.jobs?.length === 0 ? (
          <div className="text-center py-20 bg-[var(--color-dark-card)] rounded-2xl border border-[var(--color-dark-border)]">
            <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-white font-semibold mb-2">No jobs found</p>
            <p className="text-gray-400">Try adjusting your filters or search criteria.</p>
            <button 
              onClick={() => handleFilterChange('search', '') || handleFilterChange('department', '') || handleFilterChange('location', '')}
              className="mt-6 text-[#FFB800] hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobData?.jobs?.map((job) => (
              <Link 
                href={`/careers/${job.slug}`} 
                key={job._id}
                className="group bg-[var(--color-dark-card)] p-8 rounded-2xl border border-[var(--color-dark-border)] hover:border-[#FFB800] transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs font-semibold rounded-full uppercase tracking-wider">
                      {job.department}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#FFB800] transition-colors line-clamp-2">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-gray-400 text-sm mb-6">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {job.location}</span>
                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4"/> {job.employmentType}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-[var(--color-dark-border)]">
                  <span className="text-sm font-medium text-white">
                    Experience: {job.experience?.min}-{job.experience?.max} yrs
                  </span>
                  <span className="text-[#FFB800] font-semibold group-hover:translate-x-2 transition-transform flex items-center gap-2">
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
