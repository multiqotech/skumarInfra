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
    <main className="min-h-screen bg-white text-[#0C0C0C]">
      <div className="bg-[#0C0C0C]">
        <Navbar alwaysSolid={true} />
      </div>

      {/* Header Section */}
      <section className="pt-28 pb-6 border-b border-gray-200">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-light text-[#0C0C0C] uppercase tracking-wide flex flex-col gap-2">
                LATEST HAPPENINGS
                <div className="flex">
                  <div className="h-1 w-24 bg-[#FFB800]"></div>
                  <div className="h-1 w-16 bg-[#17375E]"></div>
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
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-[#FFB800] text-[#0C0C0C] shadow-md' 
                      : 'bg-[#17375E] text-white hover:bg-[#17375E]/90'
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
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column (Years & News List) */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="py-20 text-center text-gray-500">Loading...</div>
              ) : (
                <>
                  {/* Years Grid */}
                  <div className="mb-12 border-y border-gray-200 py-4">
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
                          className={`py-2 transition-colors rounded-md ${
                            selectedYear === year 
                              ? 'bg-[#17375E] text-white font-bold shadow-md' 
                              : 'text-gray-600 hover:text-black hover:bg-gray-100'
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
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 italic">No updates available for the selected criteria.</motion.p>
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
                              className="flex gap-6 border-b border-gray-100 pb-8 last:border-0 group"
                            >
                            {/* Date Box */}
                            <div className="flex-shrink-0 flex flex-col items-center bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-gray-100 w-16 h-16">
                              <div className="bg-[#17375E] text-white text-xs w-full text-center py-1 font-medium">{month}</div>
                              <div className="text-[#17375E] text-xl font-light py-1">{day}</div>
                            </div>
                            
                            {/* Headline */}
                            <div className="flex-1">
                              <a 
                                href={href} 
                                target={item.type === 'featured-stories' ? "_blank" : "_self"}
                                rel={item.type === 'featured-stories' ? "noopener noreferrer" : ""}
                                className="block"
                              >
                                <h3 className="text-lg md:text-xl text-gray-700 font-light hover:text-[#17375E] transition-colors line-clamp-2">
                                  {item.headline}
                                </h3>
                                <p className="text-xs text-gray-400 mt-2">{day} {month} {year}</p>
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
              <div className="bg-[#FFB800] sticky top-24 shadow-lg">
                <div className="p-6 border-b border-black/10">
                  <h3 className="text-xl font-light text-[#0C0C0C]">Media Contacts</h3>
                </div>
                <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {contacts.length === 0 ? (
                    <p className="text-[#0C0C0C]/60 text-sm">No media contacts available.</p>
                  ) : (
                    contacts.map(contact => (
                      <div key={contact._id} className="text-[#0C0C0C]">
                        <h4 className="text-[#17375E] text-lg font-medium mb-1">{contact.name}</h4>
                        <p className="text-xs font-medium mb-1">{contact.designation}</p>
                        <p className="text-xs">
                          Email: <a href={`mailto:${contact.email}`} className="text-[#17375E] hover:underline">{contact.email}</a>
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
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <NewsroomContent />
    </Suspense>
  );
}
