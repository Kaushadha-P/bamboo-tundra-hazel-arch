import { useEffect, useRef } from "react";
import { getTrack } from "@/lib/music/api";
import { useLibrary } from "@/lib/music/library-store";
import { usePlayer } from "@/lib/music/player-store";

export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastId = useRef<string | null>(null);
  const seekLock = useRef(false);

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
        audio.currentTime = progress;
      } catch {
        /* ignore */
      }
    }
  }, [progress]);

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
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable)
        return;
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
      } else if (e.key === "f" || e.key === "F") {
        usePlayer.getState().setFullOpen(!usePlayer.getState().fullOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, next, prev, seek]);

  const onTime = () => {
    const audio = audioRef.current;
    if (!audio) return;
    seekLock.current = true;
    setProgress(audio.currentTime, Number.isFinite(audio.duration) ? audio.duration : 30);
    if (typeof navigator !== "undefined" && navigator.mediaSession) {
      try {
        const duration = audio.duration;
        if (Number.isFinite(duration) && duration > 0) {
          navigator.mediaSession.setPositionState({
            duration,
            playbackRate: audio.playbackRate || 1,
            position: Math.min(audio.currentTime, duration),
          });
        }
      } catch {
        /* unsupported */
      }
    }
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
