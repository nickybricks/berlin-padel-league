import { useState } from 'react';
import { Trophy, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const columns = [
  {
    title: 'Produkt',
    links: ['Features', 'Preise', 'Roadmap'],
  },
  {
    title: 'Ressourcen',
    links: ['FAQ', 'Blog', 'Support'],
  },
  {
    title: 'Unternehmen',
    links: ['Über uns', 'Kontakt', 'Impressum', 'Datenschutz'],
  },
];

export default function LandingFooter() {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-primary text-primary-foreground/80">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-primary-foreground mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
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
          ))}

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-background mb-4">Newsletter</h4>
            <p className="text-sm text-background/50 mb-3">
              Updates zu neuen Features erhalten.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmail('');
              }}
              className="flex gap-2"
            >
              <Input
                type="email"
                placeholder="deine@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 rounded-full bg-background/10 border-background/10 text-background placeholder:text-background/30 text-sm"
              />
              <Button
                type="submit"
                size="sm"
                className="rounded-full px-4 bg-accent text-accent-foreground hover:bg-accent/90 shrink-0"
              >
                OK
              </Button>
            </form>
          </div>
        </div>

        {/* Social + Logo */}
        <div className="mt-14 pt-8 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/10">
              <Trophy className="h-4 w-4 text-background" />
            </div>
            <span className="text-lg font-bold text-background tracking-tight">
              Berlin Padel Liga
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="text-background/40 hover:text-background transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-background/40 hover:text-background transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/30">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Alle Systeme aktiv
          </div>
          <p>© {new Date().getFullYear()} Berlin Padel Liga. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
