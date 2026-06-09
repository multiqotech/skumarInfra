'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { teamData } from '@/data/siteData';

export default function TeamSection() {
  const [team, setTeam] = useState(teamData);

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
            <AnimateOnScroll key={index} delay={index * 0.1}>
              <div className="group relative overflow-hidden bg-white border border-[#183964]/5 rounded-2xl hover:border-[#f36c21]/30 hover:shadow-[0_15px_40px_rgba(24,57,100,0.08)] transition-all duration-500">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    unoptimized={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#183964]/80 via-transparent to-transparent opacity-50" />

                  {/* Social hover */}
                  <div className="absolute bottom-3 left-3 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    {[FaFacebookF, FaLinkedinIn, FaTwitter].map((Icon, i) => (
                      <a
                        key={i}
                        href="#"
                        className="w-8 h-8 rounded-full bg-[#f36c21] flex items-center justify-center text-white hover:bg-[#d45a14] transition-colors shadow-lg"
                      >
                        <Icon size={12} />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="text-[#183964] text-base font-bold">
                    {member.name}
                  </h3>
                  <p className="text-[#f36c21] text-[12px] uppercase tracking-[0.12em] font-medium mt-1">
                    {member.role}
                  </p>
                  {member.description && (
                    <p className="text-[#4b5563] text-xs mt-3 line-clamp-4 leading-relaxed">
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
