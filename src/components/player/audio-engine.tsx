import { useEffect, useRef, useState } from "react";
import { getTrack } from "@/lib/music/api";
import { useLibrary } from "@/lib/music/library-store";
import { usePlayer } from "@/lib/music/player-store";
import { isYouTubeConfigured, playYouTubeVideo, searchYouTubeTrack, youtubeGetDuration, youtubeGetTime, youtubeIsActive, youtubePause, youtubePlay, youtubeSeek, youtubeSetVolume } from "@/lib/music/youtube";

function getPlaybackUrl(track: { playbackUrl?: string; previewUrl: string }): string { return track.playbackUrl || track.previewUrl; }

export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const youtubeRef = useRef<HTMLDivElement>(null);
  const lastId = useRef<string | null>(null);
  const seekLock = useRef(false);
  const wasPlayingBeforeHidden = useRef(false);
  const youtubeActive = useRef(false);
  const youtubeStateSync = useRef(false);
  const [youtubeVisible, setYoutubeVisible] = useState(false);

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
    const ytHost = youtubeRef.current;
    if (!track || !audio || !ytHost) return;
    const load = async () => {
      if (lastId.current === track.id && (audio.src || youtubeActive.current)) return;
      lastId.current = track.id;
      youtubeActive.current = false;
      audio.pause();
      setYoutubeVisible(false);
      if (!incognito) addRecent(track);

      if (isYouTubeConfigured()) {
        try {
          const match = await searchYouTubeTrack(track.title, track.artist);
          if (match) {
            youtubeActive.current = true;
            setYoutubeVisible(true);
            await playYouTubeVideo(ytHost, match.videoId, (state) => {
              const YT = window.YT;
              if (!YT) return;
              youtubeStateSync.current = true;
              if (state === YT.PlayerState.PLAYING) setPlaying(true);
              if (state === YT.PlayerState.PAUSED) setPlaying(false);
              if (state === YT.PlayerState.ENDED) next();
              window.setTimeout(() => { youtubeStateSync.current = false; }, 0);
            });
            youtubeSetVolume(muted ? 0 : volume);
            if (playing) youtubePlay();
            return;
          }
        } catch {
          youtubeActive.current = false;
          setYoutubeVisible(false);
        }
      }

      audio.src = getPlaybackUrl(track);
      audio.load();
      if (playing) { try { await audio.play(); } catch { setPlaying(false); } }
    };
    void load();
  }, [track, addRecent, incognito, playing, setPlaying, next, muted, volume]);

  useEffect(() => {
    if (!track) return;
    if (youtubeActive.current) {
      if (!youtubeStateSync.current) { if (playing) youtubePlay(); else youtubePause(); }
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) void audio.play().catch(() => setPlaying(false)); else audio.pause();
  }, [playing, track, setPlaying]);

  useEffect(() => {
    if (youtubeActive.current) { youtubeSetVolume(muted ? 0 : volume); return; }
    const audio = audioRef.current;
    if (audio) audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    if (youtubeActive.current) { if (!youtubeStateSync.current) youtubeSeek(progress); return; }
    const audio = audioRef.current;
    if (!audio || seekLock.current) return;
    if (Math.abs(audio.currentTime - progress) > 1.2) {
      try { audio.currentTime = Math.min(Math.max(0, progress), Number.isFinite(audio.duration) ? audio.duration : progress); } catch { /* ignore */ }
    }
  }, [progress]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!youtubeActive.current || !youtubeIsActive() || youtubeStateSync.current) return;
      const duration = youtubeGetDuration();
      const position = youtubeGetTime();
      if (duration > 0 && Number.isFinite(position)) {
        youtubeStateSync.current = true;
        setProgress(position, duration);
        window.setTimeout(() => { youtubeStateSync.current = false; }, 0);
      }
    }, 500);
    return () => window.clearInterval(id);
  }, [setProgress]);

  useEffect(() => {
    const onVisibilityChange = () => {
      const audio = audioRef.current;
      if (youtubeActive.current || !audio) return;
      if (document.visibilityState === "hidden") {
        wasPlayingBeforeHidden.current = !audio.paused;
        if (!backgroundPlay) { audio.pause(); setPlaying(false); }
      } else if (backgroundPlay && wasPlayingBeforeHidden.current && playing) void audio.play().catch(() => setPlaying(false));
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
    const updatePositionState = () => {
      const duration = youtubeActive.current ? usePlayer.getState().duration : (audioRef.current?.duration ?? usePlayer.getState().duration);
      const position = youtubeActive.current ? usePlayer.getState().progress : (audioRef.current?.currentTime ?? progress);
      if (Number.isFinite(duration) && duration > 0 && Number.isFinite(position) && position >= 0 && position <= duration) { try { navigator.mediaSession.setPositionState({ duration, playbackRate: 1, position }); } catch { /* unsupported */ } }
    };
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => setPlaying(true)], ["pause", () => setPlaying(false)], ["previoustrack", prev], ["nexttrack", next], ["stop", () => setPlaying(false)],
      ["seekbackward", (details) => seek(Math.max(0, progress - (details.seekOffset || 10)))], ["seekforward", (details) => seek(progress + (details.seekOffset || 10))],
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
      if (e.code === "Space") { e.preventDefault(); toggle(); } else if (e.code === "ArrowRight") seek(usePlayer.getState().progress + 5); else if (e.code === "ArrowLeft") seek(Math.max(0, usePlayer.getState().progress - 5));
      else if (e.key === "n" || e.key === "N") next(); else if (e.key === "p" || e.key === "P") prev(); else if (e.key === "m" || e.key === "M") usePlayer.getState().toggleMute();
      else if (e.key === "s" || e.key === "S") usePlayer.getState().toggleShuffle(); else if (e.key === "r" || e.key === "R") usePlayer.getState().cycleRepeat(); else if (e.key === "f" || e.key === "F") usePlayer.getState().setFullOpen(!usePlayer.getState().fullOpen);
      else if (e.key === "]") usePlayer.getState().setVolume(Math.min(1, usePlayer.getState().volume + 0.05)); else if (e.key === "[") usePlayer.getState().setVolume(Math.max(0, usePlayer.getState().volume - 0.05));
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [toggle, next, prev, seek]);

  const syncMediaPosition = () => {
    if (typeof navigator === "undefined" || !navigator.mediaSession) return;
    const duration = youtubeActive.current ? usePlayer.getState().duration : audioRef.current?.duration;
    const position = youtubeActive.current ? usePlayer.getState().progress : audioRef.current?.currentTime;
    if (Number.isFinite(duration) && duration! > 0 && Number.isFinite(position)) { try { navigator.mediaSession.setPositionState({ duration: duration!, playbackRate: 1, position: Math.min(Math.max(0, position!), duration!) }); } catch { /* unsupported */ } }
  };

  const onTime = () => { const audio = audioRef.current; if (!audio || youtubeActive.current) return; seekLock.current = true; setProgress(audio.currentTime, Number.isFinite(audio.duration) ? audio.duration : 30); syncMediaPosition(); window.setTimeout(() => { seekLock.current = false; }, 50); };
  const onMetadata = () => { const audio = audioRef.current; if (!audio || youtubeActive.current) return; if (Number.isFinite(audio.duration) && audio.duration > 0) { setProgress(audio.currentTime, audio.duration); syncMediaPosition(); } };
  const onEnded = () => next();
  const onError = async () => {
    if (!track) return;
    try {
      const fresh = await getTrack({ data: { id: track.id } }); const current = audioRef.current;
      if (fresh) { const freshUrl = getPlaybackUrl(fresh); if (current && freshUrl && current.src !== freshUrl) { current.src = freshUrl; lastId.current = track.id; if (playing) void current.play(); return; } }
    } catch { /* fall through */ }
    next();
  };

  return (
    <>
      <audio ref={audioRef} preload="auto" playsInline onLoadedMetadata={onMetadata} onDurationChange={onMetadata} onTimeUpdate={onTime} onEnded={onEnded} onError={() => void onError()} onPlay={() => { if (backgroundPlay && !youtubeActive.current) setPlaying(true); if (typeof navigator !== "undefined" && navigator.mediaSession) navigator.mediaSession.playbackState = "playing"; }} onPause={() => { if (typeof navigator !== "undefined" && navigator.mediaSession) navigator.mediaSession.playbackState = "paused"; }} />
      {youtubeVisible && <div ref={youtubeRef} aria-label="YouTube playback" className="fixed bottom-24 right-4 z-40 size-[200px] overflow-hidden rounded-md bg-black shadow-lg" />}
    </>
  );
}
