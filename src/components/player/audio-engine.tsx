import { useEffect, useRef } from "react";
import { getTrack } from "@/lib/music/api";
import { useLibrary } from "@/lib/music/library-store";
import { usePlayer } from "@/lib/music/player-store";
import { isSpotifyConnected, playSpotifyUri, searchSpotifyTrack, spotifySeek, spotifySetPaused, spotifySetVolume } from "@/lib/music/spotify";

function getPlaybackUrl(track: { playbackUrl?: string; previewUrl: string }): string { return track.playbackUrl || track.previewUrl; }

export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastId = useRef<string | null>(null);
  const seekLock = useRef(false);
  const wasPlayingBeforeHidden = useRef(false);
  const spotifyActive = useRef(false);

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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;

    const load = async () => {
      if (lastId.current === track.id && (audio.src || spotifyActive.current)) return;
      lastId.current = track.id;
      spotifyActive.current = false;
      if (!incognito) addRecent(track);

      // If the user connected Spotify Premium, resolve the catalog result to the
      // official Spotify recording and let Spotify's protected player handle it.
      if (isSpotifyConnected()) {
        try {
          const match = await searchSpotifyTrack(track.title, track.artist);
          if (match) {
            spotifyActive.current = true;
            await playSpotifyUri(match.uri, (state) => {
              if (!state) return;
              const duration = Number(state.duration ?? 0) / 1000;
              const position = Number(state.position ?? 0) / 1000;
              if (duration > 0) setProgress(position, duration);
              setPlaying(!state.paused);
            });
            return;
          }
        } catch {
          spotifyActive.current = false;
        }
      }

      audio.src = getPlaybackUrl(track);
      audio.load();
      if (playing) {
        try { await audio.play(); } catch { setPlaying(false); }
      }
    };
    void load();
  }, [track, addRecent, incognito, playing, setPlaying, setProgress]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (spotifyActive.current) {
      void spotifySetPaused(!playing).catch(() => setPlaying(false));
      return;
    }
    if (!track) { audio.pause(); return; }
    if (playing) void audio.play().catch(() => setPlaying(false)); else audio.pause();
  }, [playing, track, setPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (spotifyActive.current) {
      void spotifySetVolume(muted ? 0 : volume).catch(() => undefined);
      return;
    }
    if (audio) audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    if (spotifyActive.current) {
      void spotifySeek(progress * 1000).catch(() => undefined);
      return;
    }
    const audio = audioRef.current;
    if (!audio || seekLock.current) return;
    if (Math.abs(audio.currentTime - progress) > 1.2) {
      try { audio.currentTime = Math.min(Math.max(0, progress), Number.isFinite(audio.duration) ? audio.duration : progress); } catch { /* ignore */ }
    }
  }, [progress]);

  useEffect(() => {
    const onVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio || spotifyActive.current) return;
      if (document.visibilityState === "hidden") {
        wasPlayingBeforeHidden.current = !audio.paused;
        if (!backgroundPlay) { audio.pause(); setPlaying(false); }
      } else if (backgroundPlay && wasPlayingBeforeHidden.current && playing) {
        void audio.play().catch(() => setPlaying(false));
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [backgroundPlay, playing, setPlaying]);

  useEffect(() => {
    if (!sleepUntil) return;
    const ms = sleepUntil - Date.now();
    if (ms <= 0) { setPlaying(false); usePlayer.getState().setSleep(null); return; }
    const id = window.setTimeout(() => { setPlaying(false); usePlayer.getState().setSleep(null); }, ms);
    return () => window.clearTimeout(id);
  }, [sleepUntil, setPlaying]);

  useEffect(() => {
    if (!track || typeof navigator === "undefined" || !navigator.mediaSession) return;
    navigator.mediaSession.metadata = new MediaMetadata({ title: track.title, artist: track.artist, album: track.album, artwork: [{ src: track.cover, sizes: "250x250", type: "image/jpeg" }, { src: track.coverLg || track.cover, sizes: "512x512", type: "image/jpeg" }].filter((item) => Boolean(item.src)) });
    navigator.mediaSession.playbackState = playing ? "playing" : "paused";
    const audio = audioRef.current;
    const updatePositionState = () => {
      const duration = audio?.duration ?? usePlayer.getState().duration;
      const position = spotifyActive.current ? usePlayer.getState().progress : (audio?.currentTime ?? progress);
      if (Number.isFinite(duration) && duration > 0 && Number.isFinite(position) && position >= 0 && position <= duration) {
        try { navigator.mediaSession.setPositionState({ duration, playbackRate: 1, position }); } catch { /* unsupported */ }
      }
    };
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => setPlaying(true)], ["pause", () => setPlaying(false)], ["previoustrack", prev], ["nexttrack", next], ["stop", () => setPlaying(false)],
      ["seekbackward", (details) => seek(Math.max(0, progress - (details.seekOffset || 10)))],
      ["seekforward", (details) => seek(progress + (details.seekOffset || 10))],
      ["seekto", (details) => { if (details.seekTime != null) seek(details.seekTime); }],
    ];
    for (const [action, fn] of handlers) { try { navigator.mediaSession.setActionHandler(action, fn); } catch { /* unsupported */ } }
    updatePositionState();
    return () => { for (const [action] of handlers) { try { navigator.mediaSession.setActionHandler(action, null); } catch { /* ignore */ } } };
  }, [track, playing, progress, next, prev, setPlaying, seek]);

  useEffect(() => { document.title = track ? `${track.title} · ${track.artist}` : "Pulse"; }, [track]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;
      if (e.code === "Space") { e.preventDefault(); toggle(); }
      else if (e.code === "ArrowRight") seek(usePlayer.getState().progress + 5);
      else if (e.code === "ArrowLeft") seek(Math.max(0, usePlayer.getState().progress - 5));
      else if (e.key === "n" || e.key === "N") next(); else if (e.key === "p" || e.key === "P") prev();
      else if (e.key === "m" || e.key === "M") usePlayer.getState().toggleMute(); else if (e.key === "s" || e.key === "S") usePlayer.getState().toggleShuffle();
      else if (e.key === "r" || e.key === "R") usePlayer.getState().cycleRepeat(); else if (e.key === "f" || e.key === "F") usePlayer.getState().setFullOpen(!usePlayer.getState().fullOpen);
      else if (e.key === "]") usePlayer.getState().setVolume(Math.min(1, usePlayer.getState().volume + 0.05)); else if (e.key === "[") usePlayer.getState().setVolume(Math.max(0, usePlayer.getState().volume - 0.05));
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [toggle, next, prev, seek]);

  const syncMediaPosition = () => {
    const audio = audioRef.current; if (!audio || typeof navigator === "undefined" || !navigator.mediaSession) return;
    const duration = spotifyActive.current ? usePlayer.getState().duration : audio.duration; const position = spotifyActive.current ? usePlayer.getState().progress : audio.currentTime;
    if (Number.isFinite(duration) && duration > 0 && Number.isFinite(position)) { try { navigator.mediaSession.setPositionState({ duration, playbackRate: audio.playbackRate || 1, position: Math.min(Math.max(0, position), duration) }); } catch { /* unsupported */ } }
  };

  const onTime = () => { const audio = audioRef.current; if (!audio || spotifyActive.current) return; seekLock.current = true; setProgress(audio.currentTime, Number.isFinite(audio.duration) ? audio.duration : 30); syncMediaPosition(); window.setTimeout(() => { seekLock.current = false; }, 50); };
  const onMetadata = () => { const audio = audioRef.current; if (!audio || spotifyActive.current) return; if (Number.isFinite(audio.duration) && audio.duration > 0) { setProgress(audio.currentTime, audio.duration); syncMediaPosition(); } };
  const onEnded = () => next();

  const onError = async () => {
    if (!track) return;
    try {
      const fresh = await getTrack({ data: { id: track.id } }); const audio = audioRef.current;
      if (fresh) { const freshUrl = getPlaybackUrl(fresh); if (audio && freshUrl && audio.src !== freshUrl) { audio.src = freshUrl; lastId.current = track.id; if (playing) void audio.play(); return; } }
    } catch { /* fall through */ }
    next();
  };

  return <audio ref={audioRef} preload="auto" playsInline onLoadedMetadata={onMetadata} onDurationChange={onMetadata} onTimeUpdate={onTime} onEnded={onEnded} onError={() => void onError()} onPlay={() => { if (backgroundPlay && !spotifyActive.current) setPlaying(true); if (typeof navigator !== "undefined" && navigator.mediaSession) navigator.mediaSession.playbackState = "playing"; }} onPause={() => { if (typeof navigator !== "undefined" && navigator.mediaSession) navigator.mediaSession.playbackState = "paused"; }} />;
}
