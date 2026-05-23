import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import { weAreData } from '@/data/weAreData';
import { weBuildData } from '@/data/weBuildData';
import SectionLayout from '../components/SectionLayout';
import CardLayout from '../components/CardLayout';
import LocationLayout from '../components/LocationLayout';
import GalleryLayout from '../components/GalleryLayout';
import OfficeLayout from '../components/OfficeLayout';

// Define the layout mapping based on the slug
const LAYOUT_MAP = {
  'our-company': 'section',
  'our-global-presence': 'location',
  'our-unique-capabilities': 'section',
  'our-innovation-centres': 'card',
};

async function getPageData(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/we-are/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.error("Error fetching We Are page:", error);
  }
  
  // Fallback to dummy data
  return weAreData[slug];
}

export default async function WeArePage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  if (slug === 'our-businesses') {
    // Generate page data dynamically from weBuildData
    const items = Object.entries(weBuildData).map(([key, data]) => ({
      id: key,
      title: data.title,
      description: data.tagline || data.description.substring(0, 100) + '...',
      image: (data.projects && data.projects.length > 0) ? data.projects[0].image : data.heroImage,
      link: `/we-build/${key}`
    }));

    const businessData = {
      title: 'Our Businesses',
      pageData: {
        tagline: 'Diverse Capabilities, Singular Focus',
        heroImage: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=1600&h=600&fit=crop',
        items
      }
    };

    return <WeAreRenderer data={businessData} layoutType="card" />;
  }

  const layoutType = LAYOUT_MAP[slug];

  if (!layoutType) {
    notFound();
  }

  const data = await getPageData(slug);
  if (!data) {
    notFound();
  }

  return <WeAreRenderer data={data} layoutType={layoutType} />;
}

function WeAreRenderer({ data, layoutType }) {
  const pageInfo = data.pageData || {};

  return (
    <main className="min-h-screen bg-[#F5F1EA]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center">
        {pageInfo.heroImage && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${pageInfo.heroImage})` }}
            />
            <div className="absolute inset-0 bg-black/60" />
          </>
        )}
        
        <div className="relative z-10 container-custom text-center mt-20">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-12 h-1 bg-[#FFB800]" />
            <span className="text-[#FFB800] uppercase tracking-[0.3em] font-bold text-sm md:text-base">
              S KUMAR INFRACONS
            </span>
            <div className="w-12 h-1 bg-[#FFB800]" />
          </div>
          
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-wider mb-6 drop-shadow-lg"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {data.title}
          </h1>
          
          {pageInfo.tagline && (
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed">
              {pageInfo.tagline}
            </p>
          )}
        </div>
      </section>

      {/* Dynamic Content Section */}
      <section className="py-20 md:py-32">
        <div className="container-custom">
          {layoutType === 'section' && <SectionLayout items={pageInfo.items || []} />}
          {layoutType === 'card' && <CardLayout items={pageInfo.items || []} />}
          {layoutType === 'location' && <LocationLayout items={pageInfo.items || []} />}
          {layoutType === 'gallery' && <GalleryLayout items={pageInfo.items || []} />}
          {layoutType === 'office' && <OfficeLayout items={pageInfo.items || []} />}
        </div>
      </section>

      <Footer />
    </main>
  );
}
