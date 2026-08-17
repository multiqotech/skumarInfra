'use client';

export default function CareerCTA() {
  return (
    <section className="py-24 bg-[#f36c21] relative overflow-hidden">
      <div className="absolute inset-0 bg-[#183964]/5" />
      <div className="container-custom relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-[#183964] mb-6 drop-shadow-sm" style={{ fontFamily: 'var(--font-heading)' }}>
          Don't see a perfect fit?
        </h2>
        <p className="text-[#183964]/90 text-lg mb-10 max-w-2xl mx-auto font-medium">
          We are always looking for talented individuals to join our growing team. Send us your resume and we'll keep you in mind for future opportunities.
        </p>
        <a 
          href="mailto:careers@skconstructions.com" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#183964] text-white font-bold rounded-lg hover:bg-[#224c85] transition-colors uppercase tracking-wider text-sm shadow-xl hover:-translate-y-1"
        >
          Email Your Resume
        </a>
      </div>
    </section>
  );
}
