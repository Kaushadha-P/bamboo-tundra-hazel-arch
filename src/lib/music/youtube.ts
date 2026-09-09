const API_KEY = String(import.meta.env.VITE_YOUTUBE_API_KEY ?? "").trim();
const SCRIPT_SRC = "https://www.youtube.com/iframe_api";

type YouTubePlayer = {
  destroy(): void;
  cueVideoById(videoId: string): void;
  loadVideoById(videoId: string): void;
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead?: boolean): void;
  setVolume(volume: number): void;
  getCurrentTime(): number;
  getDuration(): number;
};

declare global {
  interface Window {
    YT?: {
      Player: new (element: HTMLElement | string, options: Record<string, unknown>) => YouTubePlayer;
      PlayerState: { ENDED: number; PLAYING: number; PAUSED: number; BUFFERING: number; CUED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let scriptPromise: Promise<void> | null = null;
let player: YouTubePlayer | null = null;
let currentVideoId: string | null = null;

export function isYouTubeConfigured(): boolean {
  return Boolean(API_KEY);
}

export function disconnectYouTube(): void {
  player?.destroy();
  player = null;
  currentVideoId = null;
}

async function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") throw new Error("YouTube playback is browser-only.");
  if (window.YT?.Player) return;
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { previous?.(); resolve(); };
      window.setTimeout(() => window.YT?.Player ? resolve() : reject(new Error("YouTube IFrame API did not initialize.")), 8000);
      return;
    }
    window.onYouTubeIframeAPIReady = () => resolve();
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onerror = () => reject(new Error("Could not load the YouTube IFrame API."));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

type SearchItem = {
  id?: { videoId?: string };
  snippet?: { title?: string; channelTitle?: string; description?: string };
};

function scoreCandidate(item: SearchItem, title: string, artist: string): number {
  const videoTitle = item.snippet?.title ?? "";
  const channel = item.snippet?.channelTitle ?? "";
  const text = `${videoTitle} ${channel}`.toLowerCase();
  const normalizedTitle = title.toLowerCase();
  const normalizedArtist = artist.toLowerCase();
  let score = 0;
  if (text.includes(normalizedTitle)) score += 8;
  if (text.includes(normalizedArtist)) score += 6;
  if (text.includes("official")) score += 3;
  if (text.includes("official audio")) score += 2;
  if (text.includes("topic")) score += 2;
  if (text.includes("lyrics")) score += 1;
  if (text.includes("remix")) score -= 5;
  if (text.includes("cover")) score -= 5;
  if (text.includes("live")) score -= 3;
  if (text.includes("reaction")) score -= 8;
  if (text.includes("shorts")) score -= 8;
  return score;
}

export async function searchYouTubeTrack(title: string, artist: string): Promise<{ videoId: string; title: string } | null> {
  if (!API_KEY) return null;

  const queries = [
    `${title} ${artist} official audio`,
    `${title} ${artist}`,
  ];

  const results: SearchItem[] = [];
  for (const query of queries) {
    const params = new URLSearchParams({
      part: "snippet",
      type: "video",
      videoCategoryId: "10",
      videoEmbeddable: "true",
      videoSyndicated: "true",
      order: "relevance",
      maxResults: "10",
      regionCode: "LK",
      relevanceLanguage: "en",
      q: query.slice(0, 180),
      key: API_KEY,
    });
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
    if (!response.ok) throw new Error(`YouTube catalog request failed (${response.status}).`);
    const body = await response.json() as { items?: SearchItem[] };
    results.push(...(body.items ?? []));
    if (results.length >= 10) break;
  }

  const candidates = results.filter((item, index, all) => {
    const id = item.id?.videoId;
    return Boolean(id) && all.findIndex((other) => other.id?.videoId === id) === index;
  });

  const ranked = candidates.sort((a, b) => scoreCandidate(b, title, artist) - scoreCandidate(a, title, artist));
  const best = ranked[0];
  return best?.id?.videoId
    ? { videoId: best.id.videoId, title: best.snippet?.title ?? title }
    : null;
}

export async function ensureYouTubePlayer(element: HTMLElement, onState?: (state: number) => void): Promise<YouTubePlayer> {
  await loadYouTubeApi();
  if (!window.YT?.Player) throw new Error("YouTube IFrame API is unavailable.");
  if (player) return player;

  player = new window.YT.Player(element, {
    width: "200",
    height: "200",
    videoId: "",
    playerVars: { autoplay: 0, controls: 1, playsinline: 1, rel: 0 },
    events: {
      onStateChange: (event: { data: number }) => onState?.(event.data),
    },
  });
  return player;
}

export async function playYouTubeVideo(element: HTMLElement, videoId: string, onState?: (state: number) => void): Promise<void> {
  const yt = await ensureYouTubePlayer(element, onState);
  currentVideoId = videoId;
  yt.loadVideoById(videoId);
}

export function youtubePlay(): void { player?.playVideo(); }
export function youtubePause(): void { player?.pauseVideo(); }
export function youtubeSeek(seconds: number): void { player?.seekTo(Math.max(0, seconds), true); }
export function youtubeSetVolume(volume: number): void { player?.setVolume(Math.round(Math.max(0, Math.min(1, volume)) * 100)); }
export function youtubeGetTime(): number { return player?.getCurrentTime?.() ?? 0; }
export function youtubeGetDuration(): number { return player?.getDuration?.() ?? 0; }
export function youtubeIsActive(): boolean { return Boolean(player && currentVideoId); }
