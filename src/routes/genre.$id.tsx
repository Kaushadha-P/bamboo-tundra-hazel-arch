import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { HScroll, MediaCard, Section } from "@/components/music/media-card";
import { ErrorState, FeedSkeleton, Page, PageHeader } from "@/components/music/page";
import { TrackRow } from "@/components/music/track-row";
import { Button } from "@/components/ui/button";
import { getGenre } from "@/lib/music/api";
import { usePlayer } from "@/lib/music/player-store";

export const Route = createFileRoute("/genre/$id")({ component: GenrePage });

function GenrePage() {
  const { id } = Route.useParams();
  const playTracks = usePlayer((s) => s.playTracks);
  const q = useQuery({
    queryKey: ["genre", id],
    queryFn: () => getGenre({ data: { id } }),
  });

  if (q.isLoading) return <FeedSkeleton />;
  if (q.isError || !q.data) {
    return <ErrorState message="This genre couldn't be loaded." onRetry={() => void q.refetch()} />;
  }

  const { genre, artists, tracks } = q.data;

  return (
    <Page>
      <PageHeader
        kicker="Genre"
        title={genre.name}
        actions={
          <Button onClick={() => playTracks(tracks, 0)} disabled={!tracks.length}>
            <Play className="size-4 fill-current" style={{ marginLeft: 1 }} />
            Play
          </Button>
        }
      />
      {artists.length ? (
        <Section title="Artists">
          <HScroll>
            {artists.map((a) => (
              <MediaCard
                key={a.id}
                href={`/artist/${a.id}`}
                image={a.pictureLg || a.picture}
                title={a.name}
                circle
              />
            ))}
          </HScroll>
        </Section>
      ) : null}
      {tracks.length ? (
        <Section title="Top tracks">
          {tracks.map((t, i) => (
            <TrackRow key={t.id} track={t} queue={tracks} index={i} numbered />
          ))}
        </Section>
      ) : null}
    </Page>
  );
}
