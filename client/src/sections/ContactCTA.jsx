'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HiArrowRight } from 'react-icons/hi';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { statsData } from '@/data/siteData';

export default function ContactCTA() {
  const [stats, setStats] = useState(statsData);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/stats`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        if (data && data.value) {
          try {
            const parsed = JSON.parse(data.value);
            setStats([
              { value: parsed.projectValue || '₹650Cr+', label: 'Total Order Book Value' },
              { value: parsed.completedProjects || '14', label: 'Completed Projects' },
              { value: parsed.ongoingProjects || '5', label: 'Ongoing Projects' },
              { value: parsed.indianStates || '7', label: 'Indian States' },
            ]);
          } catch (e) {
            console.error('Error parsing stats JSON', e);
          }
        }
      })
      .catch((err) => {
        console.log('Using default static stats');
      });
  }, []);

  return (
    <section className="relative overflow-hidden" id="contact">
      {/* Large "INDUSTRY" watermark */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none overflow-visible w-full text-center"
      >
        <span className="text-[80px] sm:text-[100px] lg:text-[150px] font-bold text-black/[0.04] uppercase tracking-[0.2em]">
          INDUSTRY
        </span>
      </div>

      <div className="grid lg:grid-cols-2 min-h-[480px]">
        {/* Left */}
        <div className="bg-[#183964] flex items-center py-14 lg:py-20 px-6 lg:px-14 xl:px-20 relative z-10">
          <AnimateOnScroll>
            <div className="max-w-md">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-[3px] bg-[#f36c21]" />
                <span className="text-[#f36c21] text-[11px] tracking-[0.25em] uppercase font-semibold">
                  Let&apos;s Connect
                </span>
              </div>

              <h2 className="text-white text-2xl lg:text-3xl xl:text-4xl font-bold mb-7 leading-tight">
                Ready to Get Started?{' '}
                <span className="text-[#f36c21]">Contact Us Today!</span>
              </h2>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {stats.map((stat, i) => (
                  <div key={i} className="border border-white/10 p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                    <div className="text-[#f36c21] text-2xl font-bold">
                      {stat.value}
                    </div>
                    <div className="text-white/70 text-[10px] uppercase tracking-[0.12em] mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <a href="/contact-us" className="btn-primary">
                CONTACT US <HiArrowRight />
              </a>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Right */}
        <div className="relative min-h-[400px] lg:min-h-full lg:p-10 flex items-center bg-white z-10">
          <div className="relative w-full h-full min-h-[350px] lg:min-h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&h=700&fit=crop"
              alt="Construction project"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/30" />
          </div>
        </div>
      </div>
    </section>
  );
}
