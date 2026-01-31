
# Plan: Login, Team-Bearbeitung, Ergebnismeldung und Platzbuchungssystem

## Zusammenfassung

Dieses Feature-Paket erweitert die Padel Liga App um ein vollständiges Buchungssystem für Plätze sowie verbesserte Bearbeitungsfunktionen für Teams. Benutzer können sich mit ihrer E-Mail anmelden, eigene Teamdaten bearbeiten und Spielergebnisse melden. Admins erhalten Zugriff auf die Platzverwaltung und Export-Funktionen.

## Benutzer-Funktionen

**Für alle angemeldeten Benutzer:**
- Eigene Teamdaten (Name, Logo, Kontaktdaten) bearbeiten - sofern die E-Mail mit einem Team verknüpft ist
- Ergebnisse für Spiele des eigenen Teams melden

**Für Admins:**
- Alle Team- und Spieldaten bearbeiten
- Plätze bei Padelvereinen erstellen mit Datum und Uhrzeit
- Mehrfachauswahl bei Platzerstellung (mehrere Plätze, Daten, Uhrzeiten)
- Platzbuchungen als CSV/Excel exportieren

**Platzbuchung durch Teams:**
- Teams buchen sich auf verfügbare Plätze
- Bei Buchung wird ein offenes Spiel aus dem Spielplan ausgewählt
- Der Gegner wird automatisch mit eingetragen
- Buchungsfenster: 14 Tage vorher bis Donnerstag 23:59 Uhr der Vorwoche

## Umsetzungsschritte

### 1. Datenbank-Erweiterungen

Neue Tabellen für das Buchungssystem:

**Tabelle: `padel_venues`** (Padelvereine)
- id, name, address, created_at

**Tabelle: `court_slots`** (Verfügbare Plätze)
- id, venue_id, court_name, slot_date, start_time, end_time, created_by, created_at

**Tabelle: `court_bookings`** (Buchungen)
- id, court_slot_id, match_id, booked_by_team_id, booked_by_user_id, booked_at

RLS-Policies:
- Jeder kann Venues und Slots lesen
- Nur Admins können Venues/Slots erstellen/bearbeiten/löschen
- Teams können Buchungen für ihre eigenen Spiele erstellen
- Admins können alle Buchungen verwalten

### 2. Team-Bearbeitungsfunktion erweitern

Neuer Button auf der TeamPage für berechtigte Benutzer:
- Zahnrad-Icon neben dem Teamnamen
- Dialog zum Bearbeiten von: Teamname, Captain-Name/E-Mail/Telefon, Spieler2-Name/E-Mail/Telefon
- Logo-Upload bleibt wie bisher

Die bestehende RLS-Policy "Captains can update their own team" erlaubt bereits die Bearbeitung durch Team-Mitglieder.

### 3. Neue Seite: Platzbuchungen (/bookings)

**Navigation:**
- Neuer Menüpunkt "Platzbuchungen" im Header
- Sichtbar für alle Benutzer

**Ansicht für alle:**
- Liste verfügbarer Plätze nach Datum gruppiert
- Status: Frei / Gebucht (mit Teamnamen)
- Filter nach Datum und Verein

**Buchungs-Flow für Teams:**
1. Platz auswählen
2. Offenes Spiel aus Dropdown wählen (nur eigene Spiele, noch ohne Buchung)
3. Bestätigen - Gegner wird automatisch eingetragen
4. Validierung des Buchungszeitfensters (14 Tage vorher bis Do. 23:59)

### 4. Admin-Bereich: Platzverwaltung

**Venue-Verwaltung:**
- CRUD für Padelvereine (Name, Adresse)

**Slot-Erstellung:**
- Formular mit Mehrfachauswahl:
  - Venue auswählen
  - Mehrere Platznummern (z.B. Platz 1, Platz 2)
  - Mehrere Daten (Kalender mit Mehrfachauswahl)
  - Mehrere Zeitfenster (z.B. 18:00-19:30, 20:00-21:30)
- Beim Speichern werden alle Kombinationen als einzelne Slots erstellt

**Export-Funktion:**
- Button "Buchungen exportieren"
- Datumsbereich wählbar
- CSV-Download mit: Datum, Platz, Uhrzeit, Teilnehmername, Teilnehmer-E-Mails, Teamnamen

### 5. Komponenten-Übersicht

```text
src/
  pages/
    Bookings.tsx              # Hauptseite Platzbuchungen
  components/
    bookings/
      BookingCalendar.tsx     # Kalenderansicht der Slots
      BookingSlotCard.tsx     # Einzelner Slot mit Buchungsoption
      BookingDialog.tsx       # Buchungsdialog mit Spielauswahl
      AdminVenueManager.tsx   # Admin: Vereine verwalten
      AdminSlotCreator.tsx    # Admin: Plätze erstellen
      AdminBookingExport.tsx  # Admin: Export-Funktion
    teams/
      TeamEditDialog.tsx      # Dialog zum Bearbeiten von Teamdaten
  hooks/
    useBookings.ts            # React Query Hooks für Buchungen
    useVenues.ts              # React Query Hooks für Vereine/Slots
```

## Technische Details

### Buchungszeitfenster-Logik

```text
Beispiel: Platz am Mo. 09.02.2026

Buchungsstart:  So. 26.01.2026 00:00 (14 Tage vorher)
Buchungsende:   Do. 05.02.2026 23:59 (Donnerstag der Vorwoche)

Berechnung Buchungsende:
1. Vom Slot-Datum: Mo. 09.02.
2. Finde den Montag dieser Woche: Mo. 09.02.
3. Gehe zur Vorwoche: Mo. 02.02.
4. Finde den Donnerstag: Do. 05.02.
5. Setze Uhrzeit: 23:59:59
```

### Export-Format (CSV)

```text
Datum,Platz,Uhrzeit,Team A,Team B,Captain A,Email A,Captain B,Email B
09.02.2026,Platz 1,20:00-21:30,Los Hermanos,Fairpointers,Paul,paul@...,Frederik,frederik@...
```

### Datenbankschema

```text
┌─────────────────┐
│  padel_venues   │
├─────────────────┤
│ id (uuid)       │
│ name (text)     │
│ address (text)  │
│ created_at      │
└────────┬────────┘
         │
         │ 1:n
         ▼
┌─────────────────┐
│  court_slots    │
├─────────────────┤
│ id (uuid)       │
│ venue_id (fk)   │
│ court_name      │
│ slot_date       │
│ start_time      │
│ end_time        │
│ created_by (fk) │
│ created_at      │
└────────┬────────┘
         │
         │ 1:1
         ▼
┌─────────────────────┐
│   court_bookings    │
├─────────────────────┤
│ id (uuid)           │
│ court_slot_id (fk)  │
│ match_id (fk)       │
│ booked_by_team_id   │
│ booked_by_user_id   │
│ booked_at           │
└─────────────────────┘
```

## Berechtigungsmatrix

| Aktion | Viewer | Captain | Admin |
|--------|--------|---------|-------|
| Plätze ansehen | Ja | Ja | Ja |
| Eigenes Team bearbeiten | - | Ja | Ja |
| Eigene Spiele buchen | - | Ja | Ja |
| Alle Teams bearbeiten | - | - | Ja |
| Plätze erstellen | - | - | Ja |
| Buchungen exportieren | - | - | Ja |
| Venues verwalten | - | - | Ja |
