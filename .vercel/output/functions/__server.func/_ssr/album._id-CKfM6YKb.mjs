import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Play, u as Shuffle } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { _ as usePlayer, d as Button, f as TrackRow, s as Route$5, v as getAlbum } from "./router-2Yg10NKW.mjs";
import { n as FeedSkeleton, r as Page, t as ErrorState } from "./page-C68vVrlc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/album._id-CKfM6YKb.js
var import_jsx_runtime = require_jsx_runtime();
function AlbumPage() {
	const { id } = Route$5.useParams();
	const playTracks = usePlayer((s) => s.playTracks);
	const q = useQuery({
		queryKey: ["album", id],
		queryFn: () => getAlbum({ data: { id } })
	});
	if (q.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedSkeleton, {});
	if (q.isError || !q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		message: "This album couldn't be loaded.",
		onRetry: () => void q.refetch()
	});
	const { album, tracks } = q.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-start gap-6 sm:flex-row sm:items-end",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: album.coverLg || album.cover,
			alt: "",
			className: "cover size-44 rounded-md object-cover sm:size-56"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted uppercase",
					children: "Album"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold tracking-tight sm:text-5xl",
					children: album.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/artist/$id",
							params: { id: album.artistId },
							className: "hover:underline",
							children: album.artist
						}),
						album.year ? ` · ${album.year}` : "",
						album.trackCount ? ` · ${album.trackCount} songs` : ""
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => playTracks(tracks, 0),
						disabled: !tracks.length,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
							className: "size-4 fill-current",
							style: { marginLeft: 1 }
						}), "Play"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "chip",
						onClick: () => playTracks(tracks, Math.floor(Math.random() * Math.max(tracks.length, 1))),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "size-4" }), " Shuffle"]
					})]
				})
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [tracks.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackRow, {
		track: t,
		queue: tracks,
		index: i,
		numbered: true,
		showAlbum: false
	}, t.id)), tracks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-8 text-sm text-muted",
		children: "No playable previews on this album."
	}) : null] })] });
}
//#endregion
export { AlbumPage as component };
