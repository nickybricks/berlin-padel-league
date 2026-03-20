import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="feature-showcase" className="bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto flex">
        {/* Sticky side nav — desktop only */}
        <div className="hidden lg:flex flex-col justify-center w-56 shrink-0 sticky top-20 self-start pl-6 pt-20">
          <div className="space-y-1">
            {features.map((f, i) => (
              <button
                key={f.id}
                onClick={() =>
                  sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left text-sm transition-all duration-200 ${
                  i === activeIndex
                    ? 'bg-primary-foreground/10 text-primary-foreground font-medium'
                    : 'text-primary-foreground/40 hover:text-primary-foreground/70'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-200 ${
                    i === activeIndex ? 'bg-accent' : 'bg-primary-foreground/20'
                  }`}
                />
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature blocks */}
        <div className="flex-1 py-16 lg:py-20">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                ref={(el) => { sectionRefs.current[i] = el; }}
                className="px-6 lg:px-12 py-16 lg:py-20"
              >
                <motion.div
                  className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
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
