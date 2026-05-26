'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { teamData } from '@/data/siteData';

export default function TeamSection() {
  const [team, setTeam] = useState(teamData); // Default fallback data

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team`)
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        // Fall back to dummy data if DB collection is empty
        if (data && data.length > 0) {
          setTeam(data);
        }
      })
      .catch((err) => {
        console.log('Team server offline, using fallback dummy data');
      });
  }, []);

  return (
    <section className="relative bg-white dark:bg-[#0C0C0C] py-14 lg:py-20 overflow-hidden">
      {/* Large "OUR TEAM" watermark text */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none select-none"
        
      >
        <span className="text-[100px] sm:text-[130px] lg:text-[180px] xl:text-[220px] font-bold text-black/[0.03] dark:text-white/[0.03] uppercase tracking-[0.15em]">
          OUR TEAM
        </span>
      </div>

      <div className="relative container-custom">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <AnimateOnScroll>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-[3px] bg-[#FFB800]" />
              <span
                className="text-[#FFB800] text-[11px] tracking-[0.25em] uppercase font-semibold"
                
              >
                Meet Our Experts
              </span>
            </div>
            <h2
              className="text-gray-900 dark:text-white text-2xl md:text-3xl lg:text-4xl font-bold"
              
            >
              Building Team
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.2}>
            <div className="hidden md:block">
              <span
                className="text-[#FFB800] text-[11px] uppercase tracking-[0.2em] font-semibold border border-[#FFB800]/30 px-4 py-2"
                
              >
                Our Success
              </span>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Team Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((member, index) => (
            <AnimateOnScroll key={index} delay={index * 0.1}>
              <div className="group relative overflow-hidden bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-[#2A2A2A] rounded-2xl hover:border-[#FFB800]/20 hover:shadow-[0_8px_30px_rgba(255,184,0,0.05)] transition-all duration-500">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    unoptimized={true} // Allow external Unsplash URLs pasted by admin
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 dark:from-[#0C0C0C] via-transparent to-transparent opacity-50" />

                  {/* Social hover */}
                  <div className="absolute bottom-3 left-3 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    {[FaFacebookF, FaLinkedinIn, FaTwitter].map((Icon, i) => (
                      <a
                        key={i}
                        href="#"
                        className="w-7 h-7 bg-[#FFB800] flex items-center justify-center text-[#0C0C0C] text-[10px] hover:bg-[#FFC933] transition-colors"
                      >
                        <Icon />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3
                    className="text-gray-900 dark:text-white text-base font-bold"
                    
                  >
                    {member.name}
                  </h3>
                  <p
                    className="text-[#FFB800] text-[12px] uppercase tracking-[0.12em]"
                    
                  >
                    {member.role}
                  </p>
                  {member.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-3 line-clamp-4 leading-relaxed">
                      {member.description}
                    </p>
                  )}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
