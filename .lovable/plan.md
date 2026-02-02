
# Plan: Navigation und Onboarding-Flow korrigieren

## Zusammenfassung
Zwei Korrekturen sind nötig:
1. Beim Klick auf "Liga beitreten" soll direkt das Code-Eingabefeld erscheinen (nicht die Auswahl)
2. Ein neuer Menüpunkt "Meine Ligen" im Header hinzufügen

---

## Änderung 1: Direkter Zugang zur Code-Eingabe

**Datei:** `src/pages/MyLeagues.tsx`

Statt zu `/onboarding` zu verlinken, wird direkt zu einer vereinfachten Route navigiert oder der Onboarding-Flow angepasst.

**Lösung A (empfohlen):** Den Link in MyLeagues.tsx ändern, um direkt zur Code-Eingabe zu kommen. Dafür muss auch die Redirect-Logik in Onboarding.tsx entfernt werden.

**Datei:** `src/pages/Onboarding.tsx`

- Die automatische Weiterleitung bei vorhandenen Ligen (Zeilen 29-33) entfernen
- Nutzer sollen die Seite nutzen können, auch wenn sie bereits einer Liga angehören

---

## Änderung 2: Menüpunkt "Meine Ligen" im Header

**Datei:** `src/components/layout/Header.tsx`

- Im User-Dropdown-Menü einen neuen Eintrag "Meine Ligen" hinzufügen
- Dieser verlinkt auf `/leagues`
- Wird vor "Abmelden" platziert

---

## Technische Details

### Onboarding.tsx
```typescript
// ENTFERNEN: Zeilen 29-33
// Redirect if user already has leagues
useEffect(() => {
  if (!authLoading && !leaguesLoading && userLeagues && userLeagues.length > 0) {
    navigate(`/league/${userLeagues[0].league_id}`, { replace: true });
  }
}, [userLeagues, authLoading, leaguesLoading, navigate]);
```

Da die `userLeagues` Variable dann nicht mehr benötigt wird, kann auch der `useUserLeagues` Hook und zugehörige Imports entfernt werden.

### Header.tsx
```typescript
// Im DropdownMenuContent, vor dem Abmelden-Button:
<DropdownMenuItem asChild className="cursor-pointer">
  <Link to="/leagues">
    <Trophy className="mr-2 h-4 w-4" />
    Meine Ligen
  </Link>
</DropdownMenuItem>
```

---

## Betroffene Dateien
1. `src/pages/Onboarding.tsx` - Redirect-Logik entfernen
2. `src/components/layout/Header.tsx` - Menüpunkt hinzufügen
