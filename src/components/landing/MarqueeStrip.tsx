import { motion } from 'framer-motion';

const ITEMS = [
  'Padel Club Berlin',
  'TC Grünwald',
  'Hamburg Smashers',
  'Köln Padel Liga',
  'München Courts',
  'Düsseldorf Open',
  'Stuttgart Padel',
  'Frankfurt League',
];

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="flex gap-4 overflow-hidden">
      <motion.div
        className="flex gap-4 shrink-0"
        animate={{ x: reverse ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <div
            key={`${item}-${i}`}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/40 bg-card/60 backdrop-blur-sm whitespace-nowrap"
          >
            <div className="h-5 w-5 rounded-full bg-accent/15 flex items-center justify-center text-[8px] font-bold text-accent">
              {item[0]}
            </div>
            <span className="text-xs font-medium text-muted-foreground">{item}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function MarqueeStrip() {
  return (
    <section className="py-8 overflow-hidden">
      <div className="space-y-3">
        <MarqueeRow />
        <MarqueeRow reverse />
      </div>
    </section>
  );
}
