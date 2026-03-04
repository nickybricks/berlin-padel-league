import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DemoLeagueProvider, useDemoLeague } from './DemoLeagueContext';
import { Button } from '@/components/ui/button';
import DemoStandings from './tabs/DemoStandings';
import DemoSchedule from './tabs/DemoSchedule';
import DemoEnterResult from './tabs/DemoEnterResult';

const EMBED_TABS = [
  { key: 'tabelle', label: 'Tabelle' },
  { key: 'spielplan', label: 'Spielplan' },
  { key: 'ergebnis', label: 'Ergebnis eintragen' },
];

function EmbedContent() {
  const { activeTab, setActiveTab } = useDemoLeague();

  return (
    <div>
      {/* Browser mockup */}
      <div className="rounded-xl border border-border/60 shadow-lg overflow-hidden bg-card">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[hsl(var(--foreground))]/[.06] border-b border-border/40">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--warning))]/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-accent/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-muted/80 rounded-md px-3 py-0.5 text-[10px] text-muted-foreground font-mono">
              app.padelleagues.de/liga/demo
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 px-4 pt-3 pb-2">
          {EMBED_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                activeTab === t.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-4 pb-4 max-h-[420px] overflow-y-auto">
          {activeTab === 'tabelle' && <DemoStandings compact />}
          {activeTab === 'spielplan' && <DemoSchedule compact />}
          {activeTab === 'ergebnis' && <DemoEnterResult compact />}
        </div>
      </div>
    </div>
  );
}

export default function DemoEmbed() {
  return (
    <DemoLeagueProvider>
      <section className="w-full max-w-[991px] mx-auto px-4 py-16">
        {/* Headline */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Probier es aus – live Demo
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Trage Ergebnisse ein und sieh wie sich die Tabelle aktualisiert.
          </p>
        </div>

        <EmbedContent />

        {/* CTAs */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <Link to="/demo">
            <Button variant="outline" className="rounded-full">
              Vollbild Demo öffnen
            </Button>
          </Link>
          <Link to="/register">
            <Button className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
              Eigene Liga starten
            </Button>
          </Link>
        </div>
      </section>
    </DemoLeagueProvider>
  );
}
