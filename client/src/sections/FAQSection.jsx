'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HiPlus, HiMinus } from 'react-icons/hi';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { faqData } from '@/data/siteData';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const [faqs, setFaqs] = useState(faqData); // Default fallback data

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faqs`)
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        // Fall back to dummy data if DB collection is empty
        if (data && data.length > 0) {
          setFaqs(data);
        }
      })
      .catch((err) => {
        console.log('FAQ server offline, using fallback dummy data');
      });
  }, []);

  return (
    <section className="bg-[#161616] py-14 lg:py-20">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Left - Image */}
          <AnimateOnScroll
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
              },
            }}
          >
            <div className="relative h-[350px] lg:h-[500px] overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=700&h=600&fit=crop"
                alt="Construction site"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C]/50 to-transparent" />
              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-[#0C0C0C]/85 backdrop-blur-sm p-4 border-l-[3px] border-[#FFB800]">
                <p
                  className="text-[#FFB800] text-[10px] uppercase tracking-[0.2em] mb-0.5"
                  
                >
                  Trusted by
                </p>
                <p
                  className="text-white text-lg font-bold"
                  
                >
                  1200+ Happy Clients
                </p>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Right - Accordion */}
          <AnimateOnScroll
            variants={{
              hidden: { opacity: 0, x: 30 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
              },
            }}
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-[3px] bg-[#FFB800]" />
                <span
                  className="text-[#FFB800] text-[11px] tracking-[0.25em] uppercase font-semibold"
                  
                >
                  FAQ
                </span>
              </div>
              <h2
                className="text-white text-2xl lg:text-3xl font-bold mb-8"
                
              >
                Trusted Engineering Services for Your Project
              </h2>

              <div>
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-[#2A2A2A]">
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                      className="flex items-center justify-between w-full py-4 text-left group"
                    >
                      <span
                        className={`text-[15px] font-medium transition-colors duration-300 pr-4 ${
                          openIndex === index ? 'text-[#FFB800]' : 'text-white group-hover:text-[#FFB800]'
                        }`}
                        
                      >
                        {faq.question}
                      </span>
                      <div
                        className={`w-7 h-7 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                          openIndex === index
                            ? 'bg-[#FFB800] text-[#0C0C0C]'
                            : 'border border-[#2A2A2A] text-white/50'
                        }`}
                      >
                        {openIndex === index ? <HiMinus size={12} /> : <HiPlus size={12} />}
                      </div>
                    </button>

                    <div
                      className="overflow-hidden transition-all duration-500 ease-in-out"
                      style={{
                        maxHeight: openIndex === index ? '200px' : '0',
                        opacity: openIndex === index ? 1 : 0,
                      }}
                    >
                      <p className="text-white/45 text-[13px] leading-relaxed pb-4">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
