import { useEffect, useRef } from "react";
import { getTrack } from "@/lib/music/api";
import { useLibrary } from "@/lib/music/library-store";
import { usePlayer } from "@/lib/music/player-store";

export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastId = useRef<string | null>(null);
  const seekLock = useRef(false);
  const wasPlayingBeforeHidden = useRef(false);

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
      if (lastId.current === track.id && audio.src) return;
      lastId.current = track.id;
      audio.src = track.previewUrl;
      audio.load();
      if (!incognito) addRecent(track);
      if (playing) {
        try {
          await audio.play();
        } catch {
          setPlaying(false);
        }
      }
    };
    void load();
  }, [track, addRecent, incognito, playing, setPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!track) {
      audio.pause();
      return;
    }
    if (playing) {
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing, track, setPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || seekLock.current) return;
    if (Math.abs(audio.currentTime - progress) > 1.2) {
      try {
        audio.currentTime = Math.min(Math.max(0, progress), Number.isFinite(audio.duration) ? audio.duration : progress);
      } catch {
        /* ignore */
      }
    }
  }, [progress]);

  // Respect the user's background-play setting. When enabled, the native audio
  // element continues playing while the page is hidden; supported browsers can
  // keep Media Session controls active on the lock screen/headset controls.
  useEffect(() => {
    const onVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.visibilityState === "hidden") {
        wasPlayingBeforeHidden.current = !audio.paused;
        if (!backgroundPlay) {
          audio.pause();
          setPlaying(false);
        }
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

  // Keep the browser/OS media session in sync so supported mobile browsers can
  // expose lock-screen, headset and notification controls for the active track.
  useEffect(() => {
    if (!track || typeof navigator === "undefined" || !navigator.mediaSession) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album,
      artwork: [
        { src: track.cover, sizes: "250x250", type: "image/jpeg" },
        { src: track.coverLg || track.cover, sizes: "512x512", type: "image/jpeg" },
      ].filter((item) => Boolean(item.src)),
    });
    navigator.mediaSession.playbackState = playing ? "playing" : "paused";

    const audio = audioRef.current;
    const updatePositionState = () => {
      const duration = audio?.duration ?? 0;
      const position = audio?.currentTime ?? progress;
      if (
        Number.isFinite(duration) &&
        duration > 0 &&
        Number.isFinite(position) &&
        position >= 0 &&
        position <= duration
      ) {
        try {
          navigator.mediaSession.setPositionState({
            duration,
            playbackRate: audio?.playbackRate || 1,
            position,
          });
        } catch {
          /* unsupported by this browser */
        }
      }
    };

    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => setPlaying(true)],
      ["pause", () => setPlaying(false)],
      ["previoustrack", prev],
      ["nexttrack", next],
      ["stop", () => setPlaying(false)],
      ["seekbackward", (details) => seek(Math.max(0, progress - (details.seekOffset || 10)))],
      ["seekforward", (details) => seek(progress + (details.seekOffset || 10))],
      ["seekto", (details) => {
        if (details.seekTime != null) seek(details.seekTime);
      }],
    ];

    for (const [action, fn] of handlers) {
      try {
        navigator.mediaSession.setActionHandler(action, fn);
      } catch {
        /* unsupported */
      }
    }

    updatePositionState();
    return () => {
      for (const [action] of handlers) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          /* ignore */
        }
      }
    };
  }, [track, playing, progress, next, prev, setPlaying, seek]);

  useEffect(() => {
    document.title = track ? `${track.title} · ${track.artist}` : "Pulse";
  }, [track]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;

      if (e.code === "Space") {
        e.preventDefault();
        toggle();
      } else if (e.code === "ArrowRight") {
        seek(usePlayer.getState().progress + 5);
      } else if (e.code === "ArrowLeft") {
        seek(Math.max(0, usePlayer.getState().progress - 5));
      } else if (e.key === "n" || e.key === "N") {
        next();
      } else if (e.key === "p" || e.key === "P") {
        prev();
      } else if (e.key === "m" || e.key === "M") {
        usePlayer.getState().toggleMute();
      } else if (e.key === "s" || e.key === "S") {
        usePlayer.getState().toggleShuffle();
      } else if (e.key === "r" || e.key === "R") {
        usePlayer.getState().cycleRepeat();
      } else if (e.key === "f" || e.key === "F") {
        usePlayer.getState().setFullOpen(!usePlayer.getState().fullOpen);
      } else if (e.key === "]") {
        usePlayer.getState().setVolume(Math.min(1, usePlayer.getState().volume + 0.05));
      } else if (e.key === "[") {
        usePlayer.getState().setVolume(Math.max(0, usePlayer.getState().volume - 0.05));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, next, prev, seek]);

  const syncMediaPosition = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const duration = audio.duration;
    const position = audio.currentTime;
    if (
      typeof navigator !== "undefined" &&
      navigator.mediaSession &&
      Number.isFinite(duration) &&
      duration > 0 &&
      Number.isFinite(position)
    ) {
      try {
        navigator.mediaSession.setPositionState({
          duration,
          playbackRate: audio.playbackRate || 1,
          position: Math.min(Math.max(0, position), duration),
        });
      } catch {
        /* unsupported */
      }
    }
  };

  const onTime = () => {
    const audio = audioRef.current;
    if (!audio) return;
    seekLock.current = true;
    setProgress(audio.currentTime, Number.isFinite(audio.duration) ? audio.duration : 30);
    syncMediaPosition();
    window.setTimeout(() => {
      seekLock.current = false;
    }, 50);
  };

  const onMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      setProgress(audio.currentTime, audio.duration);
      syncMediaPosition();
    }
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
        if (playing) void audio.play();
        return;
      }
    } catch {
      /* fall through */
    }
    next();
  };

  return (
    <audio
      ref={audioRef}
      preload="auto"
      playsInline
      onLoadedMetadata={onMetadata}
      onDurationChange={onMetadata}
      onTimeUpdate={onTime}
      onEnded={onEnded}
      onError={() => void onError()}
      onPlay={() => {
        if (backgroundPlay) setPlaying(true);
        if (typeof navigator !== "undefined" && navigator.mediaSession) {
          navigator.mediaSession.playbackState = "playing";
        }
      }}
      onPause={() => {
        if (typeof navigator !== "undefined" && navigator.mediaSession) {
          navigator.mediaSession.playbackState = "paused";
        }
      }}
    />
  );
}
