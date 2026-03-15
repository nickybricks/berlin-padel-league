import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const reveal = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.15 },
  }),
};

const TESTIMONIALS = [
  {
    name: 'Marco B.',
    club: 'Padel Berlin Mitte',
    initials: 'MB',
    quote: 'Endlich eine Plattform, die unsere Liga professionell abbildet. Spielplan und Tabelle laufen komplett automatisch.',
  },
  {
    name: 'Laura S.',
    club: 'Smash Club Hamburg',
    initials: 'LS',
    quote: 'Die Platzbuchung direkt in der Liga-App spart uns jede Woche mindestens eine Stunde Orga-Aufwand.',
  },
  {
    name: 'Jonas K.',
    club: 'Court Kings München',
    initials: 'JK',
    quote: 'Unsere Spieler lieben es — Ergebnis eintragen, Tabelle aktualisiert sich sofort. So muss das sein.',
  },
];

export default function TestimonialSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-[991px] mx-auto">
        <motion.div
          className="text-center mb-10"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          custom={0}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Was Spieler sagen
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Liga-Organisatoren und Spieler über ihre Erfahrung.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm flex flex-col"
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={i}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-sm text-foreground leading-relaxed flex-1 mb-5">
                „{t.quote}"
              </p>

              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-accent/10 text-accent text-xs font-bold">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.club}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
