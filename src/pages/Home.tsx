import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trophy, Calendar, CheckCircle2, MapPin, Clock } from 'lucide-react';

const standingsData = [
  { rank: 1, team: 'Smash Brothers', played: 6, wins: 5, losses: 1, sets: '12:4', points: 18 },
  { rank: 2, team: 'Padel Pinguine', played: 6, wins: 4, losses: 2, sets: '10:6', points: 15 },
  { rank: 3, team: 'Net Crushers', played: 6, wins: 3, losses: 3, sets: '8:8', points: 12 },
  { rank: 4, team: 'Drop Shot FC', played: 6, wins: 2, losses: 4, sets: '6:10', points: 9 },
  { rank: 5, team: 'Lob City Berlin', played: 6, wins: 1, losses: 5, sets: '4:12', points: 6 },
];

const scheduleData = [
  { teamA: 'Smash Brothers', teamB: 'Net Crushers', date: 'Sa 15.03.', time: '14:00', venue: 'Padel Berlin Neukölln' },
  { teamA: 'Padel Pinguine', teamB: 'Drop Shot FC', date: 'So 16.03.', time: '10:00', venue: 'Padel City Mitte' },
  { teamA: 'Lob City Berlin', teamB: 'Smash Brothers', date: 'Mi 19.03.', time: '19:00', venue: 'Padel Berlin Neukölln' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Floating Header Island */}
      <header className="w-full flex justify-center pt-4 px-4 z-50">
        <div className="w-full max-w-2xl flex items-center justify-between px-5 sm:px-6 h-14 rounded-full bg-white/70 backdrop-blur-xl border border-border/40 shadow-sm shadow-black/5">
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

      <main className="flex-1 flex flex-col items-center px-4">
        {/* Hero */}
        <section className="w-full max-w-2xl text-center pt-16 pb-12 space-y-5">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Padel Leagues
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            Organisiere deine Padel-Liga. Tritt einem Team bei, spiele Matches und verfolge dein Ranking.
          </p>
          <Link to="/register">
            <Button size="lg" className="rounded-full mt-2 px-8">
              Jetzt mitmachen
            </Button>
          </Link>
        </section>

        {/* Preview */}
        <section className="w-full max-w-2xl pb-20 space-y-5">
          <h2 className="text-xl font-semibold text-foreground text-center">
            So sieht deine Liga aus
          </h2>

          <Card className="shadow-md border-border/50">
            <CardContent className="p-3 sm:p-5">
              <Tabs defaultValue="tabelle">
                <TabsList className="w-full">
                  <TabsTrigger value="tabelle" className="flex-1 gap-1.5">
                    <Trophy className="h-3.5 w-3.5" />
                    Tabelle
                  </TabsTrigger>
                  <TabsTrigger value="spielplan" className="flex-1 gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Spielplan
                  </TabsTrigger>
                  <TabsTrigger value="ergebnis" className="flex-1 gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Ergebnis
                  </TabsTrigger>
                </TabsList>

                {/* Tabelle */}
                <TabsContent value="tabelle" className="mt-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">#</TableHead>
                          <TableHead>Team</TableHead>
                          <TableHead className="text-center">Sp</TableHead>
                          <TableHead className="text-center">S</TableHead>
                          <TableHead className="text-center">N</TableHead>
                          <TableHead className="text-center">Sätze</TableHead>
                          <TableHead className="text-center">Pkt</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {standingsData.map((row) => (
                          <TableRow key={row.rank}>
                            <TableCell className="font-medium">
                              {row.rank === 1 ? (
                                <Badge className="bg-primary/10 text-primary border-0 text-xs px-1.5">
                                  {row.rank}
                                </Badge>
                              ) : (
                                row.rank
                              )}
                            </TableCell>
                            <TableCell className="font-medium">{row.team}</TableCell>
                            <TableCell className="text-center text-muted-foreground">{row.played}</TableCell>
                            <TableCell className="text-center text-muted-foreground">{row.wins}</TableCell>
                            <TableCell className="text-center text-muted-foreground">{row.losses}</TableCell>
                            <TableCell className="text-center text-muted-foreground">{row.sets}</TableCell>
                            <TableCell className="text-center font-semibold">{row.points}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Spielplan */}
                <TabsContent value="spielplan" className="mt-4 space-y-3">
                  {scheduleData.map((match, i) => (
                    <div key={i} className="rounded-lg border border-border/60 p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">
                          {match.teamA} <span className="text-muted-foreground mx-1.5">vs</span> {match.teamB}
                        </div>
                        <Badge variant="secondary" className="text-xs">Geplant</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {match.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {match.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {match.venue}
                        </span>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {/* Ergebnis */}
                <TabsContent value="ergebnis" className="mt-4">
                  <div className="rounded-lg border border-border/60 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-primary/10 text-primary border-0 text-xs">Abgeschlossen</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-sm flex items-center gap-1.5">
                          Smash Brothers
                          <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0">
                            Sieger
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Padel Pinguine</div>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-mono">
                        <span className="font-semibold">6:3</span>
                        <span className="text-muted-foreground">4:6</span>
                        <span className="font-semibold">6:2</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground pt-1 border-t border-border/40">
                      Enges Match, dritter Satz war entscheidend 🔥
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
