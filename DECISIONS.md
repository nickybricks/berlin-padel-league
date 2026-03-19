# Berlin Padel League

## 1. User Journey

### Einstiegspunkt
- Nutzer landet auf der **Landing Page** (`/`) mit Überblick über die App
- Login/Registrierung über E-Mail + Passwort (E-Mail-Verifizierung erforderlich)

### Kernflow: Liga beitreten
1. Nutzer erhält **Einladungslink** (`/join/:code`) von Liga-Admin
2. Registrierung / Login
3. Team auswählen (oder zugewiesen werden via E-Mail-Match)
4. Spielername + Telefonnummer eingeben
5. → Automatisch der Liga als Spieler beigetreten, Team zugewiesen

### Kernflow: Liga erstellen
1. Nutzer klickt auf **"Liga erstellen"** im Onboarding (`/onboarding`)
2. 3-Schritt-Wizard:
   - **Schritt 1**: Name + Logo
   - **Schritt 2**: Format (Liga/Gruppen), Hin-/Rückrunde, Max Teams
   - **Schritt 3**: Playoff-Konfiguration
3. → Liga erstellt, Nutzer ist automatisch Admin
4. → Einladungslink + Code zum Teilen

### Kernaktionen (eingeloggt)
- **Dashboard** (`/league/:id`): Übersicht über Liga, Tabelle, nächste Spiele
- **Spielplan** (`/league/:id/schedule`): Alle Spieltage, Gruppenfilter
- **Teams** (`/league/:id/teams`): Teamübersicht, Kontaktdaten (nur für eigene Teams / Admins)
- **Platzbuchungen** (`/league/:id/bookings`): Verfügbare Slots buchen, Spiel zuordnen
- **Ergebnis eintragen** (`/league/:id/enter-result`): Satzweise Eingabe, Kommentar

### Admin-Aktionen
- **Liga-Verwaltung** (`/league/:id/admin`): Mitglieder, Rollen, Teams, Format, Gruppenzuteilung
- **Venue-Verwaltung**: Padelvereine anlegen, Plätze konfigurieren, Slots erstellen
- **Liga löschen**: Mit Bestätigungsdialog, CASCADE auf Mitgliedschaften

### Edge Cases
- E-Mail-Match: Nutzer wird automatisch dem richtigen Team zugewiesen, wenn die E-Mail in der Teams-Tabelle hinterlegt ist
- Team voll: Wenn beide Spielerslots belegt sind, kann kein weiterer Spieler beitreten
- Max Teams: Wenn `max_teams` gesetzt und erreicht, werden keine neuen Teams akzeptiert
- Buchungs-Deadline: Plätze können bis Donnerstag 23:59 der Vorwoche gebucht werden

---

## 2. Tech Stack

### Frontend
- **React 18** + **TypeScript** – Bewährte Kombination für typsichere SPAs
- **Vite** – Schnellster Bundler für React-Projekte
- **Tailwind CSS** + **shadcn/ui** – Konsistentes Design-System mit Apple-like Clean-Ästhetik
- **React Router v6** – Client-Side Routing mit verschachtelten Layouts
- **TanStack React Query** – Server-State-Management, Caching, Invalidierung
- **Framer Motion** – (geplant) Animationen

### Backend
- **Lovable Cloud (Supabase)** – Vollständige Backend-Lösung
  - **PostgreSQL** – Relationale DB mit RLS (Row-Level Security)
  - **Auth** – E-Mail/Passwort-Authentifizierung
  - **Storage** – Team- und Liga-Logos (Bucket: `Teams`)
  - **Edge Functions** – Server-Side-Logik (z.B. User-Deletion, Booking-Export)
  - **RLS Policies** – Feingranulare Zugriffskontrolle pro Tabelle

### Hosting / Deployment
- **Lovable** – Automatisches Deployment bei Code-Änderungen
- **Published URL**: `https://berlin-padel-league.lovable.app`

### Begründung
- Lovable Cloud eliminiert separates Backend-Setup
- Supabase-RLS ist sicherer als clientseitige Rollenprüfungen
- shadcn/ui erlaubt volle Kontrolle über Komponenten bei konsistentem Design
- React Query vermeidet manuelles State-Management für Server-Daten

---

## 3. Design Rules

### Farben
- Alle Farben als **HSL-Variablen** in `index.css` definiert
- Semantische Tokens: `--background`, `--foreground`, `--primary`, `--muted`, `--accent`, `--destructive`
- **Keine Hex-Codes** in Komponenten – ausschließlich Tailwind-Variablen

