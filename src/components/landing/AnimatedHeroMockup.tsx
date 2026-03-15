import { motion } from 'framer-motion';

const TEAMS = [
  { name: 'Team Alpha', short: 'A', pts: 12 },
  { name: 'Smash Bros', short: 'S', pts: 10 },
  { name: 'Net Ninjas', short: 'N', pts: 8 },
  { name: 'Court Kings', short: 'C', pts: 6 },
];

export default function AnimatedHeroMockup() {
  return (
    <div className="relative z-10 mt-14 w-full max-w-2xl mx-auto">
      <div className="rounded-3xl border border-border/50 bg-card shadow-lg overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border/30">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-destructive/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-warning/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-accent/50" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-background rounded-md px-4 py-0.5 text-[10px] text-muted-foreground font-mono">
              app.padelleagues.de
            </div>
          </div>
        </div>

        {/* Static rows */}
        <div className="p-4 space-y-2">
          {TEAMS.map((team, i) => (
            <motion.div
              key={team.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/40"
            >
              <span className="text-xs font-bold text-muted-foreground w-5 text-center">
                {i + 1}
              </span>
              <div className="h-7 w-7 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">
                {team.short}
              </div>
              <span className="text-sm font-medium text-foreground flex-1">{team.name}</span>
              {i < 2 && (
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-accent/10 text-accent">
                  Playoff
                </span>
              )}
              <span className="text-xs font-semibold text-accent tabular-nums">
                {team.pts} Pkt
              </span>
            </motion.div>
          ))}
        </div>

        {/* Static result flash */}
        <div className="mx-4 mb-4 px-3 py-2 rounded-xl bg-accent/10 border border-accent/20 text-xs text-accent font-medium text-center">
          ✓ Ergebnis eingetragen — Tabelle aktualisiert
        </div>
      </div>

      <div className="absolute -inset-4 rounded-[2rem] bg-accent/5 blur-2xl -z-10 pointer-events-none" />
    </div>
  );
}
