import { Link } from 'react-router-dom';

export default function LandingFooter() {
  return (
    <footer className="border-t border-border/40 py-10">
      <div className="max-w-[991px] mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <span className="text-lg font-bold text-primary tracking-tight">Padel Leagues</span>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Die Plattform für deine Freizeit-Liga — Tabellen, Spielpläne und mehr.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">Produkt</h4>
            <ul className="space-y-2">
              <li><Link to="/demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Demo</Link></li>
              <li><Link to="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Registrieren</Link></li>
              <li><Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">Rechtliches</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-muted-foreground">Impressum</span></li>
              <li><span className="text-sm text-muted-foreground">Datenschutz</span></li>
              <li><span className="text-sm text-muted-foreground">AGB</span></li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">Kontakt</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-muted-foreground">info@padelleagues.de</span></li>
              <li><span className="text-sm text-muted-foreground">Berlin, DE</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Padel Freizeit-Liga. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
