import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import { weBuildData } from '@/data/weBuildData';

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
    if (res.ok) {
      const categories = await res.json();
      return categories.map((cat) => ({ slug: cat.slug }));
    }
  } catch (err) {
    console.error(err);
  }
  return Object.keys(weBuildData).map((slug) => ({
    slug,
  }));
}

export default async function WeBuildPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  let categoryData = null;
  let dynamicProjects = [];

  try {
    const resCat = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/slug/${slug}`, { 
      cache: 'no-store' 
    });
    if (resCat.ok) {
      categoryData = await resCat.json();
      if (categoryData.projects && categoryData.projects.length > 0) {
        dynamicProjects = categoryData.projects;
      } else {
        // Fallback to fetch from projects API directly just in case
        const resProj = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/category/${slug}`, { cache: 'no-store' });
        if (resProj.ok) dynamicProjects = await resProj.json();
      }
    }
  } catch (err) {
    console.log(`Failed to fetch category data for ${slug}.`);
  }

  // Fallback to static data
  if (!categoryData) {
    categoryData = weBuildData[slug];
    if (!categoryData) notFound();
    
    // Try to fetch projects for static category
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/category/${slug}`, { cache: 'no-store' });
      if (res.ok) dynamicProjects = await res.json();
    } catch (err) {}
  }

  const projectsToDisplay = dynamicProjects.length > 0 ? dynamicProjects : (categoryData.projects || []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f7f9fc]">
        {/* Hero Section */}
        <section className="relative w-full h-[65vh] flex items-end pb-16">
          <div className="absolute inset-0 z-0">
            <Image
              src={categoryData.heroImage || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=800&fit=crop'}
              alt={categoryData.name || categoryData.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[#183964]/80 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#183964] via-[#183964]/40 to-transparent" />
          </div>
          <div className="container-custom relative z-10">
            <div className="w-12 h-1 bg-[#f36c21] mb-6 shadow-[0_0_10px_rgba(243,108,33,0.5)]" />
            <h1 className="text-white text-5xl md:text-7xl font-bold uppercase tracking-wider drop-shadow-lg" style={{ fontFamily: 'var(--font-heading)' }}>
              {categoryData.name || categoryData.title}
            </h1>
          </div>
        </section>

        {/* Tagline & Description Section */}
        <section className="py-20 lg:py-28 container-custom bg-white mt-12 rounded-3xl shadow-[0_20px_50px_rgba(24,57,100,0.04)] border border-[#183964]/5 relative z-20 -top-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center px-4 lg:px-8">
            <div>
              <h2 className="text-[#183964] text-3xl md:text-[2.5rem] font-bold uppercase mb-8 leading-[1.2]" style={{ fontFamily: 'var(--font-heading)' }}>
                {categoryData.tagline}
              </h2>
              <div className="w-full h-[2px] bg-[#183964]/10 mb-8" />
              <p className="text-[#4b5563] text-lg leading-relaxed text-justify font-medium">
                {categoryData.description}
              </p>
            </div>
            <div className="relative">
              <div className="relative h-[400px] lg:h-[500px] w-full overflow-hidden shadow-2xl z-10 border-[6px] border-white rounded-xl">
                <Image
                  src={categoryData.descriptionImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'}
                  alt="Infrastructure Overview"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Decorative background border */}
              <div className="absolute inset-0 border-[4px] border-[#f36c21] translate-x-6 translate-y-6 rounded-xl -z-0" />
            </div>
          </div>
        </section>

        {/* Projects Grid Section */}
        <section className="bg-[#183964] py-24 mt-[-6rem] pt-32">
          <div className="container-custom">
            <div className="flex items-center gap-6 mb-16">
              <h2 className="text-white text-3xl lg:text-4xl font-bold uppercase tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
                Projects
              </h2>
              <div className="flex-1 h-[2px] bg-white/20" />
              <div className="text-[#f36c21] text-sm tracking-widest uppercase font-bold">Show All | India | Global</div>
            </div>
            
            {projectsToDisplay.length === 0 ? (
              <div className="text-white/70 text-center py-20 font-medium">No projects found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[250px] md:auto-rows-[350px]">
                {projectsToDisplay.map((project, idx) => {
                  const projectId = project._id || idx.toString();
                  return (
                    <Link 
                      href={`/we-build/${slug}/${projectId}`} 
                      key={projectId} 
                      className={`block relative group overflow-hidden rounded-xl border border-white/10 shadow-lg ${project.className || 'col-span-1 md:col-span-1 md:row-span-1'}`}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#183964] via-[#183964]/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="absolute inset-0 border-4 border-transparent group-hover:border-[#f36c21]/50 transition-colors duration-500 rounded-xl" />
                      
                      <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-white text-2xl md:text-3xl font-bold tracking-wide drop-shadow-md" style={{ fontFamily: 'var(--font-heading)' }}>
                          {project.title}
                        </h3>
                        <div className="w-0 h-[3px] bg-[#f36c21] mt-4 group-hover:w-20 transition-all duration-500" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
