import { Link } from 'react-router-dom';
import { DemoLeagueProvider, useDemoLeague } from './DemoLeagueContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import DemoStandings from './tabs/DemoStandings';
import DemoTeams from './tabs/DemoTeams';
import DemoSchedule from './tabs/DemoSchedule';
import DemoPlayoffs from './tabs/DemoPlayoffs';
import DemoEnterResult from './tabs/DemoEnterResult';

const TABS = [
  { key: 'tabelle', label: 'Tabelle' },
  { key: 'teams', label: 'Teams' },
  { key: 'spielplan', label: 'Spielplan' },
  { key: 'playoffs', label: 'Playoffs' },
  { key: 'ergebnis', label: 'Ergebnis eintragen' },
];

function DemoPageContent() {
  const { activeTab, setActiveTab } = useDemoLeague();

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Floating Header */}
      <header className="w-full flex justify-center pt-4 px-4 z-50 sticky top-0">
        <div className="w-full max-w-[991px] flex items-center gap-3 px-4 sm:px-5 h-14 rounded-full bg-card/80 backdrop-blur-xl border border-border/40 shadow-sm">
          {/* Logo */}
          <span className="text-sm font-bold text-primary tracking-tight whitespace-nowrap">
            Demo Padel Liga
          </span>
          <Badge className="bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30 text-[10px] px-1.5 py-0">
            DEMO
          </Badge>

          {/* Nav pills – scrollable */}
          <nav className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1 pl-2">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.key
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* User icon */}
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-[991px] mx-auto px-4 pt-6">
        {activeTab === 'tabelle' && <DemoStandings />}
        {activeTab === 'teams' && <DemoTeams />}
        {activeTab === 'spielplan' && <DemoSchedule />}
        {activeTab === 'playoffs' && <DemoPlayoffs />}
        {activeTab === 'ergebnis' && <DemoEnterResult />}
      </main>

      {/* Bottom banner */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-card/90 backdrop-blur-md border-t border-border/40">
        <div className="max-w-[991px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-3">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            Dies ist eine interaktive Demo – keine echten Daten.
          </p>
          <div className="flex items-center gap-2">
            <Link to="/register">
              <Button size="sm" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 text-xs h-8">
                Eigene Liga starten
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm" className="rounded-full text-xs h-8">
                Zurück zur Startseite
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <DemoLeagueProvider>
      <DemoPageContent />
    </DemoLeagueProvider>
  );
}
