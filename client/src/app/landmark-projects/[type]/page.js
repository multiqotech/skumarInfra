import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import { HiMapPin } from 'react-icons/hi2';
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
      heroImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=800&fit=crop'
    },
    'completed': { 
      title: 'Completed Projects', 
      tagline: 'Masterpieces of engineering that stand the test of time.',
      heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=800&fit=crop'
    },
    'awarded': { 
      title: 'Awarded Projects', 
      tagline: 'Upcoming landmark projects poised to shape tomorrow.',
      heroImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&h=800&fit=crop'
    }
  };

  const pageTitle = typeLabels[type].title;
  const pageTagline = typeLabels[type].tagline;
  const heroImage = typeLabels[type].heroImage;

  return (
    <main className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 container-custom text-center mt-20">
          <div className="inline-flex items-center gap-4 mb-4 md:mb-6">
            <div className="w-12 h-1 bg-[#FFB800]" />
            <span className="text-[#FFB800] uppercase tracking-[0.3em] font-bold text-xs md:text-sm">
              {pageTitle}
            </span>
            <div className="w-12 h-1 bg-[#FFB800]" />
          </div>
          
          <h1 
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-white uppercase tracking-wider mb-4 drop-shadow-lg px-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {pageTitle}
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed px-4">
            {pageTagline}
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 md:py-32">
        <div className="container-custom">
          {!projects || projects.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#18181B] rounded-3xl border border-black/5 dark:border-white/5 shadow-xl">
              <h3 className="text-2xl font-bold text-[#09090B] dark:text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>No {pageTitle} Found</h3>
              <p className="text-zinc-500 dark:text-zinc-400">More projects are being added. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div key={project._id} className="group block bg-white dark:bg-[#18181B] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-black/5 dark:border-white/5 flex flex-col h-full">
                  <div className="relative w-full h-64 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-6 right-6">
                      <span className="px-3 py-1 bg-[#FFB800] text-black text-xs font-bold uppercase tracking-wider rounded shadow-lg">
                        {project.category.replace(/-/g, ' ')}
                      </span>
                    </div>

                    <h3 className="absolute bottom-6 left-6 right-6 text-2xl font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                      {project.title}
                    </h3>
                  </div>
                  
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    {project.location && (
                      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-4 text-sm font-medium">
                        <HiMapPin className="w-5 h-5 text-[#FFB800]" />
                        {project.location}
                      </div>
                    )}
                    <p className="text-zinc-600 dark:text-zinc-400 line-clamp-3 flex-1">
                      {project.description || "No description provided."}
                    </p>
                    
                    <Link 
                      href={`/we-build/${project.category}/${project._id}`}
                      className="mt-6 inline-flex items-center gap-2 text-[#FFB800] font-semibold uppercase tracking-wider text-sm hover:text-[#09090B] dark:hover:text-white transition-colors"
                    >
                      View Project Details
                      <span className="transition-transform group-hover:translate-x-1">→</span>
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
