import { motion } from 'framer-motion';
import { Trophy, CalendarDays, ClipboardEdit, MapPin, Swords } from 'lucide-react';

const reveal = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.15 },
  }),
};

/* ── Mini Visual Previews ── */

function MiniTable() {
  const rows = [
    { name: 'ALP', pts: 12, bar: 'w-full' },
    { name: 'SMB', pts: 10, bar: 'w-5/6' },
    { name: 'NET', pts: 8, bar: 'w-4/6' },
    { name: 'CRT', pts: 6, bar: 'w-3/6' },
  ];
  return (
    <div className="mt-4 space-y-1.5">
      {rows.map((r, i) => (
        <div key={r.name} className="flex items-center gap-2 text-[10px]">
          <span className="text-muted-foreground w-3 text-right">{i + 1}</span>
          <span className="font-medium text-foreground w-7">{r.name}</span>
          <div className="flex-1 h-1.5 rounded-full bg-muted/60 overflow-hidden">
            <div className={`h-full rounded-full bg-accent/60 ${r.bar}`} />
          </div>
          <span className="text-muted-foreground w-4 text-right">{r.pts}</span>
        </div>
      ))}
    </div>
  );
}

function MiniCalendar() {
  const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const highlights = [2, 5]; // Wed & Sat
  return (
    <div className="mt-4">
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => (
          <div
            key={d}
            className={`text-[8px] text-center py-1 rounded-md ${
              highlights.includes(i)
                ? 'bg-accent/20 text-accent font-bold'
                : 'text-muted-foreground'
            }`}
          >
            {d}
          </div>
        ))}
        {Array.from({ length: 14 }, (_, i) => {
          const day = i + 8;
          const isMatch = [10, 13, 15, 19].includes(day);
          return (
            <div
              key={i}
              className={`text-[8px] text-center py-0.5 rounded-md ${
                isMatch
                  ? 'bg-primary/15 text-primary font-semibold'
                  : 'text-muted-foreground/60'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniResult() {
  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between text-[10px] px-2 py-1.5 rounded-lg bg-muted/40">
        <span className="font-medium text-foreground">ALP vs SMB</span>
        <span className="font-bold text-accent">6:4 6:3</span>
      </div>
      <div className="flex items-center justify-between text-[10px] px-2 py-1.5 rounded-lg bg-muted/40">
        <span className="font-medium text-foreground">NET vs CRT</span>
        <span className="text-muted-foreground">ausstehend</span>
      </div>
    </div>
  );
}

function MiniCourtMap() {
  return (
    <div className="mt-4 flex gap-2">
      {['Court 1', 'Court 2'].map((c, i) => (
        <div
          key={c}
          className={`flex-1 rounded-lg border border-dashed p-2 text-center text-[9px] ${
            i === 0
              ? 'border-accent/40 bg-accent/5 text-accent font-medium'
              : 'border-border/40 text-muted-foreground'
          }`}
        >
          {c}
          <div className="text-[8px] mt-0.5">{i === 0 ? '18:00 gebucht' : 'frei'}</div>
        </div>
      ))}
    </div>
  );
}

function MiniBracket() {
  return (
    <div className="mt-4 flex items-center gap-1">
      {/* Semi-final column */}
      <div className="flex flex-col gap-3 text-[9px]">
        <div className="px-2 py-1 rounded-md bg-muted/40 text-foreground font-medium">ALP</div>
        <div className="px-2 py-1 rounded-md bg-muted/40 text-foreground font-medium">NET</div>
      </div>
      {/* Lines */}
      <div className="flex flex-col items-center gap-0">
        <div className="w-3 h-px bg-border" />
        <div className="w-px h-6 bg-border" />
        <div className="w-3 h-px bg-border" />
      </div>
      {/* Final */}
      <div className="px-2 py-1 rounded-md bg-accent/15 text-accent text-[9px] font-bold">
        Finale
      </div>
    </div>
  );
}

const CARDS = [
  {
    wide: true,
    icon: Trophy,
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    title: 'Live-Tabelle',
    desc: 'Punkte, Satzverhältnis und Platzierungen aktualisieren sich sofort nach Ergebniseingabe.',
    preview: MiniTable,
  },
  {
    icon: CalendarDays,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    title: 'Spielplan',
    desc: 'Automatisch generierter Round-Robin-Spielplan mit Hin- & Rückrunde.',
    preview: MiniCalendar,
  },
  {
    icon: ClipboardEdit,
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    title: 'Ergebnisse',
    desc: 'Best-of-3 Sätze eintragen — Tabelle aktualisiert sich automatisch.',
    preview: MiniResult,
  },
  {
    icon: MapPin,
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
    title: 'Platzbuchung',
    desc: 'Venues, Courts und Zeitslots verwalten — direkt innerhalb der Liga.',
    preview: MiniCourtMap,
  },
  {
    icon: Swords,
    iconBg: 'bg-playoff/10',
    iconColor: 'text-playoff',
    title: 'Playoffs',
    desc: 'K.O.-Bracket mit Halbfinale und Finale — automatisch generiert.',
    preview: MiniBracket,
  },
];

export default function BentoGrid() {
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
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Alles was du brauchst</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Von der Tabelle bis zur Platzbuchung — eine Plattform für deine komplette Liga.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              className={`${
                card.wide
                  ? 'sm:col-span-2 flex flex-col sm:flex-row items-start gap-6 p-6 sm:p-8'
                  : 'p-6'
              } rounded-3xl border border-border/50 bg-card shadow-sm group hover:shadow-md transition-shadow duration-300`}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={i}
            >
              <div>
                <div
                  className={`${
                    card.wide ? 'h-14 w-14' : 'h-12 w-12 mb-4'
                  } rounded-2xl ${card.iconBg} flex items-center justify-center shrink-0`}
                >
                  <card.icon className={`${card.wide ? 'h-7 w-7' : 'h-6 w-6'} ${card.iconColor}`} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                <card.preview />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
