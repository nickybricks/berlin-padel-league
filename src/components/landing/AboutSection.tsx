import { Quote } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 bg-muted/30">
      <div className="mx-auto max-w-2xl px-6 text-center">
        {/* Section header */}
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Die Geschichte dahinter
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Wie aus einer Idee ein Tool für alle wurde.
        </p>

        {/* Story */}
        <div className="mt-12 space-y-5 text-[16px] leading-relaxed text-muted-foreground">
          <p>
            Mein Name ist <span className="text-foreground font-medium">Nick Algner</span>. 
            Ich arbeite im E-Commerce und in der Automatisierung. Als ich angefangen 
            habe Padel zu spielen, wollte ich mehr als nur lockere Runden – ich wollte 
            kompetitiv spielen, Ergebnisse tracken und mich mit anderen messen.
          </p>

          <p>
            Also habe ich eine private Liga in Berlin gegründet. Die Organisation lief 
            über Excel, WhatsApp und viel manuelle Arbeit. Spielpläne erstellen, 
            Ergebnisse einsammeln, Tabellen pflegen – jede Woche das gleiche Chaos.
          </p>

          <p>
            Daraus ist die <span className="text-foreground font-medium">Berlin Padel Liga</span> entstanden: 
            Ein Tool, das Spielpläne generiert, Ergebnisse live verarbeitet und 
            Platzbuchungen zentral organisiert. Kein Excel, keine endlosen Nachrichten.
          </p>

          <p>
            Jetzt möchte ich, dass jeder seine eigene Liga genauso einfach 
            starten kann – egal wo, egal wie viele Teams.
          </p>
        </div>

        {/* Quote */}
        <div className="mt-12 rounded-2xl bg-background border border-border p-8 text-left flex gap-4">
          <Quote className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-foreground font-medium text-[16px] leading-relaxed italic">
              „Ich habe dieses Tool gebaut, weil ich es selbst gebraucht habe."
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Nick Algner · Gründer, Berlin Padel Liga
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
