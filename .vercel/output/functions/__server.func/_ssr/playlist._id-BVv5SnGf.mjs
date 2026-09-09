import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Play, a as Trash2, u as Shuffle } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { _ as usePlayer, d as Button, f as TrackRow, p as useLibrary, r as Route$1, x as getPlaylist } from "./router-2Yg10NKW.mjs";
import { n as FeedSkeleton, r as Page, t as ErrorState } from "./page-C68vVrlc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/playlist._id-BVv5SnGf.js
var import_jsx_runtime = require_jsx_runtime();
function PlaylistPage() {
	const { id } = Route$1.useParams();
	const local = useLibrary((s) => s.playlists.find((p) => p.id === id));
	const deletePlaylist = useLibrary((s) => s.deletePlaylist);
	usePlayer((s) => s.playTracks);
	const remote = useQuery({
		queryKey: ["playlist", id],
		enabled: !id.startsWith("local-"),
		queryFn: () => getPlaylist({ data: { id } })
	});
	if (id.startsWith("local-")) {
		if (!local) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { message: "This playlist was deleted or isn't on this device." });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {
			kicker: "Playlist",
			title: local.title,
			subtitle: `${local.tracks.length} songs · Private`,
			cover: local.tracks[0]?.coverLg || local.tracks[0]?.cover,
			tracks: local.tracks,
			extra: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "chip",
				onClick: () => deletePlaylist(local.id),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Delete"]
			})
		});
	}
	if (remote.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedSkeleton, {});
	if (remote.isError || !remote.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		message: "This playlist couldn't be loaded.",
		onRetry: () => void remote.refetch()
	});
	const { playlist, tracks } = remote.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {
		kicker: "Playlist",
		title: playlist.title,
		subtitle: `${playlist.creator}${playlist.trackCount ? ` · ${playlist.trackCount} songs` : ""}`,
		cover: playlist.coverLg || playlist.cover,
		tracks
	});
}
function Hero({ kicker, title, subtitle, cover, tracks, extra }) {
	const playTracks = usePlayer((s) => s.playTracks);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-start gap-6 sm:flex-row sm:items-end",
		children: [cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: cover,
			alt: "",
			className: "cover size-44 rounded-md object-cover sm:size-56"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-44 rounded-md bg-chip sm:size-56" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted uppercase",
					children: kicker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold tracking-tight sm:text-4xl",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: subtitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => playTracks(tracks, 0),
							disabled: !tracks.length,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
								className: "size-4 fill-current",
								style: { marginLeft: 1 }
							}), "Play"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "chip",
							onClick: () => playTracks(tracks, 0),
							disabled: !tracks.length,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "size-4" }), " Shuffle"]
						}),
						extra
					]
				})
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [tracks.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackRow, {
		track: t,
		queue: tracks,
		index: i,
		numbered: true
	}, t.id)), tracks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-8 text-sm text-muted",
		children: "This playlist is empty."
	}) : null] })] });
}
//#endregion
export { PlaylistPage as component };
