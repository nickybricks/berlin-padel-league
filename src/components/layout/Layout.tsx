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
      <main className="flex-1 container py-6 md:py-8">
        {children}
      </main>
      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Padel Freizeit-Liga
        </div>
      </footer>
    </div>
  );
}
