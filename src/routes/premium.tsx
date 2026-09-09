import { useEffect, useState, type ReactNode } from "react";
import { Download, Headphones, Mic2, Moon, ShieldOff, SkipForward, Timer, Youtube } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader } from "@/components/music/page";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { usePlayer } from "@/lib/music/player-store";
import { formatTime } from "@/lib/utils";
import { isYouTubeConfigured } from "@/lib/music/youtube";

export const Route = createFileRoute("/premium")({ component: PremiumPage });

function PremiumPage() {
  const backgroundPlay = usePlayer((s) => s.backgroundPlay);
  const highQuality = usePlayer((s) => s.highQuality);
  const crossfade = usePlayer((s) => s.crossfade);
  const incognito = usePlayer((s) => s.incognito);
  const sleepUntil = usePlayer((s) => s.sleepUntil);
  const setBackgroundPlay = usePlayer((s) => s.setBackgroundPlay);
  const setHighQuality = usePlayer((s) => s.setHighQuality);
  const setCrossfade = usePlayer((s) => s.setCrossfade);
  const setIncognito = usePlayer((s) => s.setIncognito);
  const setSleep = usePlayer((s) => s.setSleep);
  const [configured, setConfigured] = useState(false);

  useEffect(() => setConfigured(isYouTubeConfigured()), []);
  const remaining = sleepUntil && sleepUntil > Date.now() ? formatTime((sleepUntil - Date.now()) / 1000) : null;

  return (
    <Page>
      <PageHeader kicker="Included" title="Premium" subtitle="Background play, downloads, lyrics, unlimited skips, sleep timer, and no ads — on by default." />

      <div className="grid gap-3 sm:grid-cols-2">
        <Perk icon={<Headphones className="size-5" />} title="Background play" body="Pulse keeps its own player state and exposes lock-screen/media controls where the browser supports them." />
        <Perk icon={<ShieldOff className="size-5" />} title="Ad-free app UI" body="Pulse adds no advertising to its own interface. YouTube playback remains subject to YouTube's player and account rules." />
        <Perk icon={<Download className="size-5" />} title="Downloads" body="Save tracks from supported library actions for your local organization. YouTube media is not downloaded or extracted." />
        <Perk icon={<SkipForward className="size-5" />} title="Unlimited skips" body="Skip, replay, shuffle, and repeat are controlled by your Pulse queue." />
        <Perk icon={<Mic2 className="size-5" />} title="Synced lyrics" body="Open the full player and switch to Lyrics for timed lines when they're available." />
        <Perk icon={<Moon className="size-5" />} title="Sleep timer" body="Stop playback automatically after your selected interval." />
      </div>

      <section className="space-y-1 rounded-lg bg-surface p-2">
        <Row title="Background play" hint="Keep Pulse audio active when the page is not foregrounded" checked={backgroundPlay} onCheckedChange={setBackgroundPlay} />
        <Row title="High quality" hint="Prefer the best available provider source" checked={highQuality} onCheckedChange={setHighQuality} />
        <Row title="Incognito" hint="Don't save what you play to Listen again" checked={incognito} onCheckedChange={setIncognito} />
        <div className="flex flex-col gap-3 rounded-md px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-sm font-medium">Crossfade</p><p className="text-xs text-muted">{crossfade}s overlap between tracks</p></div>
          <Slider className="w-full max-w-xs" min={0} max={12} step={1} value={[crossfade]} onValueChange={(v) => setCrossfade(v[0] ?? 0)} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md px-3 py-3">
          <div><p className="text-sm font-medium">Sleep timer</p><p className="text-xs text-muted">{remaining ? `Stops in ${remaining}` : "Off"}</p></div>
          <div className="flex flex-wrap gap-2">
            {[15, 30, 45, 60].map((m) => <button key={m} type="button" onClick={() => setSleep(m)} className="inline-flex h-9 items-center gap-1 rounded-full bg-chip px-3 text-xs hover:bg-hover"><Timer className="size-3.5" /> {m}m</button>)}
            <button type="button" onClick={() => setSleep(null)} className="inline-flex h-9 items-center rounded-full bg-chip px-3 text-xs hover:bg-hover">Off</button>
          </div>
        </div>
      </section>

      <section className="rounded-lg bg-surface p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2"><Youtube className="size-5" /><p className="font-display text-base font-semibold">YouTube playback</p></div>
            <p className="mt-1 text-sm text-muted">YouTube is now the primary playback provider. Pulse uses the official YouTube IFrame Player API and YouTube Data API for catalog matching; it does not extract direct audio URLs or bypass YouTube playback controls.</p>
          </div>
          <span className="inline-flex h-8 shrink-0 items-center rounded-full bg-chip px-3 text-xs">{configured ? "Configured" : "Setup required"}</span>
        </div>
        <div className="mt-3 rounded-md bg-chip/60 p-3 text-xs text-subtle">
          {configured ? "YouTube catalog lookup is configured. Start a track from the home/search catalog and Pulse will try to match it to an official YouTube video, then fall back to the catalog preview if no match is available." : "Add VITE_YOUTUBE_API_KEY to your local environment. Use a Google Cloud project with the YouTube Data API v3 enabled, and keep the key restricted to your app's allowed origins."}
        </div>
      </section>

      <p className="text-xs text-subtle">Your YouTube Premium subscription remains your YouTube account entitlement. It does not turn YouTube into a general-purpose direct-stream API for third-party apps. Browser background/lock-screen behavior for embedded YouTube playback depends on platform and browser support.</p>
    </Page>
  );
}

function Perk({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return <div className="rounded-lg bg-surface p-4"><div className="mb-3 inline-flex size-10 items-center justify-center rounded-md bg-chip">{icon}</div><h2 className="font-display text-base font-semibold">{title}</h2><p className="mt-1 text-sm text-muted">{body}</p></div>;
}

function Row({ title, hint, checked, onCheckedChange }: { title: string; hint: string; checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return <label className="flex items-center justify-between gap-4 rounded-md px-3 py-3"><span><span className="block text-sm font-medium">{title}</span><span className="block text-xs text-muted">{hint}</span></span><Switch checked={checked} onCheckedChange={onCheckedChange} /></label>;
}
