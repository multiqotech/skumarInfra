import Image from 'next/image';

export default function SectionLayout({ items }) {
  if (!items || items.length === 0) {
    return <div className="text-center text-[#4b5563] font-medium">Content coming soon.</div>;
  }

  return (
    <div className="space-y-24">
      {items.map((item, index) => {
        const isEven = index % 2 === 0;
        
        return (
          <div key={item.id || index} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}>
            
            {/* Image Side */}
            {item.image && (
              <div className="w-full lg:w-1/2">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(24,57,100,0.15)] border-[6px] border-white group">
                  <Image
                    src={item.image}
                    alt={item.title || 'Section Image'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#183964]/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              </div>
            )}
            
            {/* Content Side */}
            <div className={`w-full ${item.image ? 'lg:w-1/2' : ''}`}>
              {item.title && (
                <div className="mb-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#183964] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                    {item.title}
                  </h2>
                  <div className="w-16 h-[3px] bg-[#f36c21]" />
                </div>
              )}
              
              {item.content && (
                <div className="prose prose-lg max-w-none text-[#4b5563] font-medium text-justify">
                  {item.content.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        );
      })}
    </div>
  );
}
