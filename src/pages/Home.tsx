import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AppPreviewSection from '@/components/landing/AppPreviewSection';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated court lines background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Center line horizontal */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-accent/10 animate-[courtPulse_4s_ease-in-out_infinite]" />
        {/* Center line vertical */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-accent/10 animate-[courtPulse_4s_ease-in-out_infinite_0.5s]" />
        {/* Service line top */}
        <div className="absolute top-[30%] left-[10%] right-[10%] h-px bg-accent/[0.07] animate-[courtDrift_8s_ease-in-out_infinite]" />
        {/* Service line bottom */}
        <div className="absolute top-[70%] left-[10%] right-[10%] h-px bg-accent/[0.07] animate-[courtDrift_8s_ease-in-out_infinite_1s]" />
        {/* Side line left */}
        <div className="absolute left-[10%] top-[15%] bottom-[15%] w-px bg-accent/[0.07] animate-[courtDrift_8s_ease-in-out_infinite_2s]" />
        {/* Side line right */}
        <div className="absolute right-[10%] top-[15%] bottom-[15%] w-px bg-accent/[0.07] animate-[courtDrift_8s_ease-in-out_infinite_3s]" />
        {/* Outer boundary */}
        <div className="absolute top-[15%] left-[10%] right-[10%] bottom-[15%] border border-accent/[0.05] rounded-sm animate-[courtPulse_6s_ease-in-out_infinite_1s]" />
        {/* Net line */}
        <div className="absolute top-1/2 left-[20%] right-[20%] h-px bg-accent/[0.12] animate-[courtPulse_3s_ease-in-out_infinite_0.3s]" />
      </div>

      {/* Fixed Header Island */}
      <header className="fixed top-0 left-0 right-0 flex justify-center pt-4 px-4 z-50">
        <div className="w-full max-w-[991px] flex items-center justify-between px-5 sm:px-6 h-14 rounded-full bg-white/70 backdrop-blur-xl border border-border/40 shadow-sm shadow-black/5">
          <span className="text-lg font-extrabold text-primary tracking-tight whitespace-nowrap">
            Padel Leagues
          </span>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="rounded-full text-sm px-3 sm:px-4">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="rounded-full text-sm px-3 sm:px-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                Registrieren
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-[800] text-primary leading-[1.05] tracking-tight mb-6">
            Deine Liga.
            <br />
            Dein Spiel.
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-lg mx-auto">
            Padel Leagues organisiert alles für dich.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="rounded-full px-8 py-6 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
                Liga starten
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-base font-semibold border-border">
              Demo ansehen
            </Button>
          </div>
        </div>
      </main>

      {/* App Preview Section */}
      <AppPreviewSection />

      {/* Court line animations */}
      <style>{`
        @keyframes courtPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes courtDrift {
          0%, 100% { transform: translateY(0px); opacity: 1; }
          50% { transform: translateY(6px); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
