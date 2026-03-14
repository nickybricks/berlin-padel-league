import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Plus, Send, Play } from 'lucide-react';

const reveal = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.15 },
  }),
};

const STEPS = [
  { step: '1', icon: Plus, title: 'Liga erstellen', desc: 'Name, Format und Gruppenzahl wählen — fertig in 30 Sekunden.' },
  { step: '2', icon: Send, title: 'Teams einladen', desc: 'Teile den Einladungslink — Spieler treten mit einem Klick bei.' },
  { step: '3', icon: Play, title: 'Spielen & tracken', desc: 'Ergebnisse eintragen, Tabelle verfolgen und Playoffs genießen.' },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">So einfach geht's</h2>
          <p className="text-muted-foreground">In drei Schritten zur eigenen Liga.</p>
        </motion.div>

        <div ref={ref} className="relative">
          {/* Connecting line */}
          <div className="hidden sm:block absolute top-[3.25rem] left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-px bg-border/60">
            <motion.div
              className="h-full bg-accent origin-left"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {STEPS.map((item, i) => (
              <motion.div
                key={item.step}
                className="relative rounded-3xl border border-border/50 bg-card p-6 shadow-sm text-center"
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={i}
              >
                {/* Animated dot */}
                <motion.div
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-accent text-accent-foreground text-sm font-bold mb-4 relative z-10"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.3 + i * 0.25,
                  }}
                >
                  {item.step}
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
