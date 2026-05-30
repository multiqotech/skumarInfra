import Image from 'next/image';
import Link from 'next/link';

export default function CardLayout({ items }) {
  if (!items || items.length === 0) {
    return <div className="text-center text-zinc-500">Content coming soon.</div>;
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
            className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-black/5 flex flex-col h-full"
          >
            {item.image && (
              <div className="relative w-full h-64 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title || 'Card Image'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                {item.title && (
                  <h3 className="absolute bottom-6 left-6 right-6 text-2xl font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                    {item.title}
                  </h3>
                )}
              </div>
            )}
            
            {(!item.image && item.title) && (
              <div className="p-8 pb-4">
                <h3 className="text-2xl font-bold text-[#09090B]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {item.title}
                </h3>
                <div className="w-12 h-1 bg-[#FFB800] mt-4" />
              </div>
            )}

            {item.description && (
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <p className="text-zinc-600 line-clamp-4 flex-1">
                  {item.description}
                </p>
                {item.link && (
                  <div className="mt-6 flex items-center gap-2 text-[#FFB800] font-semibold uppercase tracking-wider text-sm hover:text-[#09090B] transition-colors">
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
