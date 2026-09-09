import { createFileRoute } from "@tanstack/react-router";
import {
  Download,
  Headphones,
  Mic2,
  Moon,
  ShieldOff,
  SkipForward,
  Timer,
} from "lucide-react";
import type { ReactNode } from "react";
import { Page, PageHeader } from "@/components/music/page";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { usePlayer } from "@/lib/music/player-store";
import { formatTime } from "@/lib/utils";

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

  const remaining =
    sleepUntil && sleepUntil > Date.now()
      ? formatTime((sleepUntil - Date.now()) / 1000)
      : null;

  return (
    <Page>
      <PageHeader
        kicker="Included"
        title="Premium"
        subtitle="Background play, downloads, lyrics, unlimited skips, sleep timer, and no ads — on by default."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Perk
          icon={<Headphones className="size-5" />}
          title="Background play"
          body="Audio keeps going when you switch tabs or lock the screen. Lock-screen controls use Media Session."
        />
        <Perk
          icon={<ShieldOff className="size-5" />}
          title="Ad-free listening"
          body="No interruptions between tracks. Mixes, radio, and search play straight through."
        />
        <Perk
          icon={<Download className="size-5" />}
          title="Downloads"
          body="Save tracks from any menu into your Library → Downloads for offline-ready recents."
        />
        <Perk
          icon={<SkipForward className="size-5" />}
          title="Unlimited skips"
          body="Skip, replay, shuffle, and repeat without a cap."
        />
        <Perk
          icon={<Mic2 className="size-5" />}
          title="Synced lyrics"
          body="Open the full player and switch to Lyrics for timed lines when they're available."
        />
        <Perk
          icon={<Moon className="size-5" />}
          title="Sleep timer"
          body="From the now-playing screen, fade out after 5–60 minutes."
        />
      </div>

      <section className="space-y-1 rounded-lg bg-surface p-2">
        <Row
          title="Background play"
          hint="Keep audio alive when Pulse isn't in the foreground"
          checked={backgroundPlay}
          onCheckedChange={setBackgroundPlay}
        />
        <Row
          title="High quality"
          hint="Prefer the best available preview stream"
          checked={highQuality}
          onCheckedChange={setHighQuality}
        />
        <Row
          title="Incognito"
          hint="Don't save what you play to Listen again"
          checked={incognito}
          onCheckedChange={setIncognito}
        />
        <div className="flex flex-col gap-3 rounded-md px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Crossfade</p>
            <p className="text-xs text-muted">{crossfade}s overlap between tracks</p>
          </div>
          <Slider
            className="w-full max-w-xs"
            min={0}
            max={12}
            step={1}
            value={[crossfade]}
            onValueChange={(v) => setCrossfade(v[0] ?? 0)}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md px-3 py-3">
          <div>
            <p className="text-sm font-medium">Sleep timer</p>
            <p className="text-xs text-muted">{remaining ? `Stops in ${remaining}` : "Off"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[15, 30, 45, 60].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSleep(m)}
                className="inline-flex h-9 items-center gap-1 rounded-full bg-chip px-3 text-xs hover:bg-hover"
              >
                <Timer className="size-3.5" /> {m}m
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSleep(null)}
              className="inline-flex h-9 items-center rounded-full bg-chip px-3 text-xs hover:bg-hover"
            >
              Off
            </button>
          </div>
        </div>
      </section>

      <p className="text-xs text-subtle">
        Pulse searches a worldwide catalog and plays official 30-second previews so every artist is
        reachable. Full-length licensed streams aren't included in this web app.
      </p>
    </Page>
  );
}

function Perk({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-lg bg-surface p-4">
      <div className="mb-3 inline-flex size-10 items-center justify-center rounded-md bg-chip">
        {icon}
      </div>
      <h2 className="font-display text-base font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </div>
  );
}

function Row({
  title,
  hint,
  checked,
  onCheckedChange,
}: {
  title: string;
  hint: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-md px-3 py-3">
      <span>
        <span className="block text-sm font-medium">{title}</span>
        <span className="block text-xs text-muted">{hint}</span>
      </span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  );
}
