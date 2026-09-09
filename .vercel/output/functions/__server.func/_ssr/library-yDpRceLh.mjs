import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as usePlayer, d as Button, f as TrackRow, m as cn, p as useLibrary } from "./router-2Yg10NKW.mjs";
import { i as PageHeader, r as Page } from "./page-C68vVrlc.mjs";
import { t as useHydrated } from "./use-hydrated-BRQLb_xd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-yDpRceLh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	"playlists",
	"songs",
	"albums",
	"artists",
	"downloads"
];
function LibraryPage() {
	const [tab, setTab] = (0, import_react.useState)("playlists");
	const liked = useLibrary((s) => Object.values(s.liked));
	const recents = useLibrary((s) => s.recents);
	const downloads = useLibrary((s) => Object.values(s.downloads));
	const playlists = useLibrary((s) => s.playlists);
	const createPlaylist = useLibrary((s) => s.createPlaylist);
	const playTracks = usePlayer((s) => s.playTracks);
	if (!useHydrated()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "Yours",
		title: "Library",
		subtitle: "Loading your collection…"
	}) });
	const albums = uniqueBy([
		...liked,
		...recents,
		...downloads
	].filter((t) => t.albumId), (t) => t.albumId);
	const artists = uniqueBy([
		...liked,
		...recents,
		...downloads
	].filter((t) => t.artistId), (t) => t.artistId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Yours",
			title: "Library",
			subtitle: "Liked songs, playlists, downloads, and recents — saved on this device.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "chip",
				onClick: () => createPlaylist(`Playlist ${playlists.length + 1}`),
				children: "New playlist"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hide-scroll flex gap-2 overflow-x-auto",
			children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab(t),
				className: cn("h-9 shrink-0 rounded-full px-4 text-sm capitalize", tab === t ? "bg-fg text-bg" : "bg-chip text-fg hover:bg-hover"),
				children: t
			}, t))
		}),
		tab === "playlists" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => liked.length && playTracks(liked, 0),
				className: "overflow-hidden rounded-md bg-elevated text-left hover:bg-chip",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex aspect-square items-center justify-center bg-accent/90 p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-2xl font-semibold text-accent-fg",
						children: "Liked"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Liked music"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							liked.length,
							" song",
							liked.length === 1 ? "" : "s",
							" · Auto playlist"
						]
					})]
				})]
			}), playlists.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/playlist/$id",
				params: { id: p.id },
				className: "overflow-hidden rounded-md bg-elevated hover:bg-chip",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid aspect-square grid-cols-2 bg-chip",
					children: p.tracks.slice(0, 4).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: t.cover,
						alt: "",
						className: "size-full object-cover"
					}, t.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-medium",
						children: p.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [p.tracks.length, " songs"]
					})]
				})]
			}, p.id))]
		}) : null,
		tab === "songs" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: liked.length === 0 && recents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Like a song or play something — it lands here." }) : (liked.length ? liked : recents).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackRow, {
			track: t,
			queue: liked.length ? liked : recents
		}, t.id)) }) : null,
		tab === "albums" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
			children: albums.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Albums you play will collect here." }) : albums.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/album/$id",
				params: { id: t.albumId },
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: t.coverLg || t.cover,
						alt: "",
						className: "cover aspect-square w-full rounded-md object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 truncate text-sm font-medium",
						children: t.album
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs text-muted",
						children: t.artist
					})
				]
			}, t.albumId))
		}) : null,
		tab === "artists" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
			children: artists.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Artists you play will collect here." }) : artists.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/artist/$id",
				params: { id: t.artistId },
				className: "min-w-0 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: t.coverLg || t.cover,
					alt: "",
					className: "cover mx-auto aspect-square w-full rounded-full object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 truncate text-sm font-medium",
					children: t.artist
				})]
			}, t.artistId))
		}) : null,
		tab === "downloads" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: downloads.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { text: "Premium downloads appear here. Tap download on any track." }) : downloads.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackRow, {
			track: t,
			queue: downloads
		}, t.id)) }) : null
	] });
}
function Empty({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "col-span-full py-10 text-sm text-muted",
		children: text
	});
}
function uniqueBy(arr, key) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const item of arr) {
		const k = key(item);
		if (!k || seen.has(k)) continue;
		seen.add(k);
		out.push(item);
	}
	return out;
}
//#endregion
export { LibraryPage as component };
