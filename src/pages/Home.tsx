import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DemoEmbed from '@/demo/DemoEmbed';
import { Trophy, CalendarDays, ClipboardEdit, MapPin, Swords, Users, Plus, Send, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const reveal = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.15 },
  }),
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      {/* ── Floating Nav Island ── */}
      <header className="w-full flex justify-center pt-4 px-4 z-50 fixed top-0">
        <div className="w-full max-w-[991px] flex items-center justify-between px-5 sm:px-6 h-14 rounded-full bg-card/70 backdrop-blur-xl border border-border/40 shadow-sm">
          <span className="text-lg font-bold text-primary tracking-tight whitespace-nowrap">
            Padel Leagues
          </span>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="rounded-full text-sm px-3 sm:px-4">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="rounded-full text-sm px-3 sm:px-4">
                Registrieren
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] pt-24 pb-16 px-4">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-wide mb-6">
            <Swords className="h-3.5 w-3.5" />
            Freizeit-Liga Management
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05] mb-5">
            Deine Liga.{' '}
            <span className="gradient-text">Dein Spiel.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Erstelle und verwalte deine Padel-Liga in Sekunden — Tabellen, Spielpläne, Ergebnisse und Platzbuchungen an einem Ort.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg" className="rounded-full px-8 text-base h-12 shadow-md hover:shadow-lg transition-shadow">
                Kostenlos starten
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg" className="rounded-full px-8 text-base h-12">
                <Play className="h-4 w-4 mr-1" />
                Demo ansehen
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating mockup preview card */}
        <div className="relative z-10 mt-14 w-full max-w-2xl mx-auto animate-slide-up">
          <div className="rounded-3xl border border-border/50 bg-card shadow-lg overflow-hidden">
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
            <div className="p-4 space-y-2">
              {['Team Alpha', 'Smash Bros', 'Net Ninjas', 'Court Kings'].map((name, i) => (
                <div key={name} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/40">
                  <span className="text-xs font-bold text-muted-foreground w-5 text-center">{i + 1}</span>
                  <div className="h-7 w-7 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">
                    {name[0]}
                  </div>
                  <span className="text-sm font-medium text-foreground flex-1">{name}</span>
                  <span className="text-xs font-semibold text-accent">{12 - i * 2} Pkt</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -inset-4 rounded-[2rem] bg-accent/5 blur-2xl -z-10 pointer-events-none" />
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4">
          {[
            { value: '500+', label: 'Spieler' },
            { value: '50+', label: 'Ligen' },
            { value: '2.000+', label: 'Matches' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={i}
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BENTO FEATURE GRID ── */}
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
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Alles was du brauchst</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Von der Tabelle bis zur Platzbuchung — eine Plattform für deine komplette Liga.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                wide: true,
                icon: Trophy,
                iconBg: 'bg-accent/10',
                iconColor: 'text-accent',
                title: 'Live-Tabelle',
                desc: 'Punkte, Satzverhältnis und Platzierungen aktualisieren sich sofort nach Ergebniseingabe. Playoff-Qualifikation wird farblich markiert.',
              },
              {
                icon: CalendarDays,
                iconBg: 'bg-primary/10',
                iconColor: 'text-primary',
                title: 'Spielplan',
                desc: 'Automatisch generierter Round-Robin-Spielplan mit Hin- & Rückrunde und Gruppenphase.',
              },
              {
                icon: ClipboardEdit,
                iconBg: 'bg-accent/10',
                iconColor: 'text-accent',
                title: 'Ergebnisse',
                desc: 'Best-of-3 Sätze eintragen — die Tabelle aktualisiert sich automatisch in Echtzeit.',
              },
              {
                icon: MapPin,
                iconBg: 'bg-warning/10',
                iconColor: 'text-warning',
                title: 'Platzbuchung',
                desc: 'Venues, Courts und Zeitslots verwalten — Teams buchen direkt innerhalb der Liga.',
              },
              {
                icon: Swords,
                iconBg: 'bg-playoff/10',
                iconColor: 'text-playoff',
                title: 'Playoffs',
                desc: 'K.O.-Bracket mit Halbfinale und Finale — automatisch aus der Gruppenphase generiert.',
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                className={`${card.wide ? 'sm:col-span-2 flex flex-col sm:flex-row items-start gap-6 p-6 sm:p-8' : 'p-6'} rounded-3xl border border-border/50 bg-card shadow-sm`}
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={i}
              >
                <div className={`${card.wide ? 'h-14 w-14' : 'h-12 w-12 mb-4'} rounded-2xl ${card.iconBg} flex items-center justify-center shrink-0`}>
                  <card.icon className={`${card.wide ? 'h-7 w-7' : 'h-6 w-6'} ${card.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE DEMO ── */}
      <main>
        <DemoEmbed />
      </main>

      {/* ── HOW IT WORKS ── */}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { step: '1', icon: Plus, title: 'Liga erstellen', desc: 'Name, Format und Gruppenzahl wählen — fertig in 30 Sekunden.' },
              { step: '2', icon: Send, title: 'Teams einladen', desc: 'Teile den Einladungslink — Spieler treten mit einem Klick bei.' },
              { step: '3', icon: Play, title: 'Spielen & tracken', desc: 'Ergebnisse eintragen, Tabelle verfolgen und Playoffs genießen.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="relative rounded-3xl border border-border/50 bg-card p-6 shadow-sm text-center"
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={i}
              >
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-accent text-accent-foreground text-sm font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-16 px-4">
        <motion.div
          className="max-w-[991px] mx-auto"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          custom={0}
        >
          <div className="rounded-3xl bg-primary p-10 sm:p-14 text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/20 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-accent/10 blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <Users className="h-10 w-10 text-primary-foreground/70 mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-3">
                Starte jetzt deine Liga
              </h2>
              <p className="text-primary-foreground/70 max-w-md mx-auto mb-8 text-base">
                Kostenlos registrieren, Liga erstellen und dein erstes Match planen — in unter einer Minute.
              </p>
              <Link to="/register">
                <Button size="lg" className="rounded-full px-10 h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90 shadow-md">
                  Jetzt registrieren
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/40 py-6">
        <div className="max-w-[991px] mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Padel Freizeit-Liga
        </div>
      </footer>
    </div>
  );
}
