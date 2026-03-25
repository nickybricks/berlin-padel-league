import { Quote } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 bg-muted/30">
      <div className="mx-auto max-w-3xl px-6">
        {/* Section header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Die Geschichte dahinter
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Wie aus Frust ein Tool für alle wurde.
          </p>
        </div>

        {/* Story */}
        <div className="space-y-6 text-[16px] leading-relaxed text-muted-foreground">
          <p>
            Mein Name ist <span className="text-foreground font-medium">Nick Algner</span>. 
            Ich arbeite im E-Commerce und in der Automatisierung – und wenn ich nicht 
            arbeite, stehe ich auf dem Padel-Court. Padel ist für mich mehr als ein Hobby. 
            Es ist der Sport, der mich antreibt.
          </p>

          <p>
            Irgendwann reichte mir das lockere Spielen nicht mehr aus. Ich wollte wissen, 
            wo ich stehe. Ich wollte Ergebnisse tracken, eine echte Tabelle sehen und 
            gegen die besten Spieler in Berlin antreten. Aber es gab kein Tool dafür – 
            zumindest keines, das einfach und modern genug war.
          </p>

          <p>
            Also habe ich selbst eine Liga gestartet. Zuerst nur mit Freunden, dann mit 
            Bekannten, dann mit Leuten, die ich vorher gar nicht kannte. Die Organisation 
            lief anfangs über Excel, WhatsApp-Gruppen und viel manuelle Arbeit. 
            Spielpläne erstellen, Ergebnisse einsammeln, Tabellen aktualisieren – 
            jede Woche das gleiche Chaos.
          </p>

          <p>
            Daraus ist die <span className="text-foreground font-medium">Berlin Padel Liga</span> entstanden: 
            Ein Tool, das all das automatisiert. Spielpläne werden generiert, 
            Ergebnisse direkt in der App eingetragen, die Tabelle aktualisiert sich live 
            und Platzbuchungen laufen zentral über ein System. Kein Excel, keine 
            endlosen Chat-Nachrichten.
          </p>

          <p>
            Mittlerweile nutzen mehrere Teams in Berlin die Plattform – und ich möchte, 
            dass jeder, der eine Padel-Liga organisieren will, das genauso einfach 
            machen kann. Egal ob in Berlin, Hamburg oder München. Egal ob 4 Teams oder 20.
          </p>
        </div>

        {/* Quote highlight */}
        <div className="mt-12 rounded-2xl bg-background border border-border p-8 flex gap-4">
          <Quote className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-foreground font-medium text-[16px] leading-relaxed italic">
              „Ich habe dieses Tool gebaut, weil ich es selbst gebraucht habe. 
              Jetzt will ich, dass es jeder nutzen kann, der Padel genauso ernst 
              nimmt wie ich."
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
