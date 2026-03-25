import { Trophy } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
const links = [
  { label: 'Features', href: '/#features' },
  { label: 'Preise', href: '#' },
  { label: 'Über uns', href: '/#about' },
  { label: 'Kontakt', href: 'mailto:nick@algner.de' },
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
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

          {/* Links – two columns side by side */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors"
              >
                {link.label}
              </a>
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
