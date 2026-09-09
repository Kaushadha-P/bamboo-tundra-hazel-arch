import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Play, h as Radio, u as Shuffle } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { _ as usePlayer, d as Button, f as TrackRow, h as formatFans, o as Route$4, y as getArtist } from "./router-2Yg10NKW.mjs";
import { n as FeedSkeleton, r as Page, t as ErrorState } from "./page-C68vVrlc.mjs";
import { n as MediaCard, r as Section, t as HScroll } from "./media-card-BO9EL1sX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/artist._id-CgYRapIj.js
var import_jsx_runtime = require_jsx_runtime();
function ArtistPage() {
	const { id } = Route$4.useParams();
	const playTracks = usePlayer((s) => s.playTracks);
	const q = useQuery({
		queryKey: ["artist", id],
		queryFn: () => getArtist({ data: { id } })
	});
	if (q.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedSkeleton, {});
	if (q.isError || !q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		message: "This artist couldn't be loaded.",
		onRetry: () => void q.refetch()
	});
	const { artist, top, albums, related, radio } = q.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-start gap-6 sm:flex-row sm:items-end",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: artist.pictureLg || artist.picture,
				alt: "",
				className: "cover size-40 rounded-full object-cover sm:size-52"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted uppercase",
						children: "Artist"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl font-semibold tracking-tight sm:text-5xl",
						children: artist.name
					}),
					artist.fans ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [formatFans(artist.fans), " monthly listeners"]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => playTracks(top.length ? top : radio, 0),
								disabled: !top.length && !radio.length,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
									className: "size-4 fill-current",
									style: { marginLeft: 1 }
								}), "Play"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "chip",
								onClick: () => {
									usePlayer.getState().toggleShuffle();
									playTracks(top.length ? top : radio, 0);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "size-4" }), " Shuffle"]
							}),
							radio.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "chip",
								onClick: () => playTracks(radio, 0),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-4" }), " Radio"]
							}) : null
						]
					})
				]
			})]
		}),
		top.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Popular",
			children: top.slice(0, 10).map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackRow, {
				track: t,
				queue: top,
				index: i,
				numbered: true
			}, t.id))
		}) : null,
		albums.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Albums",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HScroll, { children: albums.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
				href: `/album/${a.id}`,
				image: a.coverLg || a.cover,
				title: a.title,
				subtitle: a.year || artist.name
			}, a.id)) })
		}) : null,
		related.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Fans also like",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HScroll, { children: related.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
				href: `/artist/${a.id}`,
				image: a.pictureLg || a.picture,
				title: a.name,
				circle: true
			}, a.id)) })
		}) : null
	] });
}
//#endregion
export { ArtistPage as component };
