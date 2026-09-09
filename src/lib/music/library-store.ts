import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "@/lib/utils";
import type { Track, UserPlaylist } from "./types";

type LibraryState = {
  liked: Record<string, Track>;
  recents: Track[];
  downloads: Record<string, Track>;
  playlists: UserPlaylist[];
  like: (track: Track) => void;
  unlike: (id: string) => void;
  toggleLike: (track: Track) => void;
  isLiked: (id: string) => boolean;
  addRecent: (track: Track) => void;
  toggleDownload: (track: Track) => void;
  isDownloaded: (id: string) => boolean;
  createPlaylist: (title: string, tracks?: Track[]) => string;
  renamePlaylist: (id: string, title: string) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (id: string, track: Track) => void;
  removeFromPlaylist: (id: string, trackId: string) => void;
};

export const useLibrary = create<LibraryState>()(
  persist(
    (set, get) => ({
      liked: {},
      recents: [],
      downloads: {},
      playlists: [],
      like: (track) => set({ liked: { ...get().liked, [track.id]: track } }),
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
        const rest = get().recents.filter((t) => t.id !== track.id);
        set({ recents: [track, ...rest].slice(0, 60) });
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
        const pl: UserPlaylist = {
          id,
          title: title.trim() || "New playlist",
          description: "",
          createdAt: Date.now(),
          trackIds: tracks.map((t) => t.id),
          tracks,
        };
        set({ playlists: [pl, ...get().playlists] });
        return id;
      },
      renamePlaylist: (id, title) =>
        set({
          playlists: get().playlists.map((p) =>
            p.id === id ? { ...p, title: title.trim() || p.title } : p,
          ),
        }),
      deletePlaylist: (id) =>
        set({ playlists: get().playlists.filter((p) => p.id !== id) }),
      addToPlaylist: (id, track) =>
        set({
          playlists: get().playlists.map((p) => {
            if (p.id !== id) return p;
            if (p.trackIds.includes(track.id)) return p;
            return {
              ...p,
              trackIds: [...p.trackIds, track.id],
              tracks: [...p.tracks, track],
            };
          }),
        }),
      removeFromPlaylist: (id, trackId) =>
        set({
          playlists: get().playlists.map((p) =>
            p.id === id
              ? {
                  ...p,
                  trackIds: p.trackIds.filter((t) => t !== trackId),
                  tracks: p.tracks.filter((t) => t.id !== trackId),
                }
              : p,
          ),
        }),
    }),
    { name: "pulse-library" },
  ),
);
