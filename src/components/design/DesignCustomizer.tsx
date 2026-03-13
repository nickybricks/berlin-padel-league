import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, Copy, Palette } from 'lucide-react';
import { DemoLeagueProvider } from '@/demo/DemoLeagueContext';
import DemoStandings from '@/demo/tabs/DemoStandings';
import DemoSchedule from '@/demo/tabs/DemoSchedule';
import { useToast } from '@/hooks/use-toast';

// HSL color as [h, s, l]
type HSL = [number, number, number];

function parseHSL(value: string): HSL {
  const matches = value.match(/-?\d+(?:\.\d+)?/g) ?? [];
  const h = Number.parseFloat(matches[0] ?? '0');
  const s = Number.parseFloat(matches[1] ?? '0');
  const l = Number.parseFloat(matches[2] ?? '0');
  return [h, s, l];
}

function formatHSL(hsl: HSL): string {
  return `${hsl[0]} ${hsl[1]}% ${hsl[2]}%`;
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHSL(hex: string): HSL {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      case b: h = ((r - g) / d + 4) * 60; break;
    }
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

interface ColorToken {
  variable: string;
  label: string;
  defaultValue: string;
}

const COLOR_TOKENS: ColorToken[] = [
  { variable: '--primary', label: 'Primary', defaultValue: '228 71% 15%' },
  { variable: '--primary-foreground', label: 'Primary FG', defaultValue: '0 0% 100%' },
  { variable: '--accent', label: 'Accent', defaultValue: '160 70% 40%' },
  { variable: '--accent-foreground', label: 'Accent FG', defaultValue: '0 0% 100%' },
  { variable: '--background', label: 'Background', defaultValue: '220 25% 97%' },
  { variable: '--foreground', label: 'Foreground', defaultValue: '220 40% 13%' },
  { variable: '--card', label: 'Card', defaultValue: '0 0% 100%' },
  { variable: '--card-foreground', label: 'Card FG', defaultValue: '220 40% 13%' },
  { variable: '--muted', label: 'Muted', defaultValue: '210 25% 92%' },
  { variable: '--muted-foreground', label: 'Muted FG', defaultValue: '220 15% 45%' },
  { variable: '--border', label: 'Border', defaultValue: '220 20% 88%' },
  { variable: '--destructive', label: 'Destructive', defaultValue: '0 72% 51%' },
  { variable: '--success', label: 'Success', defaultValue: '160 70% 40%' },
  { variable: '--warning', label: 'Warning', defaultValue: '38 92% 50%' },
];

const RADIUS_OPTIONS = [
  { label: '0px', value: '0rem' },
  { label: '4px', value: '0.25rem' },
  { label: '8px', value: '0.5rem' },
  { label: '12px', value: '0.75rem' },
  { label: '16px', value: '1rem' },
  { label: '20px (default)', value: '1.25rem' },
  { label: '24px', value: '1.5rem' },
  { label: '32px', value: '2rem' },
];

const FONT_OPTIONS = [
  { label: 'Inter (default)', value: 'Inter, system-ui, sans-serif' },
  { label: 'System UI', value: 'system-ui, -apple-system, sans-serif' },
  { label: 'DM Sans', value: '"DM Sans", system-ui, sans-serif', import: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap' },
  { label: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", system-ui, sans-serif', import: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap' },
  { label: 'Outfit', value: '"Outfit", system-ui, sans-serif', import: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap' },
  { label: 'Space Grotesk', value: '"Space Grotesk", system-ui, sans-serif', import: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap' },
];

function ColorControl({ token, value, onChange }: { token: ColorToken; value: HSL; onChange: (hsl: HSL) => void }) {
  const hex = hslToHex(value[0], value[1], value[2]);

  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={hex}
        onChange={(e) => onChange(hexToHSL(e.target.value))}
        className="w-8 h-8 rounded-md border border-border cursor-pointer shrink-0"
        style={{ padding: 0 }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{token.label}</p>
        <p className="text-[10px] text-muted-foreground font-mono">{formatHSL(value)}</p>
      </div>
    </div>
  );
}

const DEMO_TABS = [
  { key: 'tabelle', label: 'Tabelle' },
  { key: 'spielplan', label: 'Spielplan' },
];

/** Build inline style object with all CSS variables for scoped preview */
function buildPreviewStyle(colors: Record<string, HSL>, radius: string, font: string): React.CSSProperties {
  const style: Record<string, string> = {};
  Object.entries(colors).forEach(([variable, hsl]) => {
    style[variable] = formatHSL(hsl);
  });
  style['--radius'] = radius;
  style['fontFamily'] = font;
  // Ensure the preview always renders in "light mode" context
  style['colorScheme'] = 'light';
  return style as React.CSSProperties;
}

export default function DesignCustomizer() {
  const { toast } = useToast();
  const [colors, setColors] = useState<Record<string, HSL>>(() => {
    const initial: Record<string, HSL> = {};
    COLOR_TOKENS.forEach(t => { initial[t.variable] = parseHSL(t.defaultValue); });
    return initial;
  });
  const [radius, setRadius] = useState('1.25rem');
  const [font, setFont] = useState('Inter, system-ui, sans-serif');
  const [demoTab, setDemoTab] = useState('tabelle');

  // Load font if needed
  const loadFont = useCallback((fontValue: string) => {
    const opt = FONT_OPTIONS.find(f => f.value === fontValue);
    if (opt?.import) {
      const existing = document.querySelector(`link[href="${opt.import}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = opt.import;
        document.head.appendChild(link);
      }
    }
  }, []);

  const updateColor = useCallback((variable: string, hsl: HSL) => {
    setColors(prev => ({ ...prev, [variable]: hsl }));
  }, []);

  const resetAll = useCallback(() => {
    const initial: Record<string, HSL> = {};
    COLOR_TOKENS.forEach(t => { initial[t.variable] = parseHSL(t.defaultValue); });
    setColors(initial);
    setRadius('1.25rem');
    setFont('Inter, system-ui, sans-serif');
    toast({ title: 'Design zurückgesetzt', description: 'Alle Werte auf Standard.' });
  }, [toast]);

  const exportCSS = useCallback(() => {
    const lines = [':root {'];
    Object.entries(colors).forEach(([variable, hsl]) => {
      lines.push(`  ${variable}: ${formatHSL(hsl)};`);
    });
    lines.push(`  --radius: ${radius};`);
    lines.push('}');
    const css = lines.join('\n');
    navigator.clipboard.writeText(css);
    toast({ title: 'CSS kopiert!', description: 'Design-Tokens in die Zwischenablage kopiert.' });
  }, [colors, radius, toast]);

  const handleFontChange = useCallback((value: string) => {
    setFont(value);
    loadFont(value);
  }, [loadFont]);

  // Build scoped style for preview container
  const previewStyle = buildPreviewStyle(colors, radius, font);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
      {/* Controls — uses page theme (light/dark) */}
      <div className="space-y-4 lg:max-h-[80vh] lg:overflow-y-auto lg:pr-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="h-4 w-4" /> Design Editor
              </CardTitle>
              <div className="flex gap-1.5">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetAll}>
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={exportCSS}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Font */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Schriftart</Label>
              <Select value={font} onValueChange={handleFontChange}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map(f => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Radius */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Border Radius</Label>
              <Select value={radius} onValueChange={setRadius}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RADIUS_OPTIONS.map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <Label className="text-xs font-medium">Farben</Label>
              <div className="grid grid-cols-2 gap-3">
                {COLOR_TOKENS.map(token => (
                  <ColorControl
                    key={token.variable}
                    token={token}
                    value={colors[token.variable]}
                    onChange={(hsl) => updateColor(token.variable, hsl)}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Preview — scoped CSS variables via inline style */}
      <div className="space-y-4">
        <div
          className="rounded-xl border border-border overflow-hidden"
          style={{
            ...previewStyle,
            backgroundColor: `hsl(${formatHSL(colors['--background'])})`,
            color: `hsl(${formatHSL(colors['--foreground'])})`,
          }}
        >
          <div className="p-4 border-b" style={{ borderColor: `hsl(${formatHSL(colors['--border'])})` }}>
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold">Live-Vorschau</p>
              <div className="flex gap-1">
                {DEMO_TABS.map(t => (
                  <button
                    key={t.key}
                    onClick={() => setDemoTab(t.key)}
                    className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                    style={{
                      backgroundColor: demoTab === t.key
                        ? `hsl(${formatHSL(colors['--primary'])})`
                        : 'transparent',
                      color: demoTab === t.key
                        ? `hsl(${formatHSL(colors['--primary-foreground'])})`
                        : `hsl(${formatHSL(colors['--muted-foreground'])})`,
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-4">
            <DemoLeagueProvider>
              <div className="space-y-4">
                {demoTab === 'tabelle' && <DemoStandings />}
                {demoTab === 'spielplan' && <DemoSchedule />}
              </div>
            </DemoLeagueProvider>
          </div>
        </div>

        {/* Component samples — also scoped */}
        <div
          className="rounded-xl border border-border overflow-hidden"
          style={{
            ...previewStyle,
            backgroundColor: `hsl(${formatHSL(colors['--background'])})`,
            color: `hsl(${formatHSL(colors['--foreground'])})`,
          }}
        >
          <div className="p-4 border-b" style={{ borderColor: `hsl(${formatHSL(colors['--border'])})` }}>
            <p className="text-base font-semibold">Komponenten</p>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: `hsl(${formatHSL(colors['--accent'])})`, color: `hsl(${formatHSL(colors['--accent-foreground'])})` }}>Accent Badge</div>
              <div className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: `hsl(${formatHSL(colors['--success'])})`, color: '#fff' }}>Success</div>
              <div className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: `hsl(${formatHSL(colors['--warning'])})`, color: '#fff' }}>Warning</div>
              <div className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: `hsl(${formatHSL(colors['--destructive'])})`, color: '#fff' }}>Error</div>
            </div>
            <div className="flex gap-3">
              <Input placeholder="Input Beispiel" className="max-w-xs" />
              <Button>Senden</Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Card 1', 'Card 2', 'Card 3'].map(c => (
                <div
                  key={c}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: `hsl(${formatHSL(colors['--card'])})`,
                    color: `hsl(${formatHSL(colors['--card-foreground'])})`,
                    border: `1px solid hsl(${formatHSL(colors['--border'])})`,
                  }}
                >
                  <p className="text-sm font-medium">{c}</p>
                  <p className="text-xs mt-1" style={{ color: `hsl(${formatHSL(colors['--muted-foreground'])})` }}>Beispiel-Inhalt</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
