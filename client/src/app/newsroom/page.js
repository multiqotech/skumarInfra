'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import { fallbackNews, fallbackMediaContacts } from '@/data/newsData';

function NewsroomContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialType = searchParams.get('type') || 'press-releases';
  const [activeTab, setActiveTab] = useState(initialType);
  const [news, setNews] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  
  // Available tabs
  const TABS = [
    { id: 'press-releases', label: 'PRESS RELEASES' },
    { id: 'electronic-media', label: 'ELECTRONIC MEDIA' },
    { id: 'featured-stories', label: 'FEATURED STORIES' }
  ];

  useEffect(() => {
    // If URL param changes externally, update state
    const type = searchParams.get('type');
    if (type && TABS.some(t => t.id === type)) {
      setActiveTab(type);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [newsRes, contactsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news?type=${activeTab}`, { cache: 'no-store' }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media-contacts`, { cache: 'no-store' })
        ]);
        
        if (newsRes.ok) {
          const data = await newsRes.json();
          setNews(data.length > 0 ? data : fallbackNews.filter(n => n.type === activeTab));
        } else {
          setNews(fallbackNews.filter(n => n.type === activeTab));
        }

        if (contactsRes.ok) {
          const data = await contactsRes.json();
          setContacts(data.length > 0 ? data : fallbackMediaContacts);
        } else {
          setContacts(fallbackMediaContacts);
        }
      } catch (err) {
        console.error("Error fetching newsroom data, using fallbacks:", err);
        setNews(fallbackNews.filter(n => n.type === activeTab));
        setContacts(fallbackMediaContacts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    // Reset year filter when changing tabs
    setSelectedYear(null);
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    router.push(`/newsroom?type=${tabId}`, { scroll: false });
  };

  // Extract unique years from the current news list for the filter
  const availableYears = [...new Set(news.map(item => new Date(item.date).getFullYear()))].sort((a, b) => b - a);
  
  // Filter news by selected year
  const filteredNews = selectedYear 
    ? news.filter(item => new Date(item.date).getFullYear() === selectedYear)
    : news;

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <div className="bg-white">
        <Navbar alwaysSolid={true} />
      </div>

      {/* Header Section */}
      <section className="pt-28 pb-6 border-b border-[#183964]/10 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#183964] uppercase tracking-wide flex flex-col gap-2">
                LATEST HAPPENINGS
                <div className="flex">
                  <div className="h-1 w-24 bg-[#f36c21]"></div>
                  <div className="h-1 w-16 bg-[#183964]"></div>
                </div>
              </h1>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {TABS.map(tab => (
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-4 py-2 text-sm font-bold transition-all shadow-sm ${
                    activeTab === tab.id 
                      ? 'bg-[#f36c21] text-white shadow-md' 
                      : 'bg-[#183964]/5 text-[#183964] hover:bg-[#183964]/10 border border-[#183964]/10'
                  }`}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column (Years & News List) */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="py-20 text-center text-[#4b5563] font-medium">Loading...</div>
              ) : (
                <>
                  {/* Years Grid */}
                  <div className="mb-12 border-y border-[#183964]/5 py-4">
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-y-4 gap-x-2 text-center text-sm">
                      {availableYears.map((year, i) => (
                        <motion.button
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          key={year}
                          onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                          className={`py-2 transition-all rounded-md border ${
                            selectedYear === year 
                              ? 'bg-[#183964] text-white font-bold shadow-md border-[#183964]' 
                              : 'text-[#4b5563] hover:text-[#183964] bg-white border-[#183964]/10 hover:border-[#183964]/30'
                          }`}
                        >
                          {year}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* News List */}
                  <div className="space-y-8">
                    {filteredNews.length === 0 ? (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#4b5563] italic">No updates available for the selected criteria.</motion.p>
                    ) : (
                      <AnimatePresence mode="popLayout">
                        {filteredNews.map((item, index) => {
                          const dateObj = new Date(item.date);
                          const month = dateObj.toLocaleString('default', { month: 'short' });
                          const day = dateObj.getDate().toString().padStart(2, '0');
                          const year = dateObj.getFullYear();
                          
                          const href = item.type === 'featured-stories' 
                            ? item.pdf 
                            : `/newsroom/${item.slug}`;

                          return (
                            <motion.div 
                              layout
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.4, delay: index * 0.05 }}
                              key={item._id} 
                              className="flex gap-6 border-b border-[#183964]/5 pb-8 last:border-0 group"
                            >
                            {/* Date Box */}
                            <div className="flex-shrink-0 flex flex-col items-center bg-white shadow-[0_2px_10px_rgba(24,57,100,0.06)] border border-[#183964]/10 w-16 h-16 rounded overflow-hidden">
                              <div className="bg-[#183964] text-white text-xs w-full text-center py-1 font-bold tracking-wide">{month}</div>
                              <div className="text-[#f36c21] text-xl font-bold py-1 bg-[#f7f9fc] w-full text-center">{day}</div>
                            </div>
                            
                            {/* Headline */}
                            <div className="flex-1">
                              <a 
                                href={href} 
                                target={item.type === 'featured-stories' ? "_blank" : "_self"}
                                rel={item.type === 'featured-stories' ? "noopener noreferrer" : ""}
                                className="block"
                              >
                                <h3 className="text-lg md:text-xl text-[#183964] font-bold hover:text-[#f36c21] transition-colors line-clamp-2">
                                  {item.headline}
                                </h3>
                                <p className="text-xs text-[#4b5563] font-medium mt-2">{day} {month} {year}</p>
                              </a>
                            </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Right Column (Media Contacts) */}
            <div className="lg:col-span-1">
              <div className="bg-white sticky top-24 shadow-[0_10px_40px_rgba(24,57,100,0.08)] border border-[#183964]/10 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-[#183964]/10 bg-[#f7f9fc]">
                  <h3 className="text-xl font-bold text-[#183964]">Media Contacts</h3>
                  <div className="h-1 w-12 bg-[#f36c21] mt-3"></div>
                </div>
                <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {contacts.length === 0 ? (
                    <p className="text-[#4b5563] text-sm font-medium">No media contacts available.</p>
                  ) : (
                    contacts.map(contact => (
                      <div key={contact._id} className="text-[#183964]">
                        <h4 className="text-[#f36c21] text-lg font-bold mb-1">{contact.name}</h4>
                        <p className="text-sm font-medium mb-1 text-[#4b5563]">{contact.designation}</p>
                        <p className="text-sm font-medium text-[#4b5563]">
                          Email: <a href={`mailto:${contact.email}`} className="text-[#183964] font-bold hover:text-[#f36c21] transition-colors">{contact.email}</a>
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function NewsroomPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-[#183964] font-bold text-xl">Loading...</div>}>
      <NewsroomContent />
    </Suspense>
  );
}
