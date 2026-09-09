import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, Shuffle } from "lucide-react";
import { ErrorState, FeedSkeleton, Page } from "@/components/music/page";
import { TrackRow } from "@/components/music/track-row";
import { Button } from "@/components/ui/button";
import { getAlbum } from "@/lib/music/api";
import { usePlayer } from "@/lib/music/player-store";

export const Route = createFileRoute("/album/$id")({ component: AlbumPage });

function AlbumPage() {
  const { id } = Route.useParams();
  const playTracks = usePlayer((s) => s.playTracks);
  const q = useQuery({
    queryKey: ["album", id],
    queryFn: () => getAlbum({ data: { id } }),
  });

  if (q.isLoading) return <FeedSkeleton />;
  if (q.isError || !q.data) {
    return <ErrorState message="This album couldn't be loaded." onRetry={() => void q.refetch()} />;
  }

  const { album, tracks } = q.data;

  return (
    <Page>
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end">
        <img
          src={album.coverLg || album.cover}
          alt=""
          className="cover size-44 rounded-md object-cover sm:size-56"
        />
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Album</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            {album.title}
          </h1>
          <p className="mt-2 text-sm text-muted">
            <Link to="/artist/$id" params={{ id: album.artistId }} className="hover:underline">
              {album.artist}
            </Link>
            {album.year ? ` · ${album.year}` : ""}
            {album.trackCount ? ` · ${album.trackCount} songs` : ""}
          </p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => playTracks(tracks, 0)} disabled={!tracks.length}>
              <Play className="size-4 fill-current" style={{ marginLeft: 1 }} />
              Play
            </Button>
            <Button variant="chip" onClick={() => playTracks(tracks, Math.floor(Math.random() * Math.max(tracks.length, 1)))}>
              <Shuffle className="size-4" /> Shuffle
            </Button>
          </div>
        </div>
      </div>
      <div>
        {tracks.map((t, i) => (
          <TrackRow key={t.id} track={t} queue={tracks} index={i} numbered showAlbum={false} />
        ))}
        {tracks.length === 0 ? (
          <p className="py-8 text-sm text-muted">No playable previews on this album.</p>
        ) : null}
      </div>
    </Page>
  );
}
