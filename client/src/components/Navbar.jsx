'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPhone, HiMenuAlt3, HiX, HiChevronDown } from 'react-icons/hi';
import { navLinks, phoneNumber } from '@/data/siteData';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

function MobileNavItem({ link, handleNavClick, i }) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = (e) => {
    if (link.hasDropdown && !link.href.startsWith('http')) {
      e.preventDefault();
      setExpanded(!expanded);
    } else {
      handleNavClick(e, link.href);
    }
  };

  return (
    <div className="border-b border-[#183964]/5">
      <motion.a
        href={link.href}
        onClick={handleClick}
        target={link.href.startsWith('http') ? '_blank' : undefined}
        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.05 }}
        className="flex items-center justify-between text-[#183964] hover:text-[#f36c21] text-[15px] font-medium py-3 transition-colors tracking-wide"
      >
        {link.label}
        {link.hasDropdown && !link.href.startsWith('http') && (
          <HiChevronDown size={18} className={`transition-transform duration-300 ${expanded ? 'rotate-180 text-[#f36c21]' : 'opacity-50'}`} />
        )}
      </motion.a>
      
      {/* Sub menu items */}
      <AnimatePresence>
        {expanded && link.hasDropdown && link.dropdownItems && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-4 pb-3 flex flex-col gap-2">
              {link.dropdownLayout === 'mega' ? (
                // Flatten mega menu items for mobile
                link.dropdownItems.flatMap(col => col.items).map((item, idx) => {
                  const label = typeof item === 'string' ? item : item.name;
                  const slug = typeof item === 'string' ? item.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-') : item.slug;
                  return (
                    <a
                      key={idx}
                      href={`/we-build/${slug}`}
                      onClick={(e) => handleNavClick(e, `/we-build/${slug}`)}
                      className="text-[14px] text-[#4b5563] hover:text-[#f36c21] py-1.5"
                    >
                      {label}
                    </a>
                  );
                })
              ) : (
                link.dropdownItems.map((item, idx) => {
                  let href = '#';
                  let target = undefined;
                  let rel = undefined;
                  if (link.label === 'We Are') {
                    if (item === 'Corporate Excellence') href = '/we-are/corporate';
                    else if (item === 'Plant and Machinery') href = '/#plant-machinery';
                    else if (item === 'CSR & Sustainability') href = '/we-are/csr';
                    else if (item === 'About Us') href = '/we-are/our-company';
                    else href = `/we-are/${item.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`;
                  } else if (link.label === 'Landmark projects') {
                    if (item === 'Ongoing Projects') href = '/landmark-projects/ongoing';
                    else if (item === 'Completed Projects') href = '/landmark-projects/completed';
                    else if (item === 'Newly Awarded Projects') href = '/landmark-projects/awarded';
                  } else if (link.label === 'Newsroom') {
                    if (item === 'Press Releases') href = '/newsroom?type=press-releases';
                    else if (item === 'Electronic Media') href = '/newsroom?type=electronic-media';
                    else if (item === 'Featured Stories') href = '/newsroom?type=featured-stories';
                  } else if (link.label === 'Careers') {
                    if (item === 'Visit career portal') {
                      href = process.env.NEXT_PUBLIC_CAREER_URL || 'https://career.skumarinfracons.com';
                      target = '_blank';
                      rel = 'noopener noreferrer';
                    }
                  } else if (link.label === 'InvestorHub') {
                    if (item === 'Key Investors') href = '/#investors';
                    else if (item === 'Financial Highlights') href = '/#financial-highlights';
                  }
                  return (
                    <a
                      key={idx}
                      href={href}
                      target={target}
                      rel={rel}
                      onClick={(e) => {
                        if (!href.startsWith('http')) {
                          handleNavClick(e, href);
                        }
                      }}
                      className="text-[14px] text-[#4b5563] hover:text-[#f36c21] py-1.5"
                    >
                      {item}
                    </a>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar({ alwaysSolid = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dynamicNavLinks, setDynamicNavLinks] = useState(navLinks);
  const pathname = usePathname();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
        if (res.ok) {
          const categories = await res.json();
          const colSize = Math.ceil(categories.length / 3);
          const cols = [
            { column: 1, items: categories.slice(0, colSize) },
            { column: 2, items: categories.slice(colSize, colSize * 2) },
            { column: 3, items: categories.slice(colSize * 2) },
          ];
          setDynamicNavLinks(prev => prev.map(link => {
            if (link.label === 'We Build') {
              return { ...link, dropdownItems: cols };
            }
            return link;
          }));
        }
      } catch (err) {
        console.error("Failed to fetch categories for navbar", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  const handleNavClick = (e, href) => {
    if (href.startsWith('http') || href.startsWith('//') || href.startsWith('/')) {
      setMobileOpen(false);
      return;
    }
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white/80 backdrop-blur-lg ${scrolled || alwaysSolid
          ? 'border-b border-[#183964]/10 shadow-[0_10px_40px_rgba(24,57,100,0.08)]'
          : 'border-b border-transparent shadow-none'
        }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                const hero = document.getElementById('home');
                if (hero) hero.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-3 group"
          >
            <Image
              src="/logo.png"
              alt="S Kumar Infracons"
              width={300}
              height={80}
              className="h-[45px] md:h-[55px] w-auto object-contain py-1"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-7 h-full">
            {dynamicNavLinks.map((link) => (
              <div key={link.label} className="relative h-full flex items-center group/nav">
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="relative text-[14px] font-medium text-[#183964] hover:text-[#f36c21] transition-colors duration-300 group py-1 flex items-center gap-1.5 uppercase tracking-wide"
                >
                  {link.label}
                  {link.hasDropdown && (
                    <HiChevronDown className="opacity-70 mt-[1px] transition-transform duration-300 group-hover/nav:-rotate-180" size={16} />
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#f36c21] transition-all duration-300 group-hover/nav:w-full rounded-full" />
                </a>

                {/* Dropdown Menu */}
                {link.hasDropdown && link.dropdownItems && link.dropdownItems.length > 0 && (
                  <div
                    className={`absolute top-[45px] left-0 pt-4 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-400 ease-out transform translate-y-3 group-hover/nav:translate-y-0 ${link.dropdownLayout === 'mega' ? 'w-[750px] xl:w-[900px] -left-[200px]' : 'w-[280px]'
                      }`}
                  >
                    <div className="bg-white/95 backdrop-blur-2xl rounded-xl border border-[#183964]/10 text-[#183964] shadow-[0_20px_50px_rgba(24,57,100,0.12)] overflow-hidden">
                      {link.dropdownLayout === 'mega' ? (
                        <div className="grid grid-cols-4 min-h-[350px]">
                          {link.dropdownItems.map((col, idx) => (
                            <div key={idx} className={`p-6 ${idx < 2 ? 'border-r border-[#183964]/10' : ''}`}>
                              <ul className="flex flex-col gap-3.5">
                                {col.items.map((item, itemIdx) => {
                                  const label = typeof item === 'string' ? item : item.name;
                                  const slug = typeof item === 'string' ? item.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-') : item.slug;
                                  return (
                                    <li key={itemIdx}>
                                      <a
                                        href={`/we-build/${slug}`}
                                        className="text-[14px] text-[#183964]/80 hover:text-[#f36c21] transition-colors"
                                      >
                                        {label}
                                      </a>
                                    </li>
                                  )
                                })}
                              </ul>
                            </div>
                          ))}
                          {/* Image Column */}
                          {/* <div className="relative h-full w-full">
                            <img
                              src="https://images.unsplash.com/photo-1504307651254-35680f35aa9e?w=400&h=600&fit=crop"
                              alt="Featured Building"
                              className="object-cover w-full h-full"
                            />
                          </div> */}
                        </div>
                      ) : (
                        <ul className="flex flex-col py-3">
                          {link.dropdownItems.map((item, itemIdx) => {
                            let href = '#';
                            let target = undefined;
                            let rel = undefined;
                            if (link.label === 'We Are') {
                              if (item === 'Corporate Excellence') href = '/we-are/corporate';
                              else if (item === 'Plant and Machinery') href = '/#plant-machinery';
                              else if (item === 'CSR & Sustainability') href = '/we-are/csr';
                              else if (item === 'About Us') href = '/we-are/our-company';
                              else href = `/we-are/${item.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`;
                            } else if (link.label === 'Landmark projects') {
                              if (item === 'Ongoing Projects') href = '/landmark-projects/ongoing';
                              else if (item === 'Completed Projects') href = '/landmark-projects/completed';
                              else if (item === 'Newly Awarded Projects') href = '/landmark-projects/awarded';
                            } else if (link.label === 'Newsroom') {
                              if (item === 'Press Releases') href = '/newsroom?type=press-releases';
                              else if (item === 'Electronic Media') href = '/newsroom?type=electronic-media';
                              else if (item === 'Featured Stories') href = '/newsroom?type=featured-stories';
                            } else if (link.label === 'Careers') {
                              if (item === 'Visit career portal') {
                                href = process.env.NEXT_PUBLIC_CAREER_URL || 'https://career.skumarinfracons.com';
                                target = '_blank';
                                rel = 'noopener noreferrer';
                              }
                            } else if (link.label === 'InvestorHub') {
                              if (item === 'Key Investors') href = '/#investors';
                              else if (item === 'Financial Highlights') href = '/#financial-highlights';
                            }
                            return (
                              <li key={itemIdx}>
                                <a
                                  href={href}
                                  target={target}
                                  rel={rel}
                                  className="block px-6 py-2.5 text-[15px] text-[#183964]/80 hover:bg-[#f0f4f8] hover:text-[#f36c21] transition-colors"
                                >
                                  {item}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4">

            <button
              className="xl:hidden text-[#183964] p-2 hover:text-[#f36c21] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="xl:hidden overflow-hidden bg-white border-t border-[#183964]/5 max-h-[85vh] overflow-y-auto"
          >
            <div className="container-custom py-4 flex flex-col gap-1">
              {dynamicNavLinks.map((link, i) => (
                <MobileNavItem key={link.label} link={link} handleNavClick={handleNavClick} i={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
