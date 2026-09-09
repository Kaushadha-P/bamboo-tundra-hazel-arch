import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Play } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { _ as usePlayer, d as Button, f as TrackRow, i as Route$2, w as searchMood } from "./router-2Yg10NKW.mjs";
import { i as PageHeader, n as FeedSkeleton, r as Page, t as ErrorState } from "./page-C68vVrlc.mjs";
import { t as MOODS } from "./types-DcHz4eEY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mood._id-RYpLvIRW.js
var import_jsx_runtime = require_jsx_runtime();
function MoodPage() {
	const { id } = Route$2.useParams();
	const mood = MOODS.find((m) => m.id === id);
	const playTracks = usePlayer((s) => s.playTracks);
	const q = useQuery({
		queryKey: ["mood", mood?.query ?? id],
		enabled: Boolean(mood),
		queryFn: () => searchMood({ data: { query: mood.query } })
	});
	if (!mood) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { message: "That mix isn't available." });
	if (q.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedSkeleton, {});
	if (q.isError || !q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		message: "Couldn't load this mix.",
		onRetry: () => void q.refetch()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "Mood mix",
		title: mood.title,
		subtitle: "A station built from the worldwide catalog.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: () => playTracks(q.data, 0),
			disabled: !q.data.length,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
				className: "size-4 fill-current",
				style: { marginLeft: 1 }
			}), "Play mix"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: q.data.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackRow, {
		track: t,
		queue: q.data,
		index: i,
		numbered: true
	}, t.id)) })] });
}
//#endregion
export { MoodPage as component };
