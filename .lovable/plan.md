

# Plan: Interaktive Demo-Padel-Liga

## Zusammenfassung
Eine vollständig im Browser-State lebende Demo-Liga mit 8 Teams in 2 Gruppen, Spielplan, Tabelle, Playoffs und Ergebniseingabe. Erreichbar als eigenständige Seite unter `/demo` und eingebettet als interaktive Preview auf der Landingpage `/`.

## Neue Dateien

### 1. `src/demo/DemoLeagueContext.tsx` — React Context + Provider
- Hardcoded 8 Teams (4 pro Gruppe A/B) mit IDs, Namen, Spielernamen, Gruppe
- 12 Round-Robin-Matches (6 pro Gruppe), aufgeteilt in 3 Spielwochen (je 4 Spiele)
- 4 Matches aus Woche 1 haben vordefinierte Ergebnisse
- State: `results` Map, Funktionen `submitResult(matchId, sets)` und `clearResult(matchId)`
- Automatische Berechnung von Standings (reuse `calculateStandings` aus `src/lib/standings.ts`) und Playoff-Bracket bei jeder Ergebnisänderung
- Kein API-Call, kein Backend — alles in `useState`

### 2. `src/demo/DemoPage.tsx` — Route `/demo`
- Floating Header Island (wie bestehender Stil): "Demo Padel Liga" + orange "DEMO" Badge, rechts Tab-Pills
- 5 Tabs via React State: Tabelle, Teams, Spielplan, Playoffs, Ergebnis eintragen
- Fixiertes Bottom-Banner: "Dies ist eine interaktive Demo" + CTAs zu `/register` und `/`
- User-Icon rechts im Header (dekorativ)

### 3. `src/demo/tabs/DemoStandings.tsx` — Tab "Tabelle"
- Sub-Tabs: Gruppe A, Gruppe B, Gesamt (shadcn Tabs)
- Wiederverwendung der Tabellenlogik aus `StandingsTable` aber als eigenständige Demo-Variante (kein `useParams`, keine Links)
- Grüner Playoff-Balken links, farbige Differenz-Werte, Legende

### 4. `src/demo/tabs/DemoTeams.tsx` — Tab "Teams"
- 3/2/1-Spalten-Grid, Cards mit User-Icon-Avatar, Name, Spielernamen, Chevron
- Klick → Toast "In der echten App siehst du hier Team-Details."

### 5. `src/demo/tabs/DemoSchedule.tsx` — Tab "Spielplan"
- Filter-Dropdowns (Gruppe, Woche, Team, Status) — filtern den lokalen State
- Match-Cards gruppiert nach Spielwoche, Header mit "X/Y gespielt"
- Gespielt: grünes Badge, Satz-Score, Gewinner grün, Game-Scores
- Ausstehend: graues Badge, nur Teamnamen
- Klick auf ausstehende Card → wechselt zu Tab "Ergebnis eintragen" mit vorausgewähltem Match

### 6. `src/demo/tabs/DemoPlayoffs.tsx` — Tab "Playoffs"
- Gelbes Info-Banner, Qualifikations-Chips, Bracket (VF→HF→Finale→Champion)
- Kreuzspiel-Format: 1A vs 4B, 2A vs 3B, 1B vs 4A, 2B vs 3A
- Playoff-Modus-Erklärung als Card

### 7. `src/demo/tabs/DemoEnterResult.tsx` — Tab "Ergebnis eintragen"
- Orange "Demo-Modus" Badge
- Select für ausstehende Spiele, Satz-Eingabe (1-3), optionaler Kommentar
- Submit → `submitResult()` → Erfolgs-Toast, Tabelle aktualisiert sich

### 8. `src/demo/DemoEmbed.tsx` — Kompakte Version für Landingpage
- Browser-Mockup-Frame (dunkle Titelleiste mit 3 Punkten + Fake-URL)
- Kompakte Tabs: Tabelle, Spielplan, Ergebnis eintragen
- Reduziertes Padding/Schriftgrößen
- Umgeben von Headline "Probier es aus – live Demo" und CTAs

## Geänderte Dateien

### `src/App.tsx`
- Neue Route `/demo` → `DemoPage`

### `src/pages/Home.tsx`
- Import und Einbettung von `DemoEmbed` nach dem Header
- Headline-Section + Browser-Frame + CTA-Buttons darunter

## Technische Details

- **Datenfluss**: `DemoLeagueProvider` wrapped nur die Demo-Routen/Komponenten, nicht die gesamte App
- **Standings-Berechnung**: Direkte Wiederverwendung von `calculateStandings()` und `formatSetResult()` / `getSetScore()` aus `src/lib/standings.ts`
- **Typen**: Wiederverwendung von `Team`, `Match`, `MatchResult`, `TeamStanding`, `MatchWithTeams` aus `src/types/database.ts`
- **Kein Backend**: Alle Daten leben in React State, Page Refresh setzt zurück
- **Mobile-first**: Bottom-Banner fixed, Header scrollbar auf Mobile, responsive Grids
- **Styling**: Konsistent mit bestehendem Design-System (shadcn, Tailwind-Variablen, `match-card`, `sport-badge` CSS-Klassen)

