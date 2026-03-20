import { motion } from 'framer-motion';

const venues = [
  'Padel Berlin',
  'Padelzone',
  'Berlin Padel Club',
  'Urban Padel',
  'Padelhalle Mitte',
  'Court & Co.',
];

export default function LogoBar() {
  return (
    <section id="features" className="py-16 px-4 bg-background border-t border-border/40">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">
          Vertraut von Padel-Communities in Berlin
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {venues.map((name, i) => (
            <motion.div
              key={name}
              className="flex items-center justify-center h-10 px-5 rounded-lg bg-muted/50 text-muted-foreground/60 text-sm font-medium hover:text-foreground hover:bg-muted transition-all duration-200"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
            >
              {name}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
