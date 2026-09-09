const CLIENT_ID = String(import.meta.env.VITE_SPOTIFY_CLIENT_ID ?? "").trim();
const TOKEN_KEY = "pulse.spotify.token";
const REFRESH_KEY = "pulse.spotify.refresh";
const EXPIRES_KEY = "pulse.spotify.expires";
const VERIFIER_KEY = "pulse.spotify.verifier";
const STATE_KEY = "pulse.spotify.state";

const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-modify-playback-state",
].join(" ");

type StoredToken = { accessToken: string; expiresAt: number };

type SpotifyPlayer = {
  connect(): Promise<boolean>;
  disconnect(): void;
  addListener(event: string, callback: (data: any) => void): void;
  removeListener(event: string, callback?: (data: any) => void): void;
  activateElement(): Promise<void>;
  getCurrentState(): Promise<any>;
};

declare global {
  interface Window {
    Spotify?: { Player: new (options: any) => SpotifyPlayer };
    onSpotifyWebPlaybackSDKReady?: () => void;
  }
}

function redirectUri(): string {
  return `${window.location.origin}/premium`;
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sha256(value: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
}

function randomString(length = 64): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return base64Url(bytes).slice(0, length);
}

export function isSpotifyConfigured(): boolean {
  return Boolean(CLIENT_ID);
}

export function isSpotifyConnected(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem(TOKEN_KEY) || localStorage.getItem(REFRESH_KEY));
}

export function disconnectSpotify(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(EXPIRES_KEY);
  localStorage.removeItem(VERIFIER_KEY);
  localStorage.removeItem(STATE_KEY);
}

export async function connectSpotify(): Promise<void> {
  if (!CLIENT_ID) throw new Error("Set VITE_SPOTIFY_CLIENT_ID before connecting Spotify.");
  const verifier = randomString();
  const challenge = base64Url(new Uint8Array(await sha256(verifier)));
  const state = randomString(32);
  localStorage.setItem(VERIFIER_KEY, verifier);
  localStorage.setItem(STATE_KEY, state);

  const url = new URL("https://accounts.spotify.com/authorize");
  url.search = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: redirectUri(),
    scope: SCOPES,
    state,
    code_challenge_method: "S256",
    code_challenge: challenge,
  }).toString();
  window.location.assign(url.toString());
}

async function exchangeCode(code: string): Promise<void> {
  const verifier = localStorage.getItem(VERIFIER_KEY);
  if (!verifier) throw new Error("Spotify authorization verifier is missing.");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri(),
      code_verifier: verifier,
    }),
  });
  const body = await response.json() as { access_token?: string; refresh_token?: string; expires_in?: number; error?: string };
  if (!response.ok || !body.access_token) throw new Error(body.error || "Spotify authorization failed.");
  localStorage.setItem(TOKEN_KEY, body.access_token);
  if (body.refresh_token) localStorage.setItem(REFRESH_KEY, body.refresh_token);
  localStorage.setItem(EXPIRES_KEY, String(Date.now() + Math.max(60, body.expires_in ?? 3600) * 1000));
}

export async function finishSpotifyCallback(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  if (!code) return false;
  const state = params.get("state");
  if (!state || state !== localStorage.getItem(STATE_KEY)) throw new Error("Spotify authorization state mismatch.");
  await exchangeCode(code);
  localStorage.removeItem(VERIFIER_KEY);
  localStorage.removeItem(STATE_KEY);
  window.history.replaceState({}, document.title, window.location.pathname);
  return true;
}

async function refreshToken(refresh: string): Promise<StoredToken> {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh, client_id: CLIENT_ID }),
  });
  const body = await response.json() as { access_token?: string; refresh_token?: string; expires_in?: number; error?: string };
  if (!response.ok || !body.access_token) {
    disconnectSpotify();
    throw new Error(body.error === "invalid_grant" ? "Spotify authorization expired. Please reconnect." : "Spotify token refresh failed.");
  }
  if (body.refresh_token) localStorage.setItem(REFRESH_KEY, body.refresh_token);
  const expiresAt = Date.now() + Math.max(60, body.expires_in ?? 3600) * 1000;
  localStorage.setItem(TOKEN_KEY, body.access_token);
  localStorage.setItem(EXPIRES_KEY, String(expiresAt));
  return { accessToken: body.access_token, expiresAt };
}

