'use client';

import { motion } from 'framer-motion';
import { Target, Users, Shield, Zap } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Excellence',
    description: 'We strive for perfection in every project, setting new benchmarks in the construction industry.',
  },
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Zero compromise on safety. We ensure a secure working environment for all our teams on site.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Great structures are built by great teams. We foster a culture of mutual respect and teamwork.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'Embracing modern engineering techniques and sustainable practices for future-ready infrastructure.',
  },
];

export default function CultureSection() {
  return (
    <section className="py-24 bg-white relative">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-[#183964] mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Why Work With <span className="text-[#f36c21]">S Kumar Infracons (India) Private Limited</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#6b7280] text-lg leading-relaxed font-medium"
          >
            We don't just build infrastructure; we build careers. Join a team where your expertise is valued, safety is paramount, and innovation is encouraged.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, idx) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#f7f9fc] p-8 rounded-2xl border border-[#183964]/10 hover:border-[#f36c21]/50 hover:bg-white hover:shadow-[0_20px_50px_rgba(24,57,100,0.08)] transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-[#183964]/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#f36c21] transition-colors duration-300">
                <value.icon className="w-7 h-7 text-[#183964] group-hover:text-[#183964] transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-[#183964] mb-3">{value.title}</h3>
              <p className="text-[#4b5563] text-sm leading-relaxed font-medium">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
