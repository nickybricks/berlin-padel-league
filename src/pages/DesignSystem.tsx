import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Users, Calendar, Star, ChevronRight, Check, X, AlertTriangle, Info, Download } from 'lucide-react';
import DesignCustomizer from '@/components/design/DesignCustomizer';

function ColorSwatch({ name, variable, className }: { name: string; variable: string; className: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-16 h-16 rounded-lg shadow-sm border border-border/30 ${className}`} />
      <span className="text-xs font-medium text-foreground">{name}</span>
      <span className="text-[10px] text-muted-foreground font-mono">{variable}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="design-section space-y-4">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <Separator />
      {children}
    </div>
  );
}

export default function DesignSystem() {
  return (
    <Layout>
      <div className="space-y-12 pb-16" id="design-system-content">
        {/* Page Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Design System</h1>
            <p className="text-muted-foreground mt-1">Komplette Übersicht aller Design-Tokens, Komponenten und Styles.</p>
          </div>
          <Button
            onClick={() => window.print()}
            variant="outline"
            size="sm"
            className="shrink-0 print:hidden"
          >
            <Download className="h-4 w-4 mr-1.5" />
            PDF
          </Button>
        </div>

        {/* ── Typography ── */}
        <Section title="Typografie">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1 font-mono">font-sans (Inter)</p>
                <p className="text-4xl font-bold">Heading 1 — 36px Bold</p>
              </div>
              <div>
                <p className="text-3xl font-bold">Heading 2 — 30px Bold</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">Heading 3 — 24px Semibold</p>
              </div>
              <div>
                <p className="text-xl font-semibold">Heading 4 — 20px Semibold</p>
              </div>
              <div>
                <p className="text-lg font-medium">Heading 5 — 18px Medium</p>
              </div>
              <Separator />
              <div>
                <p className="text-base">Body — 16px Regular. Dies ist ein Fließtext-Beispiel für die Padel-Liga-Anwendung.</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Small / Muted — 14px Regular. Sekundäre Informationen und Beschreibungen.</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Extra Small — 12px. Labels, Badges, Metadaten.</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1 font-mono">font-mono</p>
                <p className="font-mono text-sm">0123456789 — Monospace für Scores und Zahlen</p>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* ── Colors ── */}
        <Section title="Farben — Light Mode">
          <Card>
            <CardContent className="p-6 space-y-8">
              {/* Core */}
              <div>
                <p className="text-sm font-medium mb-3">Kernfarben</p>
                <div className="flex flex-wrap gap-4">
                  <ColorSwatch name="Background" variable="--background" className="bg-background" />
                  <ColorSwatch name="Foreground" variable="--foreground" className="bg-foreground" />
                  <ColorSwatch name="Card" variable="--card" className="bg-card" />
                  <ColorSwatch name="Popover" variable="--popover" className="bg-popover" />
                  <ColorSwatch name="Muted" variable="--muted" className="bg-muted" />
                  <ColorSwatch name="Muted FG" variable="--muted-foreground" className="bg-muted-foreground" />
                </div>
              </div>

              {/* Brand */}
              <div>
                <p className="text-sm font-medium mb-3">Markenfarben</p>
                <div className="flex flex-wrap gap-4">
                  <ColorSwatch name="Primary" variable="228 71% 15%" className="bg-primary" />
                  <ColorSwatch name="Primary FG" variable="0 0% 100%" className="bg-primary-foreground" />
                  <ColorSwatch name="Secondary" variable="210 30% 94%" className="bg-secondary" />
                  <ColorSwatch name="Accent" variable="160 70% 40%" className="bg-accent" />
                  <ColorSwatch name="Accent FG" variable="0 0% 100%" className="bg-accent-foreground" />
                </div>
              </div>

              {/* Semantic */}
              <div>
                <p className="text-sm font-medium mb-3">Semantische Farben</p>
                <div className="flex flex-wrap gap-4">
                  <ColorSwatch name="Destructive" variable="0 72% 51%" className="bg-destructive" />
                  <ColorSwatch name="Success" variable="160 70% 40%" className="bg-success" />
                  <ColorSwatch name="Warning" variable="38 92% 50%" className="bg-warning" />
                  <ColorSwatch name="Playoff" variable="45 90% 55%" className="bg-playoff" />
                </div>
              </div>

              {/* UI */}
              <div>
                <p className="text-sm font-medium mb-3">UI-Elemente</p>
                <div className="flex flex-wrap gap-4">
                  <ColorSwatch name="Border" variable="220 20% 88%" className="bg-border" />
                  <ColorSwatch name="Input" variable="220 20% 88%" className="bg-input" />
                  <ColorSwatch name="Ring" variable="160 70% 40%" className="bg-ring" />
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <p className="text-sm font-medium mb-3">Sidebar</p>
                <div className="flex flex-wrap gap-4">
                  <ColorSwatch name="Sidebar BG" variable="220 60% 20%" className="bg-sidebar" />
                  <ColorSwatch name="Sidebar FG" variable="210 40% 95%" className="bg-sidebar-foreground" />
                  <ColorSwatch name="Sidebar Primary" variable="160 70% 50%" className="bg-sidebar-primary" />
                  <ColorSwatch name="Sidebar Accent" variable="220 50% 28%" className="bg-sidebar-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* ── Radius ── */}
        <Section title="Rundungen (Border Radius)">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-6 items-end">
                {[
                  { label: 'sm', desc: 'calc(1.25rem - 4px)', cls: 'rounded-sm' },
                  { label: 'md', desc: 'calc(1.25rem - 2px)', cls: 'rounded-md' },
                  { label: 'lg', desc: '1.25rem (--radius)', cls: 'rounded-lg' },
                  { label: 'xl', desc: '1.5rem', cls: 'rounded-xl' },
                  { label: 'full', desc: '9999px', cls: 'rounded-full' },
                ].map(r => (
                  <div key={r.label} className="flex flex-col items-center gap-2">
                    <div className={`w-16 h-16 bg-primary ${r.cls}`} />
                    <span className="text-xs font-medium">{r.label}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{r.desc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* ── Shadows ── */}
        <Section title="Schatten">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-6 items-end">
                {[
                  { label: 'shadow-sm', style: { boxShadow: 'var(--shadow-sm)' } },
                  { label: 'shadow', style: { boxShadow: 'var(--shadow)' } },
                  { label: 'shadow-md', style: { boxShadow: 'var(--shadow-md)' } },
                  { label: 'shadow-lg', style: { boxShadow: 'var(--shadow-lg)' } },
                  { label: 'shadow-glow', style: { boxShadow: 'var(--shadow-glow)' } },
                ].map(s => (
                  <div key={s.label} className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 bg-card rounded-lg" style={s.style} />
                    <span className="text-xs font-medium">{s.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* ── Spacing ── */}
        <Section title="Abstände (Spacing)">
          <Card>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">Tailwind 4px-Basis-System. Häufig genutzte Abstände:</p>
              <div className="space-y-2">
                {[
                  { label: '1 (4px)', w: 'w-1' },
                  { label: '2 (8px)', w: 'w-2' },
                  { label: '3 (12px)', w: 'w-3' },
                  { label: '4 (16px)', w: 'w-4' },
                  { label: '6 (24px)', w: 'w-6' },
                  { label: '8 (32px)', w: 'w-8' },
                  { label: '12 (48px)', w: 'w-12' },
                  { label: '16 (64px)', w: 'w-16' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span className="text-xs font-mono w-20 text-muted-foreground">{s.label}</span>
                    <div className={`h-3 ${s.w} bg-accent rounded-sm`} />
                  </div>
                ))}
              </div>
              <Separator />
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Container padding:</span> <span className="font-mono text-xs">px-4 (16px)</span></p>
                <p><span className="font-medium">Max-Breite Inhalt:</span> <span className="font-mono text-xs">max-w-5xl (1024px)</span></p>
                <p><span className="font-medium">Header Breite:</span> <span className="font-mono text-xs">992px</span></p>
                <p><span className="font-medium">Header Höhe:</span> <span className="font-mono text-xs">h-14 (56px)</span></p>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* ── Buttons ── */}
        <Section title="Buttons">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-sm font-medium mb-3">Varianten</p>
                <div className="flex flex-wrap gap-3">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-3">Größen</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon"><Star className="h-4 w-4" /></Button>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-3">Zustände</p>
                <div className="flex flex-wrap gap-3">
                  <Button>Enabled</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* ── Badges ── */}
        <Section title="Badges">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge className="bg-success text-success-foreground">Gespielt</Badge>
                <Badge className="bg-warning text-warning-foreground">Ausstehend</Badge>
                <Badge className="bg-playoff text-playoff-foreground">Playoff</Badge>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* ── Form Elements ── */}
        <Section title="Formular-Elemente">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="demo-input">Input Label</Label>
                  <Input id="demo-input" placeholder="Placeholder Text" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="demo-input-disabled">Disabled Input</Label>
                  <Input id="demo-input-disabled" placeholder="Disabled" disabled />
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch id="demo-switch" />
                  <Label htmlFor="demo-switch">Switch</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="demo-check" />
                  <Label htmlFor="demo-check">Checkbox</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* ── Cards ── */}
        <Section title="Cards">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Standard Card</CardTitle>
                <CardDescription>bg-card, shadow-sm, rounded-lg, kein Border</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Weißer Hintergrund mit dezentem Schatten — der Standardstil für alle Container.</p>
              </CardContent>
            </Card>
            <div className="glass-card rounded-lg p-6 space-y-2">
              <h3 className="text-lg font-semibold">Glass Card</h3>
              <p className="text-sm text-muted-foreground">backdrop-blur-md, bg-card/80, border-border/50 — für Overlays und Header.</p>
            </div>
            <Card className="match-card p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-semibold">Match Card</p>
                  <p className="text-sm text-muted-foreground">Verwendet .match-card Klasse</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          </div>
        </Section>

        {/* ── Tabs ── */}
        <Section title="Tabs">
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="tab1">
                <TabsList>
                  <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                  <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                  <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="mt-4">
                  <p className="text-sm text-muted-foreground">Inhalt von Tab 1. Shadcn Tabs mit Standard-Styling.</p>
                </TabsContent>
                <TabsContent value="tab2" className="mt-4">
                  <p className="text-sm text-muted-foreground">Inhalt von Tab 2.</p>
                </TabsContent>
                <TabsContent value="tab3" className="mt-4">
                  <p className="text-sm text-muted-foreground">Inhalt von Tab 3.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </Section>

        {/* ── Icons ── */}
        <Section title="Icons (Lucide)">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4">
                {[
                  { Icon: Trophy, label: 'Trophy' },
                  { Icon: Users, label: 'Users' },
                  { Icon: Calendar, label: 'Calendar' },
                  { Icon: Star, label: 'Star' },
                  { Icon: Check, label: 'Check' },
                  { Icon: X, label: 'X' },
                  { Icon: AlertTriangle, label: 'AlertTriangle' },
                  { Icon: Info, label: 'Info' },
                  { Icon: ChevronRight, label: 'ChevronRight' },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* ── Animations ── */}
        <Section title="Animationen">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2 text-center">
                  <div className="w-16 h-16 bg-accent rounded-lg animate-pulse-glow" />
                  <span className="text-xs">pulse-glow</span>
                </div>
                <div className="space-y-2 text-center">
                  <div className="w-16 h-16 bg-primary rounded-lg animate-fade-in" />
                  <span className="text-xs">fade-in</span>
                </div>
                <div className="space-y-2 text-center">
                  <div className="w-16 h-16 bg-primary rounded-lg animate-slide-up" />
                  <span className="text-xs">slide-up</span>
                </div>
                <div className="space-y-2 text-center">
                  <div className="w-16 h-16 bg-primary rounded-lg animate-scale-in" />
                  <span className="text-xs">scale-in</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-mono">Stagger-Delays: .stagger-1 (50ms) bis .stagger-5 (250ms)</p>
            </CardContent>
          </Card>
        </Section>

        {/* ── Layout Rules ── */}
        <Section title="Layout-Regeln">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="font-medium">Breakpoints</p>
                  <ul className="text-muted-foreground space-y-1 font-mono text-xs">
                    <li>sm: 640px</li>
                    <li>md: 768px</li>
                    <li>lg: 1024px</li>
                    <li>xl: 1280px</li>
                    <li>2xl: 1400px</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Container</p>
                  <ul className="text-muted-foreground space-y-1 text-xs">
                    <li>Inhalt: max-w-5xl (1024px), mx-auto, px-4</li>
                    <li>Header: 992px, floating pill, h-14</li>
                    <li>Mobile: Full-width, kein Padding-Verlust</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Design-Prinzipien</p>
                  <ul className="text-muted-foreground space-y-1 text-xs">
                    <li>✓ Mobile-first, Daumen-freundlich</li>
                    <li>✓ Kein Border — nur shadow-sm</li>
                    <li>✓ Apple-like Clean & Minimalist</li>
                    <li>✓ Großzügiges Padding & Weißraum</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Fonts</p>
                  <ul className="text-muted-foreground space-y-1 text-xs">
                    <li>Sans: Inter (Primary)</li>
                    <li>Display: Inter</li>
                    <li>Serif: Crimson Pro (--font-serif)</li>
                    <li>Mono: Cascadia Code (--font-mono)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>
      </div>
    </Layout>
  );
}
