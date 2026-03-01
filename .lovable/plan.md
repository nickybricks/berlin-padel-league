

# Neue Landing Page + Routing-Umstellung

## Uebersicht
Die aktuelle minimale Landing Page (`/`) wird durch eine vollstaendige Marketing-Seite mit 5 Sektionen ersetzt. Alle internen Verweise, die bisher auf `"/"` zeigen (und eigentlich "zurueck zur App" meinen), werden auf `"/leagues"` umgestellt.

## Routing-Aenderungen

### `src/App.tsx`
- Route `"/"` zeigt die neue Landing Page (mit Auth-Redirect auf `/leagues` fuer eingeloggte User)
- Route `"/leagues"` bleibt fuer `MyLeagues`
- Keine weitere Aenderung noetig

### Verweise auf `"/"` aktualisieren (zu `"/leagues"`)
Folgende Dateien verlinken auf `"/"` und meinen damit die App-Startseite nach Login:
- `src/pages/LeagueDashboard.tsx` -- `Navigate to="/"` wird zu `"/leagues"`
- `src/pages/Onboarding.tsx` -- Auth-Redirect `navigate('/')` wird zu `"/leagues"`
- `src/pages/CreateLeague.tsx` -- Auth-Redirect `navigate('/')` wird zu `"/leagues"`
- `src/pages/JoinLeague.tsx` -- zwei `Link to="/"` werden zu `"/leagues"`
- `src/pages/Register.tsx` -- `Link to="/"` ("Zurueck") wird zu `"/"`  (bleibt, da es zur Landing zurueck soll)

## Neue Datei: `src/pages/Landing.tsx` (kompletter Rewrite)

Eingeloggte User werden weiterhin auf `/leagues` redirected.

### Header -- Fixed Navigation Island
- `fixed top-4 left-1/2 -translate-x-1/2 z-50` zentriert
- `rounded-full backdrop-blur-xl bg-white/70 border border-border/30 shadow-md`
- Links: "Padel Leagues" Logo-Text (bold, dark green via `text-accent`)
- Rechts: "Login" (ghost Button) + "Registrieren" (primary Button, gruener Hintergrund)
- Kein Hamburger-Menu, mobile gleich, nur kleineres Padding

### Section 1 -- Hero
- Headline: "Padel Leagues"
- Subline: Beschreibungstext
- CTA: "Jetzt mitmachen" Button -> `/register`
- Darunter: Fake-Browser-Mockup mit eingebetteter Mini-Tabelle (echte shadcn Table mit Dummy-Daten, abgerundeter Rahmen + Schatten)

### Section 2 -- Live App Preview ("So sieht deine Liga aus")
- shadcn `Tabs` mit 3 Tabs: Tabelle, Spielplan, Ergebnis
- Tab "Tabelle": shadcn `Table` mit 5 Dummy-Teams, Rang 1 mit gruener Badge
- Tab "Spielplan": 3 Match-Cards (shadcn Card) mit Teams, Datum, Venue, Status-Badge "Geplant"
- Tab "Ergebnis": Eine Result-Card mit Satzstaenden, Gewinner grueen hervorgehoben, Badge "Abgeschlossen"
- Alles in einem Card-Container mit Schatten

### Section 3 -- "So funktioniert's"
- 3 Steps horizontal (desktop) / gestapelt (mobile)
- Lucide Icons: `Mail`, `Swords`/`Trophy`, `BarChart3`
- Titel + Beschreibungstext pro Step

### Section 4 -- Features (2x2 Grid)
- 4 Feature-Cards mit Lucide Icon + Titel + Einzeiler
- Icons: `CalendarDays`, `Timer`, `TrendingUp`, `Layers`

### Section 5 -- CTA Footer
- "Bereit fuer deine Liga?" + "Jetzt registrieren" Button -> `/register`
- Copyright-Zeile

## Zusammenfassung der Aenderungen

| Datei | Aenderung |
|---|---|
| `src/pages/Landing.tsx` | Komplett neu geschrieben (Marketing-Seite) |
| `src/App.tsx` | Keine Aenderung noetig (Route `/` und `/leagues` existieren bereits) |
| `src/pages/LeagueDashboard.tsx` | `Navigate to="/"` -> `to="/leagues"` |
| `src/pages/Onboarding.tsx` | `navigate('/')` -> `navigate('/leagues')` |
| `src/pages/CreateLeague.tsx` | `navigate('/')` -> `navigate('/leagues')` |
| `src/pages/JoinLeague.tsx` | 2x `Link to="/"` -> `to="/leagues"` |

`Register.tsx` behaelt `Link to="/"` da es zur Landing zurueck verweisen soll.

## Technische Details
- Alle Dummy-Daten sind statisch im Component definiert (kein DB-Zugriff)
- Verwendet ausschliesslich bestehende shadcn-Komponenten (Table, Tabs, Card, Button, Badge)
- Mobile-first: Sections stacken vertikal, Feature-Grid wird 1-spaltig
- Header Island ist `fixed` mit `backdrop-blur-xl` fuer Glassmorphism

