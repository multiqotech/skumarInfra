import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import { ArrowLeft } from 'lucide-react';

async function getNewsItem(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/slug/${slug}`, { cache: 'no-store' });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching news item:`, error);
    return null;
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
      <div className="bg-white">
        <Navbar alwaysSolid={true} />
      </div>

      <article className="pt-28 pb-12 md:pb-20">
        <div className="container-custom max-w-4xl">
          
          <Link 
            href={`/newsroom?type=${newsItem.type}`}
            className="inline-flex items-center gap-2 text-[#4b5563] hover:text-[#f36c21] transition-colors mb-8 text-sm uppercase tracking-wider font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {newsItem.type.replace('-', ' ')}
          </Link>

          <header className="mb-10 border-b border-[#183964]/10 pb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-[#183964] leading-tight mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              {newsItem.headline}
            </h1>
            <div className="flex items-center gap-4 text-sm font-medium text-[#4b5563]">
              <span className="font-bold text-white uppercase tracking-wider bg-[#f36c21] px-3 py-1 rounded shadow-sm">
                {newsItem.type.replace('-', ' ')}
              </span>
              <span>{formattedDate}</span>
            </div>
          </header>

          {newsItem.type === 'press-releases' && (
            <div className="space-y-8">
              {newsItem.image && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#f7f9fc] border border-[#183964]/5 shadow-sm">
                  <Image 
                    src={newsItem.image} 
                    alt={newsItem.headline}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="prose prose-lg max-w-none text-[#4b5563] leading-relaxed whitespace-pre-wrap font-medium">
                {newsItem.body}
              </div>
            </div>
          )}

          {newsItem.type === 'electronic-media' && (
            <div className="space-y-8">
              {newsItem.videoLink && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#183964] shadow-xl border border-[#183964]/10">
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
                    <div className="w-full h-full flex items-center justify-center flex-col gap-4 bg-[#f7f9fc] p-8 text-center border border-[#183964]/5">
                      <p className="text-[#183964] font-medium">Video link provided is not a standard YouTube embed.</p>
                      <a href={newsItem.videoLink} target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-[#f36c21] text-white rounded font-bold hover:bg-[#d45a14] transition-colors shadow-md">
                        Watch Original Video
                      </a>
                    </div>
                  )}
                </div>
              )}
              
              {newsItem.description && (
                <div className="prose prose-lg max-w-none text-[#4b5563] leading-relaxed font-medium">
                  {newsItem.description}
                </div>
              )}
            </div>
          )}

          {newsItem.type === 'featured-stories' && (
            <div className="py-20 text-center border-t border-[#183964]/10 mt-12 bg-[#f7f9fc] rounded-2xl">
              <p className="text-[#4b5563] font-medium mb-6 text-lg">This featured story is available as a PDF document.</p>
              <a 
                href={newsItem.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#f36c21] text-white rounded-lg font-bold hover:bg-[#d45a14] transition-colors shadow-[0_10px_20px_rgba(243,108,33,0.3)]"
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
