
# Plan: Apple-Inspired Design Redesign

## Zusammenfassung
Das Design wird nach Apple-Prinzipien überarbeitet: radikale Reduktion, verbesserte Typografie, Glassmorphism-Header, Segmented Control Navigation und entsättigte Farbakzente.

---

## Änderung 1: Farb- und Design-System (CSS Variables)

**Datei:** `src/index.css`

- Neue CSS-Variable für Glassmorphism-Effekte hinzufuegen
- Subtilere Farbvarianten fuer Siege/Niederlagen (stark entsaettigt)
- Zebra-Streifen Hintergrund (2-3% Grau) definieren
- Monospace-Zahlen aktivieren fuer tabellarische Daten

Aenderungen:
- `--success` entsaettigen (von 160 70% 40% auf ca. 160 30% 45%)
- `--destructive` entsaettigen (von 0 72% 51% auf ca. 0 30% 55%)
- Neue Variable `--zebra: 220 10% 97%` fuer abwechselnde Zeilen
- Glassmorphism-Material-Stil fuer Header

---

## Änderung 2: Header mit Glassmorphism und Segmented Control

**Datei:** `src/components/layout/Header.tsx`

**Glassmorphism Header:**
- Hintergrund: semitransparent weiss/grau statt solid dark
- Staerkerer Blur-Effekt: `backdrop-blur-xl`
- Feinere Border: `border-b border-border/30`

**Segmented Control Navigation:**
- Navigationslinks in einem "Pill"-Container zusammenfassen
- Aktives Element mit subtiler Hervorhebung (weisser Hintergrund, leichter Schatten)
- Kein saturierter Primary-Hintergrund fuer aktive Items

```
Desktop-Navigation Design:
+--------------------------------------------------+
|  [ Tabelle ][ Teams ][ Spielplan ][ Playoffs ]   |
+--------------------------------------------------+
     ^active: white bg, subtle shadow
```

---

## Änderung 3: Tabellen-Design ohne Linien

**Datei:** `src/components/standings/StandingsTable.tsx`

**Radikale Reduktion der Linien:**
- Alle `border-b` von Tabellenzeilen entfernen
- Zebra-Striping mit sehr subtiler Hintergrundfarbe (odd rows)
- Mehr vertikaler Whitespace (py-5 statt py-4)

**Typografie-Hierarchie:**
- Spaltenheader: Kleinere Schrift, VERSALIEN, mittleres Grau
- Zahlen: `tabular-nums` fuer exakte Ausrichtung
- Punkte-Badge: Kein farbiger Hintergrund, stattdessen Fettdruck

**Team-Logos:**
- Kreisrund statt eckig (`rounded-full`)
- Feiner hellgrauer Innenrahmen (`ring-1 ring-border/40`)

**Farbakzente reduzieren:**
- Siege/Niederlagen: Entsaettigte oder graue Farben
- Nur eine Akzentfarbe fuer Interaktionen (Primary Blue)
- Punkte-Spalte: Semibold statt bold, kein farbiger Badge

---

## Änderung 4: Hero Section und Karten

**Datei:** `src/pages/LeagueDashboard.tsx`

- Hero-Hintergrund: Subtilerer Gradient (nicht solid primary)
- Stats-Karten: Weisserer Hintergrund, feinere Schatten
- Abgerundete Kanten beibehalten, aber weniger "schwer"

---

## Änderung 5: Tailwind Konfiguration

**Datei:** `tailwind.config.ts`

- Font-Stack: System-UI San Francisco fuer Apple-Geraete priorisieren
- Neue Utility-Klasse fuer `tabular-nums`
- Leichtere Schatten-Varianten

---

## Technische Details

### StandingsTable.tsx - Hauptaenderungen:

```typescript
// Thead: Kleinere Versalien-Header
<tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground/70">
  <th className="pb-4 pl-4 w-12 font-medium">#</th>
  ...
</tr>

// Tbody Rows: Zebra statt Borders
<tr className={`transition-colors ${index % 2 === 1 ? 'bg-muted/30' : ''}`}>

// Zahlen mit tabular-nums
<td className="tabular-nums text-center ...">

// Punkte ohne Badge
<span className="text-lg font-semibold tabular-nums">
  {standing.points}
</span>

// Logos kreisrund mit Ring
<div className="h-8 w-8 rounded-full ring-1 ring-border/40 overflow-hidden">
```

### Header.tsx - Segmented Control:

```typescript
// Container fuer Navigation
<nav className="hidden md:flex items-center bg-muted/60 rounded-full p-1">
  {navItems.map(item => (
    <Link
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
        isActive(item.path)
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {item.label}
    </Link>
  ))}
</nav>
```

---

## Betroffene Dateien

1. `src/index.css` - Neue CSS-Variablen, entsaettigte Farben
2. `src/components/layout/Header.tsx` - Glassmorphism + Segmented Control
3. `src/components/standings/StandingsTable.tsx` - Linien entfernen, Zebra, Typografie
4. `src/pages/LeagueDashboard.tsx` - Subtilere Hero Section
5. `tailwind.config.ts` - San Francisco Font-Stack

---

## Visueller Vergleich

```text
VORHER:                          NACHHER:
+---------------------------+    +---------------------------+
| [Dark Navy Header]        |    | [Glass Blur Header]       |
| Nav: solid active state   |    | Nav: Segmented Control    |
+---------------------------+    +---------------------------+
| #  Logo  Team    S  N Pkt |    | #  LOGO  TEAM    S  N PKT |
|---------------------------|    |                           |
| 1  [■]   TeamA   5  2  15 |    | 1  (○)   TeamA   5  2  15 |
|---------------------------|    |    subtle zebra bg        |
| 2  [■]   TeamB   4  3  12 |    | 2  (○)   TeamB   4  3  12 |
|---------------------------|    |                           |
| Punkte: [Blue Badge]      |    | Punkte: Bold, no badge   |
+---------------------------+    +---------------------------+
```
