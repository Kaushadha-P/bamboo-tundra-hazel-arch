import { createFileRoute, Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { HScroll, MediaCard, Section } from "@/components/music/media-card";
import { ErrorState, Page } from "@/components/music/page";
import { TrackRow } from "@/components/music/track-row";
import { Button } from "@/components/ui/button";
import { getHomeFeed } from "@/lib/music/api";
import { useLibrary } from "@/lib/music/library-store";
import { usePlayer } from "@/lib/music/player-store";
import { MOODS } from "@/lib/music/types";
import { useHydrated } from "@/lib/use-hydrated";

export const Route = createFileRoute("/")({
  loader: () => getHomeFeed(),
  component: Home,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Late night mix";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 22) return "Good evening";
  return "Night drive";
}

function Home() {
  const feed = Route.useLoaderData();
  const recents = useLibrary((s) => s.recents);
  const playTracks = usePlayer((s) => s.playTracks);
  const hydrated = useHydrated();
  const [hello, setHello] = useState("Welcome back");

  useEffect(() => setHello(greeting()), []);

  if (!feed) {
    return (
      <ErrorState message="The catalog is taking a moment. Try again." />
    );
  }

  const { charts, albums, artists, playlists, radios, mixes } = feed;
  const quick = charts.slice(0, 12);

  return (
    <Page className="stagger-in">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Pulse Premium</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {hello}
          </h1>
        </div>
        {charts.length ? (
          <Button onClick={() => playTracks(charts, 0)}>
            <Play className="size-4 fill-current" style={{ marginLeft: 1 }} />
            Play charts
          </Button>
        ) : null}
      </div>

      {hydrated && recents.length ? (
        <Section title="Listen again" subtitle="Pick up where you left off">
          <HScroll>
            {recents.slice(0, 12).map((t) => (
              <MediaCard
                key={t.id}
                href={`/album/${t.albumId}`}
                image={t.coverLg || t.cover}
                title={t.title}
                subtitle={t.artist}
                onPlay={() => playTracks([t, ...recents], 0)}
              />
            ))}
          </HScroll>
        </Section>
      ) : null}

      {quick.length ? (
        <Section title="Quick picks" subtitle="Start radio from any row">
          <div className="grid gap-1 sm:grid-cols-2">
            {quick.map((t) => (
              <TrackRow key={t.id} track={t} queue={charts} showAlbum={false} />
            ))}
          </div>
        </Section>
      ) : null}

      {mixes.map((mix) =>
        mix.tracks.length ? (
          <Section key={mix.id} title={mix.title} subtitle={mix.subtitle}>
            <HScroll>
              {mix.tracks.map((t) => (
                <MediaCard
                  key={t.id}
                  href={`/album/${t.albumId}`}
                  image={t.coverLg || t.cover}
                  title={t.title}
                  subtitle={t.artist}
                  onPlay={() => playTracks(mix.tracks, mix.tracks.indexOf(t))}
                />
              ))}
            </HScroll>
          </Section>
        ) : null,
      )}

      {albums.length ? (
        <Section title="New albums for you">
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

      {artists.length ? (
        <Section title="Your favorite artists">
          <HScroll>
            {artists.map((a) => (
              <MediaCard
                key={a.id}
                href={`/artist/${a.id}`}
                image={a.pictureLg || a.picture}
                title={a.name}
                subtitle={a.fans ? `${Math.round(a.fans / 1000)}K followers` : "Artist"}
                circle
              />
            ))}
          </HScroll>
        </Section>
      ) : null}

      {playlists.length ? (
        <Section title="Playlists for you">
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
      ) : null}

      <Section title="Moods & genres">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {MOODS.map((m) => (
            <Link
              key={m.id}
              to="/mood/$id"
              params={{ id: m.id }}
              className="flex h-20 items-end rounded-md bg-elevated px-4 py-3 text-base font-semibold hover:bg-chip"
            >
              {m.title}
            </Link>
          ))}
        </div>
      </Section>

      {radios.length ? (
        <Section title="Radio">
          <HScroll>
            {radios.map((r) => (
              <MediaCard
                key={r.id}
                href={`/radio/${r.id}`}
                image={r.pictureLg || r.picture}
                title={r.title}
                subtitle="Radio"
                circle
              />
            ))}
          </HScroll>
        </Section>
      ) : null}
    </Page>
  );
}
