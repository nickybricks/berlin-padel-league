import { useRef, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DemoEmbed from '@/demo/DemoEmbed';
import { Swords, Users, Play } from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import AnimatedHeroMockup from '@/components/landing/AnimatedHeroMockup';
import BentoGrid from '@/components/landing/BentoGrid';
import MarqueeStrip from '@/components/landing/MarqueeStrip';
import HowItWorks from '@/components/landing/HowItWorks';
import TestimonialSection from '@/components/landing/TestimonialSection';
import LandingFooter from '@/components/landing/LandingFooter';

const reveal = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.15 },
  }),
};

/* ── Animated Counter Hook ── */
function useCounter(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return { count, ref };
}

function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(value);
  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl sm:text-4xl font-extrabold text-foreground tabular-nums">
        {count.toLocaleString('de-DE')}{suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Parallax
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const mockupY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  // Gradient mesh animation (glow blobs)
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Sticky nav scroll state
  const [navScrolled, setNavScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Cursor glow
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      {/* ── Floating Nav Island with scroll transition ── */}
      <header className="w-full flex justify-center pt-4 px-4 z-50 fixed top-0">
        <div
          className={`w-full max-w-[991px] flex items-center justify-between px-5 sm:px-6 h-14 rounded-full border shadow-sm transition-all duration-500 ${
            navScrolled
              ? 'bg-card/70 backdrop-blur-xl border-border/40'
              : 'bg-transparent backdrop-blur-none border-transparent shadow-none'
          }`}
        >
          <span className="text-lg font-bold text-primary tracking-tight whitespace-nowrap">
            Padel Leagues
          </span>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="rounded-full text-sm px-3 sm:px-4">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="rounded-full text-sm px-3 sm:px-4">
                Registrieren
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO with Parallax + Cursor Glow + Gradient Mesh ── */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center min-h-[90vh] pt-24 pb-16 px-4"
        onMouseMove={handleMouseMove}
      >
        {/* Cursor glow */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-40 hidden sm:block"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, hsl(var(--accent) / 0.12), transparent 60%)`,
          }}
        />

        {/* Gradient mesh blobs */}
        <motion.div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: glowOpacity }}>
          <div className="gradient-blob gradient-blob-1" />
          <div className="gradient-blob gradient-blob-2" />
          <div className="gradient-blob gradient-blob-3" />
        </motion.div>

        <motion.div
          className="relative z-10 text-center max-w-3xl mx-auto"
          style={{ y: heroY }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-wide mb-6 animate-fade-in">
            <Swords className="h-3.5 w-3.5" />
            Freizeit-Liga Management
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05] mb-5 animate-fade-in">
            Deine Liga.{' '}
            <span className="gradient-text">Dein Spiel.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed animate-fade-in">
            Erstelle und verwalte deine Padel-Liga in Sekunden — Tabellen, Spielpläne, Ergebnisse und Platzbuchungen an einem Ort.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in">
            <Link to="/register">
              <Button size="lg" className="rounded-full px-8 text-base h-12 shadow-md hover:shadow-lg transition-shadow">
                Kostenlos starten
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg" className="rounded-full px-8 text-base h-12">
                <Play className="h-4 w-4 mr-1" />
                Demo ansehen
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Animated mockup with zoom-out reveal */}
        <motion.div
          style={{
            scale: mockupScale,
            filter: useTransform(mockupBlur, (v) => `blur(${v}px)`),
            opacity: mockupOpacity,
          }}
        >
          <AnimatedHeroMockup />
        </motion.div>
      </section>

      {/* ── SOCIAL PROOF BAR — Animated Counters ── */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4">
          <AnimatedStat value={500} suffix="+" label="Spieler" />
          <AnimatedStat value={50} suffix="+" label="Ligen" />
          <AnimatedStat value={2000} suffix="+" label="Matches" />
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <MarqueeStrip />

      {/* ── BENTO FEATURE GRID ── */}
      <BentoGrid />

      {/* ── INTERACTIVE DEMO ── */}
      <main>
        <DemoEmbed />
      </main>

      {/* ── HOW IT WORKS ── */}
      <HowItWorks />

      {/* ── TESTIMONIALS ── */}
      <TestimonialSection />

      {/* ── FINAL CTA ── */}
      <section className="py-16 px-4">
        <motion.div
          className="max-w-[991px] mx-auto"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          custom={0}
        >
          <div className="rounded-3xl bg-primary p-10 sm:p-14 text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/20 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-accent/10 blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <Users className="h-10 w-10 text-primary-foreground/70 mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-3">
                Starte jetzt deine Liga
              </h2>
              <p className="text-primary-foreground/70 max-w-md mx-auto mb-8 text-base">
                Kostenlos registrieren, Liga erstellen und dein erstes Match planen — in unter einer Minute.
              </p>
              <Link to="/register">
                <Button
                  size="lg"
                  className="rounded-full px-10 h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90 shadow-md relative overflow-hidden group"
                >
                  <span className="relative z-10">Jetzt registrieren</span>
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <LandingFooter />
    </div>
  );
}
