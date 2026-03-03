import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const TEAMS = [
  { rank: 1, name: 'Smash Brothers', w: 8, l: 1, sets: '17:5', pts: 24 },
  { rank: 2, name: 'Padel Pinguine', w: 7, l: 2, sets: '15:7', pts: 21 },
  { rank: 3, name: 'Net Crushers', w: 5, l: 4, sets: '12:10', pts: 15 },
  { rank: 4, name: 'Drop Shot FC', w: 3, l: 6, sets: '8:14', pts: 9 },
  { rank: 5, name: 'Lob City Berlin', w: 1, l: 8, sets: '4:18', pts: 3 },
];

const MATCHES = [
  { a: 'Smash Brothers', b: 'Net Crushers', date: 'Mo, 16. März · 19:00' },
  { a: 'Padel Pinguine', b: 'Drop Shot FC', date: 'Di, 17. März · 20:00' },
  { a: 'Lob City Berlin', b: 'Smash Brothers', date: 'Do, 19. März · 18:30' },
];

const SCORE_SETS = ['6:3', '4:6', '6:2'];

function CountUpDigit({ value, progress, delay }: { value: string; progress: any; delay: number }) {
  const opacity = useTransform(progress, [delay, delay + 0.05], [0, 1]);
  const y = useTransform(progress, [delay, delay + 0.05], [12, 0]);
  return (
    <motion.span style={{ opacity, y, display: 'inline-block' }} className="tabular-nums">
      {value}
    </motion.span>
  );
}

export default function AppPreviewSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  // Phase ranges: table 0-0.3, schedule 0.3-0.6, result 0.6-1
  const tableOpacity = useTransform(scrollYProgress, [0.05, 0.12, 0.28, 0.33], [0, 1, 1, 0]);
  const scheduleOpacity = useTransform(scrollYProgress, [0.3, 0.37, 0.55, 0.62], [0, 1, 1, 0]);
  const resultOpacity = useTransform(scrollYProgress, [0.58, 0.65, 0.9, 0.95], [0, 1, 1, 1]);

  // Row stagger for table
  const rowDelays = TEAMS.map((_, i) => {
    const start = 0.08 + i * 0.03;
    return {
      opacity: useTransform(scrollYProgress, [start, start + 0.04], [0, 1]),
      y: useTransform(scrollYProgress, [start, start + 0.04], [16, 0]),
    };
  });

  // Match card stagger
  const matchDelays = MATCHES.map((_, i) => {
    const start = 0.35 + i * 0.04;
    return {
      opacity: useTransform(scrollYProgress, [start, start + 0.05], [0, 1]),
      x: useTransform(scrollYProgress, [start, start + 0.05], [60, 0]),
    };
  });

  // Score count-up progress
  const scoreProgress = useTransform(scrollYProgress, [0.65, 0.85], [0, 1]);

  return (
    <section ref={containerRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-4">
        {/* Label */}
        <motion.p
          className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6"
          style={{
            opacity: useTransform(scrollYProgress, [0.02, 0.08], [0, 1]),
          }}
        >
          So sieht deine Liga aus
        </motion.p>

        {/* App Mockup Frame */}
        <div className="w-full max-w-[600px]">
          <div className="rounded-xl border border-border/60 bg-card shadow-lg overflow-hidden">
            {/* Title Bar */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-foreground/[0.04] border-b border-border/40">
              <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-warning/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-success/60" />
              <span className="ml-3 text-xs text-muted-foreground font-medium">
                Berliner Padel Liga – Saison 2026
              </span>
            </div>

            {/* Content Area */}
            <div className="relative min-h-[340px] sm:min-h-[380px] p-4 sm:p-6">
              {/* === Phase 1: League Table === */}
              <motion.div style={{ opacity: tableOpacity }} className="absolute inset-4 sm:inset-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">Tabelle</h3>
                <div className="space-y-0">
                  {/* Header */}
                  <div className="grid grid-cols-[1.5rem_1fr_2rem_2rem_3rem_2.5rem] gap-1 text-[10px] sm:text-xs text-muted-foreground font-medium pb-2 border-b border-border/40 px-1">
                    <span>#</span>
                    <span>Team</span>
                    <span className="text-center">S</span>
                    <span className="text-center">N</span>
                    <span className="text-center">Sätze</span>
                    <span className="text-right">Pkt</span>
                  </div>
                  {TEAMS.map((team, i) => (
                    <motion.div
                      key={team.name}
                      style={{ opacity: rowDelays[i].opacity, y: rowDelays[i].y }}
                      className="grid grid-cols-[1.5rem_1fr_2rem_2rem_3rem_2.5rem] gap-1 items-center py-2.5 px-1 text-xs sm:text-sm border-b border-border/20 last:border-0"
                    >
                      <span className="text-muted-foreground font-medium">{team.rank}</span>
                      <span className="font-semibold text-foreground truncate">{team.name}</span>
                      <span className="text-center text-success font-medium">{team.w}</span>
                      <span className="text-center text-destructive/70 font-medium">{team.l}</span>
                      <span className="text-center text-muted-foreground">{team.sets}</span>
                      <span className="text-right font-bold text-foreground">{team.pts}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* === Phase 2: Schedule === */}
              <motion.div style={{ opacity: scheduleOpacity }} className="absolute inset-4 sm:inset-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">Spielplan · Woche 10</h3>
                <div className="space-y-3">
                  {MATCHES.map((match, i) => (
                    <motion.div
                      key={i}
                      style={{ opacity: matchDelays[i].opacity, x: matchDelays[i].x }}
                      className="rounded-lg border border-border/40 bg-background p-3 sm:p-4"
                    >
                      <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5">{match.date}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-semibold text-foreground">{match.a}</span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground font-medium px-2">vs</span>
                        <span className="text-xs sm:text-sm font-semibold text-foreground">{match.b}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* === Phase 3: Result === */}
              <motion.div style={{ opacity: resultOpacity }} className="absolute inset-4 sm:inset-6 flex flex-col items-center justify-center">
                <p className="text-xs text-muted-foreground mb-2">Ergebnis</p>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm sm:text-base font-bold text-foreground">Smash Brothers</span>
                  <span className="text-[10px] text-muted-foreground">vs</span>
                  <span className="text-sm sm:text-base font-bold text-foreground">Net Crushers</span>
                </div>
                <div className="flex items-center gap-4">
                  {SCORE_SETS.map((set, i) => {
                    const [a, b] = set.split(':');
                    const baseDelay = i * 0.3;
                    return (
                      <div key={i} className="flex items-center gap-0.5">
                        <CountUpDigit value={a} progress={scoreProgress} delay={baseDelay} />
                        <motion.span
                          style={{ opacity: useTransform(scoreProgress, [baseDelay + 0.05, baseDelay + 0.1], [0, 1]) }}
                          className="text-muted-foreground mx-0.5"
                        >
                          :
                        </motion.span>
                        <CountUpDigit value={b} progress={scoreProgress} delay={baseDelay + 0.1} />
                        {i < SCORE_SETS.length - 1 && (
                          <span className="text-muted-foreground/40 ml-3">,</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <motion.div
                  style={{ opacity: useTransform(scoreProgress, [0.85, 1], [0, 1]) }}
                  className="mt-4 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold"
                >
                  Smash Brothers gewinnt 2:1
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