### Typografie
- System-Font-Stack (Apple-like)
- Überschriften: `font-bold`, Größen via Tailwind (`text-lg`, `text-xl`, `text-2xl`)
- Body: `text-sm` / `text-base`

### Spacing & Layout
- **Mobile-First** – Daumen-optimiert, Bottom Navigation
- Konsistente Abstände: `space-y-4`, `space-y-6`, `gap-2`, `gap-4`
- Rundungen: `rounded-lg` (Cards), `rounded-xl` (große Container)
- Schatten: `shadow-sm`, `shadow-md` – sanft und subtil

### Komponenten-Regeln
- **Buttons**: shadcn `Button` mit Varianten (`default`, `outline`, `ghost`, `destructive`)
- **Cards**: `bg-card rounded-xl shadow-sm` mit `p-5` oder `p-6`
- **Forms**: shadcn `Input`, `Select`, `Label` – konsistente Höhe und Spacing
- **Tables**: shadcn `Table` mit `bg-muted/50` Header
- **Dialoge**: shadcn `Dialog` / `AlertDialog` für Bestätigungen

### Responsive Breakpoints
- Mobile: Default (< 768px)
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)

### Barrierefreiheit
- Semantische HTML-Elemente (`<header>`, `<main>`, `<nav>`)
- Labels für alle Formularfelder
- Fokus-Styles für Keyboard-Navigation (via shadcn Defaults)

---

## 4. Frameworks & Libraries

| Library | Version | Zweck |
|---------|---------|-------|
| React | ^18.3.1 | UI Framework |
| TypeScript | – | Typsicherheit |
| Vite | – | Build Tool |
| Tailwind CSS | – | Utility-First CSS |
| shadcn/ui | – | Komponentenbibliothek |
| @tanstack/react-query | ^5.83.0 | Server-State |
| react-router-dom | ^6.30.1 | Routing |
| @supabase/supabase-js | ^2.91.1 | Backend SDK |
| date-fns | ^3.6.0 | Datumsformatierung |
| lucide-react | ^0.462.0 | Icons |
| sonner | ^1.7.4 | Toast Notifications |
| recharts | ^2.15.4 | Charts (geplant) |
| zod | ^3.25.76 | Schema-Validierung |
| react-hook-form | ^7.61.1 | Formular-Management |

### Bekannte Einschränkungen
- Kein SSR (reine SPA) – SEO nur via Meta-Tags
- Keine native Mobile-App – PWA möglich, aber nicht implementiert
- Supabase Free Tier Limits beachten (DB-Größe, Edge Function Invocations)

---

## 5. Implementation Plan

### Phase 1: MVP ✅
- [x] Authentifizierung (Login, Register, E-Mail-Verifizierung)
- [x] Liga beitreten via Einladungslink
- [x] Team-Zuordnung (E-Mail-Match + manuelle Auswahl)
- [x] Spielplan-Generierung (Round Robin + Gruppen)
- [x] Ergebnis-Eintragung (Best-of-3)
- [x] Tabelle mit Punkte-/Satzverhältnis
- [x] Platzbuchungssystem (Venues, Courts, Slots)
- [x] Admin-Bereich (Mitglieder, Rollen, Teams)
- [x] RLS-Policies für alle Tabellen

### Phase 2: Erweiterungen ✅ / 🔄
- [x] Liga erstellen (3-Schritt-Wizard)
- [x] Multi-Liga-Architektur (alle Daten per `league_id` isoliert)
- [x] Liga-spezifische Platzbuchungen
- [x] Liga löschen
- [x] Turnierformat nachträglich ändern (Admin)
- [x] Gruppenzuteilung (manuell + zufällig)
- [x] Hin- und Rückrunde Toggle
- [x] Bis zu 8 Gruppen
- [x] **Dark Mode** — System-Erkennung (`prefers-color-scheme`) + manueller Toggle im Header
- [x] **Interaktive Demo-Liga** — `/demo` mit 8 Teams, lokalem State, Playoffs
- [ ] Playoffs / Bracket-Ansicht (für echte Ligen)
- [ ] Max-Teams-Prüfung im Join-Flow

