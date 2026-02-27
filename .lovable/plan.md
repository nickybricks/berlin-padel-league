
# Liga erstellen -- Feature-Plan

## Uebersicht
Nutzer koennen ueber die Onboarding-Seite eine eigene Liga erstellen. Ein mehrstufiger Wizard fuehrt durch alle Einstellungen. Nach Erstellung erhaelt der Nutzer einen Einladungslink zum Teilen.

## User Flow (Wizard mit 3 Schritten)

```text
Schritt 1: Grundlagen
+----------------------------------+
| Liga-Name:  [________________]   |
| Logo:       [Bild hochladen]     |
+----------------------------------+

Schritt 2: Turnierformat
+----------------------------------+
| Modus:  (o) Liga  ( ) Gruppen   |
| Hin+Rueck?  [x] Ja              |
| Max Teams:  [ 16 ] (optional)   |
+----------------------------------+

Schritt 3: Playoffs
+----------------------------------+
| Wer kommt weiter?  [Top 4 v]    |
| Playoff-Art:  [Bracket  v]      |
| (bei Gruppen: Kreuzspiel mgl.)  |
+----------------------------------+

        --> Liga erstellt! -->

Ergebnis-Screen
+----------------------------------+
| Liga "XYZ" erstellt!             |
| Code: BPL2025                    |
| [Link kopieren]  [Zur Liga]     |
+----------------------------------+
```

## Datenbank-Aenderungen

### Neue Spalte: `home_and_away` (boolean)
Migration auf `leagues`-Tabelle:
- `ALTER TABLE public.leagues ADD COLUMN home_and_away boolean NOT NULL DEFAULT false;`
- `ALTER TABLE public.leagues ADD COLUMN max_teams integer;`

Der `League`-Typ wird entsprechend erweitert.

### Leagues INSERT Policy
Bereits vorhanden: "Authenticated users can create leagues" -- passt.

## Neue Dateien

### 1. `src/pages/CreateLeague.tsx`
Mehrstufiger Wizard (3 Steps) mit lokalem State. Nutzt bestehende shadcn-Komponenten (Input, RadioGroup, Select, Switch, Button). Am Ende: `supabase.from('leagues').insert(...)`, dann automatisch `league_members` mit Rolle `admin` einfuegen. Zeigt Erfolgsscreen mit Code und Share-Link.

### 2. `src/hooks/useCreateLeague.ts`
Mutation-Hook: Erstellt die Liga und fuegt den Ersteller als Admin-Mitglied hinzu (zwei Inserts in Folge).

## Bestehende Dateien -- Aenderungen

### `src/pages/Onboarding.tsx`
- "Liga erstellen"-Karte aktivieren (opacity entfernen, onClick zu `/create-league`)
- Button-Text von "Folgt" auf "Erstellen" aendern

### `src/App.tsx`
- Neue Route: `<Route path="/create-league" element={<CreateLeague />} />`

### `src/types/leagues.ts`
- `home_and_away: boolean` und `max_teams: number | null` zum `League`-Interface hinzufuegen

### `src/components/leagues/TournamentFormatCard.tsx`
- Hin-und-Rueckrunde Toggle (Switch) ergaenzen, damit Admins das auch nachtraeglich aendern koennen

## Technische Details

### Liga-Code Generierung
Zufaelliger 6-stelliger alphanumerischer Code, clientseitig generiert (z.B. `Math.random().toString(36).substring(2, 8).toUpperCase()`). Unique-Constraint in DB verhindert Kollisionen.

### Einladungslink
Format: `{window.location.origin}/join/{code}` -- bereits vom bestehenden Join-Flow unterstuetzt. Zusaetzlich "Link kopieren"-Button mit `navigator.clipboard.writeText()`.

### Max Teams / Liga schliessen
- `max_teams` ist optional (null = unbegrenzt)
- Im Join-Flow (`JoinLeague.tsx`) wird geprueft ob die aktuelle Teamanzahl < max_teams ist, bevor neue Teams hinzugefuegt werden koennen
- Admins koennen max_teams nachtraeglich in den Liga-Einstellungen aendern

### Hin- und Rueckrunde
- `home_and_away = true` verdoppelt die generierten Gruppenspiele (jede Paarung wird zweimal generiert)
- Wird beim Spielplan-Generieren beruecksichtigt
