'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPhone, HiMenuAlt3, HiX, HiChevronDown } from 'react-icons/hi';
import { navLinks, phoneNumber } from '@/data/siteData';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import Link from 'next/link';

export default function Navbar({ alwaysSolid = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dynamicNavLinks, setDynamicNavLinks] = useState(navLinks);

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
    setMounted(true);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white/40 dark:bg-[#09090B]/40 backdrop-blur-lg ${
        scrolled || alwaysSolid
          ? 'border-b border-black/5 dark:border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)]'
          : 'border-b border-transparent shadow-none'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 bg-[#FFB800] flex items-center justify-center rounded-sm shadow-lg shadow-[#FFB800]/20">
              <span className="text-[#09090B] font-bold text-sm tracking-wider">
                SK
              </span>
            </div>
            <div className="hidden sm:flex flex-col justify-center">
              <span className="text-zinc-900 dark:text-white text-[13px] md:text-[14px] font-bold tracking-wider uppercase group-hover:text-[#FFB800] dark:group-hover:text-[#FFB800] transition-colors duration-300 leading-none mb-0.5">
                S Kumar Infracons
              </span>
              <span className="text-zinc-500 dark:text-zinc-400 text-[9px] md:text-[10px] font-medium tracking-widest uppercase leading-none">
                (India) Private Limited
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-7 h-full">
            {dynamicNavLinks.map((link) => (
              <div key={link.label} className="relative h-full flex items-center group/nav">
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="relative text-[14px] font-medium text-zinc-800 dark:text-white/90 hover:text-[#FFB800] dark:hover:text-[#FFB800] transition-colors duration-300 group py-1 flex items-center gap-1.5 uppercase tracking-wide"
                >
                  {link.label}
                  {link.hasDropdown && (
                    <HiChevronDown className="opacity-70 mt-[1px] transition-transform duration-300 group-hover/nav:-rotate-180" size={16} />
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FFB800] transition-all duration-300 group-hover/nav:w-full rounded-full" />
                </a>

                {/* Dropdown Menu */}
                {link.hasDropdown && link.dropdownItems && link.dropdownItems.length > 0 && (
                  <div
                    className={`absolute top-[45px] left-0 pt-4 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-400 ease-out transform translate-y-3 group-hover/nav:translate-y-0 ${
                      link.dropdownLayout === 'mega' ? 'w-[750px] xl:w-[900px] -left-[200px]' : 'w-[280px]'
                    }`}
                  >
                    <div className="bg-white/90 dark:bg-[#09090B]/90 backdrop-blur-2xl rounded-xl border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                      {link.dropdownLayout === 'mega' ? (
                        <div className="grid grid-cols-4 min-h-[350px]">
                          {link.dropdownItems.map((col, idx) => (
                            <div key={idx} className={`p-6 ${idx < 2 ? 'border-r border-white/20' : ''}`}>
                              <ul className="flex flex-col gap-3.5">
                                {col.items.map((item, itemIdx) => {
                                  const label = typeof item === 'string' ? item : item.name;
                                  const slug = typeof item === 'string' ? item.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-') : item.slug;
                                  return (
                                  <li key={itemIdx}>
                                    <a
                                      href={`/we-build/${slug}`}
                                      className="text-[14px] text-zinc-700 dark:text-white/80 hover:text-[#FFB800] dark:hover:text-[#FFB800] transition-colors"
                                    >
                                      {label}
                                    </a>
                                  </li>
                                )})}
                              </ul>
                            </div>
                          ))}
                          {/* Image Column */}
                          <div className="relative h-full w-full">
                            <img
                              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=600&fit=crop"
                              alt="Featured Building"
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                      ) : (
                        <ul className="flex flex-col py-3">
                          {link.dropdownItems.map((item, itemIdx) => {
                            let href = '#';
                            let target = undefined;
                            let rel = undefined;
                            if (link.label === 'We Are') {
                              if (item === 'Corporate Excellence') href = '/we-are/corporate';
                              else if (item === 'CSR & Sustainability') href = '/we-are/csr';
                              else href = `/we-are/${item.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`;
                            } else if (link.label === 'Landmark projects') {
                              if (item === 'Ongoing Projects') href = '/landmark-projects/ongoing';
                              else if (item === 'Completed Projects') href = '/landmark-projects/completed';
                              else if (item === 'Awarded Projects') href = '/landmark-projects/awarded';
                            } else if (link.label === 'Newsroom') {
                              if (item === 'Press Releases') href = '/newsroom?type=press-releases';
                              else if (item === 'Electronic Media') href = '/newsroom?type=electronic-media';
                              else if (item === 'Featured Stories') href = '/newsroom?type=featured-stories';
                            } else if (link.label === 'Careers') {
                              if (item === 'Visit career portal') {
                                href = 'https://sk-construction-s2k6.vercel.app';
                                target = '_blank';
                                rel = 'noopener noreferrer';
                              }
                            }
                            return (
                              <li key={itemIdx}>
                                <a
                                  href={href}
                                  target={target}
                                  rel={rel}
                                  className="block px-6 py-2.5 text-[15px] text-zinc-700 dark:text-white/80 hover:bg-zinc-100 dark:hover:bg-[#1A1A1A] hover:text-[#FFB800] dark:hover:text-[#FFB800] transition-colors"
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

          {/* Phone + Mobile Toggle */}
          <div className="flex items-center gap-4">
            
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-white/10 text-zinc-800 dark:text-white hover:bg-zinc-200 dark:hover:bg-white/20 transition-all duration-300"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            <a
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="hidden md:flex items-center gap-2 text-zinc-900 dark:text-white hover:text-[#FFB800] dark:hover:text-[#FFB800] transition-colors duration-300"
            >
              <div className="w-8 h-8 border border-black/20 dark:border-white/20 flex items-center justify-center hover:border-[#FFB800]/50 transition-colors">
                <HiPhone className="text-[#FFB800] text-sm" />
              </div>
              <span className="text-[12px] font-medium tracking-wider">
                {phoneNumber}
              </span>
            </a>

            <button
              className="lg:hidden text-zinc-900 dark:text-white p-2 hover:text-[#FFB800] dark:hover:text-[#FFB800] transition-colors"
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
            className="lg:hidden overflow-hidden bg-white dark:bg-[#09090B] border-t border-black/5 dark:border-white/10"
          >
            <div className="container-custom py-6 flex flex-col gap-3">
              {dynamicNavLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between text-zinc-800 dark:text-white/90 hover:text-[#FFB800] dark:hover:text-[#FFB800] text-[15px] font-medium py-3 border-b border-black/5 dark:border-[#18181B] transition-colors tracking-wide"
                >
                  {link.label}
                  {link.hasDropdown && !link.href.startsWith('http') && <HiChevronDown size={18} className="opacity-50" />}
                </motion.a>
              ))}
              <a
                href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-[#FFB800] mt-3"
              >
                <HiPhone />
                <span className="text-sm font-medium tracking-wider">
                  {phoneNumber}
                </span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
