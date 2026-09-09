import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-CR18detA.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var cache = /* @__PURE__ */ new Map();
var TTL = 48e4;
function coverFromMd5(md5, size) {
	if (!md5) return "";
	return `https://cdn-images.dzcdn.net/images/cover/${md5}/${size}x${size}-000000-80-0-0.jpg`;
}
function bump(url, size) {
	if (!url) return "";
	return url.replace(/\/\d+x\d+-/, `/${size}x${size}-`).replace("picture_medium", "picture_xl");
}
function mapTrack(t) {
	const previewUrl = t.preview ?? "";
	if (!previewUrl) return null;
	const md5 = t.md5_image || t.album?.md5_image;
	const cover = t.album?.cover_medium || coverFromMd5(md5, 250) || t.artist?.picture_medium || "";
	const coverLg = t.album?.cover_xl || bump(t.album?.cover_medium, "1000") || coverFromMd5(md5, 1e3) || t.artist?.picture_xl || cover;
	return {
		id: String(t.id),
		title: t.title_short || t.title || "Unknown",
		artist: t.artist?.name || "Unknown artist",
		artistId: String(t.artist?.id ?? ""),
		album: t.album?.title || "",
		albumId: String(t.album?.id ?? ""),
		duration: t.duration ?? 30,
		previewUrl,
		cover,
		coverLg: coverLg || cover,
		explicit: Boolean(t.explicit_lyrics)
	};
}
function mapAlbum(a) {
	const cover = a.cover_medium || coverFromMd5(a.md5_image, 250);
	const coverLg = a.cover_xl || bump(a.cover_medium, "1000") || coverFromMd5(a.md5_image, 1e3) || cover;
	return {
		id: String(a.id),
		title: a.title || "Album",
		artist: a.artist?.name || "Unknown artist",
		artistId: String(a.artist?.id ?? ""),
		cover,
		coverLg,
		year: a.release_date?.slice(0, 4),
		trackCount: a.nb_tracks
	};
}
function mapArtist(a) {
	return {
		id: String(a.id),
		name: a.name || "Artist",
		picture: a.picture_medium || "",
		pictureLg: a.picture_xl || bump(a.picture_medium, "1000") || a.picture_medium || "",
		fans: a.nb_fan
	};
}
function mapPlaylist(p) {
	return {
		id: String(p.id),
		title: p.title || "Playlist",
		cover: p.picture_medium || "",
		coverLg: p.picture_xl || bump(p.picture_medium, "1000") || p.picture_medium || "",
		creator: p.creator?.name || p.user?.name || "Pulse",
		trackCount: p.nb_tracks
	};
}
function mapRadio(r) {
	return {
		id: String(r.id),
		title: r.title || "Radio",
		picture: r.picture_medium || "",
		pictureLg: r.picture_xl || r.picture_medium || ""
	};
}
async function dz(path) {
	const url = path.startsWith("http") ? path : `https://api.deezer.com${path}`;
	const res = await fetch(url, { headers: { Accept: "application/json" } });
	if (!res.ok) throw new Error(`Catalog request failed (${res.status})`);
	return await res.json();
}
async function cached(key, ttl, fn) {
	const hit = cache.get(key);
	if (hit && Date.now() - hit.at < ttl) return hit.data;
	const data = await fn();
	cache.set(key, {
		at: Date.now(),
		data
	});
	return data;
}
function tracksOf(data) {
	return (Array.isArray(data) ? data : data?.data ?? []).map(mapTrack).filter((t) => t !== null);
}
var getHomeFeed_createServerFn_handler = createServerRpc({
	id: "d4120f99f7f7f7f2c95f12999e84ce7c1863dbb4972087e0223781e40ffb38a9",
	name: "getHomeFeed",
	filename: "src/lib/music/api.ts"
}, (opts) => getHomeFeed.__executeServer(opts));
var getHomeFeed = createServerFn({ method: "GET" }).handler(getHomeFeed_createServerFn_handler, async () => {
	return cached("home-v2", TTL, async () => {
		const [chart, radios, genres] = await Promise.all([
			dz("/chart/0"),
			dz("/radio"),
			dz("/genre")
		]);
		const stations = (radios.data ?? []).filter((r) => r.title && !/test/i.test(r.title || ""));
		const mixStations = stations.slice(0, 6);
		const mixRaw = await Promise.all(mixStations.map((r) => dz(`/radio/${r.id}/tracks?limit=16`)));
		return {
			charts: tracksOf(chart.tracks),
			albums: (chart.albums?.data ?? []).map(mapAlbum),
			artists: (chart.artists?.data ?? []).map(mapArtist),
			playlists: (chart.playlists?.data ?? []).map(mapPlaylist),
			radios: stations.slice(0, 24).map(mapRadio),
			genres: (genres.data ?? []).filter((g) => g.id !== 0 && g.name).slice(0, 24).map((g) => ({
				id: String(g.id),
				name: g.name || "Genre",
				picture: g.picture_medium || ""
			})),
			mixes: mixRaw.map((raw, i) => ({
				id: String(mixStations[i].id),
				title: `${mixStations[i].title} mix`,
				subtitle: "Made for you",
				tracks: tracksOf(raw)
			}))
		};
	});
});
var searchCatalog_createServerFn_handler = createServerRpc({
	id: "4669e5e0ff2f394f9346f5d47cbac3d77be56ec06588cb7c2894e8f5b8952e44",
	name: "searchCatalog",
	filename: "src/lib/music/api.ts"
}, (opts) => searchCatalog.__executeServer(opts));
var searchCatalog = createServerFn({ method: "GET" }).validator((d) => ({ q: String(d.q ?? "").trim().slice(0, 120) })).handler(searchCatalog_createServerFn_handler, async ({ data }) => {
	const q = data.q;
	if (!q) return {
		tracks: [],
		albums: [],
		artists: [],
		playlists: []
	};
	return cached(`search:${q.toLowerCase()}`, 3e5, async () => {
		const enc = encodeURIComponent(q);
		const [tracks, albums, artists, playlists] = await Promise.all([
			dz(`/search?q=${enc}&limit=40`),
			dz(`/search/album?q=${enc}&limit=16`),
			dz(`/search/artist?q=${enc}&limit=16`),
			dz(`/search/playlist?q=${enc}&limit=16`)
		]);
		return {
			tracks: tracksOf(tracks),
			albums: (albums.data ?? []).map(mapAlbum),
			artists: (artists.data ?? []).map(mapArtist),
			playlists: (playlists.data ?? []).map(mapPlaylist)
		};
	});
});
var getTrack_createServerFn_handler = createServerRpc({
	id: "2de3baaf8fc527236071c83a1488152f44dbbb149089706825feb4fb669d153e",
	name: "getTrack",
	filename: "src/lib/music/api.ts"
}, (opts) => getTrack.__executeServer(opts));
var getTrack = createServerFn({ method: "GET" }).validator((d) => ({ id: String(d.id) })).handler(getTrack_createServerFn_handler, async ({ data }) => {
	return mapTrack(await dz(`/track/${encodeURIComponent(data.id)}`));
});
var getAlbum_createServerFn_handler = createServerRpc({
	id: "2009c1867a5262b975cce3f56ef64a071eb473be75ce750c952e53d83a2a2ae0",
	name: "getAlbum",
	filename: "src/lib/music/api.ts"
}, (opts) => getAlbum.__executeServer(opts));
var getAlbum = createServerFn({ method: "GET" }).validator((d) => ({ id: String(d.id) })).handler(getAlbum_createServerFn_handler, async ({ data }) => {
	return cached(`album:${data.id}`, TTL, async () => {
		const raw = await dz(`/album/${encodeURIComponent(data.id)}`);
		return {
			album: mapAlbum(raw),
			tracks: tracksOf(raw.tracks)
		};
	});
});
var getArtist_createServerFn_handler = createServerRpc({
	id: "60fa48774f04c82edadc132c7aa17269e1bfc048f0ce12a84607bdadf05894cc",
	name: "getArtist",
	filename: "src/lib/music/api.ts"
}, (opts) => getArtist.__executeServer(opts));
var getArtist = createServerFn({ method: "GET" }).validator((d) => ({ id: String(d.id) })).handler(getArtist_createServerFn_handler, async ({ data }) => {
	return cached(`artist:${data.id}`, TTL, async () => {
		const id = encodeURIComponent(data.id);
		const [artist, top, albums, related, radio] = await Promise.all([
			dz(`/artist/${id}`),
			dz(`/artist/${id}/top?limit=25`),
			dz(`/artist/${id}/albums?limit=24`),
			dz(`/artist/${id}/related?limit=12`),
			dz(`/artist/${id}/radio`)
		]);
		return {
			artist: mapArtist(artist),
			top: tracksOf(top),
			albums: (albums.data ?? []).map(mapAlbum),
			related: (related.data ?? []).map(mapArtist),
			radio: tracksOf(radio)
		};
	});
});
var getPlaylist_createServerFn_handler = createServerRpc({
	id: "81e15e0768cd6b6711eb99d86ab827f4021d7cf8f7a5706d84f9439f9cab4ce3",
	name: "getPlaylist",
	filename: "src/lib/music/api.ts"
}, (opts) => getPlaylist.__executeServer(opts));
var getPlaylist = createServerFn({ method: "GET" }).validator((d) => ({ id: String(d.id) })).handler(getPlaylist_createServerFn_handler, async ({ data }) => {
	return cached(`playlist:${data.id}`, TTL, async () => {
		const raw = await dz(`/playlist/${encodeURIComponent(data.id)}`);
		return {
			playlist: mapPlaylist(raw),
			tracks: tracksOf(raw.tracks)
		};
	});
});
var getRadio_createServerFn_handler = createServerRpc({
	id: "6cae975dd6b3da68168f53f1b43c8ea3e3751730e355a4570ee035f574dac4a2",
	name: "getRadio",
	filename: "src/lib/music/api.ts"
}, (opts) => getRadio.__executeServer(opts));
var getRadio = createServerFn({ method: "GET" }).validator((d) => ({ id: String(d.id) })).handler(getRadio_createServerFn_handler, async ({ data }) => {
	return cached(`radio:${data.id}`, 24e4, async () => {
		const [info, tracks] = await Promise.all([dz(`/radio/${encodeURIComponent(data.id)}`), dz(`/radio/${encodeURIComponent(data.id)}/tracks?limit=40`)]);
		return {
			radio: mapRadio(info),
			tracks: tracksOf(tracks)
		};
	});
});
var getGenre_createServerFn_handler = createServerRpc({
	id: "da70ced785bb14b01392120727c4d1e81ea093ca0fab7053b048ab15a865e7db",
	name: "getGenre",
	filename: "src/lib/music/api.ts"
}, (opts) => getGenre.__executeServer(opts));
var getGenre = createServerFn({ method: "GET" }).validator((d) => ({ id: String(d.id) })).handler(getGenre_createServerFn_handler, async ({ data }) => {
	return cached(`genre:${data.id}`, TTL, async () => {
		const id = encodeURIComponent(data.id);
		const [info, artists] = await Promise.all([dz(`/genre/${id}`), dz(`/genre/${id}/artists?limit=24`)]);
		const first = artists.data?.[0];
		let tracks = [];
		if (first) tracks = tracksOf(await dz(`/artist/${first.id}/top?limit=30`));
		return {
			genre: {
				id: String(info.id),
				name: info.name || "Genre",
				picture: info.picture_medium || ""
			},
			artists: (artists.data ?? []).map(mapArtist),
			tracks
		};
	});
});
var searchMood_createServerFn_handler = createServerRpc({
	id: "bc6b5a8d6e41d7f092cde89ad3a4b9adae53141175d9ac2bde3338258bb3b394",
	name: "searchMood",
	filename: "src/lib/music/api.ts"
}, (opts) => searchMood.__executeServer(opts));
var searchMood = createServerFn({ method: "GET" }).validator((d) => ({ query: String(d.query ?? "").slice(0, 80) })).handler(searchMood_createServerFn_handler, async ({ data }) => {
	return cached(`mood:${data.query.toLowerCase()}`, TTL, async () => {
		return tracksOf(await dz(`/search?q=${encodeURIComponent(data.query)}&limit=40`));
	});
});
var getLyrics_createServerFn_handler = createServerRpc({
	id: "675ae78f80127c2bfa82d4bd8a4b9bab1da671d1b1b9baa46a5cf14c1ddd6bfd",
	name: "getLyrics",
	filename: "src/lib/music/api.ts"
}, (opts) => getLyrics.__executeServer(opts));
var getLyrics = createServerFn({ method: "GET" }).validator((d) => ({
	artist: String(d.artist ?? "").slice(0, 120),
	title: String(d.title ?? "").slice(0, 120),
	duration: typeof d.duration === "number" ? d.duration : void 0
})).handler(getLyrics_createServerFn_handler, async ({ data }) => {
	const params = new URLSearchParams({
		artist_name: data.artist,
		track_name: data.title
	});
	if (data.duration) params.set("duration", String(Math.round(data.duration)));
	try {
		const res = await fetch(`https://lrclib.net/api/get?${params.toString()}`, { headers: { "User-Agent": "Pulse/1.0 (music-app)" } });
		if (!res.ok) return {
			synced: null,
			plain: null
		};
		const json = await res.json();
		const synced = parseLrc(json.syncedLyrics ?? "");
		return {
			synced: synced.length ? synced : null,
			plain: json.plainLyrics || null
		};
	} catch {
		return {
			synced: null,
			plain: null
		};
	}
});
function parseLrc(raw) {
	if (!raw) return [];
	const out = [];
	for (const line of raw.split("\n")) {
		const m = line.match(/\[(\d+):(\d+(?:\.\d+)?)\](.*)/);
		if (!m) continue;
		const time = Number(m[1]) * 60 + Number(m[2]);
		const text = (m[3] ?? "").trim();
		if (!text) continue;
		out.push({
			time,
			text
		});
	}
	return out;
}
//#endregion
export { getAlbum_createServerFn_handler, getArtist_createServerFn_handler, getGenre_createServerFn_handler, getHomeFeed_createServerFn_handler, getLyrics_createServerFn_handler, getPlaylist_createServerFn_handler, getRadio_createServerFn_handler, getTrack_createServerFn_handler, searchCatalog_createServerFn_handler, searchMood_createServerFn_handler };
