export type PlaybackSource = "deezer-preview" | "authorized-url" | "spotify";

export type Track = {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  duration: number;
  /** Short catalog preview URL. Kept for discovery/fallback playback. */
  previewUrl: string;
  /** Full-track URL supplied by an authorized provider. Never inferred from a catalog URL. */
  playbackUrl?: string;
  playbackSource?: PlaybackSource;
  cover: string;
  coverLg: string;
  explicit: boolean;
};

export type Album = {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  cover: string;
  coverLg: string;
  year?: string;
  trackCount?: number;
};

export type Artist = {
  id: string;
  name: string;
  picture: string;
  pictureLg: string;
  fans?: number;
};

export type PlaylistRef = {
  id: string;
  title: string;
  cover: string;
  coverLg: string;
  creator: string;
  trackCount?: number;
};

export type RadioStation = {
  id: string;
  title: string;
  picture: string;
  pictureLg: string;
};

export type Genre = {
  id: string;
  name: string;
  picture: string;
};

export type UserPlaylist = {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  trackIds: string[];
  tracks: Track[];
};

export type RepeatMode = "off" | "all" | "one";

export type HomeFeed = {
  charts: Track[];
  albums: Album[];
  artists: Artist[];
  playlists: PlaylistRef[];
  radios: RadioStation[];
  genres: Genre[];
  mixes: { id: string; title: string; subtitle: string; tracks: Track[] }[];
};

export type SearchResults = {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  playlists: PlaylistRef[];
};

export type Lyrics = {
  synced: { time: number; text: string }[] | null;
  plain: string | null;
};

export const MOODS = [
  { id: "workout", title: "Workout", query: "workout hits" },
  { id: "relax", title: "Relax", query: "chill acoustic" },
  { id: "focus", title: "Focus", query: "lofi beats" },
  { id: "party", title: "Party", query: "party anthems" },
  { id: "romance", title: "Romance", query: "love songs" },
  { id: "sleep", title: "Sleep", query: "sleep piano ambient" },
  { id: "sad", title: "Sad", query: "sad songs" },
  { id: "energy", title: "Energy", query: "edm bangers" },
  { id: "commute", title: "Commute", query: "pop hits" },
  { id: "feel-good", title: "Feel good", query: "feel good" },
  { id: "throwback", title: "Throwback", query: "2000s hits" },
  { id: "latin", title: "Latin", query: "reggaeton latin" },
] as const;
