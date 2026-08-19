import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import { HiMapPin, HiClock, HiUserGroup, HiOutlineCalendar } from 'react-icons/hi2';
import { weBuildData } from '@/data/weBuildData';

async function getLandmarkProjects(type) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/type/${type}`, { next: { revalidate: 0 } }); // disable cache so it updates when admin adds
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Error fetching ${type} projects:`, error);
    return null;
  }
}

export default async function LandmarkProjectsPage({ params }) {
  const resolvedParams = await params;
  const type = resolvedParams.type;

  if (type !== 'ongoing' && type !== 'completed' && type !== 'awarded') {
    notFound();
  }

  let projects = await getLandmarkProjects(type);

  if (!projects || projects.length === 0) {
    // Basic fallback if DB is empty
    projects = [];
  }
  
  const typeLabels = {
    'ongoing': { 
      title: 'Ongoing Projects', 
      tagline: 'Building the future with groundbreaking infrastructure across the globe.',
      heroImage: 'https://res.cloudinary.com/dkhyb43ae/image/upload/v1786391852/is36dtziemk5xib4omzq.jpg'
    },
    'completed': { 
      title: 'Completed Projects', 
      tagline: 'Masterpieces of engineering that stand the test of time.',
      heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=800&fit=crop'
    },
    'awarded': { 
      title: 'Newly Awarded Projects', 
      tagline: 'Upcoming landmark projects poised to shape tomorrow.',
      heroImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&h=800&fit=crop'
    }
  };

  const pageTitle = typeLabels[type].title;
  const pageTagline = typeLabels[type].tagline;
  const heroImage = typeLabels[type].heroImage;

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-[#183964]/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#183964] via-[#183964]/40 to-transparent" />
        
        <div className="relative z-10 container-custom text-center mt-20">
          <div className="inline-flex items-center gap-4 mb-4 md:mb-6">
            <div className="w-12 h-1 bg-[#f36c21]" />
            <span className="text-[#f36c21] uppercase tracking-[0.3em] font-bold text-xs md:text-sm">
              {pageTitle}
            </span>
            <div className="w-12 h-1 bg-[#f36c21]" />
          </div>
          
          <h1 
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-white uppercase tracking-wider mb-4 drop-shadow-lg px-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {pageTitle}
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed px-4 drop-shadow">
            {pageTagline}
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 md:py-32">
        <div className="container-custom">
          {type === 'completed' ? (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl border border-[#183964]/10 shadow-xl">
              <div className="w-24 h-24 mb-8 bg-[#f36c21]/10 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-[#f36c21]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h2 className="text-4xl font-bold text-[#183964] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Under Construction</h2>
              <p className="text-lg text-[#4b5563] max-w-lg mx-auto">
                We are currently updating our completed projects portfolio. Please check back later to see our masterpieces of engineering.
              </p>
            </div>
          ) : !projects || projects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#183964]/10 shadow-xl">
              <h3 className="text-2xl font-bold text-[#183964] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>No {pageTitle} Found</h3>
              <p className="text-[#4b5563]">More projects are being added. Check back soon.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {projects.map((project) => (
                <div key={project._id} className="flex flex-col lg:flex-row bg-[#130f54] rounded-sm overflow-hidden shadow-[0_20px_50px_rgba(19,15,84,0.3)] border border-white/5">
                  
                  {/* Left Side: Images */}
                  <div className="w-full lg:w-1/2 flex flex-col p-2 gap-2 bg-white">
                    <div className="relative w-full h-[300px] md:h-[400px]">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Thumbnails (Placeholder layout matching RSIL) */}
                    {/* 
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((idx) => (
                        <div key={idx} className="relative w-full aspect-video group cursor-pointer overflow-hidden bg-gray-200">
                          <Image 
                            src={project.image} 
                            alt={`${project.title} thumbnail ${idx}`} 
                            fill 
                            className="object-cover opacity-70 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-500" 
                          />
                        </div>
                      ))}
                    </div>
                    */}
                  </div>

                  {/* Right Side: Details */}
                  <div className="w-full lg:w-1/2 p-8 md:p-10 lg:p-12 text-white flex flex-col justify-center">
                    <h3 className="text-xl md:text-2xl font-bold uppercase mb-8 pb-4 leading-relaxed" style={{ fontFamily: 'var(--font-heading)' }}>
                      {project.title}
                    </h3>
                    
                    <div className="space-y-5 text-sm md:text-base text-white/90">
                      <div className="flex gap-4">
                        <span className="font-semibold w-1/3 md:w-1/4 text-white">Location:</span>
                        <span className="w-2/3 md:w-3/4">{project.location || 'N/A'}</span>
                      </div>
                      
                      {project.timeToBuild && (
                        <div className="flex gap-4">
                          <span className="font-semibold w-1/3 md:w-1/4 text-white">Timeline:</span>
                          <span className="w-2/3 md:w-3/4">{project.timeToBuild}</span>
                        </div>
                      )}
                      
                      {project.client && (
                        <div className="flex gap-4">
                          <span className="font-semibold w-1/3 md:w-1/4 text-white">Client:</span>
                          <span className="w-2/3 md:w-3/4">{project.client}</span>
                        </div>
                      )}

                      {project.epcContractor && (
                        <div className="flex gap-4">
                          <span className="font-semibold w-1/3 md:w-1/4 text-white">EPC Contractor:</span>
                          <span className="w-2/3 md:w-3/4">{project.epcContractor}</span>
                        </div>
                      )}

                      {project.epcSubContractor && (
                        <div className="flex gap-4">
                          <span className="font-semibold w-1/3 md:w-1/4 text-white">EPC Sub-Contractor:</span>
                          <span className="w-2/3 md:w-3/4">{project.epcSubContractor}</span>
                        </div>
                      )}

                      {project.projectCost && (
                        <div className="flex gap-4">
                          <span className="font-semibold w-1/3 md:w-1/4 text-white">Project Cost:</span>
                          <span className="w-2/3 md:w-3/4 line-clamp-3">{project.projectCost}</span>
                        </div>
                      )}
                    </div>

                    <Link 
                      href={`/we-build/${project.category}/${project._id}`}
                      className="mt-10 inline-flex items-center justify-center bg-white text-[#130f54] px-8 py-3 font-bold uppercase tracking-wider text-sm hover:bg-[#f36c21] hover:text-white transition-colors self-start rounded-sm"
                    >
                      View Details
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
