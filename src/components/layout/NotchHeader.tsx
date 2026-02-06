import { useState, useEffect, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Initialize with current scroll position to prevent flash
const getScrollState = () => typeof window !== 'undefined' && window.scrollY > 10;

export function NotchHeader() {
  const [isScrolled, setIsScrolled] = useState(getScrollState);
  const { user, role, signOut } = useAuth();
  const location = useLocation();

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

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Desktop: Notch-style header */}
      <div className="hidden lg:block py-3 px-4">
        <div 
          className={`mx-auto max-w-2xl flex h-14 items-center justify-between px-6 rounded-full transition-all duration-300 ${
            isScrolled 
              ? 'bg-card/80 backdrop-blur-md shadow-md border border-border/50' 
              : 'bg-card/60 backdrop-blur-sm'
          }`}
        >
          {/* Logo */}
          <Link to="/leagues" className="flex items-center gap-2 font-bold text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Trophy className="h-4 w-4 text-primary-foreground" />
            </div>
            <span>Padel Liga</span>
          </Link>

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

      {/* Mobile & Tablet: Traditional header */}
      <div 
        className={`lg:hidden flex h-14 items-center justify-between px-4 transition-all duration-300 ${
          isScrolled 
            ? 'bg-card/80 backdrop-blur-md border-b border-border/50' 
            : 'bg-transparent'
        }`}
      >
        {/* Logo */}
        <Link to="/leagues" className="flex items-center gap-2 font-bold text-lg">
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
        </div>
      </div>
    </header>
  );
}
