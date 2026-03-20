import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Wand2, CalendarDays, Trophy, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    id: 'setup',
    icon: Wand2,
    label: 'Liga Setup',
    headline: 'Erstelle deine Liga in 3 Schritten',
    description:
      'Mit dem Wizard legst du Format, Teams und Gruppen in wenigen Minuten fest. Round Robin oder Gruppen — du entscheidest.',
    bullets: [
      'Flexibles Turnierformat wählen',
      'Teams anlegen & Spieler einladen',
      'Gruppen automatisch oder manuell zuweisen',
    ],
  },
  {
    id: 'schedule',
    icon: CalendarDays,
    label: 'Spielplan',
    headline: 'Automatisch generierte Spielpläne',
    description:
      'Dein Spielplan wird sofort erstellt — mit Hin- und Rückrunde, Wochen-Übersicht und Gruppen-Support.',
    bullets: [
      'Round Robin & Gruppen-Modus',
      'Hin- und Rückrunde optional',
      'Wochenweise Übersicht',
    ],
  },
  {
    id: 'standings',
    icon: Trophy,
    label: 'Live-Tabelle',
    headline: 'Echtzeit-Tabelle mit Satzverhältnis',
    description:
      'Nach jeder Ergebniseingabe aktualisiert sich die Tabelle automatisch. Punkte, Sätze, Differenz — alles im Blick.',
    bullets: [
      'Punkte- & Satzverhältnis',
      'Gruppen-Tabellen parallel',
      'Ergebnisse sofort sichtbar',
    ],
  },
  {
    id: 'booking',
    icon: MapPin,
    label: 'Platzbuchungen',
    headline: 'Buche Padel-Plätze direkt in der App',
    description:
      'Verwalte Venues, erstelle Zeitslots und lass Teams ihre Plätze selbst buchen. Export per E-Mail inklusive.',
    bullets: [
      'Venues & Courts verwalten',
      'Zeitslots mit einem Klick buchen',
      'Automatischer E-Mail-Export',
    ],
  },
];

export default function FeatureShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Map scroll progress to ball position (0% to 100% of beam height)
  const ballProgress = useTransform(scrollYProgress, [0.15, 0.85], [0, 100]);

  // Derive which nodes are "passed" — each node at 0%, 33%, 66%, 100%
  const nodeThresholds = features.map((_, i) => i / (features.length - 1));

  return (
    <section id="feature-showcase" className="bg-primary text-primary-foreground" ref={containerRef}>
      <div className="max-w-6xl mx-auto flex">
        {/* Beam column — desktop only */}
        <div className="hidden lg:flex w-16 shrink-0 relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-20 bottom-20 w-[2px] bg-primary-foreground/10" />

          {/* Node dots — positioned at each feature card center */}
          {features.map((f, i) => {
            const topPercent = 20 + (i / (features.length - 1)) * 60; // spread from 20% to 80% matching padding
            return (
              <BeamNode
                key={f.id}
                index={i}
                label={f.label}
                topPercent={topPercent}
                scrollProgress={ballProgress}
                threshold={nodeThresholds[i] * 100}
              />
            );
          })}

          {/* Glowing ball */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full z-10 pointer-events-none"
            style={{
              top: useTransform(ballProgress, (v) => `calc(20% + ${v * 0.6}%)`),
              backgroundColor: 'hsl(var(--accent))',
              boxShadow:
                '0 0 8px hsl(var(--accent)), 0 0 20px hsl(var(--accent) / 0.5), 0 0 40px hsl(var(--accent) / 0.2)',
            }}
          />

          {/* Lit trail behind ball */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-[2px] top-[20%] origin-top"
            style={{
              height: '60%',
              scaleY: useTransform(ballProgress, [0, 100], [0, 1]),
              background: 'linear-gradient(to bottom, hsl(var(--accent) / 0.4), hsl(var(--accent) / 0.1))',
            }}
          />
        </div>

        {/* Feature blocks */}
        <div className="flex-1 py-16 lg:py-20">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={f.id} className="px-6 lg:px-12 py-14 lg:py-16">
                <motion.div
                  className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
                  initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Text */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Icon className="h-5 w-5 text-accent" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                        {f.label}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold leading-tight mb-4">
                      {f.headline}
                    </h3>
                    <p className="text-primary-foreground/70 mb-5 leading-relaxed">
                      {f.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {f.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-2 text-sm text-primary-foreground/60"
                        >
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="ghost"
                      className="rounded-full text-accent hover:text-accent hover:bg-primary-foreground/5 gap-1 px-0"
                    >
                      Mehr erfahren <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Placeholder screenshot */}
                  <div className="aspect-video rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center">
                    <span className="text-primary-foreground/20 text-sm font-medium">
                      Screenshot — {f.label}
                    </span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Beam Node ── */
function BeamNode({
  label,
  topPercent,
  scrollProgress,
  threshold,
}: {
  index: number;
  label: string;
  topPercent: number;
  scrollProgress: ReturnType<typeof useTransform>;
  threshold: number;
}) {
  const isActive = useTransform(scrollProgress, (v: number) => v >= threshold - 5);

  const dotBg = useTransform(isActive, (active) =>
    active ? 'hsl(var(--accent))' : 'hsl(var(--primary-foreground) / 0.2)'
  );

  const dotShadow = useTransform(isActive, (active) =>
    active ? '0 0 8px hsl(var(--accent)), 0 0 16px hsl(var(--accent) / 0.3)' : 'none'
  );

  const labelOpacity = useTransform(isActive, (active) => (active ? 1 : 0.3));

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3"
      style={{ top: `${topPercent}%`, transform: 'translate(-50%, -50%)' }}
    >
      <motion.div
        className="w-2 h-2 rounded-full shrink-0 z-10"
        style={{
          backgroundColor: dotBg,
          boxShadow: dotShadow,
        }}
      />
      <motion.span
        className="text-xs font-medium whitespace-nowrap text-primary-foreground absolute left-6"
        style={{ opacity: labelOpacity }}
      >
        {label}
      </motion.span>
    </div>
  );
}
