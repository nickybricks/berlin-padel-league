

# Turniermodus-Verwaltung: Gruppen, Spielplan und Playoffs

## Zusammenfassung
Der Admin bekommt in den Liga-Einstellungen die Moglichkeit, das Turnierformat flexibel zu konfigurieren: Einzelrunde (Round Robin) oder Gruppenphase mit mehreren Gruppen. Dazu gehort die Gruppenzuteilung (manuell oder zufallig), ein angepasster Spielplan (nur innerhalb der Gruppe) und konfigurierbare Playoff-Formate mit gruppenuebergreifenden Paarungen.

---

## Schritt 1: Datenbank erweitern

Neue Spalten in der `leagues`-Tabelle:

| Spalte | Typ | Default | Beschreibung |
|--------|-----|---------|--------------|
| `format_type` | text | `'round_robin'` | `round_robin` oder `groups` |
| `group_count` | integer | `1` | Anzahl Gruppen (1-4) |
| `playoff_format` | text | `'top8_bracket'` | z.B. `top8_bracket`, `top4_bracket`, `cross_group` |
| `playoff_qualifiers_per_group` | integer | `4` | Wie viele Teams pro Gruppe weiterkommen |
| `keep_existing_results` | boolean | `false` | Ob bei Formatwechsel Ergebnisse beibehalten werden |

Die `teams`-Tabelle hat bereits eine `group_name`-Spalte -- diese wird genutzt (z.B. `'A'`, `'B'`).

---

## Schritt 2: Admin-UI -- Turnierformat-Konfiguration

Neue Komponente `TournamentFormatCard` auf der Admin-Seite mit:

- **Format-Auswahl**: Einzelrunde / Gruppenphase (Radio-Buttons)
- **Gruppenanzahl**: Dropdown (2, 3, 4)
- **Playoff-Format**: Dropdown
  - "Top 8 Bracket" (1. vs 8., etc.)
  - "Kreuzspiel" (1A vs 4B, 2A vs 3B, 1B vs 4A, 2B vs 3A)
  - "Top 4 Bracket"
- **Qualifikanten pro Gruppe**: Zahleneingabe
- **Bei Formatwechsel**: Dialog mit Optionen:
  - "Neu starten" (alle Matches loschen)
  - "Ergebnisse beibehalten" (bereits gespielte Paarungen bleiben, Teams die gegeneinander gespielt haben kommen in eine Gruppe)

---

## Schritt 3: Admin-UI -- Gruppenzuteilung

Neue Komponente `GroupAssignment` mit zwei Modi:

**Manueller Modus:**
- Gruppen als Spalten/Karten (Gruppe A, Gruppe B)
- Teams per Dropdown einer Gruppe zuweisen
- Validierung: Teams, die bereits gegeneinander gespielt haben, muessen in einer Gruppe sein (Warnung anzeigen)

**Zufallsmodus:**
- Button "Zufallig zuteilen"
- Constraint: Teams mit bestehenden Ergebnissen werden automatisch in die gleiche Gruppe gesetzt
- Restliche Teams werden gleichmaessig verteilt (z.B. 7/6 bei 13 Teams)
- Vorschau vor dem Speichern

---

## Schritt 4: Spielplan-Generierung anpassen

Die bestehende `generateSchedule`-Funktion in `src/lib/schedule.ts` wird erweitert:

```text
generateGroupSchedule(groups: Map<string, Team[]>)
  -> Fuer jede Gruppe: Round-Robin innerhalb der Gruppe
  -> Wochennummerierung durchgehend
  -> Bestehende Ergebnisse beibehalten (optional)
```

- Gruppe A (7 Teams): 21 Spiele, 7 Wochen
- Gruppe B (6 Teams): 15 Spiele, 5 Wochen (mit Bye-Wochen)
- Der Admin kann den Spielplan neu generieren (mit Bestaetigung)

---

## Schritt 5: Tabelle/Standings gruppenweise anzeigen

- `calculateStandings` bekommt einen optionalen `groupName`-Filter
- `StandingsTable` zeigt bei Gruppenformat Tabs: "Gruppe A" | "Gruppe B"
- Playoff-Qualifikation wird pro Gruppe markiert (z.B. Top 4 pro Gruppe)
- Dashboard zeigt beide Gruppen-Tabellen

---

## Schritt 6: Playoffs anpassen

Die Playoff-Seite wird dynamisch basierend auf `league.playoff_format`:

**Kreuzspiel-Format (cross_group):**
```text
VF 1: 1. Gruppe A vs 4. Gruppe B
VF 2: 2. Gruppe A vs 3. Gruppe B
VF 3: 1. Gruppe B vs 4. Gruppe A
VF 4: 2. Gruppe B vs 3. Gruppe A
     -> Halbfinale -> Finale
```

**Top 8 Bracket (wie bisher):**
Gesamttabelle aller Gruppen, Top 8 nach Punkten.

---

## Schritt 7: Bestehende Ergebnisse behandeln

Wenn der Admin von Round-Robin zu Gruppen wechselt:

1. System ermittelt alle bereits gespielten Paarungen
2. Teams, die gegeneinander gespielt haben, werden als "verbunden" markiert
3. Bei der Gruppenzuteilung: verbundene Teams muessen in dieselbe Gruppe
4. Option "Komplett neu starten": alle Matches und Ergebnisse loeschen

---

## Technische Details

### Dateien die erstellt werden:
- `src/components/leagues/TournamentFormatCard.tsx` -- Format-Konfiguration
- `src/components/leagues/GroupAssignment.tsx` -- Gruppenzuteilung
- `src/lib/groupSchedule.ts` -- Gruppenbasierte Spielplan-Generierung
- `src/hooks/useLeagueFormat.ts` -- Hook fuer Format-Einstellungen

### Dateien die geaendert werden:
- `src/pages/LeagueAdmin.tsx` -- Neue Karten einbinden
- `src/lib/standings.ts` -- Gruppenfilter hinzufuegen
- `src/components/standings/StandingsTable.tsx` -- Gruppen-Tabs
- `src/pages/LeagueDashboard.tsx` -- Gruppen-Tabellen anzeigen
- `src/pages/Playoffs.tsx` -- Dynamisches Playoff-Format
- `src/pages/Schedule.tsx` -- Gruppenfilter im Spielplan
- `src/lib/schedule.ts` -- Gruppenbasierte Generierung
- `src/types/leagues.ts` -- Neue Felder im League-Typ

### Datenbank-Migration:
- `leagues`-Tabelle um Format-Spalten erweitern
- RLS-Policies bleiben unveraendert (Admins koennen `leagues` updaten)

