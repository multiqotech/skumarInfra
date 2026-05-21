import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi';
import { HiMapPin, HiClock, HiUserGroup, HiBuildingOffice2 } from 'react-icons/hi2';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import { weBuildData } from '@/data/weBuildData';

export default async function ProjectDetailsPage({ params }) {
  const resolvedParams = await params;
  const { slug, projectId } = resolvedParams;

  let project = null;

  // Try to fetch from DB first
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}`, { 
      cache: 'no-store' 
    });
    if (res.ok) {
      project = await res.json();
    }
  } catch (err) {
    console.log(`Failed to fetch project ${projectId} from DB.`);
  }

  // Fallback to static dummy data if not found in DB
  if (!project) {
    const staticCategory = weBuildData[slug];
    if (staticCategory && staticCategory.projects) {
      // projectId might be the array index if it's dummy data
      const idx = parseInt(projectId, 10);
      if (!isNaN(idx) && staticCategory.projects[idx]) {
        project = staticCategory.projects[idx];
        project.category = slug;
      }
    }
  }

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FFFDF9] text-[#0C0C0C] pt-24 pb-20">
        <div className="container-custom">
          {/* Back Button */}
          <Link 
            href={`/we-build/${slug}`}
            className="inline-flex items-center gap-2 text-[#FFB800] hover:text-[#0C0C0C] font-semibold tracking-wide uppercase transition-colors mb-8"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <HiArrowLeft className="h-5 w-5" />
            Back to {slug.replace(/-/g, ' ')}
          </Link>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Column: Image & Details */}
            <div className="lg:col-span-8 space-y-8">
              <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl border border-black/5">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div>
                <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wide text-[#0C0C0C] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                  {project.title}
                </h1>
                
                <div className="bg-[#F5F1EA] rounded-xl p-6 md:p-8 border border-[#E8E0D0]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-1 bg-[#FFB800]"></div>
                    <h3 className="text-[#0C0C0C] text-sm font-bold tracking-[0.15em] uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
                      Project Description
                    </h3>
                  </div>
                  <p className="text-gray-600 text-[16px] leading-relaxed text-justify">
                    {project.description || 'Detailed description for this project will be available soon. This is a landmark project showcasing our engineering excellence and commitment to delivering world-class infrastructure.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Key Stats Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-[#0C0C0C] rounded-xl p-8 sticky top-32 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
                <h3 className="text-white text-2xl font-bold uppercase tracking-wider mb-8 flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)' }}>
                  <div className="w-8 h-1 bg-[#FFB800]"></div>
                  Project Details
                </h3>

                <div className="space-y-6">
                  {/* Category */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FFB800]/10 flex items-center justify-center flex-shrink-0">
                      <HiBuildingOffice2 className="h-5 w-5 text-[#FFB800]" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs tracking-widest uppercase mb-1 font-semibold">Category</p>
                      <p className="text-white font-medium capitalize">{slug.replace(/-/g, ' ')}</p>
                    </div>
                  </div>

                  <div className="w-full h-px bg-white/10"></div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FFB800]/10 flex items-center justify-center flex-shrink-0">
                      <HiMapPin className="h-5 w-5 text-[#FFB800]" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs tracking-widest uppercase mb-1 font-semibold">Location</p>
                      <p className="text-white font-medium">{project.location || 'Global Hub'}</p>
                    </div>
                  </div>

                  <div className="w-full h-px bg-white/10"></div>

                  {/* Time to Build */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FFB800]/10 flex items-center justify-center flex-shrink-0">
                      <HiClock className="h-5 w-5 text-[#FFB800]" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs tracking-widest uppercase mb-1 font-semibold">Time to Build</p>
                      <p className="text-white font-medium">{project.timeToBuild || '24 Months'}</p>
                    </div>
                  </div>

                  <div className="w-full h-px bg-white/10"></div>

                  {/* Engineers */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FFB800]/10 flex items-center justify-center flex-shrink-0">
                      <HiUserGroup className="h-5 w-5 text-[#FFB800]" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs tracking-widest uppercase mb-1 font-semibold">Key Engineers</p>
                      <p className="text-white font-medium leading-snug">{project.engineers || 'John Doe, Jane Smith'}</p>
                    </div>
                  </div>

                </div>

                {/* Decorative Elements */}
                <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
                  <div className="text-[#FFB800] text-xs font-bold tracking-[0.2em] uppercase">
                    SK Construction
                  </div>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFB800]/50"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFB800]/20"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
