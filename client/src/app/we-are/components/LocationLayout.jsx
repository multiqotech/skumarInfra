import { HiMapPin } from 'react-icons/hi2';

export default function LocationLayout({ items }) {
  if (!items || items.length === 0) {
    return <div className="text-center text-zinc-500">Content coming soon.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-black/5">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: 'var(--font-heading)' }}>
          Operating Regions
        </h2>
        
        <div className="space-y-8">
          {items.map((item, index) => (
            <div key={item.id || index} className="flex gap-6 items-start group">
              <div className="w-14 h-14 rounded-full bg-[#FFB800]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFB800] transition-colors duration-300">
                <HiMapPin className="w-7 h-7 text-[#FFB800] group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="flex-1 pb-8 border-b border-black/5 last:border-0 last:pb-0">
                <h3 className="text-2xl font-bold text-[#09090B] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {item.country}
                </h3>
                <p className="text-zinc-600 leading-relaxed text-lg">
                  {item.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
