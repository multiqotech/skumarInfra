"use client";

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import { ArrowRight, Leaf, Users, BookOpen, HardHat, ShieldCheck, MapPin, CheckCircle2, TrendingUp, HeartHandshake } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function CSRSustainabilityPage() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  const [activeState, setActiveState] = useState('Gujarat');

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      
      {/* SECTION 1 — HERO */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden pt-20">
        <motion.div style={{ y: yHero }} className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&h=1080&fit=crop"
            alt="Community impact"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#183964]/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#183964] via-[#183964]/40 to-transparent" />
        </motion.div>

        <div className="container-custom relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg" style={{ fontFamily: 'var(--font-heading)' }}>
              Building Communities <br />
              <span className="text-[#f36c21]">Beyond Construction</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed border-l-4 border-[#f36c21] pl-6 font-medium">
              Our responsibility extends beyond projects to creating lasting social and environmental impact.
            </p>
          </motion.div>

          {/* Floating Impact Illustrations */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-10 md:right-32 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6"
          >
            <div className="bg-[#183964]/40 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-4">
              <HeartHandshake className="w-10 h-10 text-[#f36c21]" />
              <div>
                <h4 className="font-bold text-xl text-white">5M+ Lives</h4>
                <p className="text-sm text-white/80 font-medium">Positively Impacted</p>
              </div>
            </div>
            <div className="bg-[#183964]/40 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-4 ml-12">
              <Leaf className="w-10 h-10 text-[#10B981]" />
              <div>
                <h4 className="font-bold text-xl text-white">100% Green</h4>
                <p className="text-sm text-white/80 font-medium">Compliance Standard</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — CSR PHILOSOPHY */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#183964]" style={{ fontFamily: 'var(--font-heading)' }}>
              Infrastructure With <span className="text-[#f36c21]">Purpose</span>
            </h2>
          </div>

          <div className="space-y-24">
            {/* Story 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full md:w-1/2 relative h-[400px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(24,57,100,0.15)] border-4 border-white"
              >
                <Image src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop" fill alt="Connectivity" className="object-cover" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full md:w-1/2"
              >
                <h3 className="text-3xl font-bold text-[#183964] mb-4">Driving Economic Growth</h3>
                <p className="text-lg text-[#4b5563] mb-6 leading-relaxed font-medium">
                  The infrastructure we build acts as the arteries of the nation, connecting remote villages to bustling urban centers. This improved connectivity directly translates to greater economic opportunities and access to essential services.
                </p>
                <ul className="space-y-3">
                  {['Enhanced Connectivity', 'Local Employment Generation', 'Market Access Expansion'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[#183964] font-bold">
                      <div className="w-2 h-2 rounded-full bg-[#f36c21]" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Story 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full md:w-1/2 relative h-[400px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(24,57,100,0.15)] border-4 border-white"
              >
                <Image src="https://images.unsplash.com/photo-1494607239400-ff147da48308?w=800&h=600&fit=crop" fill alt="Quality of Life" className="object-cover" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full md:w-1/2"
              >
                <h3 className="text-3xl font-bold text-[#183964] mb-4">Elevating Quality of Life</h3>
                <p className="text-lg text-[#4b5563] mb-6 leading-relaxed font-medium">
                  Through our water pipeline and housing projects, we deliver the fundamental building blocks of a healthy society. Clean water and safe shelter are the prerequisites for community development.
                </p>
                <ul className="space-y-3">
                  {['Clean Water Access', 'Safe Housing Initiatives', 'Community Health Improvement'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[#183964] font-bold">
                      <div className="w-2 h-2 rounded-full bg-[#f36c21]" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — FOUR PILLARS OF IMPACT */}
      <section className="py-24 bg-[#f7f9fc]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#183964]" style={{ fontFamily: 'var(--font-heading)' }}>
              Four Pillars of <span className="text-[#f36c21]">Impact</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Community Development", icon: Users, desc: "Connecting people and opportunities through sustainable infrastructure and local engagement programs.", color: "bg-blue-500" },
              { title: "Environment", icon: Leaf, desc: "Sustainable and responsible construction minimizing ecological footprint and promoting green technologies.", color: "bg-green-500" },
              { title: "Workforce Welfare", icon: HardHat, desc: "Prioritizing health, safety, and holistic employee well-being across all our project sites.", color: "bg-orange-500" },
              { title: "Education & Skills", icon: BookOpen, desc: "Supporting learning initiatives and skill development to empower the next generation of builders.", color: "bg-purple-500" }
            ].map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white rounded-3xl p-10 overflow-hidden border border-[#183964]/5 hover:shadow-[0_20px_50px_rgba(24,57,100,0.12)] hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`absolute top-0 right-0 w-40 h-40 ${pillar.color} opacity-10 rounded-bl-full -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150`} />
                <div className={`w-16 h-16 rounded-2xl ${pillar.color} bg-opacity-20 flex items-center justify-center mb-6`}>
                  <pillar.icon className={`w-8 h-8 ${pillar.color.replace('bg-', 'text-')}`} />
                </div>
                <h3 className="text-2xl font-bold text-[#183964] mb-4 group-hover:text-[#f36c21] transition-colors">{pillar.title}</h3>
                <p className="text-[#4b5563] font-medium text-lg">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — SUSTAINABILITY COMMITMENT */}
      <section className="py-24 bg-[#183964] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f36c21]/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
              Committed To <span className="text-[#f36c21]">Sustainable Growth</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Environmental Responsibility", value: 95 },
              { label: "Resource Optimization", value: 88 },
              { label: "ESG Alignment", value: 100 },
              { label: "Quality Standards", value: 98 }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring" }}
                className="flex flex-col items-center text-center"
              >
                {/* Circular Progress Placeholder / SVG */}
                <div className="relative w-32 h-32 mb-6 flex items-center justify-center bg-white/5 rounded-full backdrop-blur-sm border border-white/10 shadow-[0_0_30px_rgba(243,108,33,0.15)]">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                    <motion.circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#f36c21" 
                      strokeWidth="8"
                      strokeDasharray="283"
                      initial={{ strokeDashoffset: 283 }}
                      whileInView={{ strokeDashoffset: 283 - (283 * stat.value) / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{stat.value}%</span>
                  </div>
                </div>
                <h3 className="font-bold text-white tracking-wide">{stat.label}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — SAFETY FIRST */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#183964]" style={{ fontFamily: 'var(--font-heading)' }}>
              Safety Is A <span className="text-[#f36c21]">Core Responsibility</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "PPE Compliance", num: "100%", icon: ShieldCheck, img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop" },
              { title: "Safety Training", num: "50k+", icon: BookOpen, img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop" },
              { title: "Site Inspections", num: "Daily", icon: CheckCircle2, img: "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=400&h=300&fit=crop" },
              { title: "Risk Management", num: "Zero", icon: TrendingUp, img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop" }
            ].map((safety, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#f7f9fc] rounded-2xl overflow-hidden border border-[#183964]/5 shadow-md hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="h-48 relative">
                  <Image src={safety.img} alt={safety.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#183964]/80 to-transparent opacity-80" />
                  <div className="absolute top-4 right-4 bg-[#f36c21] p-2 rounded-xl text-white shadow-lg">
                    <safety.icon className="w-5 h-5" />
                  </div>
                  <h4 className="absolute bottom-4 left-6 text-4xl font-black text-white drop-shadow-md">{safety.num}</h4>
                </div>
                <div className="p-6 text-center bg-white">
                  <p className="text-[#183964] font-bold text-lg">{safety.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — OUR IMPACT ACROSS INDIA */}
      <section className="py-24 bg-[#f7f9fc]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#183964]" style={{ fontFamily: 'var(--font-heading)' }}>
              Communities <span className="text-[#f36c21]">We Serve</span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(24,57,100,0.08)] border border-[#183964]/5">
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
              {['Gujarat', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Rajasthan'].map((state) => (
                <button
                  key={state}
                  onMouseEnter={() => setActiveState(state)}
                  className={`px-6 py-4 rounded-xl text-left font-bold transition-all ${
                    activeState === state 
                      ? 'bg-[#183964] text-white shadow-[0_10px_20px_rgba(24,57,100,0.2)] scale-105 border-l-4 border-[#f36c21]' 
                      : 'bg-[#f7f9fc] text-[#4b5563] hover:bg-[#183964]/5 hover:text-[#183964]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    {state}
                    {activeState === state && <MapPin className="w-5 h-5 text-[#f36c21]" />}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="w-full lg:w-2/3">
              <motion.div
                key={activeState}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-[#f7f9fc] p-8 md:p-12 rounded-3xl border border-[#183964]/5 relative overflow-hidden"
              >
                <div className="absolute -top-20 -right-20 text-[200px] text-[#183964] font-black opacity-5 z-0 select-none">
                  {activeState.substring(0,2)}
                </div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold text-[#183964] mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#f36c21]/20 flex items-center justify-center">
                      <span className="w-3 h-3 rounded-full bg-[#f36c21]" />
                    </span>
                    Impact in {activeState}
                  </h3>
                  <p className="text-lg text-[#4b5563] mb-8 leading-relaxed font-medium">
                    In {activeState}, our infrastructure projects have not only improved physical connectivity but have acted as catalysts for comprehensive socio-economic development, directly benefiting local communities and empowering the regional workforce.
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="border-l-4 border-[#183964] pl-4 bg-white p-4 rounded-r-xl shadow-sm">
                      <div className="text-xl font-bold text-[#f36c21] mb-1">Local Hiring</div>
                      <div className="text-sm font-medium text-[#4b5563]">Prioritizing regional talent</div>
                    </div>
                    <div className="border-l-4 border-[#183964] pl-4 bg-white p-4 rounded-r-xl shadow-sm">
                      <div className="text-xl font-bold text-[#f36c21] mb-1">Infrastructure</div>
                      <div className="text-sm font-medium text-[#4b5563]">Sustainable building</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — ESG FRAMEWORK */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { letter: "E", title: "Environmental", desc: "Responsible infrastructure development with strict adherence to environmental regulations and green practices." },
              { letter: "S", title: "Social", desc: "People and community focused growth, ensuring health, safety, and empowerment of our workforce." },
              { letter: "G", title: "Governance", desc: "Ethical, transparent, and accountable business practices that build trust with all stakeholders." }
            ].map((esg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-[#f7f9fc] p-10 rounded-3xl text-center border border-[#183964]/5 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(24,57,100,0.08)] transition-all duration-300"
              >
                <div className="w-24 h-24 mx-auto bg-[#183964] rounded-full flex items-center justify-center mb-8 shadow-[0_10px_20px_rgba(24,57,100,0.2)]">
                  <span className="text-5xl font-black text-[#f36c21]">{esg.letter}</span>
                </div>
                <h3 className="text-2xl font-bold text-[#183964] mb-4">{esg.title}</h3>
                <p className="text-[#4b5563] font-medium">{esg.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — OUR PROMISE */}
      <section className="relative py-32 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=1920&h=1080&fit=crop')" }}>
        <div className="absolute inset-0 bg-[#183964]/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#183964] via-[#183964]/50 to-[#183964]/80" />
        <div className="container-custom relative z-10 text-white text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg" style={{ fontFamily: 'var(--font-heading)' }}>
              Every Road We Build Should Lead To A <span className="text-[#f36c21]">Better Tomorrow</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 font-medium">
              Creating infrastructure that benefits communities, supports economic growth and respects the environment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 9 — CTA */}
      <section className="py-24 bg-[#f36c21] relative overflow-hidden">
        {/* Subtle pattern background */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <div className="container-custom text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-10 drop-shadow-md" 
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Creating Impact Together
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/contact-us" className="px-8 py-4 bg-[#183964] text-white font-bold rounded-lg hover:bg-[#183964]/90 transition-colors flex items-center gap-2 shadow-[0_10px_20px_rgba(24,57,100,0.3)] hover:-translate-y-1">
              Partner With Us <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/we-are/our-team" className="px-8 py-4 bg-white text-[#183964] font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-lg hover:-translate-y-1">
              Contact Our Team
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
