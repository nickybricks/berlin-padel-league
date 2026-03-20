import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 bg-background overflow-hidden">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.08]"
          style={{ textWrap: 'balance' }}
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Deine Padel Liga, organisiert.
        </motion.h1>

        <motion.p
          className="mt-5 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto"
          style={{ textWrap: 'pretty' }}
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          Spielpläne, Tabellen, Platzbuchungen — alles in einer App.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/register">
            <Button size="lg" className="rounded-full px-7 text-base gap-2">
              Liga erstellen
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-7 text-base"
            onClick={scrollToFeatures}
          >
            So funktioniert's
          </Button>
        </motion.div>
      </div>

      {/* Animated branching SVG */}
      <motion.div
        className="mt-16 sm:mt-20 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <svg
          viewBox="0 0 600 180"
          className="w-full max-w-lg text-muted-foreground/30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Center dot */}
          <circle cx="300" cy="10" r="4" className="fill-primary" />

          {/* 4 branching paths */}
          {[
            { path: 'M300 10 Q300 60 100 140', label: 'Liga Setup', x: 100, delay: 0.6 },
            { path: 'M300 10 Q300 50 220 140', label: 'Spielplan', x: 220, delay: 0.75 },
            { path: 'M300 10 Q300 50 380 140', label: 'Tabelle', x: 380, delay: 0.9 },
            { path: 'M300 10 Q300 60 500 140', label: 'Buchungen', x: 500, delay: 1.05 },
          ].map((item) => (
            <g key={item.label}>
              <motion.path
                d={item.path}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: item.delay, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.circle
                cx={item.x}
                cy="140"
                r="3"
                className="fill-accent"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: item.delay + 1 }}
              />
              <motion.text
                x={item.x}
                y="165"
                textAnchor="middle"
                className="fill-muted-foreground text-[11px] font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: item.delay + 1.1 }}
              >
                {item.label}
              </motion.text>
            </g>
          ))}
        </svg>
      </motion.div>
    </section>
  );
}
