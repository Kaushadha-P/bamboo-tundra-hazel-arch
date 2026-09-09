import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as searchCatalog, _ as usePlayer, c as Route$6, f as TrackRow } from "./router-2Yg10NKW.mjs";
import { i as PageHeader, n as FeedSkeleton, r as Page, t as ErrorState } from "./page-C68vVrlc.mjs";
import { n as MediaCard, r as Section, t as HScroll } from "./media-card-BO9EL1sX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-CnQNaAXs.js
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	const { q } = Route$6.useSearch();
	const playTracks = usePlayer((s) => s.playTracks);
	const results = useQuery({
		queryKey: ["search", q],
		enabled: q.trim().length > 0,
		queryFn: () => searchCatalog({ data: { q: q.trim() } })
	});
	if (!q.trim()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Search",
		subtitle: "Find any song, album, artist, or playlist in the worldwide catalog."
	}) });
	if (results.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedSkeleton, {});
	if (results.isError || !results.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		message: "Search is unavailable right now.",
		onRetry: () => void results.refetch()
	});
	const { tracks, albums, artists, playlists } = results.data;
	const empty = !tracks.length && !albums.length && !artists.length && !playlists.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: `Results for “${q}”`,
			subtitle: "Songs, albums, artists, playlists"
		}),
		empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "No matches. Try another name or lyric-like phrase."
		}) : null,
		tracks.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Songs",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: tracks.slice(0, 20).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackRow, {
				track: t,
				queue: tracks
			}, t.id)) })
		}) : null,
		artists.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Artists",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HScroll, { children: artists.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
				href: `/artist/${a.id}`,
				image: a.pictureLg || a.picture,
				title: a.name,
				circle: true
			}, a.id)) })
		}) : null,
		albums.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Albums",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HScroll, { children: albums.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
				href: `/album/${a.id}`,
				image: a.coverLg || a.cover,
				title: a.title,
				subtitle: a.artist
			}, a.id)) })
		}) : null,
		playlists.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Playlists",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HScroll, { children: playlists.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
				href: `/playlist/${p.id}`,
				image: p.coverLg || p.cover,
				title: p.title,
				subtitle: p.creator,
				onPlay: () => tracks.length && playTracks(tracks, 0)
			}, p.id)) })
		}) : null
	] });
}
//#endregion
export { SearchPage as component };
