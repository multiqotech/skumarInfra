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
      <main className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-[#09090B] dark:text-white">
        {/* Hero Section */}
        <section className="relative w-full h-[65vh] flex items-end pb-16">
          <div className="absolute inset-0 z-0">
            <Image
              src={categoryData.heroImage || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=800&fit=crop'}
              alt={categoryData.name || categoryData.title}
              fill
              className="object-cover brightness-75"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/40 to-transparent" />
          </div>
          <div className="container-custom relative z-10">
            <div className="w-12 h-1 bg-[#FFB800] mb-6" />
            <h1 className="text-white text-5xl md:text-7xl font-bold uppercase tracking-wider drop-shadow-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
              {categoryData.name || categoryData.title}
            </h1>
          </div>
        </section>

        {/* Tagline & Description Section */}
        <section className="py-20 lg:py-28 container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[#09090B] dark:text-white text-3xl md:text-[2.5rem] font-bold uppercase mb-8 leading-[1.2]" style={{ fontFamily: 'var(--font-heading)' }}>
                {categoryData.tagline}
              </h2>
              <div className="w-full h-[1px] bg-zinc-200 dark:bg-white/10 mb-8" />
              <p className="text-zinc-600 dark:text-white/80 text-lg leading-relaxed text-justify">
                {categoryData.description}
              </p>
            </div>
            <div className="relative">
              <div className="relative h-[400px] lg:h-[500px] w-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-10 border-4 border-white dark:border-white/5">
                <Image
                  src={categoryData.descriptionImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'}
                  alt="Infrastructure Overview"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Decorative background border */}
              <div className="absolute inset-0 border-2 border-[#FFB800] translate-x-6 translate-y-6 -z-0" />
            </div>
          </div>
        </section>

        {/* Projects Grid Section */}
        <section className="bg-[#09090B] py-24 border-t border-white/10">
          <div className="container-custom">
            <div className="flex items-center gap-6 mb-16">
              <h2 className="text-white text-3xl lg:text-4xl font-bold uppercase tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
                Projects
              </h2>
              <div className="flex-1 h-[1px] bg-white/20" />
              <div className="text-white/60 text-sm tracking-widest uppercase font-medium">Show All | India | Global</div>
            </div>
            
            {projectsToDisplay.length === 0 ? (
              <div className="text-white/50 text-center py-20">No projects found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
                {projectsToDisplay.map((project, idx) => {
                  const projectId = project._id || idx.toString();
                  return (
                    <Link 
                      href={`/we-build/${slug}/${projectId}`} 
                      key={projectId} 
                      className={`block relative group overflow-hidden rounded-md border border-white/10 ${project.className || 'col-span-1 md:col-span-1 md:row-span-1'}`}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-90" />
                      
                      <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-white text-xl md:text-2xl font-medium tracking-wide drop-shadow-md" style={{ fontFamily: 'var(--font-heading)' }}>
                          {project.title}
                        </h3>
                        <div className="w-0 h-[2px] bg-[#FFB800] mt-3 group-hover:w-16 transition-all duration-500" />
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
