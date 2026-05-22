'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPhone, HiMenuAlt3, HiX, HiChevronDown, HiUser, HiLogout } from 'react-icons/hi';
import { navLinks, phoneNumber } from '@/data/siteData';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Navbar({ alwaysSolid = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const portfolioUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'http://localhost:3002';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || alwaysSolid
          ? 'bg-[#0C0C0C]/80 backdrop-blur-xl border-b border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
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
              <span className="text-[#0C0C0C] font-bold text-sm tracking-wider">
                SK
              </span>
            </div>
            <span className="text-white text-sm font-semibold tracking-[0.15em] uppercase hidden sm:block group-hover:text-[#FFB800] transition-colors duration-300">
              SK Constructions
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-7 h-full">
            {navLinks.map((link) => (
              <div key={link.label} className="relative h-full flex items-center group/nav">
                <a
                  href={link.label === 'Careers' ? '/' : `${portfolioUrl}${link.href}`}
                  target={link.label === 'Careers' ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="relative text-[14px] font-medium text-white/90 hover:text-[#FFB800] transition-colors duration-300 group py-1 flex items-center gap-1.5 uppercase tracking-wide"
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
                    <div className="bg-[#0C0C0C]/90 backdrop-blur-2xl rounded-xl border border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                      {link.dropdownLayout === 'mega' ? (
                        <div className="grid grid-cols-4 min-h-[350px]">
                          {link.dropdownItems.map((col, idx) => (
                            <div key={idx} className={`p-6 ${idx < 2 ? 'border-r border-white/20' : ''}`}>
                              <ul className="flex flex-col gap-3.5">
                                {col.items.map((item, itemIdx) => (
                                  <li key={itemIdx}>
                                    <a
                                      href={`${portfolioUrl}/we-build/${item.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[14px] text-white/80 hover:text-[#FFB800] transition-colors"
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
                              if (link.label === 'We Are') {
                                href = `${portfolioUrl}/we-are/${item.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`;
                              } else if (link.label === 'Landmark projects') {
                                if (item === 'Landmarks in the making') href = `${portfolioUrl}/landmark-projects/landmark`;
                                else if (item === 'Iconic Projects') href = `${portfolioUrl}/landmark-projects/iconic`;
                              } else if (link.label === 'Newsroom') {
                                if (item === 'Press Releases') href = `${portfolioUrl}/newsroom?type=press-releases`;
                                else if (item === 'Electronic Media') href = `${portfolioUrl}/newsroom?type=electronic-media`;
                                else if (item === 'Featured Stories') href = `${portfolioUrl}/newsroom?type=featured-stories`;
                              } else if (link.label === 'Careers') {
                                href = '/';
                              }
                              return (
                                <li key={itemIdx}>
                                  <a
                                    href={href}
                                    target={link.label === 'Careers' ? '_self' : '_blank'}
                                    rel="noopener noreferrer"
                                    className="block px-6 py-2.5 text-[15px] text-white/80 hover:bg-[#1A1A1A] hover:text-[#FFB800] transition-colors"
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
            <a
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="hidden md:flex items-center gap-2 text-white hover:text-[#FFB800] transition-colors duration-300"
            >
              <div className="w-8 h-8 border border-white/20 flex items-center justify-center hover:border-[#FFB800]/50 transition-colors">
                <HiPhone className="text-[#FFB800] text-sm" />
              </div>
              <span className="text-[12px] font-medium tracking-wider">
                {phoneNumber}
              </span>
            </a>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3 border-l border-white/20 pl-4 ml-2">
              {user ? (
                <>
                  <Link href="/profile" className="flex items-center gap-2 text-white hover:text-[#FFB800] text-sm font-medium transition-colors">
                    <HiUser className="text-[#FFB800] text-lg" />
                    <span>{user.name.split(' ')[0]}</span>
                  </Link>
                  <button 
                    onClick={logout}
                    className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 text-xs uppercase tracking-wider ml-2 transition-colors"
                  >
                    <HiLogout /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-white hover:text-[#FFB800] text-sm font-semibold tracking-wide transition-colors uppercase">
                    Login
                  </Link>
                  <Link href="/signup" className="bg-[#FFB800] text-black hover:bg-[#e5a600] px-4 py-1.5 rounded-sm text-sm font-bold tracking-wide transition-colors uppercase">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <button
              className="lg:hidden text-white p-2 hover:text-[#FFB800] transition-colors"
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
            className="lg:hidden overflow-hidden bg-[#0C0C0C] border-t border-[#2A2A2A]"
          >
            <div className="container-custom py-6 flex flex-col gap-3">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.label === 'Careers' ? '/' : `${portfolioUrl}${link.href}`}
                  target={link.label === 'Careers' ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between text-white/90 hover:text-[#FFB800] text-[15px] font-medium py-3 border-b border-[#1C1C1C] transition-colors tracking-wide"
                >
                  {link.label}
                  {link.hasDropdown && <HiChevronDown size={18} className="opacity-50" />}
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

              {/* Mobile Auth */}
              <div className="border-t border-[#1C1C1C] mt-2 pt-4 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link 
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-white hover:text-[#FFB800] transition-colors"
                    >
                      <HiUser className="text-[#FFB800] text-xl" />
                      <span className="font-semibold">{user.name}</span>
                      <span className="text-xs text-gray-400 hover:underline">(View Profile)</span>
                    </Link>
                    <button 
                      onClick={() => { setMobileOpen(false); logout(); }}
                      className="text-left text-red-400 hover:text-red-300 font-medium py-2 transition-colors flex items-center gap-2"
                    >
                      <HiLogout /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-3 mt-2">
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 border border-[#FFB800] text-[#FFB800] hover:bg-[#FFB800]/10 rounded-sm font-semibold transition-colors uppercase text-sm">
                      Login
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 bg-[#FFB800] text-black hover:bg-[#e5a600] rounded-sm font-semibold transition-colors uppercase text-sm">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
