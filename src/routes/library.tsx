import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Page, PageHeader } from "@/components/music/page";
import { TrackRow } from "@/components/music/track-row";
import { Button } from "@/components/ui/button";
import { useLibrary } from "@/lib/music/library-store";
import { usePlayer } from "@/lib/music/player-store";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/library")({ component: LibraryPage });

const TABS = ["playlists", "songs", "albums", "artists", "downloads"] as const;
type Tab = (typeof TABS)[number];

function LibraryPage() {
  const [tab, setTab] = useState<Tab>("playlists");
  const liked = useLibrary((s) => Object.values(s.liked));
  const recents = useLibrary((s) => s.recents);
  const downloads = useLibrary((s) => Object.values(s.downloads));
  const playlists = useLibrary((s) => s.playlists);
  const createPlaylist = useLibrary((s) => s.createPlaylist);
  const playTracks = usePlayer((s) => s.playTracks);
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <Page>
        <PageHeader kicker="Yours" title="Library" subtitle="Loading your collection…" />
      </Page>
    );
  }

  const albums = uniqueBy(
    [...liked, ...recents, ...downloads].filter((t) => t.albumId),
    (t) => t.albumId,
  );
  const artists = uniqueBy(
    [...liked, ...recents, ...downloads].filter((t) => t.artistId),
    (t) => t.artistId,
  );

  return (
    <Page>
      <PageHeader
        kicker="Yours"
        title="Library"
        subtitle="Liked songs, playlists, downloads, and recents — saved on this device."
        actions={
          <Button
            variant="chip"
            onClick={() => createPlaylist(`Playlist ${playlists.length + 1}`)}
          >
            New playlist
          </Button>
        }
      />

      <div className="hide-scroll flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "h-9 shrink-0 rounded-full px-4 text-sm capitalize",
              tab === t ? "bg-fg text-bg" : "bg-chip text-fg hover:bg-hover",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "playlists" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <button
            type="button"
            onClick={() => liked.length && playTracks(liked, 0)}
            className="overflow-hidden rounded-md bg-elevated text-left hover:bg-chip"
          >
            <div className="flex aspect-square items-center justify-center bg-accent/90 p-4">
              <span className="font-display text-2xl font-semibold text-accent-fg">Liked</span>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium">Liked music</p>
              <p className="text-xs text-muted">
                {liked.length} song{liked.length === 1 ? "" : "s"} · Auto playlist
              </p>
            </div>
          </button>
          {playlists.map((p) => (
            <Link
              key={p.id}
              to="/playlist/$id"
              params={{ id: p.id }}
              className="overflow-hidden rounded-md bg-elevated hover:bg-chip"
            >
              <div className="grid aspect-square grid-cols-2 bg-chip">
                {p.tracks.slice(0, 4).map((t) => (
                  <img key={t.id} src={t.cover} alt="" className="size-full object-cover" />
                ))}
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium">{p.title}</p>
                <p className="text-xs text-muted">{p.tracks.length} songs</p>
              </div>
            </Link>
          ))}
        </div>
      ) : null}

      {tab === "songs" ? (
        <div>
          {liked.length === 0 && recents.length === 0 ? (
            <Empty text="Like a song or play something — it lands here." />
          ) : (
            (liked.length ? liked : recents).map((t) => (
              <TrackRow key={t.id} track={t} queue={liked.length ? liked : recents} />
            ))
          )}
        </div>
      ) : null}

      {tab === "albums" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {albums.length === 0 ? (
            <Empty text="Albums you play will collect here." />
          ) : (
            albums.map((t) => (
              <Link key={t.albumId} to="/album/$id" params={{ id: t.albumId }} className="min-w-0">
                <img
                  src={t.coverLg || t.cover}
                  alt=""
                  className="cover aspect-square w-full rounded-md object-cover"
                />
                <p className="mt-2 truncate text-sm font-medium">{t.album}</p>
                <p className="truncate text-xs text-muted">{t.artist}</p>
              </Link>
            ))
          )}
        </div>
      ) : null}

      {tab === "artists" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {artists.length === 0 ? (
            <Empty text="Artists you play will collect here." />
          ) : (
            artists.map((t) => (
              <Link
                key={t.artistId}
                to="/artist/$id"
                params={{ id: t.artistId }}
                className="min-w-0 text-center"
              >
                <img
                  src={t.coverLg || t.cover}
                  alt=""
                  className="cover mx-auto aspect-square w-full rounded-full object-cover"
                />
                <p className="mt-2 truncate text-sm font-medium">{t.artist}</p>
              </Link>
            ))
          )}
        </div>
      ) : null}

      {tab === "downloads" ? (
        <div>
          {downloads.length === 0 ? (
            <Empty text="Premium downloads appear here. Tap download on any track." />
          ) : (
            downloads.map((t) => <TrackRow key={t.id} track={t} queue={downloads} />)
          )}
        </div>
      ) : null}
    </Page>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="col-span-full py-10 text-sm text-muted">{text}</p>;
}

function uniqueBy<T>(arr: T[], key: (t: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of arr) {
    const k = key(item);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}
