import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Play } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { S as getRadio, _ as usePlayer, d as Button, f as TrackRow, n as Route } from "./router-2Yg10NKW.mjs";
import { n as FeedSkeleton, r as Page, t as ErrorState } from "./page-C68vVrlc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/radio._id-BgHxR4FK.js
var import_jsx_runtime = require_jsx_runtime();
function RadioPage() {
	const { id } = Route.useParams();
	const playTracks = usePlayer((s) => s.playTracks);
	const q = useQuery({
		queryKey: ["radio", id],
		queryFn: () => getRadio({ data: { id } })
	});
	if (q.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedSkeleton, {});
	if (q.isError || !q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		message: "This station couldn't be loaded.",
		onRetry: () => void q.refetch()
	});
	const { radio, tracks } = q.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-start gap-6 sm:flex-row sm:items-end",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: radio.pictureLg || radio.picture,
			alt: "",
			className: "cover size-40 rounded-full object-cover sm:size-52"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted uppercase",
				children: "Radio"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold tracking-tight sm:text-4xl",
				children: radio.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Endless mix · Premium, no ads"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "mt-4",
				onClick: () => playTracks(tracks, 0),
				disabled: !tracks.length,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
					className: "size-4 fill-current",
					style: { marginLeft: 1 }
				}), "Play radio"]
			})
		] })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: tracks.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackRow, {
		track: t,
		queue: tracks,
		index: i,
		numbered: true
	}, t.id)) })] });
}
//#endregion
export { RadioPage as component };
