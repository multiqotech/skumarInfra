import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import { MapPin, Phone, Mail, Clock, Globe } from 'lucide-react';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

async function getContactInfo() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact-info`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return null;
  }
}

export default async function ContactUsPage() {
  const contactInfo = await getContactInfo();

  if (!contactInfo) {
    return (
      <main className="min-h-screen bg-white pt-[70px]">
        <Navbar />
        <div className="container-custom py-20 text-center">
          <h1 className="text-3xl font-bold text-[#183964]">Contact Information Unavailable</h1>
        </div>
        <Footer />
      </main>
    );
  }

  const {
    companyAddress,
    tollFreeNumber,
    availability,
    internationalNumber,
    internationalAvailability,
    email,
    tagline,
    linkedin,
    twitter,
    facebook,
    instagram,
    qrCodeImage
  } = contactInfo;

  return (
    <main className="min-h-screen bg-white">
      <Navbar alwaysSolid={true} />
      
      {/* Hero Banner */}
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center pt-[70px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=800&fit=crop)' }}
        >
          <div className="absolute inset-0 bg-[#183964]/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#183964] via-[#183964]/40 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg" style={{ fontFamily: 'var(--font-heading)' }}>Contact Us</h1>
          <div className="w-24 h-[3px] bg-[#f36c21] mx-auto shadow-sm"></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container-custom max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#183964] mb-6">Get in Touch</h2>
            {tagline && (
              <p className="text-[#4b5563] font-medium max-w-3xl mx-auto text-lg">
                {tagline}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            
            {/* Address */}
            {companyAddress && (
              <div className="bg-[#f7f9fc] p-8 rounded-2xl border border-[#183964]/5 shadow-sm hover:shadow-[0_15px_40px_rgba(24,57,100,0.08)] flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-white border border-[#183964]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#f36c21] group-hover:border-transparent transition-colors duration-300 shadow-sm">
                  <MapPin className="w-8 h-8 text-[#183964] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#183964] mb-4">Corporate Office</h3>
                <p className="text-[#4b5563] font-medium whitespace-pre-line leading-relaxed">
                  {companyAddress.replace(/\\n/g, '\n')}
                </p>
              </div>
            )}

            {/* Toll Free */}
            {tollFreeNumber && (
              <div className="bg-[#f7f9fc] p-8 rounded-2xl border border-[#183964]/5 shadow-sm hover:shadow-[0_15px_40px_rgba(24,57,100,0.08)] flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-white border border-[#183964]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#f36c21] group-hover:border-transparent transition-colors duration-300 shadow-sm">
                  <Phone className="w-8 h-8 text-[#183964] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#183964] mb-4">Toll Free Support</h3>
                <p className="text-xl font-bold text-[#f36c21] mb-2 tracking-wide">{tollFreeNumber}</p>
                {availability && (
                  <div className="flex items-center text-sm font-medium text-[#4b5563] mt-4">
                    <Clock className="w-4 h-4 mr-2 text-[#183964]" />
                    <span>{availability}</span>
                  </div>
                )}
              </div>
            )}

            {/* Email */}
            {email && (
              <div className="bg-[#f7f9fc] p-8 rounded-2xl border border-[#183964]/5 shadow-sm hover:shadow-[0_15px_40px_rgba(24,57,100,0.08)] flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-white border border-[#183964]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#f36c21] group-hover:border-transparent transition-colors duration-300 shadow-sm">
                  <Mail className="w-8 h-8 text-[#183964] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#183964] mb-4">Email Address</h3>
                <div className="space-y-2">
                  {email.split('/').map((e, i) => (
                    <a key={i} href={`mailto:${e.trim()}`} className="block text-[#4b5563] font-medium hover:text-[#f36c21] transition-colors">
                      {e.trim()}
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* International */}
            {internationalNumber && (
              <div className="bg-[#f7f9fc] p-8 rounded-2xl border border-[#183964]/5 shadow-sm hover:shadow-[0_15px_40px_rgba(24,57,100,0.08)] flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300 md:col-span-2 lg:col-span-1 lg:col-start-2">
                <div className="w-16 h-16 bg-white border border-[#183964]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#f36c21] group-hover:border-transparent transition-colors duration-300 shadow-sm">
                  <Globe className="w-8 h-8 text-[#183964] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#183964] mb-4">International Support</h3>
                <p className="text-xl font-bold text-[#f36c21] mb-2 tracking-wide">{internationalNumber}</p>
                {internationalAvailability && (
                  <div className="flex items-center text-sm font-medium text-[#4b5563] mt-4 justify-center">
                    <Clock className="w-4 h-4 mr-2 text-[#183964]" />
                    <span>{internationalAvailability}</span>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Social Media & Directions Links */}
          <div className="mt-20 pt-16 border-t border-[#183964]/10 flex flex-col md:flex-row justify-center items-center md:items-start gap-16 text-center md:text-left">
            {(linkedin || twitter || facebook || instagram) && (
              <div>
                <h2 className="text-2xl font-bold text-[#183964] mb-6">Connect With Us Online</h2>
                <div className="flex justify-center md:justify-start gap-4">
                  {linkedin && (
                    <a href={linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded bg-blue-600 shadow-md flex items-center justify-center text-white hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300">
                      <FaLinkedin className="w-6 h-6" />
                    </a>
                  )}
                  {twitter && (
                    <a href={twitter} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded bg-black shadow-md flex items-center justify-center text-white hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300">
                      <FaTwitter className="w-6 h-6" />
                    </a>
                  )}
                  {facebook && (
                    <a href={facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded bg-blue-800 shadow-md flex items-center justify-center text-white hover:bg-blue-900 hover:-translate-y-1 transition-all duration-300">
                      <FaFacebook className="w-6 h-6" />
                    </a>
                  )}
                  {instagram && (
                    <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-md flex items-center justify-center text-white hover:opacity-90 hover:-translate-y-1 transition-all duration-300">
                      <FaInstagram className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {qrCodeImage && (
              <div>
                <h2 className="text-2xl font-bold text-[#183964] mb-6">Get Directions</h2>
                <div className="bg-white p-2 rounded-xl shadow-[0_10px_20px_rgba(24,57,100,0.1)] inline-block border border-[#183964]/5">
                  <img src={qrCodeImage} alt="Get Directions QR Code" className="w-40 h-40 object-contain" />
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
