import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { Trophy } from 'lucide-react';

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
        <nav
          className={`w-full max-w-[991px] flex items-center justify-between px-5 sm:px-6 h-14 rounded-full transition-all duration-300 ${
            scrolled
              ? 'bg-card/90 backdrop-blur-xl border border-border/60 shadow-md'
              : 'bg-card/60 backdrop-blur-xl border border-border/30'
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Trophy className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold text-foreground tracking-tight hidden sm:inline">
              Berlin Padel Liga
            </span>
            <span className="text-base font-bold text-foreground tracking-tight sm:hidden">
              BPL
            </span>
          </Link>

          {/* Center nav links — hidden on mobile */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'So funktioniert\'s', id: 'features' },
              { label: 'Features', id: 'feature-showcase' },
              { label: 'Preise', id: 'stats' },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right CTAs */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-sm px-3 sm:px-4"
              onClick={() => setLoginOpen(true)}
            >
              Log in
            </Button>
            <Link to="/register">
              <Button size="sm" className="rounded-full text-sm px-3 sm:px-4">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
