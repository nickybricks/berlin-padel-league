import { Trophy } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-primary text-primary-foreground/80">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          <div>
            <h4 className="text-sm font-semibold text-primary-foreground mb-4">Unternehmen</h4>
            <ul className="space-y-2.5">
              {['Über uns', 'Kontakt', 'Impressum', 'Datenschutz'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Logo */}
        <div className="mt-14 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/10">
              <Trophy className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-primary-foreground tracking-tight">
              Berlin Padel Liga
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 text-center sm:text-right text-xs text-primary-foreground/30">
          <p>© {new Date().getFullYear()} Berlin Padel Liga. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
