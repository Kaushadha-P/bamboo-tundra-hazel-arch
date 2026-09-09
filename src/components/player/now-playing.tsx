import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  Download,
  Heart,
  ListMusic,
  Mic2,
  Moon,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Timer,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getLyrics } from "@/lib/music/api";
import { useLibrary } from "@/lib/music/library-store";
import { usePlayer } from "@/lib/music/player-store";
import { cn, formatTime } from "@/lib/utils";
import { TrackRow } from "@/components/music/track-row";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function NowPlaying() {
  const open = usePlayer((s) => s.fullOpen);
  const setOpen = usePlayer((s) => s.setFullOpen);
  const track = usePlayer((s) => s.queue[s.index] ?? null);
  const queue = usePlayer((s) => s.queue);
  const index = usePlayer((s) => s.index);
  const playing = usePlayer((s) => s.playing);
  const shuffle = usePlayer((s) => s.shuffle);
  const repeat = usePlayer((s) => s.repeat);
  const progress = usePlayer((s) => s.progress);
  const duration = usePlayer((s) => s.duration);
  const lyricsTab = usePlayer((s) => s.lyricsTab);
  const sleepUntil = usePlayer((s) => s.sleepUntil);
  const toggle = usePlayer((s) => s.toggle);
  const next = usePlayer((s) => s.next);
  const prev = usePlayer((s) => s.prev);
  const seek = usePlayer((s) => s.seek);
  const toggleShuffle = usePlayer((s) => s.toggleShuffle);
  const cycleRepeat = usePlayer((s) => s.cycleRepeat);
  const setLyricsTab = usePlayer((s) => s.setLyricsTab);
  const setSleep = usePlayer((s) => s.setSleep);
  const liked = useLibrary((s) => (track ? Boolean(s.liked[track.id]) : false));
  const downloaded = useLibrary((s) => (track ? Boolean(s.downloads[track.id]) : false));
  const toggleLike = useLibrary((s) => s.toggleLike);
  const toggleDownload = useLibrary((s) => s.toggleDownload);
  const [sleepOpen, setSleepOpen] = useState(false);

  const lyricsQuery = useQuery({
    queryKey: ["lyrics", track?.id],
    enabled: open && Boolean(track) && lyricsTab === "lyrics",
    queryFn: () =>
      getLyrics({
        data: {
          artist: track!.artist,
          title: track!.title,
          duration: track!.duration,
        },
      }),
  });

  if (!open || !track) return null;

  const remaining =
    sleepUntil && sleepUntil > Date.now()
      ? formatTime((sleepUntil - Date.now()) / 1000)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg">
      <header className="flex items-center justify-between px-3 py-2">
        <button
          type="button"
          aria-label="Close player"
          onClick={() => setOpen(false)}
          className="inline-flex size-11 items-center justify-center rounded-full hover:bg-chip"
        >
          <ChevronDown className="size-6" />
        </button>
        <div className="text-center">
          <p className="text-[11px] font-medium tracking-wider text-muted uppercase">
            Playing from queue
          </p>
          <p className="text-sm">{track.album || "Pulse"}</p>
        </div>
        <button
          type="button"
          aria-label="Sleep timer"
          onClick={() => setSleepOpen(true)}
          className="inline-flex size-11 items-center justify-center rounded-full hover:bg-chip"
        >
          <Timer className="size-5" />
        </button>
      </header>

      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-8 overflow-auto px-5 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col items-center justify-center">
          <img
            src={track.coverLg || track.cover}
            alt=""
            className="cover aspect-square w-full max-w-md rounded-lg object-cover shadow-[0_24px_80px_rgb(0_0_0/0.55)]"
          />
          <div className="mt-6 flex w-full max-w-md items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-display truncate text-2xl font-semibold tracking-tight">
                {track.title}
              </h1>
              <p className="truncate text-muted">{track.artist}</p>
            </div>
            <div className="flex">
              <button
                type="button"
                aria-label="Download"
                onClick={() => toggleDownload(track)}
                className={cn(
                  "inline-flex size-11 items-center justify-center rounded-full hover:bg-chip",
                  downloaded && "text-fg",
                )}
              >
                <Download className="size-5" />
              </button>
              <button
                type="button"
                aria-label={liked ? "Unlike" : "Like"}
                onClick={() => toggleLike(track)}
                className={cn(
                  "inline-flex size-11 items-center justify-center rounded-full hover:bg-chip",
                  liked && "text-accent",
                )}
              >
                <Heart className={cn("size-5", liked && "fill-current")} />
              </button>
            </div>
          </div>

          <div className="mt-4 w-full max-w-md">
            <input
              type="range"
              min={0}
              max={duration || 30}
              step={0.1}
              value={Math.min(progress, duration || 30)}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Seek"
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-fg/20 accent-fg"
            />
            <div className="mt-1 flex justify-between text-[11px] text-muted tabular-nums">
              <span>{formatTime(progress)}</span>
              <span>Preview · {formatTime(duration)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              aria-label="Shuffle"
              onClick={toggleShuffle}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full",
                shuffle ? "text-fg" : "text-muted",
              )}
            >
              <Shuffle className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Previous"
              onClick={prev}
              className="inline-flex size-12 items-center justify-center rounded-full"
            >
              <SkipBack className="size-7 fill-current" />
            </button>
            <button
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              onClick={toggle}
              className="inline-flex size-16 items-center justify-center rounded-full bg-fg text-bg"
            >
              {playing ? (
                <Pause className="size-7 fill-current" />
              ) : (
                <Play className="size-7 fill-current" style={{ marginLeft: 2 }} />
              )}
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={next}
              className="inline-flex size-12 items-center justify-center rounded-full"
            >
              <SkipForward className="size-7 fill-current" />
            </button>
            <button
              type="button"
              aria-label="Repeat"
              onClick={cycleRepeat}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full",
                repeat === "off" ? "text-muted" : "text-fg",
              )}
            >
              {repeat === "one" ? <Repeat1 className="size-5" /> : <Repeat className="size-5" />}
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-col">
          <div className="mb-3 flex gap-2">
            <Tab
              active={lyricsTab === "upnext"}
              onClick={() => setLyricsTab("upnext")}
              icon={<ListMusic className="size-4" />}
              label="Up next"
            />
            <Tab
              active={lyricsTab === "lyrics"}
              onClick={() => setLyricsTab("lyrics")}
              icon={<Mic2 className="size-4" />}
              label="Lyrics"
            />
          </div>
          <div className="min-h-0 flex-1 overflow-auto rounded-lg bg-surface p-2">
            {lyricsTab === "upnext" ? (
              <div>
                {queue.slice(index + 1, index + 20).map((t, i) => (
                  <TrackRow
                    key={`${t.id}-${i}`}
                    track={t}
                    queue={queue}
                    showAlbum={false}
                  />
                ))}
                {index + 1 >= queue.length ? (
                  <p className="px-3 py-8 text-center text-sm text-muted">
                    Queue is empty. Songs will keep playing from radio when this mix ends.
                  </p>
                ) : null}
              </div>
            ) : (
              <LyricsPane
                loading={lyricsQuery.isLoading}
                synced={lyricsQuery.data?.synced ?? null}
                plain={lyricsQuery.data?.plain ?? null}
                progress={progress}
              />
            )}
          </div>
          {remaining ? (
            <p className="mt-2 flex items-center gap-2 text-xs text-muted">
              <Moon className="size-3.5" /> Sleep timer · {remaining}
            </p>
          ) : null}
        </div>
      </div>

      <Dialog open={sleepOpen} onOpenChange={setSleepOpen}>
        <DialogContent title="Sleep timer">
          <div className="grid grid-cols-2 gap-2">
            {[5, 15, 30, 45, 60].map((m) => (
              <button
                key={m}
                type="button"
                className="h-11 rounded-md bg-chip text-sm hover:bg-hover"
                onClick={() => {
                  setSleep(m);
                  setSleepOpen(false);
                }}
              >
                {m} min
              </button>
            ))}
            <button
              type="button"
              className="col-span-2 h-11 rounded-md bg-chip text-sm hover:bg-hover"
              onClick={() => {
                setSleep(null);
                setSleepOpen(false);
              }}
            >
              Turn off
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Tab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm",
        active ? "bg-fg text-bg" : "bg-chip text-fg hover:bg-hover",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function LyricsPane({
  loading,
  synced,
  plain,
  progress,
}: {
  loading: boolean;
  synced: { time: number; text: string }[] | null;
  plain: string | null;
  progress: number;
}) {
  const active = useMemo(() => {
    if (!synced?.length) return -1;
    let i = 0;
    for (let n = 0; n < synced.length; n++) {
      if (synced[n]!.time <= progress) i = n;
    }
    return i;
  }, [synced, progress]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current?.querySelector(`[data-i="${active}"]`);
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [active]);

  if (loading) {
    return <p className="px-3 py-8 text-center text-sm text-muted">Loading lyrics…</p>;
  }
  if (synced?.length) {
    return (
      <div ref={ref} className="space-y-3 px-3 py-6">
        {synced.map((line, i) => (
          <p
            key={`${line.time}-${i}`}
            data-i={i}
            className={cn(
              "lyrics-line font-display text-xl leading-snug",
              i === active ? "scale-100 text-fg" : "scale-[0.98] text-subtle",
            )}
          >
            {line.text}
          </p>
        ))}
      </div>
    );
  }
  if (plain) {
    return (
      <pre className="px-4 py-6 font-sans text-sm leading-relaxed whitespace-pre-wrap text-muted">
        {plain}
      </pre>
    );
  }
  return (
    <p className="px-3 py-8 text-center text-sm text-muted">
      Lyrics aren't available for this track.
    </p>
  );
}
