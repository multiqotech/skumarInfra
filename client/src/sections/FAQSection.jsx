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
        if (data && data.length > 0) {
          setFaqs(data);
        }
      })
      .catch((err) => {
        console.log('FAQ server offline, using fallback dummy data');
      });
  }, []);

  return (
    <section className="bg-white py-14 lg:py-20 border-y border-[#183964]/5">
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
            <div className="relative h-[350px] lg:h-[500px] overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(24,57,100,0.1)]">
              <Image
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=700&h=600&fit=crop"
                alt="Construction site"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#183964]/70 to-transparent" />
              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-5 border-l-[4px] border-[#f36c21]">
                <p className="text-[#f36c21] text-[10px] uppercase tracking-[0.2em] mb-1 font-semibold">
                  Trusted by
                </p>
                <p className="text-[#183964] text-xl font-bold">
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
                <div className="w-10 h-[3px] bg-[#f36c21]" />
                <span className="text-[#f36c21] text-[11px] tracking-[0.25em] uppercase font-semibold">
                  FAQ
                </span>
              </div>
              <h2 className="text-[#183964] text-2xl lg:text-3xl font-bold mb-8 leading-tight">
                Trusted Engineering Services for Your Project
              </h2>

              <div className="bg-[#f0f4f8] rounded-2xl p-6 border border-[#183964]/5">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-[#183964]/10 last:border-0">
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                      className="flex items-center justify-between w-full py-4 text-left group"
                    >
                      <span
                        className={`text-[15px] font-semibold transition-colors duration-300 pr-4 ${
                          openIndex === index ? 'text-[#f36c21]' : 'text-[#183964] group-hover:text-[#f36c21]'
                        }`}
                      >
                        {faq.question}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                          openIndex === index
                            ? 'bg-[#f36c21] text-white shadow-md'
                            : 'bg-white border border-[#183964]/10 text-[#183964] group-hover:border-[#f36c21]/30'
                        }`}
                      >
                        {openIndex === index ? <HiMinus size={14} /> : <HiPlus size={14} />}
                      </div>
                    </button>

                    <div
                      className="overflow-hidden transition-all duration-500 ease-in-out"
                      style={{
                        maxHeight: openIndex === index ? '200px' : '0',
                        opacity: openIndex === index ? 1 : 0,
                      }}
                    >
                      <p className="text-[#4b5563] text-[14px] leading-relaxed pb-5 pr-8">
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
