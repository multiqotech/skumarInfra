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
    tagline: '',
    qrCodeImage: ''
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
            tagline: data.tagline || '',
            qrCodeImage: data.qrCodeImage || ''
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

  const portfolioUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'http://localhost:3000';

  return (
    <footer className="bg-[#183964] text-white py-16 font-poppins relative z-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Column 1: Who We Are */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Who We Are</h3>
              <div className="w-12 h-1 bg-[#f36c21]"></div>
            </div>
            <ul className="space-y-3">
              {weAreLink?.dropdownItems?.map((item, idx) => {
                const slug = typeof item === 'string' ? item.toLowerCase().replace(/[^a-z0-9]+/g, '-') : item.slug;
                const label = typeof item === 'string' ? item : item.name;
                return (
                  <li key={idx}>
                    <a href={`${portfolioUrl}/we-are/${slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-[#f36c21] transition-colors text-sm">
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 2: Businesses */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Businesses</h3>
              <div className="w-12 h-1 bg-[#f36c21]"></div>
            </div>
            <ul className="space-y-3">
              {businessesList.map((item, idx) => {
                const slug = typeof item === 'string' ? item.toLowerCase().replace(/[^a-z0-9]+/g, '-') : item.slug;
                const label = typeof item === 'string' ? item : item.name;
                return (
                  <li key={idx}>
                    <a href={`${portfolioUrl}/we-build/${slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-[#f36c21] transition-colors text-sm">
                      {label}
                    </a>
                  </li>
                );
              })}
              <li>
                <a href={`${portfolioUrl}/#we-build`} target="_blank" rel="noopener noreferrer" className="text-[#f36c21] hover:text-white transition-colors text-sm font-semibold">
                  View All Businesses &rarr;
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsroom */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Newsroom</h3>
              <div className="w-12 h-1 bg-[#f36c21]"></div>
            </div>
            <ul className="space-y-3">
              {newsroomLink?.dropdownItems?.map((item, idx) => {
                const slug = typeof item === 'string' ? item.toLowerCase().replace(/[^a-z0-9]+/g, '-') : item.slug;
                const label = typeof item === 'string' ? item : item.name;
                return (
                  <li key={idx}>
                    <a href={`${portfolioUrl}/newsroom/${slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-[#f36c21] transition-colors text-sm">
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4: Landmark Projects */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Landmark Projects</h3>
              <div className="w-12 h-1 bg-[#f36c21]"></div>
            </div>
            <ul className="space-y-3">
              {landmarkLink?.dropdownItems?.map((item, idx) => {
                let href = '#';
                const label = typeof item === 'string' ? item : item.name;
                if (label === 'Ongoing Projects') href = `${portfolioUrl}/landmark-projects/ongoing`;
                else if (label === 'Completed Projects') href = `${portfolioUrl}/landmark-projects/completed`;
                else if (label === 'Awarded Projects') href = `${portfolioUrl}/landmark-projects/awarded`;
                return (
                  <li key={idx}>
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-[#f36c21] transition-colors text-sm">
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 5: Contact Us */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Contact Us</h3>
              <div className="w-12 h-1 bg-[#f36c21]"></div>
            </div>
            <div className="space-y-5 text-sm text-blue-100">

              {contactInfo.companyAddress && (
                <div>
                  {contactInfo.companyAddress.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}

              {(contactInfo.tollFreeNumber || contactInfo.availability) && (
                <div>
                  {contactInfo.tollFreeNumber && <p className="font-semibold text-white">Toll Free: <span className="font-normal text-blue-100">{contactInfo.tollFreeNumber}</span></p>}
                  {contactInfo.availability && <p>{contactInfo.availability}</p>}
                </div>
              )}

              {(contactInfo.internationalNumber || contactInfo.internationalAvailability) && (
                <div>
                  {/* {contactInfo.internationalNumber && <p className="font-semibold text-white">International No: <span className="font-normal text-blue-100">{contactInfo.internationalNumber}</span></p>} */}
                  {contactInfo.internationalAvailability && <p>{contactInfo.internationalAvailability}</p>}
                </div>
              )}

              {contactInfo.email && (
                <div>
                  <p className="font-semibold text-white">Email:</p>
                  {contactInfo.email.split('/').map((em, i) => (
                    <a key={i} href={`mailto:${em.trim()}`} className="block hover:text-[#f36c21] transition-colors">{em.trim()}</a>
                  ))}
                </div>
              )}

              {contactInfo.tagline && (
                <div className="pt-4 border-t border-[#224c85] text-xs italic">
                  {contactInfo.tagline.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}

              {contactInfo.qrCodeImage && (
                <div className="pt-4 border-t border-[#224c85]">
                  <h4 className="font-semibold text-white mb-3">Get Directions</h4>
                  <div className="bg-white p-2 rounded inline-block shadow-sm">
                    <img src={contactInfo.qrCodeImage} alt="Get Directions QR Code" className="w-24 h-24 object-contain" />
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        <div className="mt-16 pt-6 border-t border-[#224c85] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-blue-200">
          <p>© {new Date().getFullYear()} S Kumar Infracons (India) Private Limited. All Rights Reserved.</p>
          <p>Powered By Multiqo Concept Management Private Limited</p>
        </div>
      </div>
    </footer>
  );
}
