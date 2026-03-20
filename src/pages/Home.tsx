import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import LogoBar from '@/components/landing/LogoBar';
import FeatureShowcase from '@/components/landing/FeatureShowcase';
import StatsSection from '@/components/landing/StatsSection';
import CTASection from '@/components/landing/CTASection';
import LandingFooter from '@/components/landing/LandingFooter';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNav />
      <HeroSection />
      <LogoBar />
      <FeatureShowcase />
      <StatsSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
