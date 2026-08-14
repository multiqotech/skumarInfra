'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { teamData } from '@/data/siteData';

export default function TeamSection() {
  const [team, setTeam] = useState(teamData);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team`)
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setTeam(data);
        }
      })
      .catch((err) => {
        console.log('Team server offline, using fallback dummy data');
      });
  }, []);

  return (
    <section className="relative bg-[#f7f9fc] py-14 lg:py-20 overflow-hidden border-y border-[#183964]/5">
      {/* Large "OUR TEAM" watermark text */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none select-none">
        <span className="text-[100px] sm:text-[130px] lg:text-[180px] xl:text-[220px] font-bold text-[#183964]/[0.03] uppercase tracking-[0.15em]">
          OUR TEAM
        </span>
      </div>

      <div className="relative container-custom">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <AnimateOnScroll>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-[3px] bg-[#f36c21]" />
              <span className="text-[#f36c21] text-[11px] tracking-[0.25em] uppercase font-semibold">
                Meet Our Experts
              </span>
            </div>
            <h2 className="text-[#183964] text-2xl md:text-3xl lg:text-4xl font-bold">
              Building Team
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.2}>
            <div className="hidden md:block">
              <span className="text-[#f36c21] text-[11px] uppercase tracking-[0.2em] font-bold border-2 border-[#f36c21]/20 px-4 py-2 rounded-lg bg-white">
                Our Success
              </span>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Team Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((member, index) => (
            <AnimateOnScroll key={index} delay={index * 0.1} className="h-full">
              <div className="group relative flex flex-col h-full overflow-hidden bg-white border border-[#183964]/5 rounded-2xl hover:border-[#f36c21]/30 hover:shadow-[0_15px_40px_rgba(24,57,100,0.08)] transition-all duration-500">
                {/* Image */}
                <div className="relative h-64 overflow-hidden shrink-0 bg-[#f7f9fc]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-contain object-center transition-transform duration-700 group-hover:scale-105 p-2"
                    unoptimized={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#183964]/80 via-transparent to-transparent opacity-50" />

                  {/* Social hover */}
                  <div className="absolute bottom-3 left-3 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-10">
                    {member.facebook && (
                      <a href={member.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#f36c21] flex items-center justify-center text-white hover:bg-[#d45a14] transition-colors shadow-lg">
                        <FaFacebookF size={12} />
                      </a>
                    )}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#f36c21] flex items-center justify-center text-white hover:bg-[#d45a14] transition-colors shadow-lg">
                        <FaLinkedinIn size={12} />
                      </a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#f36c21] flex items-center justify-center text-white hover:bg-[#d45a14] transition-colors shadow-lg">
                        <FaTwitter size={12} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-[#183964] text-base font-bold">
                    {member.name}
                  </h3>
                  <p className="text-[#f36c21] text-[12px] uppercase tracking-[0.12em] font-medium mt-1">
                    {member.role}
                  </p>
                  {member.description && (
                    <div className="mt-3">
                      <p className="text-[#4b5563] text-xs leading-relaxed line-clamp-4">
                        {member.description}
                      </p>
                      {member.description.length > 130 && (
                        <button 
                          onClick={() => setSelectedMember(member)}
                          className="text-[#f36c21] text-[11px] uppercase tracking-wider font-bold mt-2 hover:underline focus:outline-none"
                        >
                          Read More
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#183964]/80 backdrop-blur-sm"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl overflow-hidden w-full max-w-3xl shadow-2xl relative flex flex-col md:flex-row h-[85vh] md:h-[480px]"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/10 hover:bg-[#f36c21] hover:text-white rounded-full text-gray-700 transition-all duration-300"
              >
                <FaTimes size={14} />
              </button>
              
              <div className="relative h-64 md:h-full md:w-[40%] shrink-0 bg-[#f7f9fc]">
                <Image
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  fill
                  className="object-contain p-4"
                  unoptimized={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#183964]/80 via-transparent to-transparent md:hidden" />
              </div>
              
              <div className="p-8 flex-1 flex flex-col overflow-hidden">
                <h3 className="text-[#183964] text-2xl font-bold shrink-0">
                  {selectedMember.name}
                </h3>
                <p className="text-[#f36c21] text-xs uppercase tracking-[0.12em] font-bold mt-2 shrink-0">
                  {selectedMember.role}
                </p>
                
                <div className="w-12 h-[2px] bg-[#f36c21]/30 my-5 shrink-0" />
                
                <div className="text-[#4b5563] text-sm leading-relaxed overflow-y-auto pr-3 custom-scrollbar flex-1 mb-6">
                  {selectedMember.description}
                </div>
                
                {/* Modal Social Links */}
                {(selectedMember.facebook || selectedMember.twitter || selectedMember.linkedin) && (
                  <div className="mt-auto flex gap-3 pt-2 shrink-0">
                    {selectedMember.facebook && (
                      <a href={selectedMember.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#f7f9fc] border border-[#183964]/10 flex items-center justify-center text-[#183964] hover:bg-[#f36c21] hover:text-white hover:border-[#f36c21] transition-all duration-300">
                        <FaFacebookF size={14} />
                      </a>
                    )}
                    {selectedMember.linkedin && (
                      <a href={selectedMember.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#f7f9fc] border border-[#183964]/10 flex items-center justify-center text-[#183964] hover:bg-[#f36c21] hover:text-white hover:border-[#f36c21] transition-all duration-300">
                        <FaLinkedinIn size={14} />
                      </a>
                    )}
                    {selectedMember.twitter && (
                      <a href={selectedMember.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#f7f9fc] border border-[#183964]/10 flex items-center justify-center text-[#183964] hover:bg-[#f36c21] hover:text-white hover:border-[#f36c21] transition-all duration-300">
                        <FaTwitter size={14} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
