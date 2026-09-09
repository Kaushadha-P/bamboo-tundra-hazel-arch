import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { m as cn } from "./router-2Yg10NKW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/page-C68vVrlc.js
var import_jsx_runtime = require_jsx_runtime();
function Skeleton({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("animate-pulse rounded-md bg-chip", className) });
}
function Page({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mx-auto max-w-6xl space-y-10 px-4 py-6 sm:px-8", className),
		children
	});
}
function PageHeader({ kicker, title, subtitle, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted uppercase",
					children: kicker
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold tracking-tight sm:text-4xl",
					children: title
				}),
				subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-xl text-sm text-muted",
					children: subtitle
				}) : null
			]
		}), actions]
	});
}
function FeedSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-48" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-4",
			children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-36 shrink-0 space-y-2 sm:w-40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-square w-full rounded-md" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-28" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-20" })
				]
			}, i))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-14 w-full rounded-md" }, i))
		})
	] });
}
function ErrorState({ message, onRetry }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-surface px-5 py-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-lg font-semibold",
				children: "Couldn't load this"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: message
			}),
			onRetry ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onRetry,
				className: "mt-4 inline-flex h-10 items-center rounded-full bg-fg px-4 text-sm font-medium text-bg",
				children: "Try again"
			}) : null
		]
	}) });
}
//#endregion
export { PageHeader as i, FeedSkeleton as n, Page as r, ErrorState as t };
