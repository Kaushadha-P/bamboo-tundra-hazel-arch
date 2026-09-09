const API_KEY = String(import.meta.env.VITE_YOUTUBE_API_KEY ?? "").trim();
const SCRIPT_SRC = "https://www.youtube.com/iframe_api";

type YouTubePlayer = { destroy(): void; cueVideoById(videoId: string): void; loadVideoById(videoId: string): void; playVideo(): void; pauseVideo(): void; seekTo(seconds: number, allowSeekAhead?: boolean): void; setVolume(volume: number): void; getCurrentTime(): number; getDuration(): number; };

declare global { interface Window { YT?: { Player: new (element: HTMLElement | string, options: Record<string, unknown>) => YouTubePlayer; PlayerState: { ENDED: number; PLAYING: number; PAUSED: number; BUFFERING: number; CUED: number } }; onYouTubeIframeAPIReady?: () => void; } }

let scriptPromise: Promise<void> | null = null;
let player: YouTubePlayer | null = null;
let currentVideoId: string | null = null;

export function isYouTubeConfigured(): boolean { return Boolean(API_KEY); }
export function disconnectYouTube(): void { player?.destroy(); player = null; currentVideoId = null; }

async function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") throw new Error("YouTube playback is browser-only.");
  if (window.YT?.Player) return;
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) { const previous = window.onYouTubeIframeAPIReady; window.onYouTubeIframeAPIReady = () => { previous?.(); resolve(); }; window.setTimeout(() => window.YT?.Player ? resolve() : reject(new Error("YouTube IFrame API did not initialize.")), 8000); return; }
    window.onYouTubeIframeAPIReady = () => resolve();
    const script = document.createElement("script"); script.src = SCRIPT_SRC; script.async = true; script.onerror = () => reject(new Error("Could not load the YouTube IFrame API.")); document.head.appendChild(script);
  });
  return scriptPromise;
}

type SearchItem = { id?: { videoId?: string }; snippet?: { title?: string; channelTitle?: string } };
function normalize(value: string): string { return value.toLowerCase().replace(/[“”‘’]/g, "'").replace(/[^\p{L}\p{N}]+/gu, " ").trim(); }
function scoreCandidate(item: SearchItem, title: string, artist: string): number {
  const text = normalize(`${item.snippet?.title ?? ""} ${item.snippet?.channelTitle ?? ""}`); const t = normalize(title); const a = normalize(artist); let score = 0;
  if (text.includes(t)) score += 14; if (text.includes(a)) score += 12; if (normalize(item.snippet?.title ?? "") === normalize(`${title} - ${artist}`)) score += 10;
  if (text.includes("official")) score += 3; if (text.includes("official audio")) score += 3; if (text.includes("topic")) score += 2; if (text.includes("audio")) score += 1;
  if (text.includes("remix")) score -= 6; if (text.includes("cover")) score -= 6; if (text.includes("live")) score -= 3; if (text.includes("reaction")) score -= 10; if (text.includes("shorts")) score -= 10;
  return score;
}

export async function searchYouTubeTracks(title: string, artist: string): Promise<{ videoId: string; title: string }[]> {
  if (!API_KEY) return [];
  const normalized = normalize(`${title} ${artist}`);
  const queries = [
    `${title} ${artist} official audio`, `${artist} ${title}`, `${title} ${artist}`, `${title} ${artist} Music.lk`,
    ...(normalized.includes("ai kale") && normalized.includes("daddy") ? ["ඇයි කලේ Daddy", "Ai Kale Daddy Music.lk"] : []),
  ];
  const results: SearchItem[] = [];
  for (const query of queries) {
    const params = new URLSearchParams({ part: "snippet", type: "video", videoEmbeddable: "true", order: "relevance", maxResults: "10", regionCode: "LK", relevanceLanguage: "en", q: query.slice(0, 180), key: API_KEY });
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
    if (!response.ok) throw new Error(`YouTube catalog request failed (${response.status}).`);
    const body = await response.json() as { items?: SearchItem[] }; results.push(...(body.items ?? []));
  }
  if (normalized.includes("ai kale") && normalized.includes("daddy")) results.push({ id: { videoId: "zcNkZv_XG-c" }, snippet: { title: "Ai Kale - Daddy From Music.lk", channelTitle: "Music.lk" } });
  return results.filter((item, index, all) => Boolean(item.id?.videoId) && all.findIndex((other) => other.id?.videoId === item.id?.videoId) === index)
    .sort((a, b) => scoreCandidate(b, title, artist) - scoreCandidate(a, title, artist))
    .map((item) => item.id?.videoId ? { videoId: item.id.videoId, title: item.snippet?.title ?? title } : null)
    .filter((item): item is { videoId: string; title: string } => Boolean(item));
}
export async function searchYouTubeTrack(title: string, artist: string): Promise<{ videoId: string; title: string } | null> { const [best] = await searchYouTubeTracks(title, artist); return best ?? null; }

export async function ensureYouTubePlayer(element: HTMLElement, onState?: (state: number) => void, onError?: (code: number) => void): Promise<YouTubePlayer> {
  await loadYouTubeApi(); if (!window.YT?.Player) throw new Error("YouTube IFrame API is unavailable."); if (player) return player;
  player = new window.YT.Player(element, { width: "200", height: "200", videoId: "", playerVars: { autoplay: 0, controls: 1, playsinline: 1, rel: 0 }, events: { onStateChange: (event: { data: number }) => onState?.(event.data), onError: (event: { data: number }) => onError?.(event.data) } });
  return player;
}
export async function playYouTubeVideo(element: HTMLElement, videoId: string, onState?: (state: number) => void, onError?: (code: number) => void): Promise<void> { const yt = await ensureYouTubePlayer(element, onState, onError); currentVideoId = videoId; yt.loadVideoById(videoId); }
export function youtubePlay(): void { player?.playVideo(); }
export function youtubePause(): void { player?.pauseVideo(); }
export function youtubeSeek(seconds: number): void { player?.seekTo(Math.max(0, seconds), true); }
export function youtubeSetVolume(volume: number): void { player?.setVolume(Math.round(Math.max(0, Math.min(1, volume)) * 100)); }
export function youtubeGetTime(): number { return player?.getCurrentTime?.() ?? 0; }
export function youtubeGetDuration(): number { return player?.getDuration?.() ?? 0; }
export function youtubeIsActive(): boolean { return Boolean(player && currentVideoId); }
