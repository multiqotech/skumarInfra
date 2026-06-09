import Image from 'next/image';

export default function GalleryLayout({ items }) {
  if (!items || items.length === 0) {
    return <div className="text-center text-[#4b5563] font-medium">Content coming soon.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px]">
      {items.map((item, index) => (
        <div 
          key={item.id || index} 
          className="relative group rounded-2xl overflow-hidden shadow-lg bg-[#183964] cursor-pointer"
        >
          {item.image && (
            <Image
              src={item.image}
              alt={item.caption || `Gallery image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#183964]/90 via-[#183964]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {item.caption && (
            <div className="absolute bottom-0 left-0 p-6 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <p className="text-white font-bold text-lg border-l-4 border-[#f36c21] pl-4 drop-shadow-md">
                {item.caption}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
