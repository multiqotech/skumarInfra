import Navbar from '@/components/Navbar';
import HeroSection from '@/sections/HeroSection';
import ContactStrip from '@/sections/ContactStrip';
import VerticalsSection from '@/sections/VerticalsSection';
import PlantMachinerySection from '@/sections/PlantMachinerySection';
import ServicesCards from '@/sections/ServicesCards';
import WhyChooseUs from '@/sections/WhyChooseUs';
import EngineeringSolutions from '@/sections/EngineeringSolutions';
import FeaturedProjects from '@/sections/FeaturedProjects';
import VideoShowcase from '@/sections/VideoShowcase';
import FAQSection from '@/sections/FAQSection';
import InvestorSection from '@/sections/InvestorSection';
import FinancialHighlightsSection from '@/sections/FinancialHighlightsSection';
import BoardDirectorSection from '@/sections/BoardDirectorSection';
import TeamSection from '@/sections/TeamSection';
import TestimonialsSection from '@/sections/TestimonialsSection';
import ContactCTA from '@/sections/ContactCTA';
import Footer from '@/sections/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ContactStrip />
        <ServicesCards />
        <VerticalsSection />
        <PlantMachinerySection />
        <WhyChooseUs />
        <InvestorSection />
        <FinancialHighlightsSection />
        <EngineeringSolutions />
        <FeaturedProjects />
        <VideoShowcase />
        <FAQSection />
        <BoardDirectorSection />
        <TeamSection />
        <TestimonialsSection />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
