import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Play, Shuffle, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { ErrorState, FeedSkeleton, Page } from "@/components/music/page";
import { TrackRow } from "@/components/music/track-row";
import { Button } from "@/components/ui/button";
import { getPlaylist } from "@/lib/music/api";
import { useLibrary } from "@/lib/music/library-store";
import { usePlayer } from "@/lib/music/player-store";
import type { Track } from "@/lib/music/types";

export const Route = createFileRoute("/playlist/$id")({ component: PlaylistPage });

function PlaylistPage() {
  const { id } = Route.useParams();
  const local = useLibrary((s) => s.playlists.find((p) => p.id === id));
  const deletePlaylist = useLibrary((s) => s.deletePlaylist);
  const playTracks = usePlayer((s) => s.playTracks);

  const remote = useQuery({
    queryKey: ["playlist", id],
    enabled: !id.startsWith("local-"),
    queryFn: () => getPlaylist({ data: { id } }),
  });

  if (id.startsWith("local-")) {
    if (!local) {
      return <ErrorState message="This playlist was deleted or isn't on this device." />;
    }
    return (
      <Hero
        kicker="Playlist"
        title={local.title}
        subtitle={`${local.tracks.length} songs · Private`}
        cover={local.tracks[0]?.coverLg || local.tracks[0]?.cover}
        tracks={local.tracks}
        extra={
          <Button variant="chip" onClick={() => deletePlaylist(local.id)}>
            <Trash2 className="size-4" /> Delete
          </Button>
        }
      />
    );
  }

  if (remote.isLoading) return <FeedSkeleton />;
  if (remote.isError || !remote.data) {
    return (
      <ErrorState message="This playlist couldn't be loaded." onRetry={() => void remote.refetch()} />
    );
  }

  const { playlist, tracks } = remote.data;
  return (
    <Hero
      kicker="Playlist"
      title={playlist.title}
      subtitle={`${playlist.creator}${playlist.trackCount ? ` · ${playlist.trackCount} songs` : ""}`}
      cover={playlist.coverLg || playlist.cover}
      tracks={tracks}
    />
  );
}

function Hero({
  kicker,
  title,
  subtitle,
  cover,
  tracks,
  extra,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  cover?: string;
  tracks: Track[];
  extra?: ReactNode;
}) {
  const playTracks = usePlayer((s) => s.playTracks);
  return (
    <Page>
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end">
        {cover ? (
          <img src={cover} alt="" className="cover size-44 rounded-md object-cover sm:size-56" />
        ) : (
          <div className="size-44 rounded-md bg-chip sm:size-56" />
        )}
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">{kicker}</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => playTracks(tracks, 0)} disabled={!tracks.length}>
              <Play className="size-4 fill-current" style={{ marginLeft: 1 }} />
              Play
            </Button>
            <Button
              variant="chip"
              onClick={() => playTracks(tracks, 0)}
              disabled={!tracks.length}
            >
              <Shuffle className="size-4" /> Shuffle
            </Button>
            {extra}
          </div>
        </div>
      </div>
      <div>
        {tracks.map((t, i) => (
          <TrackRow key={t.id} track={t} queue={tracks} index={i} numbered />
        ))}
        {tracks.length === 0 ? (
          <p className="py-8 text-sm text-muted">This playlist is empty.</p>
        ) : null}
      </div>
    </Page>
  );
}
