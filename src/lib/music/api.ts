import { createServerFn } from "@tanstack/react-start";
import type {
  Album,
  Artist,
  Genre,
  HomeFeed,
  Lyrics,
  PlaylistRef,
  RadioStation,
  SearchResults,
  Track,
} from "./types";

type DzTrack = {
  id: number;
  title?: string;
  title_short?: string;
  duration?: number;
  preview?: string;
  explicit_lyrics?: boolean;
  md5_image?: string;
  artist?: { id?: number; name?: string; picture_medium?: string; picture_xl?: string };
  album?: { id?: number; title?: string; cover_medium?: string; cover_xl?: string; md5_image?: string };
};

type DzAlbum = {
  id: number;
  title?: string;
  cover_medium?: string;
  cover_xl?: string;
  md5_image?: string;
  nb_tracks?: number;
  release_date?: string;
  artist?: { id?: number; name?: string };
  tracks?: { data?: DzTrack[] };
};

type DzArtist = {
  id: number;
  name?: string;
  picture_medium?: string;
  picture_xl?: string;
  nb_fan?: number;
};

type DzPlaylist = {
  id: number;
  title?: string;
  picture_medium?: string;
  picture_xl?: string;
  nb_tracks?: number;
  user?: { name?: string };
  creator?: { name?: string };
  tracks?: { data?: DzTrack[] };
};

type DzRadio = {
  id: number;
  title?: string;
  picture_medium?: string;
  picture_xl?: string;
};

type DzGenre = {
  id: number;
  name?: string;
  picture_medium?: string;
};

const cache = new Map<string, { at: number; data: unknown }>();
const TTL = 8 * 60 * 1000;

function coverFromMd5(md5: string | undefined, size: number): string {
  if (!md5) return "";
  return `https://cdn-images.dzcdn.net/images/cover/${md5}/${size}x${size}-000000-80-0-0.jpg`;
}

function bump(url: string | undefined, size: "500" | "1000"): string {
  if (!url) return "";
  return url
    .replace(/\/\d+x\d+-/, `/${size}x${size}-`)
    .replace("picture_medium", "picture_xl");
}

export function mapTrack(t: DzTrack): Track | null {
  const previewUrl = t.preview ?? "";
  if (!previewUrl) return null;
  const md5 = t.md5_image || t.album?.md5_image;
  const cover =
    t.album?.cover_medium || coverFromMd5(md5, 250) || t.artist?.picture_medium || "";
  const coverLg =
    t.album?.cover_xl ||
    bump(t.album?.cover_medium, "1000") ||
    coverFromMd5(md5, 1000) ||
    t.artist?.picture_xl ||
    cover;
  return {
    id: String(t.id),
    title: t.title_short || t.title || "Unknown",
    artist: t.artist?.name || "Unknown artist",
    artistId: String(t.artist?.id ?? ""),
    album: t.album?.title || "",
    albumId: String(t.album?.id ?? ""),
    duration: t.duration ?? 30,
    previewUrl,
    playbackSource: "deezer-preview",
    cover,
    coverLg: coverLg || cover,
    explicit: Boolean(t.explicit_lyrics),
  };
}

function mapAlbum(a: DzAlbum): Album {
  const cover = a.cover_medium || coverFromMd5(a.md5_image, 250);
  const coverLg = a.cover_xl || bump(a.cover_medium, "1000") || coverFromMd5(a.md5_image, 1000) || cover;
  return {
    id: String(a.id),
    title: a.title || "Album",
    artist: a.artist?.name || "Unknown artist",
    artistId: String(a.artist?.id ?? ""),
    cover,
    coverLg,
    year: a.release_date?.slice(0, 4),
    trackCount: a.nb_tracks,
  };
}

function mapArtist(a: DzArtist): Artist {
  return {
    id: String(a.id),
    name: a.name || "Artist",
    picture: a.picture_medium || "",
    pictureLg: a.picture_xl || bump(a.picture_medium, "1000") || a.picture_medium || "",
    fans: a.nb_fan,
  };
}

function mapPlaylist(p: DzPlaylist): PlaylistRef {
  return {
    id: String(p.id),
    title: p.title || "Playlist",
    cover: p.picture_medium || "",
    coverLg: p.picture_xl || bump(p.picture_medium, "1000") || p.picture_medium || "",
    creator: p.creator?.name || p.user?.name || "Pulse",
    trackCount: p.nb_tracks,
  };
}

