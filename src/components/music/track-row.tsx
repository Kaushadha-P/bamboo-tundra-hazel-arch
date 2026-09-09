import { Link } from "@tanstack/react-router";
import {
  Download,
  Heart,
  ListPlus,
  MoreVertical,
  Pause,
  Play,
  Plus,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLibrary } from "@/lib/music/library-store";
import { usePlayer } from "@/lib/music/player-store";
import type { Track } from "@/lib/music/types";
import { cn, formatTime } from "@/lib/utils";

export function TrackRow({
  track,
  queue,
  index,
  showAlbum = true,
  numbered = false,
}: {
  track: Track;
  queue?: Track[];
  index?: number;
  showAlbum?: boolean;
  numbered?: boolean;
}) {
  const current = usePlayer((s) => s.queue[s.index]);
  const playing = usePlayer((s) => s.playing);
  const playTracks = usePlayer((s) => s.playTracks);
  const toggle = usePlayer((s) => s.toggle);
  const playNext = usePlayer((s) => s.playNext);
  const addToQueue = usePlayer((s) => s.addToQueue);
  const liked = useLibrary((s) => Boolean(s.liked[track.id]));
  const downloaded = useLibrary((s) => Boolean(s.downloads[track.id]));
  const toggleLike = useLibrary((s) => s.toggleLike);
  const toggleDownload = useLibrary((s) => s.toggleDownload);
  const playlists = useLibrary((s) => s.playlists);
  const addToPlaylist = useLibrary((s) => s.addToPlaylist);
  const createPlaylist = useLibrary((s) => s.createPlaylist);
  const [addOpen, setAddOpen] = useState(false);

  const isCurrent = current?.id === track.id;
  const isPlaying = isCurrent && playing;

  const play = () => {
    if (isCurrent) toggle();
    else if (queue) playTracks(queue, queue.findIndex((t) => t.id === track.id));
    else playTracks([track], 0);
  };

  return (
    <div
      className={cn(
        "group grid items-center gap-3 rounded-md px-2 py-1.5 hover:bg-chip",
        "grid-cols-[auto_minmax(0,1fr)_auto] sm:grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_auto]",
        isCurrent && "bg-chip",
      )}
    >
      <button
        type="button"
        onClick={play}
        className="relative size-12 shrink-0 overflow-hidden rounded-xs"
        aria-label={isPlaying ? "Pause" : `Play ${track.title}`}
      >
        <img src={track.cover} alt="" className="cover size-full object-cover" />
        <span className="absolute inset-0 flex items-center justify-center bg-bg/50 opacity-0 transition-opacity duration-150 group-hover:opacity-100 max-sm:opacity-100">
          {isPlaying ? (
            <Pause className="size-4 fill-fg text-fg" />
          ) : (
            <Play className="size-4 fill-fg text-fg" style={{ marginLeft: 2 }} />
          )}
        </span>
        {numbered && index !== undefined ? (
          <span className="absolute top-0 left-0 hidden size-5 items-center justify-center bg-bg/70 text-[10px] text-muted group-hover:hidden sm:flex">
            {index + 1}
          </span>
        ) : null}
      </button>

      <div className="min-w-0">
        <p className={cn("truncate text-sm font-medium", isCurrent && "text-accent")}>
          {track.title}
          {track.explicit ? (
            <span className="ml-1.5 inline-flex size-4 items-center justify-center rounded-xs bg-muted/30 text-[9px] font-semibold text-muted">
              E
            </span>
          ) : null}
        </p>
        <Link
          to="/artist/$id"
          params={{ id: track.artistId }}
          className="truncate text-xs text-muted hover:underline"
        >
          {track.artist}
        </Link>
      </div>

      {showAlbum ? (
        <Link
          to="/album/$id"
          params={{ id: track.albumId }}
          className="hidden min-w-0 truncate text-sm text-muted hover:underline sm:block"
        >
          {track.album}
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}

      <div className="flex items-center gap-0.5">
        <button
          type="button"
          aria-label={liked ? "Unlike" : "Like"}
          onClick={() => toggleLike(track)}
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-full opacity-0 hover:bg-hover group-hover:opacity-100 max-sm:opacity-100",
            liked && "opacity-100 text-accent",
          )}
        >
          <Heart className={cn("size-4", liked && "fill-current")} />
        </button>
        <span className="hidden w-10 text-right text-xs text-muted tabular-nums sm:inline">
          {formatTime(track.duration)}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="More"
              className="inline-flex size-10 items-center justify-center rounded-full hover:bg-hover"
            >
              <MoreVertical className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => playNext(track)}>
              <Plus className="size-4" /> Play next
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => addToQueue(track)}>
              <ListPlus className="size-4" /> Add to queue
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setAddOpen(true)}>
              <ListPlus className="size-4" /> Add to playlist
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toggleLike(track)}>
              <Heart className={cn("size-4", liked && "fill-current")} />
              {liked ? "Remove from likes" : "Save to likes"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => toggleDownload(track)}>
              <Download className="size-4" />
              {downloaded ? "Remove download" : "Download"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent title="Add to playlist">
          <button
            type="button"
            className="mb-2 flex h-11 w-full items-center rounded-md bg-chip px-3 text-sm hover:bg-hover"
            onClick={() => {
              createPlaylist(`${track.title} mix`, [track]);
              setAddOpen(false);
            }}
          >
            New playlist
          </button>
          <div className="max-h-64 space-y-1 overflow-auto">
            {playlists.map((p) => (
              <button
                key={p.id}
                type="button"
                className="flex h-11 w-full items-center rounded-md px-3 text-left text-sm hover:bg-chip"
                onClick={() => {
                  addToPlaylist(p.id, track);
                  setAddOpen(false);
                }}
              >
                {p.title}
              </button>
            ))}
            {playlists.length === 0 ? (
              <p className="px-1 py-4 text-sm text-muted">No playlists yet.</p>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
