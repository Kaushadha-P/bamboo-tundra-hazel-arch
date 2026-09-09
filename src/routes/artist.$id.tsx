import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Play, Radio, Shuffle } from "lucide-react";
import { HScroll, MediaCard, Section } from "@/components/music/media-card";
import { ErrorState, FeedSkeleton, Page } from "@/components/music/page";
import { TrackRow } from "@/components/music/track-row";
import { Button } from "@/components/ui/button";
import { getArtist } from "@/lib/music/api";
import { usePlayer } from "@/lib/music/player-store";
import { formatFans } from "@/lib/utils";

export const Route = createFileRoute("/artist/$id")({ component: ArtistPage });

function ArtistPage() {
  const { id } = Route.useParams();
  const playTracks = usePlayer((s) => s.playTracks);
  const q = useQuery({
    queryKey: ["artist", id],
    queryFn: () => getArtist({ data: { id } }),
  });

  if (q.isLoading) return <FeedSkeleton />;
  if (q.isError || !q.data) {
    return <ErrorState message="This artist couldn't be loaded." onRetry={() => void q.refetch()} />;
  }

  const { artist, top, albums, related, radio } = q.data;

  return (
    <Page>
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end">
        <img
          src={artist.pictureLg || artist.picture}
          alt=""
          className="cover size-40 rounded-full object-cover sm:size-52"
        />
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Artist</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {artist.name}
          </h1>
          {artist.fans ? (
            <p className="mt-2 text-sm text-muted">{formatFans(artist.fans)} monthly listeners</p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => playTracks(top.length ? top : radio, 0)} disabled={!top.length && !radio.length}>
              <Play className="size-4 fill-current" style={{ marginLeft: 1 }} />
              Play
            </Button>
            <Button
              variant="chip"
              onClick={() => {
                usePlayer.getState().toggleShuffle();
                playTracks(top.length ? top : radio, 0);
              }}
            >
              <Shuffle className="size-4" /> Shuffle
            </Button>
            {radio.length ? (
              <Button variant="chip" onClick={() => playTracks(radio, 0)}>
                <Radio className="size-4" /> Radio
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {top.length ? (
        <Section title="Popular">
          {top.slice(0, 10).map((t, i) => (
            <TrackRow key={t.id} track={t} queue={top} index={i} numbered />
          ))}
        </Section>
      ) : null}

      {albums.length ? (
        <Section title="Albums">
          <HScroll>
            {albums.map((a) => (
              <MediaCard
                key={a.id}
                href={`/album/${a.id}`}
                image={a.coverLg || a.cover}
                title={a.title}
                subtitle={a.year || artist.name}
              />
            ))}
          </HScroll>
        </Section>
      ) : null}

      {related.length ? (
        <Section title="Fans also like">
          <HScroll>
            {related.map((a) => (
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
    </Page>
  );
}
