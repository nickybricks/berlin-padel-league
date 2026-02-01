
# Plan: Vereinfachtes Rollen-System (Admin + Spieler)

## Zusammenfassung

Das aktuelle 3-Rollen-System (admin, captain, viewer) wird auf 2 Rollen reduziert:
- **Admin**: Vollzugriff auf alle Funktionen
- **Player**: Eingeloggte Spieler können Ergebnisse für ihr Team melden und Buchungen vornehmen

Die `viewer` Rolle wird für nicht-registrierte Benutzer oder Benutzer ohne Team-Zuordnung beibehalten, aber die `captain` Rolle entfällt vollständig.

## Umsetzungsschritte

### 1. Datenbank: Enum erweitern und Rollen migrieren

```text
Änderungen:
1. Neue Rolle 'player' zum app_role Enum hinzufügen
2. Alle bestehenden 'captain' Rollen zu 'player' migrieren
3. handle_new_user() Funktion anpassen:
   - Bei E-Mail-Match → 'player' statt 'captain' Rolle
   - Sonst weiterhin 'viewer'
```

### 2. RLS-Policies aktualisieren

**match_results Tabelle:**
- Bestehende Policy für 'captain' auf 'player' umschreiben
- Spieler mit der 'player' Rolle können Ergebnisse für ihr Team eintragen

**court_bookings Tabelle:**
- Bestehende Policy für 'captain' auf 'player' umschreiben
- Spieler können Buchungen für ihr Team vornehmen/stornieren

### 3. Frontend-Code anpassen

**src/types/database.ts:**
```text
AppRole: 'admin' | 'player' | 'viewer'
(captain entfällt)
```

**src/hooks/useAuth.ts:**
```text
- isCaptain → isPlayer umbenennen
- canEnterResults: isAdmin || isPlayer (statt isCaptain)
```

**src/components/forms/ResultForm.tsx:**
```text
- isCaptain → isPlayer in der Filterlogik
```

**src/pages/EnterResult.tsx:**
```text
- UI-Texte anpassen: "Spieler" statt "Captain"
- Rollenbadge: "Spieler" anzeigen
```

**src/pages/Login.tsx:**
```text
- Info-Text aktualisieren: Spieler statt Captain erwähnen
```

## Betroffene Dateien

```text
Datenbank:
└── Migration für app_role Enum + handle_new_user() + RLS-Policies

Frontend:
├── src/types/database.ts
├── src/hooks/useAuth.ts
├── src/components/forms/ResultForm.tsx
├── src/pages/EnterResult.tsx
└── src/pages/Login.tsx
```

## Berechtigungen nach der Änderung

| Aktion | Viewer | Player | Admin |
|--------|--------|--------|-------|
| Tabelle/Spielplan ansehen | Ja | Ja | Ja |
| Ergebnis eigenes Team eintragen | - | Ja | Ja |
| Ergebnis jedes Team eintragen | - | - | Ja |
| Buchung für eigenes Team | - | Ja | Ja |
| Verwaltung (Slots, Export) | - | - | Ja |

## Technische Details

Die Datenbank-Migration umfasst:

1. **Enum erweitern**
   - 'player' Wert hinzufügen

2. **Bestehende Daten migrieren**
   - UPDATE user_roles SET role = 'player' WHERE role = 'captain'

3. **RLS-Policies aktualisieren**
   - DROP bestehende 'captain' Policies
   - CREATE neue 'player' Policies mit gleicher Logik

4. **Trigger-Funktion anpassen**
   - handle_new_user() vergibt 'player' statt 'captain'

## Keine Breaking Changes

- Admins behalten ihren vollen Zugriff
- Bestehende Team-Zuordnungen bleiben erhalten
- Nur der Rollen-Name ändert sich
