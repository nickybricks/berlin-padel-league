
# Plan: Multi-Liga-System mit Einladungsbasierter Registrierung

## Zusammenfassung

Das System wird um Ligen erweitert. Benutzer können nur über Einladungslinks einer Liga beitreten. Die aktuelle Index-Seite wird zur Liga-Ansicht, und eine neue minimalistische Landingpage wird erstellt.

## Neue Datenbankstruktur

```text
leagues
├── id (uuid, PK)
├── name (text)
├── code (text, unique) - 6-stelliger Beitrittscode
├── created_by (uuid) - Admin der Liga
├── created_at (timestamp)
└── invite_token (text, unique) - für Einladungslinks

league_members
├── id (uuid, PK)
├── league_id (uuid, FK)
├── user_id (uuid, FK)
├── role (league_role: 'admin' | 'player')
├── team_id (uuid, FK, nullable)
└── created_at (timestamp)

teams (erweitert)
├── ... bestehende Spalten ...
└── league_id (uuid, FK) - Zuordnung zur Liga
```

## Benutzerfluss

```text
Landingpage (/)
    │
    ├── [Liga beitreten] → Code eingeben → Registrierung/Login
    │                           │
    │                           ├── E-Mail bereits bei Team → Direkt der Liga beitreten
    │                           │
    │                           └── E-Mail nicht bekannt → Team auswählen/erstellen
    │
    └── [Liga erstellen] → "Folgt" (deaktiviert)

Einladungslink (/join/:token)
    │
    └── Registrierung mit vorausgefülltem Liga-Kontext
```

## Seitenstruktur

```text
/                    → Neue Landingpage (nicht eingeloggt)
                     → Weiterleitung zu /league/[id] (eingeloggt)
/join/:code          → Beitritt via Einladungscode
/league/:id          → Liga-Dashboard (aktuelle Index-Funktionalität)
/league/:id/teams    → Teams der Liga
/league/:id/schedule → Spielplan der Liga
/league/:id/bookings → Platzbuchungen der Liga
/league/:id/playoffs → Playoffs der Liga
/login               → Bleibt, aber mit Liga-Kontext
```

## Umsetzungsschritte

### Phase 1: Datenbank-Migration

1. Neue Tabellen erstellen:
   - `leagues` mit Code und Invite-Token
   - `league_members` für Mitgliedschaften

2. Teams-Tabelle erweitern:
   - `league_id` Spalte hinzufügen

3. RLS-Policies:
   - Ligen: Öffentlich lesbar, nur Admins können erstellen
   - League Members: Nur Mitglieder sehen ihre Liga
   - Teams: Gefiltert nach Liga-Zugehörigkeit

### Phase 2: Neue Landingpage

**Design: Minimalistisch, sportlich, modern 2026**

```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│              [Padel Liga Icon/Logo]                 │
│                                                     │
│        Willkommen bei der Padel Liga                │
│                                                     │
│    Organisiere deine Freizeit-Liga einfach          │
│    und übersichtlich.                               │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │  Beitrittscode eingeben                     │   │
│   │  ┌─────────────────────────────────────┐    │   │
│   │  │ ABC123                               │    │   │
│   │  └─────────────────────────────────────┘    │   │
│   │  [Liga beitreten]                           │   │
│   └─────────────────────────────────────────────┘   │
│                                                     │
│   ─────────────── oder ───────────────              │
│                                                     │
│   [Liga erstellen (folgt)]  <- deaktiviert          │
│                                                     │
│   ──────────────────────────────────────            │
│                                                     │
│   Bereits Mitglied? [Anmelden]                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Styling-Prinzipien:**
- Viel Weißraum
- Sanfte Schatten (shadow-sm, shadow-md)
- Großzügiges Padding
- Abgerundete Ecken (rounded-lg, rounded-xl)
- Mobile-First mit zentriertem Content
- Hell, sportlich, clean

### Phase 3: Beitrittslogik

**Datei: src/pages/JoinLeague.tsx**

```text
1. Code validieren
2. Prüfen ob User eingeloggt
   - Ja → Weiter zu Schritt 3
   - Nein → Registrierung/Login zeigen
3. E-Mail prüfen gegen Teams der Liga
   - Match → Automatisch Team zuweisen, zur Liga weiterleiten
   - Kein Match → Team-Auswahl zeigen
4. League-Member erstellen
5. Zur Liga weiterleiten
```

### Phase 4: Liga-Dashboard

Die aktuelle Index-Seite wird zu `/league/:id` mit:
- Liga-spezifische Daten laden
- Navigation auf Liga beschränken
- Header zeigt aktuelle Liga

## Betroffene Dateien

```text
Neu:
├── src/pages/Landing.tsx         (neue Startseite)
├── src/pages/JoinLeague.tsx      (Beitrittsseite)
├── src/pages/LeagueDashboard.tsx (Liga-Ansicht)
├── src/hooks/useLeagues.ts       (Liga-Hooks)
└── src/types/leagues.ts          (Typen)

Anpassen:
├── src/App.tsx                   (neue Routen)
├── src/components/layout/Header.tsx (Liga-Kontext)
├── src/components/layout/Layout.tsx (Liga-Kontext)
├── src/hooks/useTeams.ts         (Liga-Filter)
├── src/hooks/useMatches.ts       (Liga-Filter)
└── src/pages/Login.tsx           (Liga-Kontext)

Migration:
└── Neue Migration für leagues, league_members, teams.league_id
```

## Bestehende Liga

Die aktuellen 11 Teams werden einer Standard-Liga zugeordnet:
- Name: "Berlin Padel Liga"
- Code: Wird generiert
- Alle bestehenden User werden dieser Liga zugewiesen

## Technische Details

### Liga-Code Generierung

```typescript
function generateLeagueCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => 
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}
```

### RLS für Liga-Isolation

```sql
-- Beispiel: Teams nur der eigenen Liga sehen
CREATE POLICY "Users can view teams in their league"
ON public.teams FOR SELECT
USING (
  league_id IN (
    SELECT league_id FROM league_members 
    WHERE user_id = auth.uid()
  )
  OR league_id IS NULL -- Für öffentliche Ansicht
);
```

## Migration der bestehenden Daten

1. Default-Liga "Berlin Padel Liga" erstellen
2. Alle Teams dieser Liga zuweisen
3. Alle bestehenden User als Liga-Mitglieder hinzufügen

## Berechtigungen

| Aktion | Nicht eingeloggt | Player | Liga-Admin | System-Admin |
|--------|------------------|--------|------------|--------------|
| Landingpage sehen | Ja | Ja | Ja | Ja |
| Liga beitreten (Code) | Ja* | Ja | Ja | Ja |
| Liga-Daten sehen | - | Eigene Liga | Eigene Liga | Alle |
| Team erstellen | - | - | Ja | Ja |
| Ergebnis melden | - | Eigenes Team | Alle Teams | Alle |

*Muss sich dann registrieren

## Nicht in diesem Plan

- Liga erstellen (Button deaktiviert mit "folgt")
- Liga-Einstellungen bearbeiten
- Mitglieder verwalten
