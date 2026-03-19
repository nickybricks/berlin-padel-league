import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, User, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLeagueById } from '@/hooks/useLeagues';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  leagueId?: string;
}

const getScrollState = () => typeof window !== 'undefined' && window.scrollY > 10;

export function Header({ leagueId }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(getScrollState);
  const location = useLocation();
  const { user, role, signOut, canEnterResults } = useAuth();
  const { data: league } = useLeagueById(leagueId);
  const navScrollRef = useRef<HTMLDivElement>(null);

  // Scroll active nav item into center
  const scrollActiveIntoView = useCallback(() => {
    const container = navScrollRef.current;
    if (!container) return;
    // Small delay to ensure DOM is updated after route change
    requestAnimationFrame(() => {
      const active = container.querySelector('[data-active="true"]') as HTMLElement | null;
      if (!active) return;
      const containerWidth = container.offsetWidth;
      const activeLeft = active.offsetLeft;
      const activeWidth = active.offsetWidth;
      const scrollTarget = activeLeft - (containerWidth / 2) + (activeWidth / 2);
      container.scrollTo({ left: scrollTarget, behavior: 'smooth' });
    });
  }, []);

  useEffect(() => {
    scrollActiveIntoView();
  }, [location.pathname, scrollActiveIntoView]);

  const leagueLogoUrl = league?.logo_url
    ? `https://hoinybrkpfhedbltdbxq.supabase.co/storage/v1/object/public/${league.logo_url}`
    : null;

  const brandName = league?.name || 'Padel Liga';

  useLayoutEffect(() => {
    setIsScrolled(window.scrollY > 10);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = leagueId ? [
    { label: 'Tabelle', path: `/league/${leagueId}` },
    { label: 'Teams', path: `/league/${leagueId}/teams` },
    { label: 'Spielplan', path: `/league/${leagueId}/schedule` },
    { label: 'Platzbuchungen', path: `/league/${leagueId}/bookings` },
    { label: 'Playoffs', path: `/league/${leagueId}/playoffs` },
    { label: 'Ergebnis eintragen', path: `/league/${leagueId}/enter-result`, requiresAuth: true },
    { label: 'Admin', path: `/league/${leagueId}/admin`, requiresAdmin: true },
  ] : [];

  const isActive = (path: string) => location.pathname === path;

  const filteredNavItems = navItems.filter(item => {
    if (item.requiresAuth && !canEnterResults) return false;
    if ('requiresAdmin' in item && item.requiresAdmin && role !== 'admin') return false;
    return true;
  });

  const AuthSection = () => (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover">
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              {user.email}
            </div>
            <div className="px-2 py-1 text-xs font-medium uppercase text-accent">
              {role}
            </div>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/leagues">
                <Trophy className="mr-2 h-4 w-4" />
                Meine Ligen
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={signOut} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Abmelden
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to="/login">
          <Button variant="default" size="sm" className="rounded-full">
            Anmelden
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Desktop: Notch-style header */}
      <div className="hidden lg:block py-3 px-4">
        <div 
          className={`mx-auto max-w-[992px] flex h-14 items-center justify-between px-4 rounded-full transition-all duration-300 ${
            isScrolled 
              ? 'bg-card/80 backdrop-blur-md shadow-md border border-border/50' 
              : 'bg-card/60 backdrop-blur-sm'
          }`}
        >
          <Link to={leagueId ? `/league/${leagueId}` : '/leagues'} className="flex items-center gap-2 font-bold text-lg shrink-0 max-w-[200px]">
            {leagueLogoUrl ? (
              <img src={leagueLogoUrl} alt={brandName} className="h-8 w-8 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shrink-0">
                <Trophy className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <span className="truncate">{brandName}</span>
          </Link>

          {filteredNavItems.length > 0 && (
            <nav className="flex items-center gap-0.5 shrink-0">
              {filteredNavItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-2.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-1 shrink-0">
            <ThemeToggle />
            <AuthSection />
          </div>
        </div>
      </div>

      {/* Mobile & Tablet: Header bar */}
      <div 
        className={`lg:hidden flex h-14 items-center justify-between px-4 transition-all duration-300 ${
          isScrolled 
            ? 'bg-card/80 backdrop-blur-md border-b border-border/50' 
            : 'bg-card/60 backdrop-blur-sm'
        }`}
      >
        <Link to={leagueId ? `/league/${leagueId}` : '/leagues'} className="flex items-center gap-2 font-bold text-lg min-w-0">
          {leagueLogoUrl ? (
            <img src={leagueLogoUrl} alt={brandName} className="h-9 w-9 rounded-lg object-cover shrink-0" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shrink-0">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
          <span className="truncate">{brandName}</span>
        </Link>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <AuthSection />
        </div>
      </div>

      {/* Mobile & Tablet: Horizontal scrollable navigation */}
      {filteredNavItems.length > 0 && (
        <nav
          ref={navScrollRef}
          className="lg:hidden overflow-x-auto scrollbar-hide border-b border-border/50 bg-card/80 backdrop-blur-md"
        >
          <div className="flex items-center gap-1 px-3 py-2 w-max">
            {filteredNavItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                data-active={isActive(item.path)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
