import { X } from "lucide-react";
import { TrackRow } from "@/components/music/track-row";
import { usePlayer } from "@/lib/music/player-store";

export function QueuePanel() {
  const open = usePlayer((s) => s.queueOpen);
  const setOpen = usePlayer((s) => s.setQueueOpen);
  const queue = usePlayer((s) => s.queue);
  const index = usePlayer((s) => s.index);
  const clearQueue = usePlayer((s) => s.clearQueue);

  if (!open) return null;

  const current = queue[index];
  const upNext = queue.slice(index + 1);

  return (
    <aside className="fixed top-14 right-0 bottom-bar z-40 hidden w-96 flex-col border-l border-border bg-surface md:flex">
      <div className="flex h-14 items-center justify-between px-4">
        <h2 className="font-display text-base font-semibold">Queue</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-full px-3 py-1 text-xs text-muted hover:bg-chip hover:text-fg"
            onClick={clearQueue}
          >
            Clear
          </button>
          <button
            type="button"
            aria-label="Close queue"
            onClick={() => setOpen(false)}
            className="inline-flex size-10 items-center justify-center rounded-full hover:bg-chip"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto px-2 pb-4">
        {current ? (
          <div className="mb-4">
            <p className="px-2 pb-1 text-xs font-medium tracking-wide text-muted uppercase">
              Now playing
            </p>
            <TrackRow track={current} queue={queue} showAlbum={false} />
          </div>
        ) : null}
        {upNext.length ? (
          <div>
            <p className="px-2 pb-1 text-xs font-medium tracking-wide text-muted uppercase">
              Next
            </p>
            {upNext.map((t, i) => (
              <TrackRow key={`${t.id}-${i}`} track={t} queue={queue} showAlbum={false} />
            ))}
          </div>
        ) : (
          <p className="px-3 py-6 text-sm text-muted">No upcoming tracks.</p>
        )}
      </div>
    </aside>
  );
}