function mapRadio(r: DzRadio): RadioStation {
  return {
    id: String(r.id),
    title: r.title || "Radio",
    picture: r.picture_medium || r.picture_xl || "",
    pictureLg: r.picture_xl || r.picture_medium || "",
  };
}

async function dz<T>(path: string): Promise<T> {
  const url = path.startsWith("http") ? path : `https://api.deezer.com${path}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Catalog request failed (${res.status})`);
  return (await res.json()) as T;
}

async function cached<T>(key: string, ttl: number, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < ttl) return hit.data as T;
  const data = await fn();
  cache.set(key, { at: Date.now(), data });
  return data;
}

function tracksOf(data: { data?: DzTrack[] } | DzTrack[] | undefined): Track[] {
  const arr = Array.isArray(data) ? data : (data?.data ?? []);
  return arr.map(mapTrack).filter((t): t is Track => t !== null);
}

export const getHomeFeed = createServerFn({ method: "GET" }).handler(
  async (): Promise<HomeFeed> =>
    cached("home-v2", TTL, async () => {
      const [chart, radios, genres] = await Promise.all([
        dz<{ tracks?: { data?: DzTrack[] }; albums?: { data?: DzAlbum[] }; artists?: { data?: DzArtist[] }; playlists?: { data?: DzPlaylist[] } }>("/chart/0"),
        dz<{ data?: DzRadio[] }>("/radio"),
        dz<{ data?: DzGenre[] }>("/genre"),
      ]);
      const stations = (radios.data ?? []).filter((r) => r.title && !/test/i.test(r.title || ""));
      const mixStations = stations.slice(0, 6);
      const mixRaw = await Promise.all(mixStations.map((r) => dz<{ data?: DzTrack[] }>(`/radio/${r.id}/tracks?limit=16`)));
      return {
        charts: tracksOf(chart.tracks),
        albums: (chart.albums?.data ?? []).map(mapAlbum),
        artists: (chart.artists?.data ?? []).map(mapArtist),
        playlists: (chart.playlists?.data ?? []).map(mapPlaylist),
        radios: stations.slice(0, 24).map(mapRadio),
        genres: (genres.data ?? []).filter((g) => g.id !== 0 && g.name).slice(0, 24).map((g) => ({ id: String(g.id), name: g.name || "Genre", picture: g.picture_medium || "" })),
        mixes: mixRaw.map((raw, i) => ({ id: String(mixStations[i]!.id), title: `${mixStations[i]!.title} mix`, subtitle: "Made for you", tracks: tracksOf(raw) })),
      };
    }),
);

export const searchCatalog = createServerFn({ method: "GET" })
  .validator((d: { q: string }) => ({ q: String(d.q ?? "").trim().slice(0, 120) }))
  .handler(async ({ data }): Promise<SearchResults> => {
    const q = data.q;
    if (!q) return { tracks: [], albums: [], artists: [], playlists: [] };
    return cached(`search:${q.toLowerCase()}`, 5 * 60 * 1000, async () => {
      const enc = encodeURIComponent(q);
      const [tracks, albums, artists, playlists] = await Promise.all([
        dz<{ data?: DzTrack[] }>(`/search?q=${enc}&limit=40`),
        dz<{ data?: DzAlbum[] }>(`/search/album?q=${enc}&limit=16`),
        dz<{ data?: DzArtist[] }>(`/search/artist?q=${enc}&limit=16`),
        dz<{ data?: DzPlaylist[] }>(`/search/playlist?q=${enc}&limit=16`),
      ]);
      return { tracks: tracksOf(tracks), albums: (albums.data ?? []).map(mapAlbum), artists: (artists.data ?? []).map(mapArtist), playlists: (playlists.data ?? []).map(mapPlaylist) };
    });
  });

export const getTrack = createServerFn({ method: "GET" })
  .validator((d: { id: string }) => ({ id: String(d.id) }))
  .handler(async ({ data }): Promise<Track | null> => mapTrack(await dz<DzTrack>(`/track/${encodeURIComponent(data.id)}`)));

export const getAlbum = createServerFn({ method: "GET" }).validator((d: { id: string }) => ({ id: String(d.id) })).handler(async ({ data }) => cached(`album:${data.id}`, TTL, async () => {
  const raw = await dz<DzAlbum>(`/album/${encodeURIComponent(data.id)}`);
  return { album: mapAlbum(raw), tracks: tracksOf(raw.tracks) };
}));

