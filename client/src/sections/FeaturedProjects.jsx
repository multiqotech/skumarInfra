'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Link from 'next/link';

export default function FeaturedProjects() {
  const scrollRef = useRef(null);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
        if (res.ok) {
          const data = await res.json();
          setFeaturedProjects(data);
        }
      } catch (err) {
        console.error("Failed to fetch featured projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -340 : 340,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-[#FAFAFA] dark:bg-[#09090B] py-14 lg:py-20" id="projects">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <AnimateOnScroll>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-[3px] bg-[#FFB800]" />
              <span
                className="text-[#FFB800] text-[11px] tracking-[0.25em] uppercase font-semibold"
                
              >
                Portfolio
              </span>
            </div>
            <h2
              className="text-zinc-900 dark:text-white text-2xl md:text-3xl lg:text-4xl font-bold"
              
            >
              Our Featured Projects
            </h2>
          </AnimateOnScroll>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-11 h-11 border border-black/5 dark:border-white/10 rounded-lg flex items-center justify-center text-zinc-900 dark:text-white hover:bg-[#FFB800] dark:hover:bg-[#FFB800] hover:border-[#FFB800] dark:hover:border-[#FFB800] hover:text-[#09090B] dark:hover:text-[#09090B] transition-all duration-300"
              aria-label="Previous"
            >
              <HiArrowLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-11 h-11 bg-[#FFB800] rounded-lg flex items-center justify-center text-[#09090B] hover:bg-[#FFC933] transition-all duration-300"
              aria-label="Next"
            >
              <HiArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Cards */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 px-5 lg:px-[calc((100vw-1280px)/2+1.25rem)] scrollbar-hide"
      >
        {loading ? (
          <div className="text-zinc-500 dark:text-white/50 px-5">Loading projects...</div>
        ) : (
          featuredProjects.map((project, index) => (
            <Link key={project._id || index} href={`/we-build/${project.category}/${project._id}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                viewport={{ once: true }}
                className="group relative flex-shrink-0 w-[280px] h-[380px] rounded-2xl overflow-hidden cursor-pointer block"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="w-6 h-[3px] bg-[#FFB800] mb-2 transition-all duration-300 group-hover:w-10" />
                  <h3
                    className="text-white text-lg font-bold"
                  >
                    {project.title}
                  </h3>
                  <p className="text-white/50 text-[13px] mt-1">{project.location}</p>
                </div>

                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#FFB800]/30 transition-all duration-500 rounded-2xl" />
              </motion.div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
