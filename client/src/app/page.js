import Navbar from '@/components/Navbar';
import HeroSection from '@/sections/HeroSection';
import ContactStrip from '@/sections/ContactStrip';
import VerticalsSection from '@/sections/VerticalsSection';
import ServicesCards from '@/sections/ServicesCards';
import WhyChooseUs from '@/sections/WhyChooseUs';
import EngineeringSolutions from '@/sections/EngineeringSolutions';
import FeaturedProjects from '@/sections/FeaturedProjects';
import VideoShowcase from '@/sections/VideoShowcase';
import FAQSection from '@/sections/FAQSection';
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
        <WhyChooseUs />
        <EngineeringSolutions />
        <FeaturedProjects />
        <VideoShowcase />
        <FAQSection />
        <TeamSection />
        <TestimonialsSection />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
