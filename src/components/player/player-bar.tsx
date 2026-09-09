import {
  Cast,
  Heart,
  ListMusic,
  Maximize2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useLibrary } from "@/lib/music/library-store";
import { usePlayer } from "@/lib/music/player-store";
import { cn, formatTime } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

function SeekBar() {
  const progress = usePlayer((s) => s.progress);
  const duration = usePlayer((s) => s.duration);
  const seek = usePlayer((s) => s.seek);
  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      <span className="w-8 text-right text-[11px] text-muted tabular-nums">
        {formatTime(progress)}
      </span>
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
      <span className="w-8 text-[11px] text-muted tabular-nums">{formatTime(duration)}</span>
    </div>
  );
}

export function PlayerBar() {
  const track = usePlayer((s) => s.queue[s.index] ?? null);
  const playing = usePlayer((s) => s.playing);
  const shuffle = usePlayer((s) => s.shuffle);
  const repeat = usePlayer((s) => s.repeat);
  const volume = usePlayer((s) => s.volume);
  const muted = usePlayer((s) => s.muted);
  const progress = usePlayer((s) => s.progress);
  const duration = usePlayer((s) => s.duration);
  const toggle = usePlayer((s) => s.toggle);
  const next = usePlayer((s) => s.next);
  const prev = usePlayer((s) => s.prev);
  const toggleShuffle = usePlayer((s) => s.toggleShuffle);
  const cycleRepeat = usePlayer((s) => s.cycleRepeat);
  const setVolume = usePlayer((s) => s.setVolume);
  const toggleMute = usePlayer((s) => s.toggleMute);
  const setFullOpen = usePlayer((s) => s.setFullOpen);
  const setQueueOpen = usePlayer((s) => s.setQueueOpen);
  const queueOpen = usePlayer((s) => s.queueOpen);
  const liked = useLibrary((s) => (track ? Boolean(s.liked[track.id]) : false));
  const toggleLike = useLibrary((s) => s.toggleLike);

  if (!track) return null;

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <>
      {/* Mobile mini player */}
      <div className="fixed right-0 bottom-nav left-0 z-40 border-t border-border bg-player md:hidden">
        <div className="h-0.5 bg-fg/15">
          <div className="h-full bg-fg" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex h-14 items-center gap-3 px-3">
          <button
            type="button"
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
            onClick={() => setFullOpen(true)}
          >
            <img src={track.cover} alt="" className="cover size-10 rounded-xs object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{track.title}</p>
              <p className="truncate text-xs text-muted">{track.artist}</p>
            </div>
          </button>
          <button
            type="button"
            aria-label={liked ? "Unlike" : "Like"}
            onClick={() => toggleLike(track)}
            className={cn(
              "inline-flex size-11 items-center justify-center",
              liked && "text-accent",
            )}
          >
            <Heart className={cn("size-5", liked && "fill-current")} />
          </button>
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={toggle}
            className="inline-flex size-11 items-center justify-center"
          >
            {playing ? (
              <Pause className="size-6 fill-fg" />
            ) : (
              <Play className="size-6 fill-fg" style={{ marginLeft: 2 }} />
            )}
          </button>
        </div>
      </div>

      {/* Desktop player */}
      <div className="fixed right-0 bottom-0 left-0 z-40 hidden h-bar border-t border-border bg-player md:block">
        <div className="grid h-full grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,1.1fr)] items-center gap-4 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setFullOpen(true)} className="shrink-0">
              <img src={track.cover} alt="" className="cover size-14 rounded-xs object-cover" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{track.title}</p>
              <p className="truncate text-xs text-muted">{track.artist}</p>
            </div>
            <button
              type="button"
              aria-label={liked ? "Unlike" : "Like"}
              onClick={() => toggleLike(track)}
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-full hover:bg-chip",
                liked && "text-accent",
              )}
            >
              <Heart className={cn("size-4", liked && "fill-current")} />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-1">
              <Tooltip content={shuffle ? "Shuffle on" : "Shuffle"}>
                <button
                  type="button"
                  aria-label="Shuffle"
                  onClick={toggleShuffle}
                  className={cn(
                    "inline-flex size-10 items-center justify-center rounded-full hover:bg-chip",
                    shuffle && "text-fg",
                    !shuffle && "text-muted",
                  )}
                >
                  <Shuffle className="size-4" />
                </button>
              </Tooltip>
              <button
                type="button"
                aria-label="Previous"
                onClick={prev}
                className="inline-flex size-10 items-center justify-center rounded-full hover:bg-chip"
              >
                <SkipBack className="size-5 fill-current" />
              </button>
              <button
                type="button"
                aria-label={playing ? "Pause" : "Play"}
                onClick={toggle}
                className="inline-flex size-12 items-center justify-center rounded-full bg-fg text-bg hover:opacity-90"
              >
                {playing ? (
                  <Pause className="size-5 fill-current" />
                ) : (
                  <Play className="size-5 fill-current" style={{ marginLeft: 2 }} />
                )}
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={next}
                className="inline-flex size-10 items-center justify-center rounded-full hover:bg-chip"
              >
                <SkipForward className="size-5 fill-current" />
              </button>
              <Tooltip content={repeat === "one" ? "Repeat one" : repeat === "all" ? "Repeat all" : "Repeat"}>
                <button
                  type="button"
                  aria-label="Repeat"
                  onClick={cycleRepeat}
                  className={cn(
                    "inline-flex size-10 items-center justify-center rounded-full hover:bg-chip",
                    repeat === "off" ? "text-muted" : "text-fg",
                  )}
                >
                  {repeat === "one" ? (
                    <Repeat1 className="size-4" />
                  ) : (
                    <Repeat className="size-4" />
                  )}
                </button>
              </Tooltip>
            </div>
            <div className="w-full max-w-xl">
              <SeekBar />
            </div>
          </div>

          <div className="flex items-center justify-end gap-0.5">
            <span className="mr-1 rounded-full bg-chip px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted uppercase">
              Preview
            </span>
            <Tooltip content="Queue">
              <button
                type="button"
                aria-label="Queue"
                onClick={() => setQueueOpen(!queueOpen)}
                className={cn(
                  "inline-flex size-10 items-center justify-center rounded-full hover:bg-chip",
                  queueOpen && "text-fg",
                )}
              >
                <ListMusic className="size-4" />
              </button>
            </Tooltip>
            <Tooltip content="Cast">
              <button
                type="button"
                aria-label="Cast"
                className="inline-flex size-10 items-center justify-center rounded-full text-muted hover:bg-chip"
              >
                <Cast className="size-4" />
              </button>
            </Tooltip>
            <button
              type="button"
              aria-label={muted ? "Unmute" : "Mute"}
              onClick={toggleMute}
              className="inline-flex size-10 items-center justify-center rounded-full hover:bg-chip"
            >
              {muted || volume === 0 ? (
                <VolumeX className="size-4" />
              ) : (
                <Volume2 className="size-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume"
              className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-fg/20 accent-fg"
            />
            <Tooltip content="Now playing">
              <button
                type="button"
                aria-label="Expand player"
                onClick={() => setFullOpen(true)}
                className="inline-flex size-10 items-center justify-center rounded-full hover:bg-chip"
              >
                <Maximize2 className="size-4" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
}
