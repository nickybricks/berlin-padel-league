import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Datenschutzerklärung</h1>

        <div className="space-y-6 text-[15px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Verantwortlicher</h2>
            <p>
              Berlin Padel Leagues UG (haftungsbeschränkt)<br />
              Nick Algner<br />
              Schlegelstr. 13<br />
              10115 Berlin<br />
              E-Mail:{' '}
              <a href="mailto:nick@algner.de" className="text-foreground underline underline-offset-2">
                nick@algner.de
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Erhebung und Speicherung personenbezogener Daten</h2>
            <p>
              Beim Besuch unserer Website werden automatisch Informationen durch den Browser übermittelt
              und temporär in Server-Logfiles gespeichert. Dies umfasst IP-Adresse, Datum und Uhrzeit
              des Zugriffs, übertragene Datenmenge sowie den anfragenden Provider.
            </p>
            <p className="mt-2">
              Bei der Registrierung und Nutzung unseres Dienstes erheben wir folgende Daten:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>E-Mail-Adresse</li>
              <li>Name (optional, als Anzeigename)</li>
              <li>Liga- und Team-Zugehörigkeit</li>
              <li>Spielergebnisse und Buchungsdaten</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Zweck der Datenverarbeitung</h2>
            <p>
              Die Verarbeitung erfolgt zur Bereitstellung unseres Dienstes (Liga-Verwaltung,
              Spielplan-Organisation, Platzbuchungen) gemäß Art. 6 Abs. 1 lit. b DSGVO
              (Vertragserfüllung) sowie auf Grundlage berechtigter Interessen gemäß Art. 6
              Abs. 1 lit. f DSGVO.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Hosting und Datenverarbeitung</h2>
            <p>
              Unsere Website und Datenbank werden auf Servern innerhalb der EU gehostet.
              Die Datenübertragung erfolgt verschlüsselt über HTTPS.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Cookies</h2>
            <p>
              Wir verwenden ausschließlich technisch notwendige Cookies für die Authentifizierung
              und Sitzungsverwaltung. Es werden keine Tracking- oder Werbe-Cookies eingesetzt.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">6. Ihre Rechte</h2>
            <p>Sie haben das Recht auf:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            </ul>
            <p className="mt-2">
              Wenden Sie sich hierzu an:{' '}
              <a href="mailto:nick@algner.de" className="text-foreground underline underline-offset-2">
                nick@algner.de
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">7. Löschung von Daten</h2>
            <p>
              Ihre Daten werden gelöscht, sobald der Zweck der Speicherung entfällt oder Sie
              die Löschung beantragen, sofern keine gesetzlichen Aufbewahrungspflichten
              entgegenstehen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">8. Änderungen</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie stets den
              aktuellen rechtlichen Anforderungen entsprechend zu gestalten.
            </p>
            <p className="mt-2 text-xs text-muted-foreground/60">
              Stand: März 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
