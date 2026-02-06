import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
  leagueId?: string;
}

export function Layout({ children, leagueId }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header leagueId={leagueId} />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 md:py-8">
        {children}
      </main>
      <footer className="border-t py-4">
        <div className="w-full max-w-5xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Padel Freizeit-Liga
        </div>
      </footer>
    </div>
  );
}
