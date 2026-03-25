import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Impressum() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNav />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-16 pt-24">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Impressum</h1>

          <div className="space-y-6 text-[15px] leading-relaxed text-muted-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Angaben gemäß § 5 TMG</h2>
              <p>
                Berlin Padel Leagues UG (haftungsbeschränkt)<br />
                Schlegelstr. 13<br />
                10115 Berlin
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Vertreten durch</h2>
              <p>Nick Algner</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Kontakt</h2>
              <p>
                E-Mail:{' '}
                <a href="mailto:nick@algner.de" className="text-foreground underline underline-offset-2">
                  nick@algner.de
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h2>
              <p>
                Nick Algner<br />
                Schlegelstr. 13<br />
                10115 Berlin
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Haftungsausschluss</h2>
              <p>
                Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte
                externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber
                verantwortlich.
              </p>
            </section>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
