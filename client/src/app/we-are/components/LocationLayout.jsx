import { HiMapPin } from 'react-icons/hi2';

export default function LocationLayout({ items }) {
  if (!items || items.length === 0) {
    return <div className="text-center text-[#4b5563] font-medium">Content coming soon.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(24,57,100,0.08)] border border-[#183964]/5">
        <h2 className="text-3xl font-bold text-[#183964] text-center mb-12" style={{ fontFamily: 'var(--font-heading)' }}>
          Operating Regions
        </h2>
        
        <div className="space-y-8">
          {items.map((item, index) => (
            <div key={item.id || index} className="flex gap-6 items-start group">
              <div className="w-14 h-14 rounded-full bg-white border border-[#183964]/10 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:bg-[#f36c21] group-hover:border-[#f36c21] transition-all duration-300">
                <HiMapPin className="w-7 h-7 text-[#183964] group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="flex-1 pb-8 border-b border-[#183964]/10 last:border-0 last:pb-0">
                <h3 className="text-2xl font-bold text-[#183964] mb-2 group-hover:text-[#f36c21] transition-colors" style={{ fontFamily: 'var(--font-heading)' }}>
                  {item.country}
                </h3>
                <p className="text-[#4b5563] font-medium leading-relaxed text-lg">
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
