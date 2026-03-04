import { useDemoLeague } from '../DemoLeagueContext';
import { Card } from '@/components/ui/card';
import { User, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DemoTeams() {
  const { teams } = useDemoLeague();
  const { toast } = useToast();

  const sorted = [...teams].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {sorted.map(team => (
        <Card
          key={team.id}
          className="flex items-center gap-3 p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => toast({ title: 'Demo', description: 'In der echten App siehst du hier Team-Details.' })}
        >
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{team.name}</p>
            <p className="text-xs text-muted-foreground">{team.player1_name} & {team.player2_name}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </Card>
      ))}
    </div>
  );
}
