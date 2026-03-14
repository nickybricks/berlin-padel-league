import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DemoEmbed from '@/demo/DemoEmbed';
import { Swords, Users, Play } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedHeroMockup from '@/components/landing/AnimatedHeroMockup';
import BentoGrid from '@/components/landing/BentoGrid';
import MarqueeStrip from '@/components/landing/MarqueeStrip';
import HowItWorks from '@/components/landing/HowItWorks';
import LandingFooter from '@/components/landing/LandingFooter';

const reveal = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.15 },
  }),
};

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      {/* ── Floating Nav Island ── */}
      <header className="w-full flex justify-center pt-4 px-4 z-50 fixed top-0">
        <div className="w-full max-w-[991px] flex items-center justify-between px-5 sm:px-6 h-14 rounded-full bg-card/70 backdrop-blur-xl border border-border/40 shadow-sm">
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

      {/* ── HERO with Parallax ── */}
      <section ref={heroRef} className="relative flex flex-col items-center justify-center min-h-[90vh] pt-24 pb-16 px-4">
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-accent/10 blur-[120px] pointer-events-none"
          style={{ scale: glowScale, opacity: glowOpacity }}
        />

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

        {/* Animated mockup with parallax */}
        <motion.div style={{ y: mockupY }}>
          <AnimatedHeroMockup />
        </motion.div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4">
          {[
            { value: '500+', label: 'Spieler' },
            { value: '50+', label: 'Ligen' },
            { value: '2.000+', label: 'Matches' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={i}
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
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
                  {/* Shimmer effect */}
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
