import { HiBuildingOffice2, HiMapPin, HiPhone } from 'react-icons/hi2';

export default function OfficeLayout({ items }) {
  if (!items || items.length === 0) {
    return <div className="text-center text-[#4b5563] font-medium">Content coming soon.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {items.map((item, index) => (
        <div 
          key={item.id || index} 
          className="bg-[#f7f9fc] rounded-2xl p-8 shadow-sm hover:shadow-[0_15px_40px_rgba(24,57,100,0.1)] transition-all duration-300 border border-[#183964]/5 border-t-[6px] hover:border-t-[#f36c21] hover:-translate-y-1"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#183964]/10 shadow-sm flex items-center justify-center">
              <HiBuildingOffice2 className="w-6 h-6 text-[#183964]" />
            </div>
            <h3 className="text-xl font-bold text-[#183964]" style={{ fontFamily: 'var(--font-heading)' }}>
              {item.city}
            </h3>
          </div>
          
          <div className="space-y-4">
            {item.address && (
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 bg-white p-1 rounded-full shadow-sm border border-[#183964]/5">
                  <HiMapPin className="w-4 h-4 text-[#f36c21]" />
                </div>
                <p className="text-[#4b5563] font-medium leading-relaxed">
                  {item.address}
                </p>
              </div>
            )}
            
            {item.contact && (
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 bg-white p-1 rounded-full shadow-sm border border-[#183964]/5">
                  <HiPhone className="w-4 h-4 text-[#f36c21]" />
                </div>
                <p className="text-[#4b5563] font-bold leading-relaxed">
                  {item.contact}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
