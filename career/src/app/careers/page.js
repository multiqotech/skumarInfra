import CareerHero from '@/components/career/CareerHero';
import CultureSection from '@/components/career/CultureSection';
import JobListings from '@/components/career/JobListings';
import CareerCTA from '@/components/career/CareerCTA';

export default function CareersPage() {
  return (
    <>
      <CareerHero />
      <CultureSection />
      <JobListings />
      <CareerCTA />
    </>
  );
}
