

# Plan: Erweitertes Buchungssystem mit festen Plätzen und Auto-Export

## Zusammenfassung

Dieses Update erweitert das Buchungssystem um:
1. Entfernung der 14-Tage-Vorlaufbeschränkung
2. Feste Plätze pro Verein (statt globaler Liste)
3. Duplikat-Prüfung bei Slot-Erstellung
4. Automatischer wöchentlicher Export per E-Mail

## Umsetzungsschritte

### 1. Buchungsbeschränkung aufheben

Die aktuelle Logik in `bookingUtils.ts` prüft, ob die Buchung mindestens 14 Tage vorher erfolgt. Diese Beschränkung wird entfernt - nur das Buchungsende (Donnerstag 23:59 der Vorwoche) bleibt bestehen.

**Änderung in `src/lib/bookingUtils.ts`:**
- `getBookingWindow()`: Start-Datum entfällt oder wird auf "sofort" gesetzt
- `isBookingOpen()`: Prüfung auf zu frühe Buchung entfernen

### 2. Feste Plätze pro Verein

Neue Tabelle `venue_courts` speichert die definierten Plätze je Verein.

**Datenbank-Migration:**

```text
Neue Tabelle: venue_courts
├── id (uuid, primary key)
├── venue_id (uuid, foreign key -> padel_venues)
├── name (text, z.B. "Platz 1", "Centre Court")
├── display_order (integer, für Sortierung)
└── created_at (timestamp)

Unique Constraint: (venue_id, name)
```

**RLS-Policies:**
- Alle können lesen
- Nur Admins können erstellen/bearbeiten/löschen

**UI-Änderungen in `AdminVenueManager.tsx`:**
- Neuer Bereich zum Verwalten der Plätze eines Vereins
- Button "Plätze bearbeiten" bei jedem Verein
- Dialog zum Hinzufügen/Entfernen von Platznamen

**UI-Änderungen in `AdminSlotCreator.tsx`:**
- Nach Venue-Auswahl: Plätze aus `venue_courts` laden
- Nur die konfigurierten Plätze des gewählten Vereins anzeigen
- Deaktiviert wenn kein Verein ausgewählt

### 3. Duplikat-Prüfung bei Slot-Erstellung

Bevor Slots erstellt werden, wird geprüft ob bereits ein Slot mit gleicher Kombination existiert:
- Verein + Platzname + Datum + Startzeit

**Umsetzung:**
- Vor dem Insert: Bestehende Slots für den Zeitraum laden
- Konfliktierende Slots herausfiltern
- Benutzer informieren welche Slots übersprungen wurden

**Alternative (strenger):** Unique Constraint in der Datenbank auf `(venue_id, court_name, slot_date, start_time)` - dann schlägt der Insert fehl bei Duplikaten.

### 4. Automatischer wöchentlicher Export

**Neue Edge Function: `send-booking-export`**

Diese Funktion:
1. Lädt alle Buchungen für die kommende Woche
2. Erstellt CSV wie bei manuellem Export
3. Sendet E-Mail an konfigurierte Empfänger

**Neue Tabelle: `booking_export_settings`**

```text
Neue Tabelle: booking_export_settings
├── id (uuid, primary key)
├── recipient_emails (text[], Liste der E-Mail-Adressen)
├── is_active (boolean, Export aktiviert)
├── created_at (timestamp)
└── updated_at (timestamp)

Nur eine Zeile (Singleton-Pattern)
```

**UI-Erweiterung in `AdminBookingExport.tsx`:**
- Neuer Abschnitt "Automatischer Export"
- Toggle zum Aktivieren/Deaktivieren
- Eingabefeld für E-Mail-Adressen (kommasepariert oder Liste)
- Info-Text: "Export wird jeden Freitag um 00:05 Uhr gesendet"

**Cron-Job Setup:**
- pg_cron führt die Edge Function jeden Freitag um 00:05 Uhr aus
- Freitag ist nach Buchungsschluss (Donnerstag 23:59)

**E-Mail-Versand:**
- Resend API für E-Mail-Versand
- RESEND_API_KEY als Secret erforderlich
- Verifizierte Absender-Domain benötigt

## Komponenten-Übersicht

```text
Änderungen:
├── src/lib/bookingUtils.ts
│   └── 14-Tage-Beschränkung entfernen
├── src/components/bookings/AdminVenueManager.tsx
│   └── Platzverwaltung pro Verein hinzufügen
├── src/components/bookings/AdminSlotCreator.tsx
│   └── Dynamische Plätze basierend auf Venue laden
├── src/components/bookings/AdminBookingExport.tsx
│   └── Auto-Export Konfiguration UI
├── src/hooks/useVenues.ts
│   └── useVenueCourts Hook hinzufügen

Neue Dateien:
├── supabase/functions/send-booking-export/index.ts
│   └── Edge Function für E-Mail-Versand
└── supabase/migrations/...
    └── venue_courts + booking_export_settings Tabellen
```

## Datenbankschema-Erweiterung

```text
┌─────────────────┐       ┌──────────────────────┐
│  padel_venues   │       │  booking_export_     │
├─────────────────┤       │  settings (Singleton)│
│ id              │       ├──────────────────────┤
│ name            │       │ id                   │
│ address         │       │ recipient_emails[]   │
└────────┬────────┘       │ is_active            │
         │                └──────────────────────┘
         │ 1:n
         ▼
┌─────────────────┐
│  venue_courts   │ (NEU)
├─────────────────┤
│ id              │
│ venue_id        │───┐
│ name            │   │ Wird referenziert bei
│ display_order   │   │ Slot-Erstellung
└─────────────────┘   │
                      ▼
┌─────────────────┐
│  court_slots    │
├─────────────────┤
│ venue_id        │
│ court_name      │ ← Muss einem venue_courts.name entsprechen
│ slot_date       │
│ start_time      │
│ ...             │
└─────────────────┘
```

## Voraussetzungen für E-Mail-Versand

Der automatische Export benötigt:
1. **Resend Account** mit API-Key
2. **Verifizierte Domain** für den E-Mail-Absender
3. **RESEND_API_KEY** als Secret in Lovable Cloud

Ohne diese Konfiguration kann der manuelle Export weiterhin genutzt werden, aber der automatische Versand ist deaktiviert.

## Berechtigungen

| Aktion | Viewer | Captain | Admin |
|--------|--------|---------|-------|
| Sofortige Buchung (ohne 14-Tage-Vorlauf) | - | Ja | Ja |
| Plätze eines Vereins sehen | Ja | Ja | Ja |
| Plätze eines Vereins verwalten | - | - | Ja |
| Auto-Export konfigurieren | - | - | Ja |

