import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Mail, Swords, BarChart3, CalendarDays, Timer, TrendingUp, Layers, Trophy, CheckCircle2, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';

// Dummy data
const standingsData = [
  { rank: 1, team: 'Smash Brothers', played: 6, wins: 5, losses: 1, sets: '12:4', points: 18 },
  { rank: 2, team: 'Padel Pinguine', played: 6, wins: 4, losses: 2, sets: '10:6', points: 15 },
  { rank: 3, team: 'Net Crushers', played: 6, wins: 3, losses: 3, sets: '8:8', points: 12 },
  { rank: 4, team: 'Drop Shot FC', played: 6, wins: 2, losses: 4, sets: '6:10', points: 9 },
  { rank: 5, team: 'Lob City Berlin', played: 6, wins: 1, losses: 5, sets: '4:12', points: 6 },
];

const matchesData = [
  { teamA: 'Smash Brothers', teamB: 'Net Crushers', date: 'Sa 15.03., 14:00', venue: 'Padel Berlin Neukölln' },
  { teamA: 'Padel Pinguine', teamB: 'Drop Shot FC', date: 'So 16.03., 10:00', venue: 'Padel City Mitte' },
  { teamA: 'Lob City Berlin', teamB: 'Smash Brothers', date: 'Mi 19.03., 19:00', venue: 'Padel Berlin Neukölln' },
];

const steps = [
  { icon: Mail, title: 'Einladung erhalten', desc: 'Du bekommst einen Einladungslink von deinem Liga-Admin' },
  { icon: Swords, title: 'Matches spielen', desc: 'Round-Robin-Format, Best-of-3 Sätze' },
  { icon: BarChart3, title: 'Tabelle checken', desc: 'Live-Ranking mit Punkten, Sätzen und Statistiken' },
];

const features = [
  { icon: CalendarDays, title: 'Automatischer Spielplan', desc: 'Alle Spiele werden automatisch generiert' },
  { icon: Timer, title: 'Ergebnisse in Sekunden', desc: 'Satzweise Eingabe, direkt vom Platz' },
  { icon: TrendingUp, title: 'Live-Tabelle', desc: 'Punkte und Ranking immer aktuell' },
  { icon: Layers, title: 'Gruppen & Playoffs', desc: 'Flexible Formate für jede Ligagröße' },
];

export default function Landing() {
  const { user, loading: authLoading } = useAuth();
  const showAuthButtons = !authLoading && !user;


  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Navigation Island */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-full backdrop-blur-xl bg-card/70 border border-border/30 shadow-md px-4 py-2 md:px-6 md:py-2.5">
        <span className="text-sm md:text-base font-bold text-accent whitespace-nowrap">Padel Leagues</span>
        <div className="flex items-center gap-2">
          {showAuthButtons ? (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-xs md:text-sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="text-xs md:text-sm">Registrieren</Button>
              </Link>
            </>
          ) : (
            <Link to="/leagues">
              <Button size="sm" className="text-xs md:text-sm">Meine Ligen</Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Section 1 – Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Padel Leagues
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Die Liga für Padel-Spieler in Berlin. Tritt einem Team bei, spiele Matches und verfolge dein Ranking.
          </p>
          <Link to="/register">
            <Button size="lg" className="mt-2">Jetzt mitmachen</Button>
          </Link>

          {/* Browser Mockup */}
          <div className="mt-10 mx-auto max-w-2xl rounded-xl border border-border/60 bg-card shadow-lg overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-muted/60 border-b border-border/40">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
              <span className="ml-3 text-[10px] text-muted-foreground font-mono">padel-leagues.app</span>
            </div>
            <div className="p-3 md:p-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead className="text-right">P</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standingsData.slice(0, 3).map((t) => (
                    <TableRow key={t.rank}>
                      <TableCell className="font-medium">{t.rank}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          {t.team}
                          {t.rank === 1 && <Badge className="text-[10px] px-1.5 py-0 bg-accent text-accent-foreground border-0">1.</Badge>}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{t.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 – Live App Preview */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground">So sieht deine Liga aus</h2>

          <Card className="shadow-md">
            <CardContent className="p-4 md:p-6">
              <Tabs defaultValue="tabelle">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="tabelle">Tabelle</TabsTrigger>
                  <TabsTrigger value="spielplan">Spielplan</TabsTrigger>
                  <TabsTrigger value="ergebnis">Ergebnis</TabsTrigger>
                </TabsList>

                {/* Tab: Tabelle */}
                <TabsContent value="tabelle">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">#</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead className="text-center hidden sm:table-cell">Sp</TableHead>
                        <TableHead className="text-center hidden sm:table-cell">S</TableHead>
                        <TableHead className="text-center hidden sm:table-cell">N</TableHead>
                        <TableHead className="text-center hidden sm:table-cell">Sätze</TableHead>
                        <TableHead className="text-right">Pkt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {standingsData.map((t) => (
                        <TableRow key={t.rank}>
                          <TableCell className="font-medium">{t.rank}</TableCell>
                          <TableCell>
                            <span className="flex items-center gap-2">
                              {t.team}
                              {t.rank === 1 && <Badge className="text-[10px] px-1.5 py-0 bg-accent text-accent-foreground border-0">1.</Badge>}
                            </span>
                          </TableCell>
                          <TableCell className="text-center hidden sm:table-cell">{t.played}</TableCell>
                          <TableCell className="text-center hidden sm:table-cell">{t.wins}</TableCell>
                          <TableCell className="text-center hidden sm:table-cell">{t.losses}</TableCell>
                          <TableCell className="text-center hidden sm:table-cell">{t.sets}</TableCell>
                          <TableCell className="text-right font-semibold">{t.points}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* Tab: Spielplan */}
                <TabsContent value="spielplan" className="space-y-3 mt-3">
                  {matchesData.map((m, i) => (
                    <Card key={i} className="border">
                      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm">{m.teamA} vs. {m.teamB}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{m.date}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{m.venue}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="self-start sm:self-center text-[10px]">Geplant</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Tab: Ergebnis */}
                <TabsContent value="ergebnis" className="mt-3">
                  <Card className="border">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">Smash Brothers vs. Padel Pinguine</p>
                        <Badge className="bg-accent text-accent-foreground border-0 text-[10px]">Abgeschlossen</Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="space-y-1 text-center">
                          <p className="text-xs text-muted-foreground">Satz 1</p>
                          <p className="font-bold text-sm"><span className="text-accent">6</span>:3</p>
                        </div>
                        <div className="space-y-1 text-center">
                          <p className="text-xs text-muted-foreground">Satz 2</p>
                          <p className="font-bold text-sm">4:<span className="text-accent">6</span></p>
                        </div>
                        <div className="space-y-1 text-center">
                          <p className="text-xs text-muted-foreground">Satz 3</p>
                          <p className="font-bold text-sm"><span className="text-accent">6</span>:2</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                        <span className="font-medium text-accent">Smash Brothers</span>
                        <span className="text-muted-foreground">gewinnt</span>
                      </div>
                      <p className="text-xs text-muted-foreground italic">„Enges Match, dritter Satz war entscheidend 🔥"</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 3 – So funktioniert's */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground">So funktioniert's</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <s.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 – Features */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <Card key={i} className="border">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <f.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{f.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 – CTA Footer */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Bereit für deine Liga?</h2>
          <Link to="/register">
            <Button size="lg">Jetzt registrieren</Button>
          </Link>
        </div>
      </section>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border/40">
        © {new Date().getFullYear()} Padel Leagues
      </footer>
    </div>
  );
}
