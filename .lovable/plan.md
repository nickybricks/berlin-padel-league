# Plan: Berlin Padel Liga

## Zusammenfassung
Eine vollständige Padel-Liga-Verwaltung mit Multi-Liga-Architektur, Team-Verwaltung, Spielplan-Generierung, Ergebniseingabe, Tabellenberechnung, Platzbuchungssystem und interaktiver Demo.

## ✅ Implementierte Features

### Phase 1: MVP
- [x] Authentifizierung (Login, Register, E-Mail-Verifizierung)
- [x] Liga beitreten via Einladungslink
- [x] Team-Zuordnung (E-Mail-Match + manuelle Auswahl)
- [x] Spielplan-Generierung (Round Robin + Gruppen)
- [x] Ergebnis-Eintragung (Best-of-3)
- [x] Tabelle mit Punkte-/Satzverhältnis
- [x] Platzbuchungssystem (Venues, Courts, Slots)
- [x] Admin-Bereich (Mitglieder, Rollen, Teams)
- [x] RLS-Policies für alle Tabellen

### Phase 2: Erweiterungen
- [x] Liga erstellen (3-Schritt-Wizard)
- [x] Multi-Liga-Architektur (alle Daten per `league_id` isoliert)
- [x] Liga-spezifische Platzbuchungen
- [x] Liga löschen
- [x] Turnierformat nachträglich ändern (Admin)
- [x] Gruppenzuteilung (manuell + zufällig)
- [x] Hin- und Rückrunde Toggle
- [x] Bis zu 8 Gruppen
- [x] **Dark Mode** — System-Erkennung + manueller Toggle
- [x] **Interaktive Demo-Liga** — `/demo` mit 8 Teams, 2 Gruppen, Playoffs

### Phase 3: Offene Features
- [ ] Playoffs / Bracket-Ansicht (echte Liga)
- [ ] Max-Teams-Prüfung im Join-Flow
- [ ] Push-Notifications für neue Ergebnisse
- [ ] Realtime-Updates
- [ ] Statistik-Dashboard mit Charts
- [ ] PWA-Support
- [ ] Export-Funktionen (CSV, PDF)

## Architektur

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **UI**: shadcn/ui mit HSL-Farbvariablen
- **Backend**: Lovable Cloud (PostgreSQL, Auth, Storage)
- **State**: TanStack React Query für Server-State

### Design-System
- Mobile-First, daumen-optimiert
- Apple-like Clean & Minimalist
- Konsistente Tokens: `--background`, `--primary`, `--muted`, `--accent`
- Keine Hex-Codes in Komponenten

## Nächste Schritte

### Priorität Hoch
1. **Playoff-System für echte Ligen** — Aktuell nur in Demo verfügbar
2. **Max-Teams-Prüfung** — Verhindere Überschreitung bei Join-Flow

### Priorität Mittel
3. **Statistik-Dashboard** — Charts für Team-Performance
4. **Push-Notifications** — Neue Ergebnisse, anstehende Spiele
5. **Export-Funktionen** — CSV-Export für Admins

### Priorität Niedrig
6. **PWA-Support** — Offline-Fähigkeit
7. **Liga-übergreifende Profile** — Spieler-Statistiken über alle Ligen