### Phase 3: Optimierung / Skalierung
- [ ] Push-Notifications für neue Ergebnisse
- [ ] Realtime-Updates (Supabase Realtime)
- [ ] Statistik-Dashboard mit Charts
- [ ] PWA-Support (Offline-Fähigkeit)
- [ ] Liga-übergreifende Spielerprofile
- [ ] Export-Funktionen (CSV, PDF)
- [ ] Performance-Optimierung (Lazy Loading, Code Splitting)

---

## Session-Log

### 2026-02-28
**Erledigt:**
- Liga erstellen: 3-Schritt-Wizard implementiert (Name, Format, Playoffs)
- Liga löschen: Bestätigungsdialog + CASCADE auf Mitgliedschaften
- Gruppenanzahl auf 2–8 erweitert
- Platzbuchungen per Liga isoliert (`league_id` auf `padel_venues`)
- RLS-Policies aktualisiert (league-scoped statt global)
- DECISIONS.md erstellt

**Nächste Schritte:**
- Max-Teams-Prüfung im Join-Flow implementieren
- Booking-Export per Liga scopen
- Spielplan-Generierung für Hin-/Rückrunde testen

### 2026-03-05
**Erledigt:**
- Interaktive Demo-Liga implementiert (`/demo` Route + Landingpage-Embed)
  - `DemoLeagueContext` mit 8 Teams, 2 Gruppen, 12 Matches, lokaler State
  - 5 Tabs: Tabelle, Teams, Spielplan, Playoffs, Ergebnis eintragen
  - Kompakte Embed-Version auf Landingpage mit Browser-Mockup-Frame
  - Playoff-Bracket (VF→HF→Finale) dynamisch aus Tabellenstand berechnet
  - Ergebniseingabe mit Live-Aktualisierung von Tabelle und Playoffs
- Spielplan-Bug behoben: Teams erschienen mehrfach in derselben Spielwoche
  - Ursache: Round-Robin-Spielplan wurde für alle Teams generiert, dann nach Gruppen gefiltert → alte Wochennummern blieben, Kollisionen
  - Lösung: `reassignWeeks()` Greedy-Algorithmus in `src/lib/weekReassign.ts` – verteilt Matches so um, dass kein Team doppelt pro Woche spielt

**Nächste Schritte:**
- Max-Teams-Prüfung im Join-Flow implementieren
- Booking-Export per Liga scopen
- Spielplan-Generierung für Hin-/Rückrunde testen
- Demo-Seite auf Mobile testen und optimieren

### 2026-03-12
**Erledigt:**
- **Dark Mode** implementiert — `ThemeProvider` mit System-Erkennung, `ThemeToggle` im Header
  - Unterstützt `light`, `dark`, `system` Modi
  - Speichert Präferenz in `localStorage`
  - iOS/Android Dark Mode wird automatisch erkannt
- Demo-Liga in Plan.md dokumentiert

### 2026-03-19
**Erledigt:**
- **Team-Logo Lightbox** — `TeamLogoLightbox` Komponente (`src/components/teams/TeamLogoLightbox.tsx`)
  - Klick auf Team-Logo öffnet Vollbild-Overlay mit sanfter Zoom-Animation (`animate-in zoom-in-90`)
  - Backdrop-Blur + 60% Schwarz-Overlay
  - Schließen per Klick auf Bild oder Hintergrund
  - Desktop: zentriert, max `md`/`lg` Breite; Mobile: 90vw / 80vh
  - Integriert auf `TeamPage.tsx`
- **Standings-Tabelle: Logo klickbar** — Logo in der Tabelle ist jetzt ein `<Link>` zur Team-Detailseite (gleich wie Teamname)
- **Kontaktdaten-Schutz** — E-Mail und Telefonnummer auf `TeamPage.tsx` und `TeamDetail.tsx` nur für eingeloggte Nutzer sichtbar
  - `useAuth()` prüft `user`-Objekt, Kontaktdaten werden conditional gerendert
  - Verhindert, dass nicht eingeloggte Besucher persönliche Daten einsehen können
- **Login als Dialog** — `LoginDialog` Komponente (`src/components/auth/LoginDialog.tsx`)
  - Anmelden-Button im Header öffnet Popup-Dialog statt separate Login-Seite
  - Login + Registrierung im gleichen Dialog (Toggle)
  - Nach erfolgreichem Login bleibt der Nutzer auf der aktuellen Seite (kein Redirect zu `/leagues`)
  - Hinweis-Box im Dialog: E-Mail-Match-Erklärung für neue Spieler
