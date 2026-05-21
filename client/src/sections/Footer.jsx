'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { navLinks } from '@/data/siteData';

export default function Footer() {
  const [contactInfo, setContactInfo] = useState({
    companyAddress: '',
    tollFreeNumber: '',
    availability: '',
    internationalNumber: '',
    internationalAvailability: '',
    email: '',
    tagline: ''
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact-info`);
        if (res.ok) {
          const data = await res.json();
          setContactInfo({
            companyAddress: data.companyAddress || '',
            tollFreeNumber: data.tollFreeNumber || '',
            availability: data.availability || '',
            internationalNumber: data.internationalNumber || '',
            internationalAvailability: data.internationalAvailability || '',
            email: data.email || '',
            tagline: data.tagline || ''
          });
        }
      } catch (err) {
        console.error('Failed to fetch contact info:', err);
      }
    };
    fetchContactInfo();
  }, []);

  const weAreLink = navLinks.find(n => n.label === 'We Are');
  const weBuildLink = navLinks.find(n => n.label === 'We Build');
  const newsroomLink = navLinks.find(n => n.label === 'Newsroom');
  const landmarkLink = navLinks.find(n => n.label === 'Landmark projects');

  // Limit businesses to 6 to keep it clean
  const businessesList = weBuildLink?.dropdownItems?.[0]?.items?.slice(0, 6) || [];

  return (
    <footer className="bg-[#0C0C0C] text-white py-16 font-poppins relative z-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Column 1: Who We Are */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Who We Are</h3>
              <div className="w-12 h-1 bg-[#FFB800]"></div>
            </div>
            <ul className="space-y-3">
              {weAreLink?.dropdownItems?.map((item, idx) => {
                const slug = item.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return (
                  <li key={idx}>
                    <Link href={`/we-are/${slug}`} className="text-gray-400 hover:text-[#FFB800] transition-colors text-sm">
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 2: Businesses */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Businesses</h3>
              <div className="w-12 h-1 bg-[#FFB800]"></div>
            </div>
            <ul className="space-y-3">
              {businessesList.map((item, idx) => {
                const slug = item.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return (
                  <li key={idx}>
                    <Link href={`/we-build/${slug}`} className="text-gray-400 hover:text-[#FFB800] transition-colors text-sm">
                      {item}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link href="#we-build" className="text-[#FFB800] hover:text-white transition-colors text-sm font-semibold">
                  View All Businesses &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsroom */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Newsroom</h3>
              <div className="w-12 h-1 bg-[#FFB800]"></div>
            </div>
            <ul className="space-y-3">
              {newsroomLink?.dropdownItems?.map((item, idx) => {
                const slug = item.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return (
                  <li key={idx}>
                    <Link href={`/newsroom/${slug}`} className="text-gray-400 hover:text-[#FFB800] transition-colors text-sm">
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4: Landmark Projects */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Landmark Projects</h3>
              <div className="w-12 h-1 bg-[#FFB800]"></div>
            </div>
            <ul className="space-y-3">
              {landmarkLink?.dropdownItems?.map((item, idx) => {
                const isLandmark = item === 'Landmarks in the making';
                const href = isLandmark ? '/landmark-projects/landmark' : '/landmark-projects/iconic';
                return (
                  <li key={idx}>
                    <Link href={href} className="text-gray-400 hover:text-[#FFB800] transition-colors text-sm">
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 5: Contact Us */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Contact Us</h3>
              <div className="w-12 h-1 bg-[#FFB800]"></div>
            </div>
            <div className="space-y-5 text-sm text-gray-400">
              
              {contactInfo.companyAddress && (
                <div>
                  {contactInfo.companyAddress.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}

              {(contactInfo.tollFreeNumber || contactInfo.availability) && (
                <div>
                  {contactInfo.tollFreeNumber && <p className="font-semibold text-white">Toll Free: <span className="font-normal text-gray-400">{contactInfo.tollFreeNumber}</span></p>}
                  {contactInfo.availability && <p>{contactInfo.availability}</p>}
                </div>
              )}

              {(contactInfo.internationalNumber || contactInfo.internationalAvailability) && (
                <div>
                  {contactInfo.internationalNumber && <p className="font-semibold text-white">International No: <span className="font-normal text-gray-400">{contactInfo.internationalNumber}</span></p>}
                  {contactInfo.internationalAvailability && <p>{contactInfo.internationalAvailability}</p>}
                </div>
              )}

              {contactInfo.email && (
                <div>
                  <p className="font-semibold text-white">Email:</p>
                  {contactInfo.email.split('/').map((em, i) => (
                    <a key={i} href={`mailto:${em.trim()}`} className="block hover:text-[#FFB800] transition-colors">{em.trim()}</a>
                  ))}
                </div>
              )}

              {contactInfo.tagline && (
                <div className="pt-4 border-t border-gray-800 text-xs italic">
                  {contactInfo.tagline.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="mt-16 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} SK Constructions. All Rights Reserved.</p>
          <p>Designed with excellence and precision.</p>
        </div>
      </div>
    </footer>
  );
}
