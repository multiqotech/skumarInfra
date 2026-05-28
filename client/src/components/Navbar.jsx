'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPhone, HiMenuAlt3, HiX, HiChevronDown } from 'react-icons/hi';
import { navLinks, phoneNumber } from '@/data/siteData';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function Navbar({ alwaysSolid = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    if (href.startsWith('http') || href.startsWith('//')) {
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white/40 dark:bg-[#0C0C0C]/40 backdrop-blur-lg ${
        scrolled || alwaysSolid
          ? 'border-b border-black/5 dark:border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)]'
          : 'border-b border-transparent shadow-none'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 bg-[#FFB800] flex items-center justify-center rounded-sm shadow-lg shadow-[#FFB800]/20">
              <span className="text-[#0C0C0C] font-bold text-sm tracking-wider">
                SK
              </span>
            </div>
            <span className="text-gray-900 dark:text-white text-sm font-semibold tracking-[0.15em] uppercase hidden sm:block group-hover:text-[#FFB800] dark:group-hover:text-[#FFB800] transition-colors duration-300">
              S Kumar Infracons
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-7 h-full">
            {navLinks.map((link) => (
              <div key={link.label} className="relative h-full flex items-center group/nav">
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="relative text-[14px] font-medium text-gray-800 dark:text-white/90 hover:text-[#FFB800] dark:hover:text-[#FFB800] transition-colors duration-300 group py-1 flex items-center gap-1.5 uppercase tracking-wide"
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
                    <div className="bg-white/90 dark:bg-[#0C0C0C]/90 backdrop-blur-2xl rounded-xl border border-black/10 dark:border-white/10 text-gray-900 dark:text-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                      {link.dropdownLayout === 'mega' ? (
                        <div className="grid grid-cols-4 min-h-[350px]">
                          {link.dropdownItems.map((col, idx) => (
                            <div key={idx} className={`p-6 ${idx < 2 ? 'border-r border-white/20' : ''}`}>
                              <ul className="flex flex-col gap-3.5">
                                {col.items.map((item, itemIdx) => (
                                  <li key={itemIdx}>
                                    <a
                                      href={`/we-build/${item.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`}
                                      className="text-[14px] text-gray-700 dark:text-white/80 hover:text-[#FFB800] dark:hover:text-[#FFB800] transition-colors"
                                      onClick={(e) => {
                                        // Allow Next.js routing to handle this, remove preventDefault if it's there, but handleNavClick does e.preventDefault(). 
                                        // Since it's a completely new page, we should NOT use handleNavClick.
                                      }}
                                    >
                                      {item}
                                    </a>
                                  </li>
                                ))}
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
                              href = `/we-are/${item.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`;
                            } else if (link.label === 'Landmark projects') {
                              if (item === 'Landmarks in the making') href = '/landmark-projects/landmark';
                              else if (item === 'Iconic Projects') href = '/landmark-projects/iconic';
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
                                  className="block px-6 py-2.5 text-[15px] text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-[#1A1A1A] hover:text-[#FFB800] dark:hover:text-[#FFB800] transition-colors"
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
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-300"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            <a
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="hidden md:flex items-center gap-2 text-gray-900 dark:text-white hover:text-[#FFB800] dark:hover:text-[#FFB800] transition-colors duration-300"
            >
              <div className="w-8 h-8 border border-black/20 dark:border-white/20 flex items-center justify-center hover:border-[#FFB800]/50 transition-colors">
                <HiPhone className="text-[#FFB800] text-sm" />
              </div>
              <span className="text-[12px] font-medium tracking-wider">
                {phoneNumber}
              </span>
            </a>

            <button
              className="lg:hidden text-gray-900 dark:text-white p-2 hover:text-[#FFB800] dark:hover:text-[#FFB800] transition-colors"
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
            className="lg:hidden overflow-hidden bg-white dark:bg-[#0C0C0C] border-t border-gray-100 dark:border-[#2A2A2A]"
          >
            <div className="container-custom py-6 flex flex-col gap-3">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between text-gray-800 dark:text-white/90 hover:text-[#FFB800] dark:hover:text-[#FFB800] text-[15px] font-medium py-3 border-b border-gray-100 dark:border-[#1C1C1C] transition-colors tracking-wide"
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
