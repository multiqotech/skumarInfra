import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import { ArrowLeft } from 'lucide-react';
import { fallbackNews } from '@/data/newsData';

async function getNewsItem(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/slug/${slug}`, { cache: 'no-store' });
    if (!res.ok) {
      const fallbackItem = fallbackNews.find(n => n.slug === slug);
      return fallbackItem || null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching news item:`, error);
    const fallbackItem = fallbackNews.find(n => n.slug === slug);
    return fallbackItem || null;
  }
}

export default async function NewsDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const newsItem = await getNewsItem(slug);

  if (!newsItem) {
    notFound();
  }

  const dateObj = new Date(newsItem.date);
  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-[#0C0C0C]">
        <Navbar alwaysSolid={true} />
      </div>

      <article className="pt-28 pb-12 md:pb-20">
        <div className="container-custom max-w-4xl">
          
          <Link 
            href={`/newsroom?type=${newsItem.type}`}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#17375E] transition-colors mb-8 text-sm uppercase tracking-wider font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {newsItem.type.replace('-', ' ')}
          </Link>

          <header className="mb-10">
            <h1 className="text-3xl md:text-5xl font-light text-[#0C0C0C] leading-tight mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              {newsItem.headline}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="font-medium text-[#17375E] uppercase tracking-wider bg-[#17375E]/10 px-3 py-1 rounded">
                {newsItem.type.replace('-', ' ')}
              </span>
              <span>{formattedDate}</span>
            </div>
          </header>

          {newsItem.type === 'press-releases' && (
            <div className="space-y-8">
              {newsItem.image && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                  <Image 
                    src={newsItem.image} 
                    alt={newsItem.headline}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="prose prose-lg max-w-none text-gray-700 font-light leading-relaxed whitespace-pre-wrap">
                {newsItem.body}
              </div>
            </div>
          )}

          {newsItem.type === 'electronic-media' && (
            <div className="space-y-8">
              {newsItem.videoLink && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-xl">
                  {newsItem.videoLink.includes('youtube.com') || newsItem.videoLink.includes('youtu.be') ? (
                    <iframe 
                      className="w-full h-full"
                      src={newsItem.videoLink.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
                      title={newsItem.headline}
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center flex-col gap-4 bg-gray-100 p-8 text-center border border-gray-200">
                      <p className="text-gray-600">Video link provided is not a standard YouTube embed.</p>
                      <a href={newsItem.videoLink} target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-[#17375E] text-white rounded font-medium hover:bg-[#17375E]/90 transition-colors">
                        Watch Original Video
                      </a>
                    </div>
                  )}
                </div>
              )}
              
              {newsItem.description && (
                <div className="prose prose-lg max-w-none text-gray-700 font-light leading-relaxed">
                  {newsItem.description}
                </div>
              )}
            </div>
          )}

          {newsItem.type === 'featured-stories' && (
            <div className="py-20 text-center border-t border-gray-200 mt-12">
              <p className="text-gray-500 mb-6">This featured story is available as a PDF document.</p>
              <a 
                href={newsItem.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#FFB800] text-[#0C0C0C] rounded-lg font-bold hover:bg-[#FFB800]/90 transition-colors shadow-lg"
              >
                View PDF Document
              </a>
            </div>
          )}

        </div>
      </article>

      <Footer />
    </main>
  );
}
