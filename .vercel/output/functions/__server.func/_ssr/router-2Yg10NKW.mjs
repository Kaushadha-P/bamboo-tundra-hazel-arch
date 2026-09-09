import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as createRootRoute, b as useRouter, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { A as Compass, C as ListMusic, E as Heart, M as Cast, O as EllipsisVertical, S as ListPlus, T as House, _ as Play, b as MicVocal, c as SkipForward, f as Search, g as Plus, i as TriangleAlert, j as ChevronDown, k as Download, l as SkipBack, m as Repeat1, n as VolumeX, o as Timer, p as Repeat, r as Volume2, s as Sparkles, t as X, u as Shuffle, v as Pause, w as Library, x as Maximize2, y as Moon } from "../_libs/lucide-react.mjs";
import { n as QueryClientProvider, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, o as DialogTitle, r as DialogContent$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Separator2, i as Root2, n as Item2, o as Trigger, r as Portal2, t as Content2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { a as Trigger$1, i as Root3, n as Portal, r as Provider, t as Content2$1 } from "../_libs/@radix-ui/react-tooltip+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-D_32OLjm.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getHomeFeed = createServerFn({ method: "GET" }).handler(createSsrRpc("d4120f99f7f7f7f2c95f12999e84ce7c1863dbb4972087e0223781e40ffb38a9"));
var searchCatalog = createServerFn({ method: "GET" }).validator((d) => ({ q: String(d.q ?? "").trim().slice(0, 120) })).handler(createSsrRpc("4669e5e0ff2f394f9346f5d47cbac3d77be56ec06588cb7c2894e8f5b8952e44"));
var getTrack = createServerFn({ method: "GET" }).validator((d) => ({ id: String(d.id) })).handler(createSsrRpc("2de3baaf8fc527236071c83a1488152f44dbbb149089706825feb4fb669d153e"));
var getAlbum = createServerFn({ method: "GET" }).validator((d) => ({ id: String(d.id) })).handler(createSsrRpc("2009c1867a5262b975cce3f56ef64a071eb473be75ce750c952e53d83a2a2ae0"));
var getArtist = createServerFn({ method: "GET" }).validator((d) => ({ id: String(d.id) })).handler(createSsrRpc("60fa48774f04c82edadc132c7aa17269e1bfc048f0ce12a84607bdadf05894cc"));
var getPlaylist = createServerFn({ method: "GET" }).validator((d) => ({ id: String(d.id) })).handler(createSsrRpc("81e15e0768cd6b6711eb99d86ab827f4021d7cf8f7a5706d84f9439f9cab4ce3"));
var getRadio = createServerFn({ method: "GET" }).validator((d) => ({ id: String(d.id) })).handler(createSsrRpc("6cae975dd6b3da68168f53f1b43c8ea3e3751730e355a4570ee035f574dac4a2"));
var getGenre = createServerFn({ method: "GET" }).validator((d) => ({ id: String(d.id) })).handler(createSsrRpc("da70ced785bb14b01392120727c4d1e81ea093ca0fab7053b048ab15a865e7db"));
var searchMood = createServerFn({ method: "GET" }).validator((d) => ({ query: String(d.query ?? "").slice(0, 80) })).handler(createSsrRpc("bc6b5a8d6e41d7f092cde89ad3a4b9adae53141175d9ac2bde3338258bb3b394"));
var getLyrics = createServerFn({ method: "GET" }).validator((d) => ({
	artist: String(d.artist ?? "").slice(0, 120),
	title: String(d.title ?? "").slice(0, 120),
	duration: typeof d.duration === "number" ? d.duration : void 0
})).handler(createSsrRpc("675ae78f80127c2bfa82d4bd8a4b9bab1da671d1b1b9baa46a5cf14c1ddd6bfd"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/player-store-BX3g0e8O.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatTime(seconds) {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
	const s = Math.floor(seconds % 60);
	const m = Math.floor(seconds / 60) % 60;
	const h = Math.floor(seconds / 3600);
	if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
	return `${m}:${String(s).padStart(2, "0")}`;
}
function formatFans(n) {
	if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M`;
	if (n >= 1e3) return `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}K`;
	return String(n);
}
function uid() {
	return crypto.randomUUID();
}
function shuffleAround(list, start) {
	if (list.length < 2) return list;
	const current = list[start];
	const rest = list.filter((_, i) => i !== start);
	for (let i = rest.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[rest[i], rest[j]] = [rest[j], rest[i]];
	}
	return [current, ...rest];
}
var usePlayer = create()(persist((set, get) => ({
	queue: [],
	index: 0,
	playing: false,
	progress: 0,
	duration: 0,
	volume: .85,
	muted: false,
	shuffle: false,
	repeat: "off",
	fullOpen: false,
	queueOpen: false,
	lyricsTab: "upnext",
	sleepUntil: null,
	crossfade: 0,
	backgroundPlay: true,
	highQuality: true,
	incognito: false,
	hydrated: false,
	current: () => {
		const { queue, index } = get();
		return queue[index] ?? null;
	},
	playTracks: (tracks, start = 0) => {
		if (!tracks.length) return;
		const shuffle = get().shuffle;
		const ordered = shuffle ? shuffleAround(tracks, start) : tracks;
		set({
			queue: ordered,
			index: shuffle ? 0 : Math.max(0, Math.min(start, ordered.length - 1)),
			playing: true,
			progress: 0
		});
	},
	playTrack: (track, extras = []) => {
		const rest = extras.filter((t) => t.id !== track.id);
		get().playTracks([track, ...rest], 0);
	},
	toggle: () => {
		const { queue, playing } = get();
		if (!queue.length) return;
		set({ playing: !playing });
	},
	setPlaying: (v) => set({ playing: v }),
	next: () => {
		const { queue, index, repeat } = get();
		if (!queue.length) return;
		if (repeat === "one") {
			set({
				progress: 0,
				playing: true
			});
			return;
		}
		if (index + 1 < queue.length) {
			set({
				index: index + 1,
				progress: 0,
				playing: true
			});
			return;
		}
		if (repeat === "all") {
			set({
				index: 0,
				progress: 0,
				playing: true
			});
			return;
		}
		set({
			playing: false,
			progress: 0
		});
	},
	prev: () => {
		const { index, progress } = get();
		if (progress > 3 && index >= 0) {
			set({ progress: 0 });
			return;
		}
		set({
			index: Math.max(0, index - 1),
			progress: 0,
			playing: true
		});
	},
	seek: (t) => set({ progress: Math.max(0, t) }),
	setProgress: (t, duration) => set(duration !== void 0 ? {
		progress: t,
		duration
	} : { progress: t }),
	setVolume: (v) => set({
		volume: Math.min(1, Math.max(0, v)),
		muted: v === 0
	}),
	toggleMute: () => set({ muted: !get().muted }),
	toggleShuffle: () => {
		const { shuffle, queue, index } = get();
		if (!shuffle && queue.length) set({
			shuffle: true,
			queue: shuffleAround(queue, index),
			index: 0
		});
		else set({ shuffle: false });
	},
	cycleRepeat: () => {
		const order = [
			"off",
			"all",
			"one"
		];
		set({ repeat: order[(order.indexOf(get().repeat) + 1) % order.length] });
	},
	addToQueue: (track) => {
		const { queue } = get();
		set({ queue: [...queue, track] });
	},
	playNext: (track) => {
		const { queue, index } = get();
		if (!queue.length) {
			get().playTracks([track], 0);
			return;
		}
		const next = [...queue];
		next.splice(index + 1, 0, track);
		set({ queue: next });
	},
	removeFromQueue: (i) => {
		const { queue, index } = get();
		const next = queue.filter((_, idx) => idx !== i);
		let nextIndex = index;
		if (i < index) nextIndex = index - 1;
		if (i === index) nextIndex = Math.min(index, Math.max(0, next.length - 1));
		set({
			queue: next,
			index: next.length ? nextIndex : 0,
			playing: next.length ? get().playing : false
		});
	},
	setFullOpen: (v) => set({ fullOpen: v }),
	setQueueOpen: (v) => set({ queueOpen: v }),
	setLyricsTab: (v) => set({ lyricsTab: v }),
	setSleep: (minutes) => set({ sleepUntil: minutes == null ? null : Date.now() + minutes * 6e4 }),
	setCrossfade: (s) => set({ crossfade: Math.max(0, Math.min(12, s)) }),
	setBackgroundPlay: (v) => set({ backgroundPlay: v }),
	setHighQuality: (v) => set({ highQuality: v }),
	setIncognito: (v) => set({ incognito: v }),
	clearQueue: () => set({
		queue: [],
		index: 0,
		playing: false,
		progress: 0
	}),
	jumpTo: (i) => set({
		index: i,
		progress: 0,
		playing: true
	})
}), {
	name: "pulse-player",
	partialize: (s) => ({
		queue: s.queue,
		index: s.index,
		volume: s.volume,
		muted: s.muted,
		shuffle: s.shuffle,
		repeat: s.repeat,
		crossfade: s.crossfade,
		backgroundPlay: s.backgroundPlay,
		highQuality: s.highQuality,
		incognito: s.incognito
	}),
	onRehydrateStorage: () => () => {
		usePlayer.setState({
			playing: false,
			hydrated: true,
			fullOpen: false
		});
	}
}));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-2Yg10NKW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var useLibrary = create()(persist((set, get) => ({
	liked: {},
	recents: [],
	downloads: {},
	playlists: [],
	like: (track) => set({ liked: {
		...get().liked,
		[track.id]: track
	} }),
	unlike: (id) => {
		const next = { ...get().liked };
		delete next[id];
		set({ liked: next });
	},
	toggleLike: (track) => {
		if (get().liked[track.id]) get().unlike(track.id);
		else get().like(track);
	},
	isLiked: (id) => Boolean(get().liked[id]),
	addRecent: (track) => {
		set({ recents: [track, ...get().recents.filter((t) => t.id !== track.id)].slice(0, 60) });
	},
	toggleDownload: (track) => {
		const next = { ...get().downloads };
		if (next[track.id]) delete next[track.id];
		else next[track.id] = track;
		set({ downloads: next });
	},
	isDownloaded: (id) => Boolean(get().downloads[id]),
	createPlaylist: (title, tracks = []) => {
		const id = `local-${uid()}`;
		set({ playlists: [{
			id,
			title: title.trim() || "New playlist",
			description: "",
			createdAt: Date.now(),
			trackIds: tracks.map((t) => t.id),
			tracks
		}, ...get().playlists] });
		return id;
	},
	renamePlaylist: (id, title) => set({ playlists: get().playlists.map((p) => p.id === id ? {
		...p,
		title: title.trim() || p.title
	} : p) }),
	deletePlaylist: (id) => set({ playlists: get().playlists.filter((p) => p.id !== id) }),
	addToPlaylist: (id, track) => set({ playlists: get().playlists.map((p) => {
		if (p.id !== id) return p;
		if (p.trackIds.includes(track.id)) return p;
		return {
			...p,
			trackIds: [...p.trackIds, track.id],
			tracks: [...p.tracks, track]
		};
	}) }),
	removeFromPlaylist: (id, trackId) => set({ playlists: get().playlists.map((p) => p.id === id ? {
		...p,
		trackIds: p.trackIds.filter((t) => t !== trackId),
		tracks: p.tracks.filter((t) => t.id !== trackId)
	} : p) })
}), { name: "pulse-library" }));
function AudioEngine() {
	const audioRef = (0, import_react.useRef)(null);
	const lastId = (0, import_react.useRef)(null);
	const seekLock = (0, import_react.useRef)(false);
	const queue = usePlayer((s) => s.queue);
	const index = usePlayer((s) => s.index);
	const playing = usePlayer((s) => s.playing);
	const volume = usePlayer((s) => s.volume);
	const muted = usePlayer((s) => s.muted);
	const progress = usePlayer((s) => s.progress);
	const backgroundPlay = usePlayer((s) => s.backgroundPlay);
	const sleepUntil = usePlayer((s) => s.sleepUntil);
	const incognito = usePlayer((s) => s.incognito);
	const next = usePlayer((s) => s.next);
	const prev = usePlayer((s) => s.prev);
	const toggle = usePlayer((s) => s.toggle);
	const setPlaying = usePlayer((s) => s.setPlaying);
	const setProgress = usePlayer((s) => s.setProgress);
	const seek = usePlayer((s) => s.seek);
	const addRecent = useLibrary((s) => s.addRecent);
	const track = queue[index] ?? null;
	(0, import_react.useEffect)(() => {
		const audio = audioRef.current;
		if (!audio || !track) return;
		const load = async () => {
			if (lastId.current === track.id && audio.src) return;
			lastId.current = track.id;
			audio.src = track.previewUrl;
			audio.load();
			if (!incognito) addRecent(track);
			if (playing) try {
				await audio.play();
			} catch {
				setPlaying(false);
			}
		};
		load();
	}, [
		track,
		addRecent,
		incognito,
		playing,
		setPlaying
	]);
	(0, import_react.useEffect)(() => {
		const audio = audioRef.current;
		if (!audio) return;
		if (!track) {
			audio.pause();
			return;
		}
		if (playing) audio.play().catch(() => setPlaying(false));
		else audio.pause();
	}, [
		playing,
		track,
		setPlaying
	]);
	(0, import_react.useEffect)(() => {
		const audio = audioRef.current;
		if (!audio) return;
		audio.volume = muted ? 0 : volume;
	}, [volume, muted]);
	(0, import_react.useEffect)(() => {
		const audio = audioRef.current;
		if (!audio || seekLock.current) return;
		if (Math.abs(audio.currentTime - progress) > 1.2) try {
			audio.currentTime = progress;
		} catch {}
	}, [progress]);
	(0, import_react.useEffect)(() => {
		if (!sleepUntil) return;
		const ms = sleepUntil - Date.now();
		if (ms <= 0) {
			setPlaying(false);
			usePlayer.getState().setSleep(null);
			return;
		}
		const id = window.setTimeout(() => {
			setPlaying(false);
			usePlayer.getState().setSleep(null);
		}, ms);
		return () => window.clearTimeout(id);
	}, [sleepUntil, setPlaying]);
	(0, import_react.useEffect)(() => {
		if (!track || typeof navigator === "undefined" || !navigator.mediaSession) return;
		navigator.mediaSession.metadata = new MediaMetadata({
			title: track.title,
			artist: track.artist,
			album: track.album,
			artwork: [{
				src: track.cover,
				sizes: "250x250",
				type: "image/jpeg"
			}, {
				src: track.coverLg || track.cover,
				sizes: "512x512",
				type: "image/jpeg"
			}]
		});
		navigator.mediaSession.playbackState = playing ? "playing" : "paused";
		const handlers = [
			["play", () => setPlaying(true)],
			["pause", () => setPlaying(false)],
			["previoustrack", prev],
			["nexttrack", next],
			["stop", () => setPlaying(false)]
		];
		for (const [action, fn] of handlers) try {
			navigator.mediaSession.setActionHandler(action, fn);
		} catch {}
		return () => {
			for (const [action] of handlers) try {
				navigator.mediaSession.setActionHandler(action, null);
			} catch {}
		};
	}, [
		track,
		playing,
		next,
		prev,
		setPlaying
	]);
	(0, import_react.useEffect)(() => {
		document.title = track ? `${track.title} · ${track.artist}` : "Pulse";
	}, [track]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const tag = e.target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;
			if (e.code === "Space") {
				e.preventDefault();
				toggle();
			} else if (e.code === "ArrowRight") seek(usePlayer.getState().progress + 5);
			else if (e.code === "ArrowLeft") seek(Math.max(0, usePlayer.getState().progress - 5));
			else if (e.key === "n" || e.key === "N") next();
			else if (e.key === "p" || e.key === "P") prev();
			else if (e.key === "m" || e.key === "M") usePlayer.getState().toggleMute();
			else if (e.key === "f" || e.key === "F") usePlayer.getState().setFullOpen(!usePlayer.getState().fullOpen);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		toggle,
		next,
		prev,
		seek
	]);
	const onTime = () => {
		const audio = audioRef.current;
		if (!audio) return;
		seekLock.current = true;
		setProgress(audio.currentTime, Number.isFinite(audio.duration) ? audio.duration : 30);
		window.setTimeout(() => {
			seekLock.current = false;
		}, 50);
	};
	const onEnded = () => {
		next();
	};
	const onError = async () => {
		if (!track) return;
		try {
			const fresh = await getTrack({ data: { id: track.id } });
			const audio = audioRef.current;
			if (fresh?.previewUrl && audio && audio.src !== fresh.previewUrl) {
				audio.src = fresh.previewUrl;
				lastId.current = track.id;
				if (playing) audio.play();
				return;
			}
		} catch {}
		next();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
		ref: audioRef,
		preload: "auto",
		playsInline: true,
		onTimeUpdate: onTime,
		onEnded,
		onError: () => void onError(),
		onPlay: () => {
			if (backgroundPlay) setPlaying(true);
		},
		onPause: () => {
			const audio = audioRef.current;
			if (audio && !audio.ended && playing && document.visibilityState === "visible") {}
		}
	});
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
function DropdownMenuContent({ className, sideOffset = 6, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		sideOffset,
		className: cn("z-50 min-w-48 overflow-hidden rounded-lg bg-elevated p-1 text-fg shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_16px_40px_rgb(0_0_0/0.5)]", className),
		...props
	}) });
}
function DropdownMenuItem({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		className: cn("flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5 text-sm outline-none select-none", "focus:bg-chip data-[disabled]:pointer-events-none data-[disabled]:opacity-40", className),
		...props
	});
}
function DropdownMenuSeparator({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, { className: cn("my-1 h-px bg-border", className) });
}
var Dialog = Dialog$1;
function DialogContent({ className, children, title, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-bg/80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[min(100%-2rem,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-elevated p-5 text-fg shadow-[0_0_0_1px_rgb(255_255_255/0.08)]", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "font-display text-lg font-semibold",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
				className: "inline-flex size-10 items-center justify-center rounded-full hover:bg-chip",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Close"
				})]
			})]
		}), children]
	})] });
}
function TrackRow({ track, queue, index, showAlbum = true, numbered = false }) {
	const current = usePlayer((s) => s.queue[s.index]);
	const playing = usePlayer((s) => s.playing);
	const playTracks = usePlayer((s) => s.playTracks);
	const toggle = usePlayer((s) => s.toggle);
	const playNext = usePlayer((s) => s.playNext);
	const addToQueue = usePlayer((s) => s.addToQueue);
	const liked = useLibrary((s) => Boolean(s.liked[track.id]));
	const downloaded = useLibrary((s) => Boolean(s.downloads[track.id]));
	const toggleLike = useLibrary((s) => s.toggleLike);
	const toggleDownload = useLibrary((s) => s.toggleDownload);
	const playlists = useLibrary((s) => s.playlists);
	const addToPlaylist = useLibrary((s) => s.addToPlaylist);
	const createPlaylist = useLibrary((s) => s.createPlaylist);
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const isCurrent = current?.id === track.id;
	const isPlaying = isCurrent && playing;
	const play = () => {
		if (isCurrent) toggle();
		else if (queue) playTracks(queue, queue.findIndex((t) => t.id === track.id));
		else playTracks([track], 0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("group grid items-center gap-3 rounded-md px-2 py-1.5 hover:bg-chip", "grid-cols-[auto_minmax(0,1fr)_auto] sm:grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_auto]", isCurrent && "bg-chip"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: play,
				className: "relative size-12 shrink-0 overflow-hidden rounded-xs",
				"aria-label": isPlaying ? "Pause" : `Play ${track.title}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: track.cover,
						alt: "",
						className: "cover size-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute inset-0 flex items-center justify-center bg-bg/50 opacity-0 transition-opacity duration-150 group-hover:opacity-100 max-sm:opacity-100",
						children: isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4 fill-fg text-fg" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
							className: "size-4 fill-fg text-fg",
							style: { marginLeft: 2 }
						})
					}),
					numbered && index !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute top-0 left-0 hidden size-5 items-center justify-center bg-bg/70 text-[10px] text-muted group-hover:hidden sm:flex",
						children: index + 1
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cn("truncate text-sm font-medium", isCurrent && "text-accent"),
					children: [track.title, track.explicit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-1.5 inline-flex size-4 items-center justify-center rounded-xs bg-muted/30 text-[9px] font-semibold text-muted",
						children: "E"
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/artist/$id",
					params: { id: track.artistId },
					className: "truncate text-xs text-muted hover:underline",
					children: track.artist
				})]
			}),
			showAlbum ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/album/$id",
				params: { id: track.albumId },
				className: "hidden min-w-0 truncate text-sm text-muted hover:underline sm:block",
				children: track.album
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hidden sm:block" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-0.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": liked ? "Unlike" : "Like",
						onClick: () => toggleLike(track),
						className: cn("inline-flex size-10 items-center justify-center rounded-full opacity-0 hover:bg-hover group-hover:opacity-100 max-sm:opacity-100", liked && "opacity-100 text-accent"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-4", liked && "fill-current") })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden w-10 text-right text-xs text-muted tabular-nums sm:inline",
						children: formatTime(track.duration)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "More",
							className: "inline-flex size-10 items-center justify-center rounded-full hover:bg-hover",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "size-4" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onSelect: () => playNext(track),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Play next"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onSelect: () => addToQueue(track),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListPlus, { className: "size-4" }), " Add to queue"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onSelect: () => setAddOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListPlus, { className: "size-4" }), " Add to playlist"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onSelect: () => toggleLike(track),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-4", liked && "fill-current") }), liked ? "Remove from likes" : "Save to likes"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onSelect: () => toggleDownload(track),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), downloaded ? "Remove download" : "Download"]
							})
						]
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: addOpen,
				onOpenChange: setAddOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					title: "Add to playlist",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mb-2 flex h-11 w-full items-center rounded-md bg-chip px-3 text-sm hover:bg-hover",
						onClick: () => {
							createPlaylist(`${track.title} mix`, [track]);
							setAddOpen(false);
						},
						children: "New playlist"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-64 space-y-1 overflow-auto",
						children: [playlists.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex h-11 w-full items-center rounded-md px-3 text-left text-sm hover:bg-chip",
							onClick: () => {
								addToPlaylist(p.id, track);
								setAddOpen(false);
							},
							children: p.title
						}, p.id)), playlists.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-1 py-4 text-sm text-muted",
							children: "No playlists yet."
						}) : null]
					})]
				})
			})
		]
	});
}
function NowPlaying() {
	const open = usePlayer((s) => s.fullOpen);
	const setOpen = usePlayer((s) => s.setFullOpen);
	const track = usePlayer((s) => s.queue[s.index] ?? null);
	const queue = usePlayer((s) => s.queue);
	const index = usePlayer((s) => s.index);
	const playing = usePlayer((s) => s.playing);
	const shuffle = usePlayer((s) => s.shuffle);
	const repeat = usePlayer((s) => s.repeat);
	const progress = usePlayer((s) => s.progress);
	const duration = usePlayer((s) => s.duration);
	const lyricsTab = usePlayer((s) => s.lyricsTab);
	const sleepUntil = usePlayer((s) => s.sleepUntil);
	const toggle = usePlayer((s) => s.toggle);
	const next = usePlayer((s) => s.next);
	const prev = usePlayer((s) => s.prev);
	const seek = usePlayer((s) => s.seek);
	const toggleShuffle = usePlayer((s) => s.toggleShuffle);
	const cycleRepeat = usePlayer((s) => s.cycleRepeat);
	const setLyricsTab = usePlayer((s) => s.setLyricsTab);
	const setSleep = usePlayer((s) => s.setSleep);
	const liked = useLibrary((s) => track ? Boolean(s.liked[track.id]) : false);
	const downloaded = useLibrary((s) => track ? Boolean(s.downloads[track.id]) : false);
	const toggleLike = useLibrary((s) => s.toggleLike);
	const toggleDownload = useLibrary((s) => s.toggleDownload);
	const [sleepOpen, setSleepOpen] = (0, import_react.useState)(false);
	const lyricsQuery = useQuery({
		queryKey: ["lyrics", track?.id],
		enabled: open && Boolean(track) && lyricsTab === "lyrics",
		queryFn: () => getLyrics({ data: {
			artist: track.artist,
			title: track.title,
			duration: track.duration
		} })
	});
	if (!open || !track) return null;
	const remaining = sleepUntil && sleepUntil > Date.now() ? formatTime((sleepUntil - Date.now()) / 1e3) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between px-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Close player",
						onClick: () => setOpen(false),
						className: "inline-flex size-11 items-center justify-center rounded-full hover:bg-chip",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-medium tracking-wider text-muted uppercase",
							children: "Playing from queue"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: track.album || "Pulse"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Sleep timer",
						onClick: () => setSleepOpen(true),
						className: "inline-flex size-11 items-center justify-center rounded-full hover:bg-chip",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "size-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-8 overflow-auto px-5 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: track.coverLg || track.cover,
							alt: "",
							className: "cover aspect-square w-full max-w-md rounded-lg object-cover shadow-[0_24px_80px_rgb(0_0_0/0.55)]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex w-full max-w-md items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display truncate text-2xl font-semibold tracking-tight",
									children: track.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-muted",
									children: track.artist
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Download",
									onClick: () => toggleDownload(track),
									className: cn("inline-flex size-11 items-center justify-center rounded-full hover:bg-chip", downloaded && "text-fg"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": liked ? "Unlike" : "Like",
									onClick: () => toggleLike(track),
									className: cn("inline-flex size-11 items-center justify-center rounded-full hover:bg-chip", liked && "text-accent"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-5", liked && "fill-current") })
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 w-full max-w-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: duration || 30,
								step: .1,
								value: Math.min(progress, duration || 30),
								onChange: (e) => seek(Number(e.target.value)),
								"aria-label": "Seek",
								className: "h-1 w-full cursor-pointer appearance-none rounded-full bg-fg/20 accent-fg"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex justify-between text-[11px] text-muted tabular-nums",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTime(progress) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Preview · ", formatTime(duration)] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Shuffle",
									onClick: toggleShuffle,
									className: cn("inline-flex size-11 items-center justify-center rounded-full", shuffle ? "text-fg" : "text-muted"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Previous",
									onClick: prev,
									className: "inline-flex size-12 items-center justify-center rounded-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipBack, { className: "size-7 fill-current" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": playing ? "Pause" : "Play",
									onClick: toggle,
									className: "inline-flex size-16 items-center justify-center rounded-full bg-fg text-bg",
									children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-7 fill-current" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
										className: "size-7 fill-current",
										style: { marginLeft: 2 }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Next",
									onClick: next,
									className: "inline-flex size-12 items-center justify-center rounded-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-7 fill-current" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Repeat",
									onClick: cycleRepeat,
									className: cn("inline-flex size-11 items-center justify-center rounded-full", repeat === "off" ? "text-muted" : "text-fg"),
									children: repeat === "one" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat1, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat, { className: "size-5" })
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-0 flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
								active: lyricsTab === "upnext",
								onClick: () => setLyricsTab("upnext"),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListMusic, { className: "size-4" }),
								label: "Up next"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
								active: lyricsTab === "lyrics",
								onClick: () => setLyricsTab("lyrics"),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicVocal, { className: "size-4" }),
								label: "Lyrics"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-h-0 flex-1 overflow-auto rounded-lg bg-surface p-2",
							children: lyricsTab === "upnext" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [queue.slice(index + 1, index + 20).map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackRow, {
								track: t,
								queue,
								showAlbum: false
							}, `${t.id}-${i}`)), index + 1 >= queue.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-3 py-8 text-center text-sm text-muted",
								children: "Queue is empty. Songs will keep playing from radio when this mix ends."
							}) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LyricsPane, {
								loading: lyricsQuery.isLoading,
								synced: lyricsQuery.data?.synced ?? null,
								plain: lyricsQuery.data?.plain ?? null,
								progress
							})
						}),
						remaining ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 flex items-center gap-2 text-xs text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-3.5" }),
								" Sleep timer · ",
								remaining
							]
						}) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: sleepOpen,
				onOpenChange: setSleepOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: "Sleep timer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [[
							5,
							15,
							30,
							45,
							60
						].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "h-11 rounded-md bg-chip text-sm hover:bg-hover",
							onClick: () => {
								setSleep(m);
								setSleepOpen(false);
							},
							children: [m, " min"]
						}, m)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "col-span-2 h-11 rounded-md bg-chip text-sm hover:bg-hover",
							onClick: () => {
								setSleep(null);
								setSleepOpen(false);
							},
							children: "Turn off"
						})]
					})
				})
			})
		]
	});
}
function Tab({ active, onClick, icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm", active ? "bg-fg text-bg" : "bg-chip text-fg hover:bg-hover"),
		children: [icon, label]
	});
}
function LyricsPane({ loading, synced, plain, progress }) {
	const active = (0, import_react.useMemo)(() => {
		if (!synced?.length) return -1;
		let i = 0;
		for (let n = 0; n < synced.length; n++) if (synced[n].time <= progress) i = n;
		return i;
	}, [synced, progress]);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		(ref.current?.querySelector(`[data-i="${active}"]`))?.scrollIntoView({
			block: "center",
			behavior: "smooth"
		});
	}, [active]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-3 py-8 text-center text-sm text-muted",
		children: "Loading lyrics…"
	});
	if (synced?.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: "space-y-3 px-3 py-6",
		children: synced.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			"data-i": i,
			className: cn("lyrics-line font-display text-xl leading-snug", i === active ? "scale-100 text-fg" : "scale-[0.98] text-subtle"),
			children: line.text
		}, `${line.time}-${i}`))
	});
	if (plain) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
		className: "px-4 py-6 font-sans text-sm leading-relaxed whitespace-pre-wrap text-muted",
		children: plain
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-3 py-8 text-center text-sm text-muted",
		children: "Lyrics aren't available for this track."
	});
}
function TooltipProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, {
		delayDuration: 250,
		children
	});
}
function Tooltip({ content, children, side = "top" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root3, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger$1, {
		asChild: true,
		children
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
		side,
		sideOffset: 6,
		className: "z-50 rounded-sm bg-fg px-2 py-1 text-xs font-medium text-bg",
		children: content
	}) })] });
}
function SeekBar() {
	const progress = usePlayer((s) => s.progress);
	const duration = usePlayer((s) => s.duration);
	const seek = usePlayer((s) => s.seek);
	duration > 0 && progress / duration * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-8 text-right text-[11px] text-muted tabular-nums",
				children: formatTime(progress)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "range",
				min: 0,
				max: duration || 30,
				step: .1,
				value: Math.min(progress, duration || 30),
				onChange: (e) => seek(Number(e.target.value)),
				"aria-label": "Seek",
				className: "h-1 w-full cursor-pointer appearance-none rounded-full bg-fg/20 accent-fg"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-8 text-[11px] text-muted tabular-nums",
				children: formatTime(duration)
			})
		]
	});
}
function PlayerBar() {
	const track = usePlayer((s) => s.queue[s.index] ?? null);
	const playing = usePlayer((s) => s.playing);
	const shuffle = usePlayer((s) => s.shuffle);
	const repeat = usePlayer((s) => s.repeat);
	const volume = usePlayer((s) => s.volume);
	const muted = usePlayer((s) => s.muted);
	const progress = usePlayer((s) => s.progress);
	const duration = usePlayer((s) => s.duration);
	const toggle = usePlayer((s) => s.toggle);
	const next = usePlayer((s) => s.next);
	const prev = usePlayer((s) => s.prev);
	const toggleShuffle = usePlayer((s) => s.toggleShuffle);
	const cycleRepeat = usePlayer((s) => s.cycleRepeat);
	const setVolume = usePlayer((s) => s.setVolume);
	const toggleMute = usePlayer((s) => s.toggleMute);
	const setFullOpen = usePlayer((s) => s.setFullOpen);
	const setQueueOpen = usePlayer((s) => s.setQueueOpen);
	const queueOpen = usePlayer((s) => s.queueOpen);
	const liked = useLibrary((s) => track ? Boolean(s.liked[track.id]) : false);
	const toggleLike = useLibrary((s) => s.toggleLike);
	if (!track) return null;
	const pct = duration > 0 ? progress / duration * 100 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed right-0 bottom-nav left-0 z-40 border-t border-border bg-player md:hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-0.5 bg-fg/15",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full bg-fg",
				style: { width: `${pct}%` }
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-14 items-center gap-3 px-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex min-w-0 flex-1 items-center gap-3 text-left",
					onClick: () => setFullOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: track.cover,
						alt: "",
						className: "cover size-10 rounded-xs object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: track.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted",
							children: track.artist
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": liked ? "Unlike" : "Like",
					onClick: () => toggleLike(track),
					className: cn("inline-flex size-11 items-center justify-center", liked && "text-accent"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-5", liked && "fill-current") })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": playing ? "Pause" : "Play",
					onClick: toggle,
					className: "inline-flex size-11 items-center justify-center",
					children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-6 fill-fg" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
						className: "size-6 fill-fg",
						style: { marginLeft: 2 }
					})
				})
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed right-0 bottom-0 left-0 z-40 hidden h-bar border-t border-border bg-player md:block",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid h-full grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,1.1fr)] items-center gap-4 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setFullOpen(true),
							className: "shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: track.cover,
								alt: "",
								className: "cover size-14 rounded-xs object-cover"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: track.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-muted",
								children: track.artist
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": liked ? "Unlike" : "Like",
							onClick: () => toggleLike(track),
							className: cn("inline-flex size-10 items-center justify-center rounded-full hover:bg-chip", liked && "text-accent"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-4", liked && "fill-current") })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								content: shuffle ? "Shuffle on" : "Shuffle",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Shuffle",
									onClick: toggleShuffle,
									className: cn("inline-flex size-10 items-center justify-center rounded-full hover:bg-chip", shuffle && "text-fg", !shuffle && "text-muted"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "size-4" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Previous",
								onClick: prev,
								className: "inline-flex size-10 items-center justify-center rounded-full hover:bg-chip",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipBack, { className: "size-5 fill-current" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": playing ? "Pause" : "Play",
								onClick: toggle,
								className: "inline-flex size-12 items-center justify-center rounded-full bg-fg text-bg hover:opacity-90",
								children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-5 fill-current" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
									className: "size-5 fill-current",
									style: { marginLeft: 2 }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Next",
								onClick: next,
								className: "inline-flex size-10 items-center justify-center rounded-full hover:bg-chip",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-5 fill-current" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								content: repeat === "one" ? "Repeat one" : repeat === "all" ? "Repeat all" : "Repeat",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Repeat",
									onClick: cycleRepeat,
									className: cn("inline-flex size-10 items-center justify-center rounded-full hover:bg-chip", repeat === "off" ? "text-muted" : "text-fg"),
									children: repeat === "one" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat1, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat, { className: "size-4" })
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full max-w-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeekBar, {})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end gap-0.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mr-1 rounded-full bg-chip px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted uppercase",
							children: "Preview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							content: "Queue",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Queue",
								onClick: () => setQueueOpen(!queueOpen),
								className: cn("inline-flex size-10 items-center justify-center rounded-full hover:bg-chip", queueOpen && "text-fg"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListMusic, { className: "size-4" })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							content: "Cast",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Cast",
								className: "inline-flex size-10 items-center justify-center rounded-full text-muted hover:bg-chip",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cast, { className: "size-4" })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": muted ? "Unmute" : "Mute",
							onClick: toggleMute,
							className: "inline-flex size-10 items-center justify-center rounded-full hover:bg-chip",
							children: muted || volume === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 1,
							step: .01,
							value: muted ? 0 : volume,
							onChange: (e) => setVolume(Number(e.target.value)),
							"aria-label": "Volume",
							className: "h-1 w-24 cursor-pointer appearance-none rounded-full bg-fg/20 accent-fg"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							content: "Now playing",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Expand player",
								onClick: () => setFullOpen(true),
								className: "inline-flex size-10 items-center justify-center rounded-full hover:bg-chip",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "size-4" })
							})
						})
					]
				})
			]
		})
	})] });
}
function QueuePanel() {
	const open = usePlayer((s) => s.queueOpen);
	const setOpen = usePlayer((s) => s.setQueueOpen);
	const queue = usePlayer((s) => s.queue);
	const index = usePlayer((s) => s.index);
	const clearQueue = usePlayer((s) => s.clearQueue);
	if (!open) return null;
	const current = queue[index];
	const upNext = queue.slice(index + 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "fixed top-14 right-0 bottom-bar z-40 hidden w-96 flex-col border-l border-border bg-surface md:flex",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-14 items-center justify-between px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-base font-semibold",
				children: "Queue"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-full px-3 py-1 text-xs text-muted hover:bg-chip hover:text-fg",
					onClick: clearQueue,
					children: "Clear"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close queue",
					onClick: () => setOpen(false),
					className: "inline-flex size-10 items-center justify-center rounded-full hover:bg-chip",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-auto px-2 pb-4",
			children: [current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-2 pb-1 text-xs font-medium tracking-wide text-muted uppercase",
					children: "Now playing"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackRow, {
					track: current,
					queue,
					showAlbum: false
				})]
			}) : null, upNext.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-2 pb-1 text-xs font-medium tracking-wide text-muted uppercase",
				children: "Next"
			}), upNext.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackRow, {
				track: t,
				queue,
				showAlbum: false
			}, `${t.id}-${i}`))] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-3 py-6 text-sm text-muted",
				children: "No upcoming tracks."
			})]
		})]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,color,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-fg text-bg hover:bg-fg/90",
			accent: "bg-accent text-accent-fg hover:bg-accent/90",
			ghost: "bg-transparent text-fg hover:bg-chip",
			chip: "bg-chip text-fg hover:bg-hover",
			outline: "bg-transparent text-fg ring-1 ring-inset ring-border hover:bg-chip",
			subtle: "bg-elevated text-fg hover:bg-chip"
		},
		size: {
			sm: "h-8 rounded-sm px-3 text-sm",
			md: "h-10 rounded-md px-4 text-sm",
			lg: "h-12 rounded-lg px-5 text-base",
			icon: "size-10 rounded-full",
			"icon-sm": "size-8 rounded-full",
			"icon-lg": "size-14 rounded-full"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "md"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-10 w-full rounded-md bg-chip px-3 text-sm text-fg placeholder:text-subtle", "outline-none ring-1 ring-inset ring-transparent transition-[box-shadow,background-color] duration-150", "focus:ring-ring", className),
		...props
	});
}
function Logo() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: "flex items-center gap-2 px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "inline-flex size-8 items-center justify-center rounded-sm bg-accent",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 24 24",
				className: "size-4 fill-accent-fg",
				"aria-hidden": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 5.5v13l11-6.5L8 5.5z" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-lg font-semibold tracking-tight",
			children: "Pulse"
		})]
	});
}
var NAV = [
	{
		to: "/",
		label: "Home",
		icon: House
	},
	{
		to: "/explore",
		label: "Explore",
		icon: Compass
	},
	{
		to: "/library",
		label: "Library",
		icon: Library
	},
	{
		to: "/premium",
		label: "Premium",
		icon: Sparkles
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const hasTrack = usePlayer((s) => s.queue.length > 0);
	const playlists = useLibrary((s) => s.playlists);
	const createPlaylist = useLibrary((s) => s.createPlaylist);
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const [newOpen, setNewOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const finish = () => usePlayer.setState({
			hydrated: true,
			playing: false,
			fullOpen: false
		});
		const unsub = usePlayer.persist.onFinishHydration(finish);
		if (usePlayer.persist.hasHydrated()) finish();
		return unsub;
	}, []);
	const onSearch = (e) => {
		e.preventDefault();
		navigate({
			to: "/search",
			search: { q: q.trim() }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioEngine, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed top-0 bottom-0 left-0 z-30 hidden w-rail flex-col border-r border-border bg-bg md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex flex-col gap-1 px-2",
						children: NAV.map((item) => {
							const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium", active ? "bg-chip text-fg" : "text-muted hover:bg-elevated hover:text-fg"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5" }), item.label]
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 px-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "chip",
							size: "sm",
							className: "w-full justify-start",
							onClick: () => setNewOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " New playlist"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex-1 space-y-1 overflow-auto px-2 pb-bar",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/library",
								className: "flex h-9 items-center gap-3 rounded-md px-3 text-sm text-muted hover:bg-elevated hover:text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-4" }), " Liked music"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/library",
								className: "flex h-9 items-center gap-3 rounded-md px-3 text-sm text-muted hover:bg-elevated hover:text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Downloads"]
							}),
							playlists.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/playlist/$id",
								params: { id: p.id },
								className: "flex h-9 items-center rounded-md px-3 text-sm text-muted hover:bg-elevated hover:text-fg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: p.title
								})
							}, p.id))
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-bg/90 px-3 backdrop-blur-sm md:ml-rail md:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
					onSubmit: onSearch,
					className: "mx-auto w-full max-w-xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "relative block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search songs, albums, artists, playlists",
							className: "h-10 w-full rounded-full bg-chip pr-4 pl-10 text-sm text-fg placeholder:text-subtle outline-none ring-1 ring-inset ring-transparent focus:ring-ring"
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: cn("md:ml-rail", hasTrack ? "pb-36 md:pb-bar" : "pb-nav md:pb-8"),
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed right-0 bottom-0 left-0 z-30 flex h-nav items-stretch border-t border-border bg-bg md:hidden",
				children: NAV.map((item) => {
					const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: cn("flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium", active ? "text-fg" : "text-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5" }), item.label]
					}, item.to);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueuePanel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NowPlaying, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: newOpen,
				onOpenChange: setNewOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: "New playlist",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "space-y-3",
						onSubmit: (e) => {
							e.preventDefault();
							const id = createPlaylist(title || "New playlist");
							setTitle("");
							setNewOpen(false);
							navigate({
								to: "/playlist/$id",
								params: { id }
							});
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: "Playlist title",
							autoFocus: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							children: "Create"
						})]
					})
				})
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var styles_default = "/assets/styles-CueqM25f.css";
var APP_NAME = "Pulse";
var Route$11 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#030303"
			},
			{
				name: "description",
				content: "Pulse — music for you. Search the world catalog, play in the background, download, lyrics, and Premium extras."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Outfit:wght@500;600;700&display=swap"
			}
		]
	}),
	component: RootComponent
});
function RootComponent() {
	const [queryClient] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		staleTime: 3e5,
		refetchOnWindowFocus: false,
		retry: 1
	} } }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
					client: queryClient,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) })
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$10 = () => import("./routes-A18kVp1I.mjs");
var Route$10 = createFileRoute("/")({
	loader: () => getHomeFeed(),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./explore-Be2Juq43.mjs");
var Route$9 = createFileRoute("/explore")({
	loader: () => getHomeFeed(),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./library-yDpRceLh.mjs");
var Route$8 = createFileRoute("/library")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./premium-C04JECmk.mjs");
var Route$7 = createFileRoute("/premium")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./search-CnQNaAXs.mjs");
var Route$6 = createFileRoute("/search")({
	validateSearch: (s) => ({ q: typeof s.q === "string" ? s.q : "" }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./album._id-CKfM6YKb.mjs");
var Route$5 = createFileRoute("/album/$id")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./artist._id-CgYRapIj.mjs");
var Route$4 = createFileRoute("/artist/$id")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./genre._id-ak668OTt.mjs");
var Route$3 = createFileRoute("/genre/$id")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./mood._id-RYpLvIRW.mjs");
var Route$2 = createFileRoute("/mood/$id")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./playlist._id-BVv5SnGf.mjs");
var Route$1 = createFileRoute("/playlist/$id")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./radio._id-BgHxR4FK.mjs");
var Route = createFileRoute("/radio/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$10.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$11
	}),
	ExploreRoute: Route$9.update({
		id: "/explore",
		path: "/explore",
		getParentRoute: () => Route$11
	}),
	LibraryRoute: Route$8.update({
		id: "/library",
		path: "/library",
		getParentRoute: () => Route$11
	}),
	PremiumRoute: Route$7.update({
		id: "/premium",
		path: "/premium",
		getParentRoute: () => Route$11
	}),
	SearchRoute: Route$6.update({
		id: "/search",
		path: "/search",
		getParentRoute: () => Route$11
	}),
	AlbumIdRoute: Route$5.update({
		id: "/album/$id",
		path: "/album/$id",
		getParentRoute: () => Route$11
	}),
	ArtistIdRoute: Route$4.update({
		id: "/artist/$id",
		path: "/artist/$id",
		getParentRoute: () => Route$11
	}),
	GenreIdRoute: Route$3.update({
		id: "/genre/$id",
		path: "/genre/$id",
		getParentRoute: () => Route$11
	}),
	MoodIdRoute: Route$2.update({
		id: "/mood/$id",
		path: "/mood/$id",
		getParentRoute: () => Route$11
	}),
	PlaylistIdRoute: Route$1.update({
		id: "/playlist/$id",
		path: "/playlist/$id",
		getParentRoute: () => Route$11
	}),
	RadioIdRoute: Route.update({
		id: "/radio/$id",
		path: "/radio/$id",
		getParentRoute: () => Route$11
	})
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { searchCatalog as C, getRadio as S, usePlayer as _, Route$3 as a, getGenre as b, Route$6 as c, Button as d, TrackRow as f, formatTime as g, formatFans as h, Route$2 as i, Route$9 as l, cn as m, Route as n, Route$4 as o, useLibrary as p, Route$1 as r, Route$5 as s, router_exports as t, Route$10 as u, getAlbum as v, searchMood as w, getPlaylist as x, getArtist as y };
