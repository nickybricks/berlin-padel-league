import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function useCounter(target: number, inView: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const duration = 1200;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, inView]);
  return count;
}

const stats = [
  { value: 12, suffix: '+', label: 'Ligen erstellt' },
  { value: 200, suffix: '+', label: 'Spieler registriert' },
  { value: 500, suffix: '+', label: 'Matches gespielt' },
];

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section id="stats" className="py-24 px-4 bg-background">
      <motion.div
        ref={ref}
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12" style={{ textWrap: 'balance' }}>
          Berlins wachsende Padel-Community
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <StatCard key={s.label} stat={s} inView={inView} delay={i * 0.1} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function StatCard({
  stat,
  inView,
  delay,
}: {
  stat: (typeof stats)[number];
  inView: boolean;
  delay: number;
}) {
  const count = useCounter(stat.value, inView);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="text-4xl sm:text-5xl font-bold text-foreground tabular-nums">
        {count}
        {stat.suffix}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
    </motion.div>
  );
}
