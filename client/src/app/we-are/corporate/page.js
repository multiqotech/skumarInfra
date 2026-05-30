"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import { ArrowRight, CheckCircle, Target, Shield, Heart, Lightbulb, Users, Globe, Building2, HardHat, TrendingUp } from 'lucide-react';
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

  return (
    <main className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] overflow-hidden">
      <Navbar />
      
      {/* SECTION 1 — HERO */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden pt-20">
        <motion.div style={{ y: yHero }} className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop"
            alt="Highway infrastructure"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/80" />
        </motion.div>

        <div className="container-custom relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Engineering India's <span className="text-[#FFB800]">Tomorrow</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto mb-16">
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
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-colors duration-300"
              >
                <h3 className="text-3xl md:text-4xl font-bold text-[#FFB800] mb-2">{stat.value}</h3>
                <p className="text-sm md:text-base font-medium tracking-wider uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — CORPORATE DNA */}
      <section className="py-24 bg-white dark:bg-[#09090B] relative">
        <div className="container-custom">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              The Foundation Of <span className="text-[#FFB800]">Everything We Build</span>
            </h2>
            <div className="w-24 h-1 bg-[#FFB800] mx-auto mt-6" />
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
                className="group relative p-8 bg-[#FAFAFA] dark:bg-[#1A1A1A] rounded-2xl border border-black/5 dark:border-white/5 hover:border-[#FFB800] transition-colors duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB800]/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700 ease-out" />
                <dna.icon className="w-12 h-12 text-[#FFB800] mb-6 relative z-10" />
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 relative z-10">{dna.title}</h3>
                <ul className="space-y-3 relative z-10">
                  {dna.items.map((item, idx) => (
                    <li key={idx} className="flex items-center text-zinc-600 dark:text-zinc-400">
                      <CheckCircle className="w-4 h-4 text-[#FFB800] mr-3 flex-shrink-0" />
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
      <section className="py-24 bg-[#FAFAFA] dark:bg-[#09090B]">
        <div className="container-custom">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Supporting India's <span className="text-[#FFB800]">Infrastructure Vision</span>
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
              Aligning our expertise with national development goals to build world-class connectivity and utilities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            {/* SVG Road connecting cards conceptually */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#FFB800]/20 hidden md:block -translate-y-1/2 overflow-hidden rounded-full">
               <motion.div 
                 className="h-full bg-[#FFB800] w-1/3"
                 animate={{ x: ["-100%", "300%"] }}
                 transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
               />
            </div>

            {[
              { title: "Bharatmala Pariyojana", desc: "Developing robust highway corridors to improve freight movement and border connectivity.", img: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=800&h=500&fit=crop" },
              { title: "PM Gati Shakti", desc: "Multimodal connectivity infrastructure for seamless economic growth.", img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=500&fit=crop" },
              { title: "Sagarmala", desc: "Port-led development projects enhancing coastal infrastructure.", img: "https://images.unsplash.com/photo-1494607239400-ff147da48308?w=800&h=500&fit=crop" },
              { title: "National Infrastructure Pipeline", desc: "Executing critical long-term projects for social and economic progression.", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=500&fit=crop" }
            ].map((initiative, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group flex flex-col sm:flex-row bg-white dark:bg-[#09090B] rounded-2xl overflow-hidden shadow-xl border border-black/5 dark:border-white/5 relative z-10"
              >
                <div className="w-full sm:w-2/5 h-48 sm:h-auto relative overflow-hidden">
                  <Image src={initiative.img} alt={initiative.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="w-full sm:w-3/5 p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">{initiative.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">{initiative.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — LEADERSHIP PHILOSOPHY */}
      <section className="py-24 bg-[#09090B] text-white">
        <div className="container-custom">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
              Leadership Beyond <span className="text-[#FFB800]">Construction</span>
            </h2>
            <div className="w-24 h-1 bg-[#FFB800] mt-6" />
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
                className="bg-[#1A1A1A] p-10 rounded-2xl border-l-4 border-[#FFB800] hover:bg-[#222] transition-colors"
              >
                <h3 className="text-2xl font-bold mb-6 text-[#FFB800]">{phil.title}</h3>
                <p className="text-xl text-zinc-300 italic font-light leading-relaxed">
                  "{phil.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — CORPORATE GOVERNANCE */}
      <section className="py-24 bg-white dark:bg-[#09090B]">
        <div className="container-custom max-w-4xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Governance <span className="text-[#FFB800]">Framework</span>
            </h2>
          </motion.div>

          <div className="relative border-l-2 border-[#FFB800]/30 pl-8 ml-4 space-y-12 py-4">
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
                className="relative bg-[#FAFAFA] dark:bg-[#1A1A1A] p-6 md:p-8 rounded-2xl shadow-sm border border-black/5 dark:border-white/5"
              >
                <div className="absolute -left-[41px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FFB800] border-4 border-white dark:border-[#09090B] shadow-lg" />
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — GROWTH JOURNEY */}
      <section className="py-24 bg-[#09090B] text-white overflow-hidden">
        <div className="container-custom">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-16" style={{ fontFamily: 'var(--font-heading)' }}
          >
            Our Growth <span className="text-[#FFB800]">Story</span>
          </motion.h2>

          <div className="flex gap-6 overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar">
            {[
              { year: "2006", title: "Foundation", desc: "The journey begins with a vision to build robust infrastructure." },
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
                className="min-w-[300px] bg-[#1A1A1A] p-8 rounded-2xl border border-white/10 snap-start flex-shrink-0 hover:border-[#FFB800]/50 transition-colors"
              >
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#FFB800] to-yellow-600 mb-4">
                  {milestone.year}
                </div>
                <h3 className="text-xl font-bold mb-3">{milestone.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{milestone.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — INFRASTRUCTURE EXPERTISE */}
      <section className="py-24 bg-[#FAFAFA] dark:bg-[#09090B]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Capabilities Across <span className="text-[#FFB800]">Infrastructure Segments</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Road Infrastructure", icon: Building2, img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=800&fit=crop" },
              { title: "Bridges & Structures", icon: Building2, img: "https://images.unsplash.com/photo-1513467535987-fd81bc7d600f?w=600&h=800&fit=crop" },
              { title: "Housing Projects", icon: Building2, img: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=600&h=800&fit=crop" },
              { title: "Irrigation & Pipelines", icon: Building2, img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=800&fit=crop" }
            ].map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative h-[400px] rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              >
                <Image src={cap.img} alt={cap.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500">
                  <div className="w-12 h-12 bg-[#FFB800] rounded-full flex items-center justify-center mb-4 text-black transform group-hover:-translate-y-2 transition-transform">
                    <cap.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{cap.title}</h3>
                  <div className="w-0 h-1 bg-[#FFB800] group-hover:w-full transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — FUTURE VISION */}
      <section className="relative py-32 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/80" />
        <div className="container-custom relative z-10 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Building <span className="text-[#FFB800]">Future Ready</span> Infrastructure
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl flex items-center gap-4 hover:bg-[#FFB800]/20 hover:border-[#FFB800] transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-[#FFB800]" />
                <span className="text-lg font-semibold">{vision}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — CTA */}
      <section className="py-24 bg-[#FFB800]">
        <div className="container-custom text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-zinc-900 mb-10" 
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
            <Link href="/we-build" className="px-8 py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-colors flex items-center gap-2">
              Explore Projects <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact-us" className="px-8 py-4 bg-white text-zinc-900 font-bold rounded-lg hover:bg-[#FAFAFA] transition-colors border border-transparent hover:border-black/5">
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
