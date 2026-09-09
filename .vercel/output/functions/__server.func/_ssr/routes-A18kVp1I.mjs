import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Play } from "../_libs/lucide-react.mjs";
import { _ as usePlayer, d as Button, f as TrackRow, p as useLibrary, u as Route$10 } from "./router-2Yg10NKW.mjs";
import { r as Page, t as ErrorState } from "./page-C68vVrlc.mjs";
import { n as MediaCard, r as Section, t as HScroll } from "./media-card-BO9EL1sX.mjs";
import { t as MOODS } from "./types-DcHz4eEY.mjs";
import { t as useHydrated } from "./use-hydrated-BRQLb_xd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-A18kVp1I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function greeting() {
	const h = (/* @__PURE__ */ new Date()).getHours();
	if (h < 5) return "Late night mix";
	if (h < 12) return "Good morning";
	if (h < 17) return "Good afternoon";
	if (h < 22) return "Good evening";
	return "Night drive";
}
function Home() {
	const feed = Route$10.useLoaderData();
	const recents = useLibrary((s) => s.recents);
	const playTracks = usePlayer((s) => s.playTracks);
	const hydrated = useHydrated();
	const [hello, setHello] = (0, import_react.useState)("Welcome back");
	(0, import_react.useEffect)(() => setHello(greeting()), []);
	if (!feed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { message: "The catalog is taking a moment. Try again." });
	const { charts, albums, artists, playlists, radios, mixes } = feed;
	const quick = charts.slice(0, 12);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		className: "stagger-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted uppercase",
					children: "Pulse Premium"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold tracking-tight sm:text-4xl",
					children: hello
				})] }), charts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => playTracks(charts, 0),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
						className: "size-4 fill-current",
						style: { marginLeft: 1 }
					}), "Play charts"]
				}) : null]
			}),
			hydrated && recents.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Listen again",
				subtitle: "Pick up where you left off",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HScroll, { children: recents.slice(0, 12).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
					href: `/album/${t.albumId}`,
					image: t.coverLg || t.cover,
					title: t.title,
					subtitle: t.artist,
					onPlay: () => playTracks([t, ...recents], 0)
				}, t.id)) })
			}) : null,
			quick.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Quick picks",
				subtitle: "Start radio from any row",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-1 sm:grid-cols-2",
					children: quick.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackRow, {
						track: t,
						queue: charts,
						showAlbum: false
					}, t.id))
				})
			}) : null,
			mixes.map((mix) => mix.tracks.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: mix.title,
				subtitle: mix.subtitle,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HScroll, { children: mix.tracks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
					href: `/album/${t.albumId}`,
					image: t.coverLg || t.cover,
					title: t.title,
					subtitle: t.artist,
					onPlay: () => playTracks(mix.tracks, mix.tracks.indexOf(t))
				}, t.id)) })
			}, mix.id) : null),
			albums.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "New albums for you",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HScroll, { children: albums.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
					href: `/album/${a.id}`,
					image: a.coverLg || a.cover,
					title: a.title,
					subtitle: a.artist
				}, a.id)) })
			}) : null,
			artists.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Your favorite artists",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HScroll, { children: artists.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
					href: `/artist/${a.id}`,
					image: a.pictureLg || a.picture,
					title: a.name,
					subtitle: a.fans ? `${Math.round(a.fans / 1e3)}K followers` : "Artist",
					circle: true
				}, a.id)) })
			}) : null,
			playlists.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Playlists for you",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HScroll, { children: playlists.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
					href: `/playlist/${p.id}`,
					image: p.coverLg || p.cover,
					title: p.title,
					subtitle: p.creator
				}, p.id)) })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Moods & genres",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
					children: MOODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/mood/$id",
						params: { id: m.id },
						className: "flex h-20 items-end rounded-md bg-elevated px-4 py-3 text-base font-semibold hover:bg-chip",
						children: m.title
					}, m.id))
				})
			}),
			radios.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Radio",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HScroll, { children: radios.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
					href: `/radio/${r.id}`,
					image: r.pictureLg || r.picture,
					title: r.title,
					subtitle: "Radio",
					circle: true
				}, r.id)) })
			}) : null
		]
	});
}
//#endregion
export { Home as component };
