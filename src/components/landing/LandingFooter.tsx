import { Trophy } from 'lucide-react';

const columns = [
  {
    title: 'Produkt',
    links: [{ label: 'Features', href: '#' }, { label: 'Preise', href: '#' }],
  },
  {
    title: 'Unternehmen',
    links: [
      { label: 'Über uns', href: '#' },
      { label: 'Kontakt', href: 'mailto:nick@algner.de' },
      { label: 'Impressum', href: '#' },
      { label: 'Datenschutz', href: '#' },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="bg-primary text-primary-foreground/80">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col items-center text-center gap-10">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/10">
              <Trophy className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-primary-foreground tracking-tight">
              Berlin Padel Liga
            </span>
          </div>

          {/* Link columns */}
          <div className="flex flex-wrap justify-center gap-12">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-primary-foreground mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-primary-foreground/10 w-full text-center text-xs text-primary-foreground/30">
            <p>© {new Date().getFullYear()} Berlin Padel Liga. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
