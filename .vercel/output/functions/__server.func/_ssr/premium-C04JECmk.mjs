import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as Headphones, b as MicVocal, c as SkipForward, d as ShieldOff, k as Download, o as Timer, y as Moon } from "../_libs/lucide-react.mjs";
import { _ as usePlayer, g as formatTime, m as cn } from "./router-2Yg10NKW.mjs";
import { i as PageHeader, r as Page } from "./page-C68vVrlc.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-chip transition-colors duration-150", "data-[state=checked]:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-fg transition-transform duration-150 data-[state=checked]:translate-x-5" })
	});
}
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex h-5 w-full touch-none items-center", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1 w-full grow overflow-hidden rounded-full bg-fg/20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-fg" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-3 rounded-full bg-fg shadow-sm outline-none ring-ring focus-visible:ring-2" })]
	});
}
function PremiumPage() {
	const backgroundPlay = usePlayer((s) => s.backgroundPlay);
	const highQuality = usePlayer((s) => s.highQuality);
	const crossfade = usePlayer((s) => s.crossfade);
	const incognito = usePlayer((s) => s.incognito);
	const sleepUntil = usePlayer((s) => s.sleepUntil);
	const setBackgroundPlay = usePlayer((s) => s.setBackgroundPlay);
	const setHighQuality = usePlayer((s) => s.setHighQuality);
	const setCrossfade = usePlayer((s) => s.setCrossfade);
	const setIncognito = usePlayer((s) => s.setIncognito);
	const setSleep = usePlayer((s) => s.setSleep);
	const remaining = sleepUntil && sleepUntil > Date.now() ? formatTime((sleepUntil - Date.now()) / 1e3) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Included",
			title: "Premium",
			subtitle: "Background play, downloads, lyrics, unlimited skips, sleep timer, and no ads — on by default."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Perk, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "size-5" }),
					title: "Background play",
					body: "Audio keeps going when you switch tabs or lock the screen. Lock-screen controls use Media Session."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Perk, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldOff, { className: "size-5" }),
					title: "Ad-free listening",
					body: "No interruptions between tracks. Mixes, radio, and search play straight through."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Perk, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-5" }),
					title: "Downloads",
					body: "Save tracks from any menu into your Library → Downloads for offline-ready recents."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Perk, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-5" }),
					title: "Unlimited skips",
					body: "Skip, replay, shuffle, and repeat without a cap."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Perk, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicVocal, { className: "size-5" }),
					title: "Synced lyrics",
					body: "Open the full player and switch to Lyrics for timed lines when they're available."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Perk, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-5" }),
					title: "Sleep timer",
					body: "From the now-playing screen, fade out after 5–60 minutes."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "space-y-1 rounded-lg bg-surface p-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					title: "Background play",
					hint: "Keep audio alive when Pulse isn't in the foreground",
					checked: backgroundPlay,
					onCheckedChange: setBackgroundPlay
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					title: "High quality",
					hint: "Prefer the best available preview stream",
					checked: highQuality,
					onCheckedChange: setHighQuality
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					title: "Incognito",
					hint: "Don't save what you play to Listen again",
					checked: incognito,
					onCheckedChange: setIncognito
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 rounded-md px-3 py-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Crossfade"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [crossfade, "s overlap between tracks"]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						className: "w-full max-w-xs",
						min: 0,
						max: 12,
						step: 1,
						value: [crossfade],
						onValueChange: (v) => setCrossfade(v[0] ?? 0)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 rounded-md px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Sleep timer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: remaining ? `Stops in ${remaining}` : "Off"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [[
							15,
							30,
							45,
							60
						].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSleep(m),
							className: "inline-flex h-9 items-center gap-1 rounded-full bg-chip px-3 text-xs hover:bg-hover",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "size-3.5" }),
								" ",
								m,
								"m"
							]
						}, m)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSleep(null),
							className: "inline-flex h-9 items-center rounded-full bg-chip px-3 text-xs hover:bg-hover",
							children: "Off"
						})]
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-subtle",
			children: "Pulse searches a worldwide catalog and plays official 30-second previews so every artist is reachable. Full-length licensed streams aren't included in this web app."
		})
	] });
}
function Perk({ icon, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-surface p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 inline-flex size-10 items-center justify-center rounded-md bg-chip",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-base font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: body
			})
		]
	});
}
function Row({ title, hint, checked, onCheckedChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex items-center justify-between gap-4 rounded-md px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-sm font-medium",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-xs text-muted",
			children: hint
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked,
			onCheckedChange
		})]
	});
}
//#endregion
export { PremiumPage as component };
