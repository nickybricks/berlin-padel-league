
# Alte Matches bereinigen und Filter korrigieren

## Problem
Die Datenbank enthalt noch 78 Matches aus dem alten Round-Robin-Format (13 Teams, jeder gegen jeden). Nach dem Wechsel auf 2 Gruppen (6+7 Teams) sollten nur noch ca. 36 Matches existieren (21 in Gruppe A + 15 in Gruppe B). Die alten Cross-Group-Matches verursachen falsche Spielwochen (bis 13) und tauchen in Buchungs- und Ergebnis-Dropdowns auf.

## Loesung

### 1. Datenbank bereinigen
- DELETE-Policy fuer Admins auf der `matches`-Tabelle hinzufuegen (fehlt aktuell)
- Alle Cross-Group-Matches aus der DB loeschen: Matches, bei denen team_a und team_b unterschiedliche `group_name`-Werte haben
- Zugehoerige `court_bookings` und `match_results` fuer diese Matches ebenfalls loeschen

### 2. Schedule-Filter: "Alle" Option hinzufuegen
- `groupFilter` Default-Wert von `"A"` auf `"all"` aendern
- "Alle Gruppen" als erste Option im Gruppen-Dropdown einfuegen
- `maxWeek` basierend auf den gefilterten (sichtbaren) Matches berechnen statt auf allen Matches

### 3. Keine weiteren Aenderungen noetig
Die Buchungs- und Ergebnis-Seiten filtern bereits clientseitig nach Intra-Group-Matches. Sobald die alten Matches aus der DB entfernt sind, zeigen alle Views automatisch die korrekten Daten.

---

## Technische Details

### Migration SQL
```sql
-- DELETE policy fuer Admins
CREATE POLICY "Admins can delete matches"
  ON public.matches FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Cross-group matches und zugehoerige Daten loeschen
DELETE FROM public.court_bookings
WHERE match_id IN (
  SELECT m.id FROM public.matches m
  JOIN public.teams ta ON m.team_a_id = ta.id
  JOIN public.teams tb ON m.team_b_id = tb.id
  WHERE ta.group_name IS DISTINCT FROM tb.group_name
    AND ta.group_name IS NOT NULL
    AND tb.group_name IS NOT NULL
);

DELETE FROM public.match_results
WHERE match_id IN (
  SELECT m.id FROM public.matches m
  JOIN public.teams ta ON m.team_a_id = ta.id
  JOIN public.teams tb ON m.team_b_id = tb.id
  WHERE ta.group_name IS DISTINCT FROM tb.group_name
    AND ta.group_name IS NOT NULL
    AND tb.group_name IS NOT NULL
);

DELETE FROM public.matches
WHERE id IN (
  SELECT m.id FROM public.matches m
  JOIN public.teams ta ON m.team_a_id = ta.id
  JOIN public.teams tb ON m.team_b_id = tb.id
  WHERE ta.group_name IS DISTINCT FROM tb.group_name
    AND ta.group_name IS NOT NULL
    AND tb.group_name IS NOT NULL
);
```

### Schedule.tsx Aenderungen
- Zeile 19: `groupFilter` Default von `"A"` auf `"all"`
- Zeile 147-153: "Alle Gruppen" Option vor den Gruppen-Items einfuegen
- Zeile 124: `maxWeek` aus `matchesByWeek.keys()` berechnen statt aus allen Matches

### Dateien
- `supabase/migrations/` -- Neue Migration
- `src/pages/Schedule.tsx` -- Filter-Fixes
