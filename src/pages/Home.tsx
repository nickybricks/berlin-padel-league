import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import LogoBar from '@/components/landing/LogoBar';
import FeatureShowcase from '@/components/landing/FeatureShowcase';

import CTASection from '@/components/landing/CTASection';
import LandingFooter from '@/components/landing/LandingFooter';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNav />
      <HeroSection />
      <LogoBar />
      <FeatureShowcase />
      
      <CTASection />
      <LandingFooter />
    </div>
  );
}
