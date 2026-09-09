import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Play } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { _ as usePlayer, a as Route$3, b as getGenre, d as Button, f as TrackRow } from "./router-2Yg10NKW.mjs";
import { i as PageHeader, n as FeedSkeleton, r as Page, t as ErrorState } from "./page-C68vVrlc.mjs";
import { n as MediaCard, r as Section, t as HScroll } from "./media-card-BO9EL1sX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/genre._id-ak668OTt.js
var import_jsx_runtime = require_jsx_runtime();
function GenrePage() {
	const { id } = Route$3.useParams();
	const playTracks = usePlayer((s) => s.playTracks);
	const q = useQuery({
		queryKey: ["genre", id],
		queryFn: () => getGenre({ data: { id } })
	});
	if (q.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedSkeleton, {});
	if (q.isError || !q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		message: "This genre couldn't be loaded.",
		onRetry: () => void q.refetch()
	});
	const { genre, artists, tracks } = q.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Genre",
			title: genre.name,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => playTracks(tracks, 0),
				disabled: !tracks.length,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
					className: "size-4 fill-current",
					style: { marginLeft: 1 }
				}), "Play"]
			})
		}),
		artists.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Artists",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HScroll, { children: artists.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
				href: `/artist/${a.id}`,
				image: a.pictureLg || a.picture,
				title: a.name,
				circle: true
			}, a.id)) })
		}) : null,
		tracks.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Top tracks",
			children: tracks.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackRow, {
				track: t,
				queue: tracks,
				index: i,
				numbered: true
			}, t.id))
		}) : null
	] });
}
//#endregion
export { GenrePage as component };
