'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HiPlay, HiX } from 'react-icons/hi';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { milestones } from '@/data/siteData';

export default function VideoShowcase() {
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=5_5oE5-p_K0'); // Default construction video
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Fetch videoUrl setting from server
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/videoUrl`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        if (data && data.value) {
          setVideoUrl(data.value);
        }
      })
      .catch((err) => {
        console.log('Using default video link');
      });
  }, []);

  const getEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
    }
    const vimeoReg = /vimeo\.com\/([0-9]+)/;
    const vimeoMatch = url.match(vimeoReg);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }
    return url;
  };

  return (
    <section className="relative py-14 lg:py-24 bg-white">
      <div className="container-custom">
        {/* Video Preview */}
        <AnimateOnScroll>
          <div
            onClick={() => setIsOpen(true)}
            className="relative group cursor-pointer overflow-hidden mb-16 rounded-3xl shadow-2xl border border-[#183964]/5"
          >
            <div className="relative w-full">
              <Image
                src="https://res.cloudinary.com/ddh5ynpqg/image/upload/v1786474233/node_uploads/et7tqls85ct9e2hcgufx.png"
                alt="Construction site video"
                width={1920}
                height={1080}
                className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#183964]/40 group-hover:bg-[#183964]/20 transition-all duration-500" />

              {/* Play Button */}
              {/* <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-18 h-18 lg:w-22 lg:h-22 bg-[#f36c21] rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-[0_0_30px_rgba(243,108,33,0.4)]"
                  style={{ width: '80px', height: '80px' }}
                >
                  <HiPlay className="text-white text-4xl ml-1" />
                </div>
              </div> */}

              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#f36c21]/80" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#f36c21]/80" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#f36c21]/80" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#f36c21]/80" />
            </div>
          </div>
        </AnimateOnScroll>

        {/* Redesigned Timeline Section */}
        <AnimateOnScroll delay={0.2}>
          <div className="relative mt-20 pb-8 bg-[#f7f9fc] rounded-3xl p-8 lg:p-12 border border-[#183964]/5">
            {/* The horizontal connecting line */}
            <div className="absolute left-[12.5%] right-[12.5%] bottom-[48px] h-[1.5px] bg-[#183964]/10 hidden md:block" />

            {/* Steps grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 relative">
              {milestones.map((item, index) => (
                <div key={index} className="text-center flex flex-col items-center justify-between min-h-[130px] group">
                  <div className="flex-1 flex flex-col justify-start">
                    <h4 className="text-[#183964] text-[15px] sm:text-base font-bold uppercase tracking-wider mb-2 max-w-[210px] mx-auto leading-snug group-hover:text-[#f36c21] transition-colors duration-300">
                      {item.title}
                    </h4>
                    <span className="text-[#f36c21] text-[11px] font-bold uppercase tracking-[0.2em] block mb-4">
                      Step {index + 1}
                    </span>
                  </div>

                  {/* Timeline indicator circle dot */}
                  <div className="relative flex items-center justify-center mt-2 bg-white rounded-full p-1 z-10">
                    {/* Glowing outer ring on hover */}
                    <div className="absolute w-8 h-8 rounded-full bg-[#f36c21]/10 scale-0 group-hover:scale-100 transition-transform duration-300" />

                    {/* The Dot */}
                    <div className="w-4 h-4 rounded-full bg-white border-[3px] border-[#183964]/20 group-hover:bg-[#f36c21] group-hover:border-white shadow-sm transition-all duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Video Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#183964]/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-[#f36c21] transition-colors p-2 bg-black/20 rounded-full"
          >
            <HiX size={24} />
          </button>

          <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <iframe
              src={getEmbedUrl(videoUrl)}
              title="S Kumar Infracons (India) Private Limited Video Showcase"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
