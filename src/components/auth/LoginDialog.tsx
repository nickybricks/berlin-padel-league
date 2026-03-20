import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Loader2, LogIn, UserPlus } from 'lucide-react';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({ title: 'Erfolgreich angemeldet!' });
        onOpenChange(false);
        resetForm();
        navigate('/leagues', { replace: true });
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast({
          title: 'Konto erstellt!',
          description: 'Bitte bestätige deine E-Mail-Adresse und melde dich dann an.',
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setIsLogin(true);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value) resetForm();
      onOpenChange(value);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isLogin ? 'Anmelden' : 'Registrieren'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isLogin
              ? 'Melde dich an, um Ergebnisse einzutragen.'
              : 'Erstelle ein Konto für die Padel Liga.'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="login-email">E-Mail</Label>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Passwort</Label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isLogin ? (
              <LogIn className="mr-2 h-4 w-4" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            {isLogin ? 'Anmelden' : 'Registrieren'}
          </Button>
        </form>

        <div className="text-center text-sm pt-2">
          <span className="text-muted-foreground">
            {isLogin ? 'Noch kein Konto?' : 'Bereits registriert?'}
          </span>{' '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-accent hover:underline font-medium"
          >
            {isLogin ? 'Registrieren' : 'Anmelden'}
          </button>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Hinweis</p>
          <p>
            Registriere dich mit der E-Mail-Adresse, die bei deinem Team
            hinterlegt ist. Du wirst automatisch als Spieler erkannt.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}