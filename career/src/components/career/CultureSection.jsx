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
    <section className="py-24 bg-[var(--color-dark)]">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Why Work With <span className="text-[#FFB800]">SK Constructions</span>?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg leading-relaxed"
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
              className="bg-[var(--color-dark-card)] p-8 rounded-2xl border border-[var(--color-dark-border)] hover:border-[#FFB800]/50 hover:bg-[#1a1a1a] transition-all group"
            >
              <div className="w-14 h-14 bg-[#FFB800]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#FFB800] transition-colors">
                <value.icon className="w-7 h-7 text-[#FFB800] group-hover:text-black transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
