import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { f as TrackRow, l as Route$9 } from "./router-2Yg10NKW.mjs";
import { i as PageHeader, r as Page } from "./page-C68vVrlc.mjs";
import { n as MediaCard, r as Section, t as HScroll } from "./media-card-BO9EL1sX.mjs";
import { t as MOODS } from "./types-DcHz4eEY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explore-Be2Juq43.js
var import_jsx_runtime = require_jsx_runtime();
function Explore() {
	const { charts, albums, artists, playlists, radios, genres } = Route$9.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Discover",
			title: "Explore",
			subtitle: "New releases, charts, moods, and radio from a worldwide catalog."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "New albums & singles",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HScroll, { children: albums.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
				href: `/album/${a.id}`,
				image: a.coverLg || a.cover,
				title: a.title,
				subtitle: a.artist
			}, a.id)) })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Top songs",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-1 sm:grid-cols-2",
				children: charts.slice(0, 10).map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackRow, {
					track: t,
					queue: charts,
					index: i,
					numbered: true,
					showAlbum: false
				}, t.id))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Moods & genres",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
				children: [MOODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/mood/$id",
					params: { id: m.id },
					className: "flex h-24 flex-col justify-end rounded-md bg-elevated px-4 py-3 hover:bg-chip",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg font-semibold",
						children: m.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "Mix"
					})]
				}, m.id)), genres.slice(0, 8).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/genre/$id",
					params: { id: g.id },
					className: "flex h-24 items-end overflow-hidden rounded-md bg-elevated px-4 py-3 hover:bg-chip",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg font-semibold",
						children: g.name
					})
				}, g.id))]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Featured playlists",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HScroll, { children: playlists.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
				href: `/playlist/${p.id}`,
				image: p.coverLg || p.cover,
				title: p.title,
				subtitle: p.creator
			}, p.id)) })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Trending artists",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HScroll, { children: artists.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
				href: `/artist/${a.id}`,
				image: a.pictureLg || a.picture,
				title: a.name,
				circle: true
			}, a.id)) })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Radio stations",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HScroll, { children: radios.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
				href: `/radio/${r.id}`,
				image: r.pictureLg || r.picture,
				title: r.title,
				subtitle: "Live radio",
				circle: true
			}, r.id)) })
		})
	] });
}
//#endregion
export { Explore as component };
