import { useState, useEffect, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Trophy, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  leagueId?: string;
}

// Initialize with current scroll position to prevent flash
const getScrollState = () => typeof window !== 'undefined' && window.scrollY > 10;

export function Header({ leagueId }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(getScrollState);
  const location = useLocation();
  const { user, role, signOut, canEnterResults } = useAuth();

  // Sync scroll state immediately on mount (before paint)
  useLayoutEffect(() => {
    setIsScrolled(window.scrollY > 10);
  }, [location.pathname]);

  // Track scroll position for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Only show navigation when inside a league context
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

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Desktop: Notch-style header */}
      <div className="hidden md:block py-3 px-4">
        <div 
          className={`mx-auto max-w-4xl flex h-14 items-center justify-between px-6 rounded-full transition-all duration-300 ${
            isScrolled 
              ? 'bg-card/80 backdrop-blur-md shadow-md border border-border/50' 
              : 'bg-card/60 backdrop-blur-sm'
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Trophy className="h-4 w-4 text-primary-foreground" />
            </div>
            <span>Padel Liga</span>
          </Link>

          {/* Desktop Navigation */}
          {filteredNavItems.length > 0 && (
            <nav className="flex items-center gap-1">
              {filteredNavItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
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

          {/* Auth Section */}
          <div className="flex items-center gap-2">
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
          </div>
        </div>
      </div>

      {/* Mobile: Traditional header */}
      <div 
        className={`md:hidden flex h-14 items-center justify-between px-4 transition-all duration-300 ${
          isScrolled 
            ? 'bg-card/80 backdrop-blur-md border-b border-border/50' 
            : 'bg-transparent'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </div>
          <span>Padel Liga</span>
        </Link>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
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
              <Button variant="default" size="sm">
                Anmelden
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          {filteredNavItems.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && filteredNavItems.length > 0 && (
        <nav className="md:hidden bg-card/95 backdrop-blur-md border-b border-border/50 p-4 animate-slide-up">
          <div className="flex flex-col gap-2">
            {filteredNavItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
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
