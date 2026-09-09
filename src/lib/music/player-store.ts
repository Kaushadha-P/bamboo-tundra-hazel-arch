import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RepeatMode, Track } from "./types";

type PlayerState = {
  queue: Track[];
  index: number;
  playing: boolean;
  progress: number;
  duration: number;
  volume: number;
  muted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  fullOpen: boolean;
  queueOpen: boolean;
  lyricsTab: "upnext" | "lyrics";
  sleepUntil: number | null;
  crossfade: number;
  backgroundPlay: boolean;
  highQuality: boolean;
  incognito: boolean;
  hydrated: boolean;
  current: () => Track | null;
  playTracks: (tracks: Track[], start?: number) => void;
  playTrack: (track: Track, extras?: Track[]) => void;
  toggle: () => void;
  setPlaying: (v: boolean) => void;
  next: () => void;
  prev: () => void;
  seek: (t: number) => void;
  setProgress: (t: number, duration?: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  addToQueue: (track: Track) => void;
  playNext: (track: Track) => void;
  removeFromQueue: (i: number) => void;
  setFullOpen: (v: boolean) => void;
  setQueueOpen: (v: boolean) => void;
  setLyricsTab: (v: "upnext" | "lyrics") => void;
  setSleep: (minutes: number | null) => void;
  setCrossfade: (s: number) => void;
  setBackgroundPlay: (v: boolean) => void;
  setHighQuality: (v: boolean) => void;
  setIncognito: (v: boolean) => void;
  clearQueue: () => void;
  jumpTo: (i: number) => void;
};

function shuffleAround(list: Track[], start: number): Track[] {
  if (list.length < 2) return list;
  const current = list[start]!;
  const rest = list.filter((_, i) => i !== start);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j]!, rest[i]!];
  }
  return [current, ...rest];
}

export const usePlayer = create<PlayerState>()(
  persist(
    (set, get) => ({
      queue: [],
      index: 0,
      playing: false,
      progress: 0,
      duration: 0,
      volume: 0.85,
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
          progress: 0,
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
          set({ progress: 0, playing: true });
          return;
        }
        if (index + 1 < queue.length) {
          set({ index: index + 1, progress: 0, playing: true });
          return;
        }
        if (repeat === "all") {
          set({ index: 0, progress: 0, playing: true });
          return;
        }
        set({ playing: false, progress: 0 });
      },
      prev: () => {
        const { index, progress } = get();
        if (progress > 3 && index >= 0) {
          set({ progress: 0 });
          return;
        }
        set({ index: Math.max(0, index - 1), progress: 0, playing: true });
      },
      seek: (t) => set({ progress: Math.max(0, t) }),
      setProgress: (t, duration) =>
        set(duration !== undefined ? { progress: t, duration } : { progress: t }),
      setVolume: (v) => set({ volume: Math.min(1, Math.max(0, v)), muted: v === 0 }),
      toggleMute: () => set({ muted: !get().muted }),
      toggleShuffle: () => {
        const { shuffle, queue, index } = get();
        if (!shuffle && queue.length) {
          set({ shuffle: true, queue: shuffleAround(queue, index), index: 0 });
        } else {
          set({ shuffle: false });
        }
      },
      cycleRepeat: () => {
        const order: RepeatMode[] = ["off", "all", "one"];
        const i = order.indexOf(get().repeat);
        set({ repeat: order[(i + 1) % order.length]! });
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
        set({ queue: next, index: next.length ? nextIndex : 0, playing: next.length ? get().playing : false });
      },
      setFullOpen: (v) => set({ fullOpen: v }),
      setQueueOpen: (v) => set({ queueOpen: v }),
      setLyricsTab: (v) => set({ lyricsTab: v }),
      setSleep: (minutes) =>
        set({ sleepUntil: minutes == null ? null : Date.now() + minutes * 60_000 }),
      setCrossfade: (s) => set({ crossfade: Math.max(0, Math.min(12, s)) }),
      setBackgroundPlay: (v) => set({ backgroundPlay: v }),
      setHighQuality: (v) => set({ highQuality: v }),
      setIncognito: (v) => set({ incognito: v }),
      clearQueue: () => set({ queue: [], index: 0, playing: false, progress: 0 }),
      jumpTo: (i) => set({ index: i, progress: 0, playing: true }),
    }),
    {
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
        incognito: s.incognito,
      }),
      onRehydrateStorage: () => () => {
        usePlayer.setState({ playing: false, hydrated: true, fullOpen: false });
      },
    },
  ),
);
