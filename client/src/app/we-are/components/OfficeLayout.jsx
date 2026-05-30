import { HiBuildingOffice2, HiMapPin, HiPhone } from 'react-icons/hi2';

export default function OfficeLayout({ items }) {
  if (!items || items.length === 0) {
    return <div className="text-center text-zinc-500">Content coming soon.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {items.map((item, index) => (
        <div 
          key={item.id || index} 
          className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border-t-4 border-[#FFB800]"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#FAFAFA] flex items-center justify-center">
              <HiBuildingOffice2 className="w-6 h-6 text-[#09090B]" />
            </div>
            <h3 className="text-xl font-bold text-[#09090B]" style={{ fontFamily: 'var(--font-heading)' }}>
              {item.city}
            </h3>
          </div>
          
          <div className="space-y-4">
            {item.address && (
              <div className="flex items-start gap-3">
                <HiMapPin className="w-5 h-5 text-[#FFB800] flex-shrink-0 mt-1" />
                <p className="text-zinc-600 leading-relaxed">
                  {item.address}
                </p>
              </div>
            )}
            
            {item.contact && (
              <div className="flex items-start gap-3">
                <HiPhone className="w-5 h-5 text-[#FFB800] flex-shrink-0 mt-1" />
                <p className="text-zinc-600 leading-relaxed font-medium">
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
