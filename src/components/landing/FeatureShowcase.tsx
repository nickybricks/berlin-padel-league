import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Wand2, CalendarDays, Trophy, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import setupImg from '@/assets/features/setup.png';
import scheduleImg from '@/assets/features/schedule.png';
import standingsImg from '@/assets/features/standings.png';
import bookingsImg from '@/assets/features/bookings.png';

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
    image: setupImg,
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
    image: scheduleImg,
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
    image: standingsImg,
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
    image: bookingsImg,
  },
];

function interpolatePosition(value: number, input: number[], output: number[]) {
  if (!input.length || !output.length) return 0;
  if (input.length === 1 || output.length === 1) return output[0] ?? 0;
  if (value <= input[0]) return output[0];

  for (let i = 1; i < input.length; i += 1) {
    if (value <= input[i]) {
      const inputSpan = input[i] - input[i - 1] || 1;
      const progress = (value - input[i - 1]) / inputSpan;
      return output[i - 1] + (output[i] - output[i - 1]) * progress;
    }
  }

  return output[output.length - 1];
}

export default function FeatureShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [nodeOffsets, setNodeOffsets] = useState<number[]>([]);
  const [activationScrollPoints, setActivationScrollPoints] = useState<number[]>([]);
  const { scrollY } = useScroll();

  useEffect(() => {
    function measure() {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerTopOnPage = containerRect.top + window.scrollY;
      const viewportCenter = window.innerHeight / 2;

      const nextNodeOffsets = cardRefs.current.map((el) => {
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return rect.top + window.scrollY + rect.height / 2 - containerTopOnPage;
      });

      const nextActivationPoints = cardRefs.current.map((el) => {
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        const cardCenterOnPage = rect.top + window.scrollY + rect.height / 2;
        return cardCenterOnPage - viewportCenter;
      });

      setNodeOffsets(nextNodeOffsets);
      setActivationScrollPoints(nextActivationPoints);
    }

    const frame = window.requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', measure);
      window.removeEventListener('load', measure);
    };
  }, []);

  const firstOffset = nodeOffsets[0] ?? 0;
  const lastOffset = nodeOffsets[nodeOffsets.length - 1] ?? 0;
  const beamRange = Math.max(0, lastOffset - firstOffset);

  const ballTop = useTransform(scrollY, (latest: number) =>
    interpolatePosition(latest, activationScrollPoints, nodeOffsets)
  );

  const trailHeight = useTransform(ballTop, (latest: number) => Math.max(0, latest - firstOffset));

  return (
    <section id="feature-showcase" ref={containerRef} className="relative bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl">
        <div className="relative hidden w-16 shrink-0 lg:flex">
          {beamRange > 0 && (
            <div
              className="absolute left-1/2 w-[2px] -translate-x-1/2 bg-primary-foreground/10"
              style={{ top: firstOffset, height: beamRange }}
            />
          )}

          {nodeOffsets.map((offset, index) => (
            <BeamNode key={features[index].id} topPx={offset} ballTop={ballTop} />
          ))}

          {beamRange > 0 && (
            <motion.div
              className="pointer-events-none absolute left-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
              style={{
                top: ballTop,
                boxShadow:
                  '0 0 8px hsl(var(--accent)), 0 0 20px hsl(var(--accent) / 0.5), 0 0 40px hsl(var(--accent) / 0.2)',
              }}
            />
          )}

          {beamRange > 0 && (
            <motion.div
              className="absolute left-1/2 z-[1] w-[2px] -translate-x-1/2 origin-top"
              style={{
                top: firstOffset,
                height: trailHeight,
                background:
                  'linear-gradient(to bottom, hsl(var(--accent) / 0.45), hsl(var(--accent) / 0.12))',
              }}
            />
          )}
        </div>

        <div className="flex-1 py-16 lg:py-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="px-6 py-14 lg:px-12 lg:py-16"
              >
                <motion.div
                  className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
                  initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <Icon className="h-5 w-5 text-accent" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                        {feature.label}
                      </span>
                    </div>

                    <h3 className="mb-4 text-2xl font-bold leading-tight sm:text-3xl">
                      {feature.headline}
                    </h3>

                    <p className="mb-5 leading-relaxed text-primary-foreground/70">
                      {feature.description}
                    </p>

                    <ul className="mb-6 space-y-2">
                      {feature.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-2 text-sm text-primary-foreground/60"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant="ghost"
                      className="gap-1 rounded-full px-0 text-accent hover:bg-primary-foreground/5 hover:text-accent"
                    >
                      Mehr erfahren <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-primary-foreground/10">
                    <img
                      src={feature.image}
                      alt={feature.label}
                      className="w-full object-cover"
                      loading="lazy"
                    />
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

function BeamNode({
  topPx,
  ballTop,
}: {
  topPx: number;
  ballTop: ReturnType<typeof useTransform>;
}) {
  const isActive = useTransform(ballTop, (latest: number) => latest >= topPx - 10);
  const dotBg = useTransform(isActive, (active: boolean) =>
    active ? 'hsl(var(--accent))' : 'hsl(var(--primary-foreground) / 0.2)'
  );
  const dotShadow = useTransform(isActive, (active: boolean) =>
    active ? '0 0 8px hsl(var(--accent)), 0 0 16px hsl(var(--accent) / 0.3)' : 'none'
  );

  return (
    <motion.div
      className="absolute left-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        top: topPx,
        backgroundColor: dotBg,
        boxShadow: dotShadow,
      }}
    />
  );
}
