import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Play } from "../_libs/lucide-react.mjs";
import { m as cn } from "./router-2Yg10NKW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/media-card-BO9EL1sX.js
var import_jsx_runtime = require_jsx_runtime();
function MediaLink({ href, className, children }) {
	const navigate = useNavigate();
	const onClick = (e) => {
		e.preventDefault();
		navigate({ to: href });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href,
		className,
		onClick,
		children
	});
}
function MediaCard({ href, image, title, subtitle, circle = false, onPlay }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group w-36 shrink-0 sm:w-40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaLink, {
				href,
				className: "block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: image,
					alt: "",
					className: cn("cover aspect-square w-full bg-chip object-cover", circle ? "rounded-full" : "rounded-md")
				})
			}), onPlay ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": `Play ${title}`,
				onClick: (e) => {
					e.preventDefault();
					onPlay();
				},
				className: "absolute right-2 bottom-2 inline-flex size-10 items-center justify-center rounded-full bg-fg text-bg opacity-0 shadow-lg transition-[opacity,transform] duration-150 group-hover:opacity-100 hover:scale-105 max-sm:opacity-100",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
					className: "size-4 fill-current",
					style: { marginLeft: 2 }
				})
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MediaLink, {
			href,
			className: "mt-2 block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "truncate text-sm font-medium",
				children: title
			}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-xs text-muted",
				children: subtitle
			}) : null]
		})]
	});
}
function HScroll({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "hide-scroll -mx-4 flex gap-4 overflow-x-auto px-4 pb-1 sm:-mx-8 sm:px-8",
		children
	});
}
function Section({ title, subtitle, action, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted uppercase",
				children: subtitle
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl font-semibold tracking-tight sm:text-2xl",
				children: title
			})] }), action]
		}), children]
	});
}
//#endregion
export { MediaCard as n, Section as r, HScroll as t };
