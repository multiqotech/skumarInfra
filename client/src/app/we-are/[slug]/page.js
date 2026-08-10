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
import BoardDirectorSection from '@/sections/BoardDirectorSection';
import TeamSection from '@/sections/TeamSection';
import VideoShowcase from '@/sections/VideoShowcase';
import WhyChooseUs from '@/sections/WhyChooseUs';
import VerticalsSection from '@/sections/VerticalsSection';
import TestimonialsSection from '@/sections/TestimonialsSection';
import FAQSection from '@/sections/FAQSection';

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

async function getSubsidiaries() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subsidiaries`, { next: { revalidate: 60 } });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error("Error fetching subsidiaries:", error);
  }
  return [];
}

export default async function WeArePage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  if (slug === 'our-businesses') {
    const subsidiaries = await getSubsidiaries();
    const subsidiaryItems = subsidiaries.map(sub => ({
      id: sub._id,
      title: sub.name,
      description: sub.description,
      image: sub.image,
      link: sub.link
    }));

    return (
      <main className="min-h-screen bg-[#f7f9fc]">
        <Navbar />
        
        {/* Simple Page Header */}
        <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1448630360428-65456885c650?w=1920&h=600&fit=crop"
              alt="Our Businesses"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#183964]/80 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#183964] via-[#183964]/40 to-transparent" />
          </div>
          <div className="container-custom relative z-10 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg" style={{ fontFamily: 'var(--font-heading)' }}>
              Our <span className="text-[#f36c21]">Businesses</span>
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto font-medium">
              Diverse Capabilities, Singular Focus
            </p>
          </div>
        </section>

        <VerticalsSection />

        {subsidiaryItems.length > 0 && (
          <section className="py-24 bg-white border-t border-[#183964]/5">
            <div className="container-custom">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-[#183964]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Our <span className="text-[#f36c21]">Subsidiary Portfolio</span>
                </h2>
                <div className="w-24 h-1 bg-[#f36c21] mx-auto mt-6" />
              </div>
              <CardLayout items={subsidiaryItems} />
            </div>
          </section>
        )}
        
        <Footer />
      </main>
    );
  }

  if (slug === 'board-of-directors') {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-[70px]">
           <BoardDirectorSection />
        </div>
        <Footer />
      </main>
    );
  }

  if (slug === 'our-team') {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-[70px]">
           <TeamSection />
        </div>
        <Footer />
      </main>
    );
  }

  if (slug === 'our-subsidiary-portfolio') {
    const subsidiaries = await getSubsidiaries();
    const items = subsidiaries.map(sub => ({
      id: sub._id,
      title: sub.name,
      description: sub.description,
      image: sub.image,
      link: sub.link
    }));

    const subsidiaryData = {
      title: 'Our Subsidiary Portfolio',
      pageData: {
        tagline: 'Expanding our horizons with strategic partnerships and group companies.',
        heroImage: 'https://res.cloudinary.com/ddh5ynpqg/image/upload/v1786296849/skconstruction/clw39vzvch81qw9x7fbb.jpg',
        items
      }
    };

    return <WeAreRenderer data={subsidiaryData} layoutType="card" />;
  }

  if (slug === 'about-us') {
    const companyData = await getPageData('our-company');
    const missionVisionItems = companyData?.pageData?.items?.filter(item => 
      item.title && (item.title.toLowerCase().includes('vision') || item.title.toLowerCase().includes('mission'))
    ) || [];

    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-[70px]">
           <VideoShowcase />
           <WhyChooseUs />
           {missionVisionItems.length > 0 && (
             <div className="container-custom py-16">
               <SectionLayout items={missionVisionItems} />
             </div>
           )}
           <VerticalsSection />
           <TestimonialsSection />
           <FAQSection />
        </div>
        <Footer />
      </main>
    );
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
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center">
        {pageInfo.heroImage && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${pageInfo.heroImage})` }}
            />
            <div className="absolute inset-0 bg-[#183964]/80 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#183964] via-[#183964]/40 to-transparent" />
          </>
        )}
        
        <div className="relative z-10 container-custom text-center mt-20">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-12 h-1 bg-[#f36c21]" />
            <span className="text-[#f36c21] uppercase tracking-[0.3em] font-bold text-sm md:text-base">
              S KUMAR INFRACONS
            </span>
            <div className="w-12 h-1 bg-[#f36c21]" />
          </div>
          
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-wider mb-6 drop-shadow-lg"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {data.title === 'Our Company' ? 'About US' : data.title}
          </h1>
          
          {pageInfo.tagline && (
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
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