export const getArtist = createServerFn({ method: "GET" }).validator((d: { id: string }) => ({ id: String(d.id) })).handler(async ({ data }) => cached(`artist:${data.id}`, TTL, async () => {
  const id = encodeURIComponent(data.id);
  const [artist, top, albums, related, radio] = await Promise.all([
    dz<DzArtist>(`/artist/${id}`), dz<{ data?: DzTrack[] }>(`/artist/${id}/top?limit=25`),
    dz<{ data?: DzAlbum[] }>(`/artist/${id}/albums?limit=24`), dz<{ data?: DzArtist[] }>(`/artist/${id}/related?limit=12`),
    dz<{ data?: DzTrack[] }>(`/artist/${id}/radio`),
  ]);
  return { artist: mapArtist(artist), top: tracksOf(top), albums: (albums.data ?? []).map(mapAlbum), related: (related.data ?? []).map(mapArtist), radio: tracksOf(radio) };
}));

export const getPlaylist = createServerFn({ method: "GET" }).validator((d: { id: string }) => ({ id: String(d.id) })).handler(async ({ data }) => cached(`playlist:${data.id}`, TTL, async () => {
  const raw = await dz<DzPlaylist>(`/playlist/${encodeURIComponent(data.id)}`);
  return { playlist: mapPlaylist(raw), tracks: tracksOf(raw.tracks) };
}));

export const getRadio = createServerFn({ method: "GET" }).validator((d: { id: string }) => ({ id: String(d.id) })).handler(async ({ data }) => cached(`radio:${data.id}`, 4 * 60 * 1000, async () => {
  const [info, tracks] = await Promise.all([dz<DzRadio>(`/radio/${encodeURIComponent(data.id)}`), dz<{ data?: DzTrack[] }>(`/radio/${encodeURIComponent(data.id)}/tracks?limit=40`)]);
  return { radio: mapRadio(info), tracks: tracksOf(tracks) };
}));

export const getGenre = createServerFn({ method: "GET" }).validator((d: { id: string }) => ({ id: String(d.id) })).handler(async ({ data }) => cached(`genre:${data.id}`, TTL, async () => {
  const id = encodeURIComponent(data.id);
  const [info, artists] = await Promise.all([dz<DzGenre>(`/genre/${id}`), dz<{ data?: DzArtist[] }>(`/genre/${id}/artists?limit=24`)]);
  const first = artists.data?.[0];
  let tracks: Track[] = [];
  if (first) tracks = tracksOf(await dz<{ data?: DzTrack[] }>(`/artist/${first.id}/top?limit=30`));
  return { genre: { id: String(info.id), name: info.name || "Genre", picture: info.picture_medium || "" }, artists: (artists.data ?? []).map(mapArtist), tracks };
}));

export const searchMood = createServerFn({ method: "GET" }).validator((d: { query: string }) => ({ query: String(d.query ?? "").slice(0, 80) })).handler(async ({ data }) => cached(`mood:${data.query.toLowerCase()}`, TTL, async () => tracksOf(await dz<{ data?: DzTrack[] }>(`/search?q=${encodeURIComponent(data.query)}&limit=40`))));

export const getLyrics = createServerFn({ method: "GET" }).validator((d: { artist: string; title: string; duration?: number }) => ({ artist: String(d.artist ?? "").slice(0, 120), title: String(d.title ?? "").slice(0, 120), duration: typeof d.duration === "number" ? d.duration : undefined })).handler(async ({ data }): Promise<Lyrics> => {
  const params = new URLSearchParams({ artist_name: data.artist, track_name: data.title });
  if (data.duration) params.set("duration", String(Math.round(data.duration)));
  try {
    const res = await fetch(`https://lrclib.net/api/get?${params.toString()}`, { headers: { "User-Agent": "Pulse/1.0 (music-app)" } });
    if (!res.ok) return { synced: null, plain: null };
    const json = (await res.json()) as { syncedLyrics?: string | null; plainLyrics?: string | null };
    const synced = parseLrc(json.syncedLyrics ?? "");
    return { synced: synced.length ? synced : null, plain: json.plainLyrics || null };
  } catch {
    return { synced: null, plain: null };
  }
});

function parseLrc(raw: string): { time: number; text: string }[] {
  if (!raw) return [];
  const out: { time: number; text: string }[] = [];
  for (const line of raw.split("\n")) {
    const m = line.match(/\[(\d+):(\d+(?:\.\d+)?)\](.*)/);
    if (!m) continue;
    const time = Number(m[1]) * 60 + Number(m[2]);
    const text = (m[3] ?? "").trim();
    if (text) out.push({ time, text });
  }
  return out;
}
