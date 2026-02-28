import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateLeagueFormat } from '@/hooks/useLeagueFormat';
import type { League, FormatType, PlayoffFormat } from '@/types/leagues';

interface TournamentFormatCardProps {
  league: League;
}

export function TournamentFormatCard({ league }: TournamentFormatCardProps) {
  const [formatType, setFormatType] = useState<FormatType>(league.format_type || 'round_robin');
  const [groupCount, setGroupCount] = useState(league.group_count || 2);
  const [playoffFormat, setPlayoffFormat] = useState<PlayoffFormat>(league.playoff_format || 'top8_bracket');
  const [homeAndAway, setHomeAndAway] = useState(league.home_and_away ?? false);
  const [qualifiers, setQualifiers] = useState(league.playoff_qualifiers_per_group || 4);

  const updateFormat = useUpdateLeagueFormat();

  useEffect(() => {
    setFormatType(league.format_type || 'round_robin');
    setGroupCount(league.group_count || 2);
    setPlayoffFormat(league.playoff_format || 'top8_bracket');
    setQualifiers(league.playoff_qualifiers_per_group || 4);
    setHomeAndAway(league.home_and_away ?? false);
  }, [league]);

  const hasChanges =
    formatType !== (league.format_type || 'round_robin') ||
    groupCount !== (league.group_count || 2) ||
    playoffFormat !== (league.playoff_format || 'top8_bracket') ||
    qualifiers !== (league.playoff_qualifiers_per_group || 4) ||
    homeAndAway !== (league.home_and_away ?? false);

  const handleSave = async () => {
    try {
      await updateFormat.mutateAsync({
        leagueId: league.id,
        format_type: formatType,
        group_count: formatType === 'round_robin' ? 1 : groupCount,
        playoff_format: playoffFormat,
        playoff_qualifiers_per_group: qualifiers,
        home_and_away: homeAndAway,
      });
      toast.success('Turnierformat aktualisiert');
    } catch {
      toast.error('Fehler beim Speichern');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings2 className="h-5 w-5 text-primary" />
          Turnierformat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Format Type */}
        <div className="space-y-2">
          <Label>Spielmodus</Label>
          <RadioGroup value={formatType} onValueChange={(v) => setFormatType(v as FormatType)}>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="round_robin" id="rr" />
              <Label htmlFor="rr" className="font-normal cursor-pointer">
                Einzelrunde (Jeder gegen Jeden)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="groups" id="groups" />
              <Label htmlFor="groups" className="font-normal cursor-pointer">
                Gruppenphase
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Group Count */}
        {formatType === 'groups' && (
          <div className="space-y-2">
            <Label>Anzahl Gruppen</Label>
            <Select value={String(groupCount)} onValueChange={(v) => setGroupCount(Number(v))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[2,3,4,5,6,7,8].map(n => (
                  <SelectItem key={n} value={String(n)}>{n} Gruppen</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Home and Away */}
        <div className="flex items-center justify-between">
          <Label htmlFor="home-away-toggle">Hin- und Rückrunde</Label>
          <Switch id="home-away-toggle" checked={homeAndAway} onCheckedChange={setHomeAndAway} />
        </div>

        {/* Playoff Format */}
        <div className="space-y-2">
          <Label>Playoff-Format</Label>
          <Select value={playoffFormat} onValueChange={(v) => setPlayoffFormat(v as PlayoffFormat)}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top8_bracket">Top 8 Bracket (1. vs 8.)</SelectItem>
              <SelectItem value="top4_bracket">Top 4 Bracket</SelectItem>
              {formatType === 'groups' && (
                <SelectItem value="cross_group">Kreuzspiel (1A vs 4B)</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Qualifiers per Group */}
        {formatType === 'groups' && (
          <div className="space-y-2">
            <Label>Qualifikanten pro Gruppe</Label>
            <Input
              type="number"
              min={1}
              max={8}
              value={qualifiers}
              onChange={(e) => setQualifiers(Number(e.target.value))}
              className="w-24"
            />
          </div>
        )}

        <Button onClick={handleSave} disabled={!hasChanges || updateFormat.isPending} size="sm">
          {updateFormat.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Speichern
        </Button>
      </CardContent>
    </Card>
  );
}
