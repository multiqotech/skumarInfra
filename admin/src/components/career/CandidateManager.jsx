'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Users, Mail, Phone, MapPin, Search } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function CandidateManager({ showFeedback }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const config = { withCredentials: true };

  useEffect(() => { fetchCandidates(); }, []);

  const fetchCandidates = async (query = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/career/admin/candidates?search=${query}`, config);
      setCandidates(res.data.candidates || []);
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
      showFeedback('Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCandidates(searchQuery);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Users className="w-7 h-7 text-[#FFB800]" />
          Candidate Database
        </h2>
        
        <form onSubmit={handleSearch} className="flex max-w-sm w-full relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[var(--color-dark-border)] pl-10 pr-4 py-2.5 text-white text-sm rounded-lg focus:border-[#FFB800] focus:outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <button type="submit" className="hidden">Search</button>
        </form>
      </div>

      <div className="bg-[#141414] rounded-2xl border border-[var(--color-dark-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-dark-card)] border-b border-[var(--color-dark-border)] text-gray-400 text-sm">
                <th className="py-4 px-6 font-semibold">Candidate</th>
                <th className="py-4 px-6 font-semibold">Contact Info</th>
                <th className="py-4 px-6 font-semibold">Experience</th>
                <th className="py-4 px-6 font-semibold text-center">Applications</th>
                <th className="py-4 px-6 font-semibold text-right">Resume</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--color-dark-border)] animate-pulse">
                    <td className="py-4 px-6"><div className="h-4 w-32 bg-gray-700 rounded" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-40 bg-gray-700 rounded" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-12 bg-gray-700 rounded" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-8 bg-gray-700 rounded mx-auto" /></td>
                    <td className="py-4 px-6"><div className="h-8 w-24 bg-gray-700 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : candidates.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500">
                    No candidates found.
                  </td>
                </tr>
              ) : (
                candidates.map((candidate) => (
                  <tr key={candidate._id} className="border-b border-[var(--color-dark-border)] hover:bg-[#1a1a1a] transition-colors">
                    <td className="py-4 px-6">
                      <p className="text-white font-medium">{candidate.fullName}</p>
                      <p className="text-gray-500 text-xs mt-1">Joined {new Date(candidate.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="py-4 px-6 space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                        <Mail className="w-3.5 h-3.5 text-[#FFB800]" />
                        <a href={`mailto:${candidate.email}`}>{candidate.email}</a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Phone className="w-3.5 h-3.5 text-[#FFB800]" />
                        <span>{candidate.phone}</span>
                      </div>
                      {candidate.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin className="w-3.5 h-3.5 text-[#FFB800]" />
                          <span>{candidate.location}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">
                        {candidate.experience} {candidate.experience === 1 ? 'year' : 'years'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-block px-2.5 py-1 bg-[#FFB800]/20 text-[#FFB800] rounded-full text-xs font-bold border border-[#FFB800]/30">
                        {candidate.applicationCount}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {candidate.resumeUrl ? (
                        <a
                          href={candidate.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] text-gray-300 rounded-lg hover:border-[#FFB800]/50 hover:text-[#FFB800] transition-colors text-sm font-medium"
                        >
                          <Download className="w-4 h-4" /> CV
                        </a>
                      ) : (
                        <span className="text-gray-600 text-sm">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
