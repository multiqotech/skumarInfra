import Image from 'next/image';
import Link from 'next/link';

export default function CardLayout({ items }) {
  if (!items || items.length === 0) {
    return <div className="text-center text-[#4b5563] font-medium">Content coming soon.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item, index) => {
        const isExternal = item.link && item.link.startsWith('http');
        const CardWrapper = item.link ? (isExternal ? 'a' : Link) : 'div';
        const wrapperProps = item.link 
          ? (isExternal ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' } : { href: item.link }) 
          : {};

        return (
          <CardWrapper 
            key={item.id || index}
            {...wrapperProps}
            className="group block bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(24,57,100,0.06)] hover:shadow-[0_20px_50px_rgba(24,57,100,0.12)] hover:-translate-y-2 transition-all duration-300 border border-[#183964]/5 flex flex-col h-full"
          >
            {item.image && (
              <div className="relative w-full h-64 overflow-hidden border-b border-[#183964]/5">
                <Image
                  src={item.image}
                  alt={item.title || 'Card Image'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#183964]/90 via-[#183964]/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                {item.title && (
                  <h3 className="absolute bottom-6 left-6 right-6 text-2xl font-bold text-white leading-tight drop-shadow-md" style={{ fontFamily: 'var(--font-heading)' }}>
                    {item.title}
                  </h3>
                )}
              </div>
            )}
            
            {(!item.image && item.title) && (
              <div className="p-8 pb-4 relative">
                <div className="absolute top-0 left-8 w-12 h-1 bg-[#f36c21]" />
                <h3 className="text-2xl font-bold text-[#183964] mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {item.title}
                </h3>
              </div>
            )}

            {item.description && (
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <p className="text-[#4b5563] font-medium leading-relaxed line-clamp-4 flex-1">
                  {item.description}
                </p>
                {item.link && (
                  <div className="mt-6 flex items-center gap-2 text-[#f36c21] font-bold uppercase tracking-wider text-sm group-hover:text-[#d45a14] transition-colors">
                    Visit Website
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                )}
              </div>
            )}
          </CardWrapper>
        );
      })}
    </div>
  );
}
