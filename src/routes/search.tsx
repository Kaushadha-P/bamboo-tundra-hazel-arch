import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { HScroll, MediaCard, Section } from "@/components/music/media-card";
import { ErrorState, FeedSkeleton, Page, PageHeader } from "@/components/music/page";
import { TrackRow } from "@/components/music/track-row";
import { searchCatalog } from "@/lib/music/api";
import { usePlayer } from "@/lib/music/player-store";

type Search = { q: string };

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : "",
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const playTracks = usePlayer((s) => s.playTracks);
  const results = useQuery({
    queryKey: ["search", q],
    enabled: q.trim().length > 0,
    queryFn: () => searchCatalog({ data: { q: q.trim() } }),
  });

  if (!q.trim()) {
    return (
      <Page>
        <PageHeader
          title="Search"
          subtitle="Find any song, album, artist, or playlist in the worldwide catalog."
        />
      </Page>
    );
  }

  if (results.isLoading) return <FeedSkeleton />;
  if (results.isError || !results.data) {
    return <ErrorState message="Search is unavailable right now." onRetry={() => void results.refetch()} />;
  }

  const { tracks, albums, artists, playlists } = results.data;
  const empty = !tracks.length && !albums.length && !artists.length && !playlists.length;

  return (
    <Page>
      <PageHeader title={`Results for “${q}”`} subtitle="Songs, albums, artists, playlists" />
      {empty ? <p className="text-sm text-muted">No matches. Try another name or lyric-like phrase.</p> : null}

      {tracks.length ? (
        <Section title="Songs">
          <div>
            {tracks.slice(0, 20).map((t) => (
              <TrackRow key={t.id} track={t} queue={tracks} />
            ))}
          </div>
        </Section>
      ) : null}

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

      {albums.length ? (
        <Section title="Albums">
          <HScroll>
            {albums.map((a) => (
              <MediaCard
                key={a.id}
                href={`/album/${a.id}`}
                image={a.coverLg || a.cover}
                title={a.title}
                subtitle={a.artist}
              />
            ))}
          </HScroll>
        </Section>
      ) : null}

      {playlists.length ? (
        <Section title="Playlists">
          <HScroll>
            {playlists.map((p) => (
              <MediaCard
                key={p.id}
                href={`/playlist/${p.id}`}
                image={p.coverLg || p.cover}
                title={p.title}
                subtitle={p.creator}
                onPlay={() => tracks.length && playTracks(tracks, 0)}
              />
            ))}
          </HScroll>
        </Section>
      ) : null}
    </Page>
  );
}
