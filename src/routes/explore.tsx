import { createFileRoute, Link } from "@tanstack/react-router";
import { HScroll, MediaCard, Section } from "@/components/music/media-card";
import { Page, PageHeader } from "@/components/music/page";
import { TrackRow } from "@/components/music/track-row";
import { getHomeFeed } from "@/lib/music/api";
import { MOODS } from "@/lib/music/types";

export const Route = createFileRoute("/explore")({
  loader: () => getHomeFeed(),
  component: Explore,
});

function Explore() {
  const feed = Route.useLoaderData();
  const { charts, albums, artists, playlists, radios, genres } = feed;

  return (
    <Page>
      <PageHeader
        kicker="Discover"
        title="Explore"
        subtitle="New releases, charts, moods, and radio from a worldwide catalog."
      />

      <Section title="New albums & singles">
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

      <Section title="Top songs">
        <div className="grid gap-1 sm:grid-cols-2">
          {charts.slice(0, 10).map((t, i) => (
            <TrackRow key={t.id} track={t} queue={charts} index={i} numbered showAlbum={false} />
          ))}
        </div>
      </Section>

      <Section title="Moods & genres">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {MOODS.map((m) => (
            <Link
              key={m.id}
              to="/mood/$id"
              params={{ id: m.id }}
              className="flex h-24 flex-col justify-end rounded-md bg-elevated px-4 py-3 hover:bg-chip"
            >
              <span className="font-display text-lg font-semibold">{m.title}</span>
              <span className="text-xs text-muted">Mix</span>
            </Link>
          ))}
          {genres.slice(0, 8).map((g) => (
            <Link
              key={g.id}
              to="/genre/$id"
              params={{ id: g.id }}
              className="flex h-24 items-end overflow-hidden rounded-md bg-elevated px-4 py-3 hover:bg-chip"
            >
              <span className="font-display text-lg font-semibold">{g.name}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Featured playlists">
        <HScroll>
          {playlists.map((p) => (
            <MediaCard
              key={p.id}
              href={`/playlist/${p.id}`}
              image={p.coverLg || p.cover}
              title={p.title}
              subtitle={p.creator}
            />
          ))}
        </HScroll>
      </Section>

      <Section title="Trending artists">
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

      <Section title="Radio stations">
        <HScroll>
          {radios.map((r) => (
            <MediaCard
              key={r.id}
              href={`/radio/${r.id}`}
              image={r.pictureLg || r.picture}
              title={r.title}
              subtitle="Live radio"
              circle
            />
          ))}
        </HScroll>
      </Section>
    </Page>
  );
}
