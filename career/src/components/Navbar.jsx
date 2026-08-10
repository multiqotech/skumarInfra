'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPhone, HiMenuAlt3, HiX, HiChevronDown, HiUser, HiLogout } from 'react-icons/hi';
import { navLinks, phoneNumber } from '@/data/siteData';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar({ alwaysSolid = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

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

  const portfolioUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'http://localhost:3002';

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
          <div className="hidden lg:flex items-center gap-7 h-full">
            {navLinks.map((link) => (
              <div key={link.label} className="relative h-full flex items-center group/nav">
                <a
                  href={link.label === 'Careers' ? '/' : `${portfolioUrl}${link.href}`}
                  target={link.label === 'Careers' ? '_self' : '_blank'}
                  rel="noopener noreferrer"
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
                                {col.items.map((item, itemIdx) => (
                                  <li key={itemIdx}>
                                    <a
                                      href={`${portfolioUrl}/we-build/${item.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[14px] text-[#183964]/80 hover:text-[#f36c21] transition-colors"
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
                              src="https://images.unsplash.com/photo-1504307651254-35680f35aa9e?w=400&h=600&fit=crop"
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
                              if (item === 'Corporate Excellence') href = `${portfolioUrl}/we-are/corporate`;
                              else if (item === 'CSR & Sustainability') href = `${portfolioUrl}/we-are/csr`;
                              else if (item === 'About Us') href = `${portfolioUrl}/we-are/our-company`;
                              else href = `${portfolioUrl}/we-are/${item.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`;
                            } else if (link.label === 'Landmark projects') {
                              if (item === 'Ongoing Projects') href = `${portfolioUrl}/landmark-projects/ongoing`;
                              else if (item === 'Completed Projects') href = `${portfolioUrl}/landmark-projects/completed`;
                              else if (item === 'Awarded Projects') href = `${portfolioUrl}/landmark-projects/awarded`;
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

          {/* Phone + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="hidden md:flex items-center gap-2 text-[#183964] hover:text-[#f36c21] transition-colors duration-300"
            >
              <div className="w-8 h-8 border border-[#183964]/20 flex items-center justify-center hover:border-[#f36c21]/50 transition-colors">
                <HiPhone className="text-[#f36c21] text-sm" />
              </div>
              <span className="text-[12px] font-medium tracking-wider">
                {phoneNumber}
              </span>
            </a>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3 border-l border-[#183964]/20 pl-4 ml-2">
              {user ? (
                <>
                  <Link href="/profile" className="flex items-center gap-2 text-[#183964] hover:text-[#f36c21] text-sm font-medium transition-colors">
                    <HiUser className="text-[#f36c21] text-lg" />
                    <span>{user.name.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 text-[#6b7280] hover:text-red-500 text-xs uppercase tracking-wider ml-2 transition-colors"
                  >
                    <HiLogout /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-[#183964] hover:text-[#f36c21] text-sm font-semibold tracking-wide transition-colors uppercase">
                    Login
                  </Link>
                  <Link href="/signup" className="bg-[#f36c21] text-white hover:bg-[#d45a14] px-4 py-1.5 rounded-sm text-sm font-bold tracking-wide transition-colors uppercase">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <button
              className="lg:hidden text-[#183964] p-2 hover:text-[#f36c21] transition-colors"
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
            className="lg:hidden overflow-hidden bg-white border-t border-[#183964]/5 shadow-[0_20px_50px_rgba(24,57,100,0.12)]"
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
                  className="flex items-center justify-between text-[#183964]/90 hover:text-[#f36c21] text-[15px] font-medium py-3 border-b border-[#183964]/5 transition-colors tracking-wide"
                >
                  {link.label}
                  {link.hasDropdown && <HiChevronDown size={18} className="opacity-50" />}
                </motion.a>
              ))}
              <a
                href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-[#f36c21] mt-3"
              >
                <HiPhone />
                <span className="text-sm font-medium tracking-wider">
                  {phoneNumber}
                </span>
              </a>

              {/* Mobile Auth */}
              <div className="border-t border-[#183964]/5 mt-2 pt-4 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-[#183964] hover:text-[#f36c21] transition-colors"
                    >
                      <HiUser className="text-[#f36c21] text-xl" />
                      <span className="font-semibold">{user.name}</span>
                      <span className="text-xs text-[#6b7280] hover:underline">(View Profile)</span>
                    </Link>
                    <button
                      onClick={() => { setMobileOpen(false); logout(); }}
                      className="text-left text-red-500 hover:text-red-400 font-medium py-2 transition-colors flex items-center gap-2"
                    >
                      <HiLogout /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-3 mt-2">
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 border border-[#f36c21] text-[#f36c21] hover:bg-[#f36c21]/10 rounded-sm font-semibold transition-colors uppercase text-sm">
                      Login
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 bg-[#f36c21] text-white hover:bg-[#d45a14] rounded-sm font-semibold transition-colors uppercase text-sm">
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
