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
    YT?: { Player: new (element: HTMLElement | string, options: Record<string, unknown>) => YouTubePlayer; PlayerState: { ENDED: number; PLAYING: number; PAUSED: number; BUFFERING: number; CUED: number } };
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

export async function searchYouTubeTrack(title: string, artist: string): Promise<{ videoId: string; title: string } | null> {
  if (!API_KEY) return null;
  const q = encodeURIComponent(`${title} ${artist}`.slice(0, 180));
  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=5&q=${q}&key=${encodeURIComponent(API_KEY)}`);
  if (!response.ok) throw new Error(`YouTube catalog request failed (${response.status}).`);
  const body = await response.json() as { items?: { id?: { videoId?: string }; snippet?: { title?: string; channelTitle?: string } }[] };
  const candidates = (body.items ?? []).filter((item) => item.id?.videoId);
  const normalizedTitle = title.toLowerCase();
  const normalizedArtist = artist.toLowerCase();
  const ranked = candidates.sort((a, b) => {
    const score = (item: typeof a) => {
      const text = `${item.snippet?.title ?? ""} ${item.snippet?.channelTitle ?? ""}`.toLowerCase();
      return (text.includes(normalizedTitle) ? 2 : 0) + (text.includes(normalizedArtist) ? 1 : 0);
    };
    return score(b) - score(a);
  });
  const best = ranked[0];
  return best?.id?.videoId ? { videoId: best.id.videoId, title: best.snippet?.title ?? title } : null;
}

export async function ensureYouTubePlayer(element: HTMLElement, onState?: (state: number) => void): Promise<YouTubePlayer> {
  await loadYouTubeApi();
  if (!window.YT?.Player) throw new Error("YouTube IFrame API is unavailable.");
  if (player) return player;
  player = new window.YT.Player(element, {
    width: "200",
    height: "200",
    videoId: "",
    playerVars: { autoplay: 0, controls: 0, playsinline: 1, rel: 0, modestbranding: 1 },
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
