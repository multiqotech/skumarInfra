"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import { ArrowRight, CheckCircle, Target, Shield, Lightbulb, Globe, Building2 } from 'lucide-react';
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

export default function CorporateExcellencePage() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const sliderRef = React.useRef(null);
  
  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 350; 
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f9fc] overflow-hidden">
      <Navbar />
      
      {/* SECTION 1 — HERO */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden pt-20">
        <motion.div style={{ y: yHero }} className="absolute inset-0 z-0">
          <Image
            src="/images/corporate_infrastructure.jpg"
            alt="Corporate infrastructure"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#183964]/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#183964] via-[#183964]/40 to-transparent" />
        </motion.div>

        <div className="container-custom relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg" style={{ fontFamily: 'var(--font-heading)' }}>
              Engineering India's <span className="text-[#f36c21]">Tomorrow</span>
            </h1>
            <p className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto mb-16 font-medium">
              Building resilient infrastructure through innovation, integrity and engineering excellence.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {[
              { value: "₹650+ Cr", label: "Project Portfolio" },
              { value: "14", label: "Completed Projects" },
              { value: "5", label: "Ongoing Projects" },
              { value: "7", label: "States Presence" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-[#f36c21]/20 hover:border-[#f36c21]/50 transition-all duration-300"
              >
                <h3 className="text-3xl md:text-4xl font-bold text-[#f36c21] mb-2">{stat.value}</h3>
                <p className="text-sm md:text-base font-bold tracking-wider uppercase text-white">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — CORPORATE DNA */}
      <section className="py-24 bg-white relative">
        <div className="container-custom">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#183964]" style={{ fontFamily: 'var(--font-heading)' }}>
              The Foundation Of <span className="text-[#f36c21]">Everything We Build</span>
            </h2>
            <div className="w-24 h-[3px] bg-[#f36c21] mx-auto mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Excellence", icon: Target, items: ["Technical precision", "Quality execution", "Continuous improvement"] },
              { title: "Integrity", icon: Shield, items: ["Transparency", "Accountability", "Ethical practices"] },
              { title: "Innovation", icon: Lightbulb, items: ["Smart construction", "Modern engineering", "Process optimization"] },
              { title: "Sustainability", icon: Globe, items: ["Resource optimization", "Long-term thinking", "Responsible infrastructure"] }
            ].map((dna, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="group relative p-8 bg-[#f7f9fc] rounded-2xl border border-[#183964]/5 hover:shadow-[0_20px_40px_rgba(24,57,100,0.08)] hover:-translate-y-2 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#183964]/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700 ease-out" />
                <dna.icon className="w-12 h-12 text-[#f36c21] mb-6 relative z-10 transition-transform group-hover:scale-110" />
                <h3 className="text-2xl font-bold text-[#183964] mb-4 relative z-10 group-hover:text-[#f36c21] transition-colors">{dna.title}</h3>
                <ul className="space-y-3 relative z-10">
                  {dna.items.map((item, idx) => (
                    <li key={idx} className="flex items-center text-[#4b5563] font-medium">
                      <CheckCircle className="w-4 h-4 text-[#183964] mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — BUILDING THE NATION */}
      <section className="py-24 bg-[#f7f9fc]">
        <div className="container-custom">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#183964] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Supporting India's <span className="text-[#f36c21]">Infrastructure Vision</span>
            </h2>
            <p className="text-xl text-[#4b5563] max-w-3xl mx-auto font-medium">
              Aligning our expertise with national development goals to build world-class connectivity and utilities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            {/* SVG Road connecting cards conceptually */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#183964]/10 hidden md:block -translate-y-1/2 overflow-hidden rounded-full">
               <motion.div 
                 className="h-full bg-[#f36c21] w-1/3"
                 animate={{ x: ["-100%", "300%"] }}
                 transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
               />
            </div>

            {[
              { title: "Bharatmala Pariyojana", desc: "Developing robust highway corridors to improve freight movement and border connectivity.", img: "https://res.cloudinary.com/dkhyb43ae/image/upload/v1786390498/bysb1xtk18qvhx5lfwwh.jpg" },
              { title: "PM Gati Shakti", desc: "Multimodal connectivity infrastructure for seamless economic growth.", img: "https://res.cloudinary.com/dkhyb43ae/image/upload/v1786390676/rweyroofaklklefoeekk.jpg" },
              { title: "Sagarmala", desc: "Port-led development projects enhancing coastal infrastructure.", img: "https://res.cloudinary.com/dkhyb43ae/image/upload/v1786390844/wrxhhbrzyvwxszbjcn8k.webp" },
              { title: "National Infrastructure Pipeline", desc: "Executing critical long-term projects for social and economic progression.", img: "https://res.cloudinary.com/dkhyb43ae/image/upload/v1786391016/cb8jjhjuv92dk86yoz7b.jpg" }
            ].map((initiative, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(24,57,100,0.06)] border border-[#183964]/5 relative z-10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-full sm:w-2/5 h-48 sm:h-auto relative overflow-hidden">
                  <Image src={initiative.img} alt={initiative.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-[#183964]/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="w-full sm:w-3/5 p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-[#183964] mb-3 group-hover:text-[#f36c21] transition-colors">{initiative.title}</h3>
                  <p className="text-[#4b5563] font-medium leading-relaxed">{initiative.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — LEADERSHIP PHILOSOPHY */}
      <section className="py-24 bg-[#183964] text-white">
        <div className="container-custom">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
              Leadership Beyond <span className="text-[#f36c21]">Construction</span>
            </h2>
            <div className="w-24 h-[3px] bg-[#f36c21] mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Vision Driven Growth", quote: "We don't just execute blueprints; we envision the socio-economic impact of every structure we create." },
              { title: "Trust & Integrity", quote: "Our strongest foundation is the trust we build with our stakeholders through absolute transparency." },
              { title: "Quality First", quote: "Compromise is not in our vocabulary. Engineering excellence drives our every decision." }
            ].map((phil, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white/5 backdrop-blur-sm p-10 rounded-2xl border-t-4 border-[#f36c21] hover:bg-white/10 transition-colors shadow-lg"
              >
                <h3 className="text-2xl font-bold mb-6 text-[#f36c21]">{phil.title}</h3>
                <p className="text-xl text-white/90 italic font-medium leading-relaxed">
                  "{phil.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — CORPORATE GOVERNANCE */}
      <section className="py-24 bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#183964]" style={{ fontFamily: 'var(--font-heading)' }}>
              Governance <span className="text-[#f36c21]">Framework</span>
            </h2>
          </motion.div>

          <div className="relative border-l-[3px] border-[#183964]/10 pl-8 ml-4 space-y-12 py-4">
            {[
              { title: "Strategic Planning", desc: "Aligning long-term goals with market dynamics and national interests." },
              { title: "Risk Assessment", desc: "Rigorous evaluation and mitigation of financial, operational, and environmental risks." },
              { title: "Resource Allocation", desc: "Efficient distribution of capital, technology, and human resources." },
              { title: "Execution Excellence", desc: "On-time, within-budget delivery maintaining the highest quality standards." },
              { title: "Quality Assurance", desc: "Multi-tiered inspection and compliance with international standards." },
              { title: "Client Satisfaction", desc: "Delivering value that exceeds expectations and builds lasting relationships." }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="relative bg-[#f7f9fc] p-6 md:p-8 rounded-2xl shadow-sm border border-[#183964]/5 hover:shadow-md transition-shadow"
              >
                <div className="absolute -left-[43px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#f36c21] border-4 border-white shadow-md" />
                <h3 className="text-2xl font-bold text-[#183964] mb-2">{step.title}</h3>
                <p className="text-[#4b5563] font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — GROWTH JOURNEY */}
      <section className="py-24 bg-[#183964] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f36c21]/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        
        <div className="container-custom relative z-10">
          <div className="flex items-center justify-between mb-16">
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold m-0" style={{ fontFamily: 'var(--font-heading)' }}
            >
              Our Growth <span className="text-[#f36c21]">Story</span>
            </motion.h2>

            <div className="flex gap-4">
              <button 
                onClick={() => scrollSlider('left')}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#f36c21] hover:border-[#f36c21] transition-all text-white"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button 
                onClick={() => scrollSlider('right')}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#f36c21] hover:border-[#f36c21] transition-all text-white"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          <div ref={sliderRef} className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory custom-scrollbar scroll-smooth hide-scroll-bar">
            {[
              // { year: "2006", title: "Foundation", desc: "The journey begins with a vision to build robust infrastructure." },
              { year: "2011", title: "Incorporation", desc: "Officially incorporated as a Private Limited entity." },
              { year: "2015", title: "National Highways", desc: "Secured major contracts for National Highway expansion." },
              { year: "2018", title: "Bridge Expansion", desc: "Expanded portfolio into complex bridge and structural engineering." },
              { year: "2022", title: "₹542 Cr Portfolio", desc: "Achieved a massive milestone in expressway development." },
              { year: "Beyond", title: "Future Growth", desc: "Pioneering smart construction and sustainable infrastructure." }
            ].map((milestone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="min-w-[320px] bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 snap-start flex-shrink-0 hover:bg-white/10 hover:border-[#f36c21]/50 transition-all shadow-lg"
              >
                <div className="text-5xl font-black text-[#f36c21] mb-6 drop-shadow-sm">
                  {milestone.year}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{milestone.title}</h3>
                <p className="text-white/70 font-medium leading-relaxed">{milestone.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — INFRASTRUCTURE EXPERTISE */}
      <section className="py-24 bg-[#f7f9fc]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#183964]" style={{ fontFamily: 'var(--font-heading)' }}>
              Capabilities Across <span className="text-[#f36c21]">Infrastructure Segments</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Road Infrastructure", icon: Building2, img: "https://res.cloudinary.com/dkhyb43ae/image/upload/v1786391145/uhnf3hrxdfbip58waeqk.jpg" },
              { title: "Bridges & Structures", icon: Building2, img: "https://res.cloudinary.com/dkhyb43ae/image/upload/v1786391382/haei1ffbuepsy8mh7k6y.jpg" },
              { title: "Housing Projects", icon: Building2, img: "https://res.cloudinary.com/dkhyb43ae/image/upload/v1786391626/jasvph6aw3ehaorlcyns.jpg" },
              { title: "Irrigation & Pipelines", icon: Building2, img: "https://res.cloudinary.com/dkhyb43ae/image/upload/v1786391495/eltqhtfsehjmanfw8kuu.jpg" }
            ].map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative h-[450px] rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(24,57,100,0.15)] cursor-pointer"
              >
                <Image src={cap.img} alt={cap.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#183964] via-[#183964]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-[#f36c21]/50 rounded-2xl transition-all duration-500 z-20" />
                <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500 z-10">
                  <div className="w-14 h-14 bg-[#f36c21] rounded-xl flex items-center justify-center mb-6 text-white transform group-hover:-translate-y-2 transition-transform shadow-lg">
                    <cap.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{cap.title}</h3>
                  <div className="w-0 h-[3px] bg-[#f36c21] group-hover:w-16 transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — FUTURE VISION */}
      <section className="relative py-32 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop')" }}>
        <div className="absolute inset-0 bg-[#183964]/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#183964] via-[#183964]/60 to-[#183964]/80" />
        <div className="container-custom relative z-10 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg" style={{ fontFamily: 'var(--font-heading)' }}>
              Building <span className="text-[#f36c21]">Future Ready</span> Infrastructure
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              "Smart Construction",
              "Digital Engineering",
              "ESG Alignment",
              "Sustainable Growth",
              "National Development"
            ].map((vision, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl flex flex-col items-center justify-center gap-4 hover:bg-[#f36c21] hover:border-[#f36c21] transition-all shadow-lg text-center"
              >
                <div className="w-3 h-3 rounded-full bg-[#f36c21] group-hover:bg-white transition-colors" />
                <span className="text-lg font-bold">{vision}</span>
              </motion.div>
            ))}
          </div>
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
            Partner With A Company That Builds More Than Infrastructure
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/landmark-projects/completed" className="px-8 py-4 bg-[#183964] text-white font-bold rounded-lg hover:bg-[#183964]/90 transition-all shadow-[0_10px_20px_rgba(24,57,100,0.3)] hover:-translate-y-1 flex items-center gap-2">
              Explore Projects <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact-us" className="px-8 py-4 bg-white text-[#183964] font-bold rounded-lg hover:bg-gray-50 transition-all shadow-lg hover:-translate-y-1">
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
