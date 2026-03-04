import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DemoEmbed from '@/demo/DemoEmbed';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Floating Header Island */}
      <header className="w-full flex justify-center pt-4 px-4 z-50">
        <div className="w-full max-w-[991px] flex items-center justify-between px-5 sm:px-6 h-14 rounded-full bg-card/70 backdrop-blur-xl border border-border/40 shadow-sm">
          <span className="text-lg font-bold text-primary tracking-tight whitespace-nowrap">
            Padel Leagues
          </span>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="rounded-full text-sm px-3 sm:px-4">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="rounded-full text-sm px-3 sm:px-4">
                Registrieren
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Demo embed */}
      <main className="flex-1">
        <DemoEmbed />
      </main>
    </div>
  );
}
