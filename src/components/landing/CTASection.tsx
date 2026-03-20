import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="bg-primary text-primary-foreground py-24 px-4">
      <motion.div
        className="max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ textWrap: 'balance' }}>
          Bereit, deine Liga zu starten?
        </h2>
        <p className="text-primary-foreground/60 mb-8 text-lg">
          Erstelle deine erste Liga in unter 5 Minuten — kostenlos.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/register">
            <Button
              size="lg"
              className="rounded-full px-7 text-base gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Liga erstellen
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="mailto:kontakt@berlinpadelliga.de">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-7 text-base border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Kontakt
            </Button>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