export async function getSpotifyAccessToken(): Promise<string> {
  if (typeof window === "undefined") throw new Error("Spotify is browser-only.");
  const accessToken = localStorage.getItem(TOKEN_KEY);
  const expiresAt = Number(localStorage.getItem(EXPIRES_KEY) ?? 0);
  if (accessToken && Date.now() < expiresAt - 60_000) return accessToken;
  const refresh = localStorage.getItem(REFRESH_KEY);
  if (!refresh) throw new Error("Spotify is not connected.");
  return (await refreshToken(refresh)).accessToken;
}

async function spotifyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getSpotifyAccessToken();
  const response = await fetch(`https://api.spotify.com/v1${path}`, {
    ...init,
    headers: { Accept: "application/json", Authorization: `Bearer ${token}`, ...(init?.headers ?? {}) },
  });
  if (!response.ok) throw new Error(`Spotify request failed (${response.status}).`);
  if (response.status === 204) return undefined as T;
  return await response.json() as T;
}

export async function searchSpotifyTrack(title: string, artist: string): Promise<{ id: string; uri: string } | null> {
  const query = encodeURIComponent(`track:${title} artist:${artist}`);
  const body = await spotifyFetch<{ tracks?: { items?: { id: string; uri: string }[] } }>(`/search?q=${query}&type=track&limit=1`);
  const item = body.tracks?.items?.[0];
  return item ? { id: item.id, uri: item.uri } : null;
}

let sdkPromise: Promise<void> | null = null;
let player: SpotifyPlayer | null = null;
let deviceId: string | null = null;

async function loadSdk(): Promise<void> {
  if (window.Spotify) return;
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise<void>((resolve, reject) => {
    const previous = window.onSpotifyWebPlaybackSDKReady;
    window.onSpotifyWebPlaybackSDKReady = () => {
      previous?.();
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.onerror = () => reject(new Error("Could not load the Spotify Web Playback SDK."));
    document.head.appendChild(script);
  });
  return sdkPromise;
}

export async function ensureSpotifyPlayer(onState?: (state: any) => void): Promise<SpotifyPlayer> {
  await loadSdk();
  if (!window.Spotify) throw new Error("Spotify Web Playback SDK is unavailable.");
  if (player) return player;

  player = new window.Spotify.Player({
    name: "Pulse Web Player",
    volume: 0.8,
    enableMediaSession: true,
    getOAuthToken: async (cb: (token: string) => void) => cb(await getSpotifyAccessToken()),
  });
  player.addListener("ready", ({ device_id }: { device_id: string }) => { deviceId = device_id; });
  player.addListener("player_state_changed", (state: any) => onState?.(state));
  player.addListener("authentication_error", ({ message }: { message: string }) => console.error(message));
  player.addListener("account_error", ({ message }: { message: string }) => console.error(message));
  player.addListener("playback_error", ({ message }: { message: string }) => console.error(message));
  const connected = await player.connect();
  if (!connected) throw new Error("Spotify Web Playback SDK could not connect.");
  return player;
}

export async function playSpotifyUri(uri: string, onState?: (state: any) => void): Promise<void> {
  const sdkPlayer = await ensureSpotifyPlayer(onState);
  if (!deviceId) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  if (!deviceId) throw new Error("Spotify player device is not ready yet.");
  const token = await getSpotifyAccessToken();
  await fetch("https://api.spotify.com/v1/me/player", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ device_ids: [deviceId], play: false }),
  });
  await fetch("https://api.spotify.com/v1/me/player/play", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ device_id: deviceId, uris: [uri] }),
  });
  await sdkPlayer.activateElement();
}

export async function spotifyTogglePlay(): Promise<void> {
  const sdkPlayer = await ensureSpotifyPlayer();
  const state = await sdkPlayer.getCurrentState();
  if (state?.paused) {
    const token = await getSpotifyAccessToken();
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${encodeURIComponent(deviceId ?? "")}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
  } else {
    const token = await getSpotifyAccessToken();
    await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${encodeURIComponent(deviceId ?? "")}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
  }
}
