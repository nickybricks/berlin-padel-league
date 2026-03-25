import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import LogoBar from '@/components/landing/LogoBar';
import FeatureShowcase from '@/components/landing/FeatureShowcase';

import AboutSection from '@/components/landing/AboutSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';
import LandingFooter from '@/components/landing/LandingFooter';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string })?.scrollTo;
    if (scrollTo) {
      setTimeout(() => {
        document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      // Clear the state so it doesn't re-scroll on re-renders
      window.history.replaceState({}, '');
    }
  }, [location.state]);
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNav />
      <HeroSection />
      <LogoBar />
      <FeatureShowcase />
      <AboutSection />
      <FAQSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
