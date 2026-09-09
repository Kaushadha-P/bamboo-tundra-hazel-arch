import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Compass,
  Download,
  Heart,
  Home,
  Library,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { AudioEngine } from "@/components/player/audio-engine";
import { NowPlaying } from "@/components/player/now-playing";
import { PlayerBar } from "@/components/player/player-bar";
import { QueuePanel } from "@/components/player/queue-panel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLibrary } from "@/lib/music/library-store";
import { usePlayer } from "@/lib/music/player-store";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 px-3 py-3">
      <span className="inline-flex size-8 items-center justify-center rounded-sm bg-accent">
        <svg viewBox="0 0 24 24" className="size-4 fill-accent-fg" aria-hidden>
          <path d="M8 5.5v13l11-6.5L8 5.5z" />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">Pulse</span>
    </Link>
  );
}

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/library", label: "Library", icon: Library },
  { to: "/premium", label: "Premium", icon: Sparkles },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hasTrack = usePlayer((s) => s.queue.length > 0);
  const playlists = useLibrary((s) => s.playlists);
  const createPlaylist = useLibrary((s) => s.createPlaylist);
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const finish = () => usePlayer.setState({ hydrated: true, playing: false, fullOpen: false });
    const unsub = usePlayer.persist.onFinishHydration(finish);
    if (usePlayer.persist.hasHydrated()) finish();
    return unsub;
  }, []);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    void navigate({ to: "/search", search: { q: q.trim() } });
  };

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <AudioEngine />
      <aside className="fixed top-0 bottom-0 left-0 z-30 hidden w-rail flex-col border-r border-border bg-bg md:flex">
        <Logo />
        <nav className="flex flex-col gap-1 px-2">
          {NAV.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium",
                  active ? "bg-chip text-fg" : "text-muted hover:bg-elevated hover:text-fg",
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 px-3">
          <Button
            variant="chip"
            size="sm"
            className="w-full justify-start"
            onClick={() => setNewOpen(true)}
          >
            <Plus className="size-4" /> New playlist
          </Button>
        </div>
        <div className="mt-4 flex-1 space-y-1 overflow-auto px-2 pb-bar">
          <Link
            to="/library"
            className="flex h-9 items-center gap-3 rounded-md px-3 text-sm text-muted hover:bg-elevated hover:text-fg"
          >
            <Heart className="size-4" /> Liked music
          </Link>
          <Link
            to="/library"
            className="flex h-9 items-center gap-3 rounded-md px-3 text-sm text-muted hover:bg-elevated hover:text-fg"
          >
            <Download className="size-4" /> Downloads
          </Link>
          {playlists.map((p) => (
            <Link
              key={p.id}
              to="/playlist/$id"
              params={{ id: p.id }}
              className="flex h-9 items-center rounded-md px-3 text-sm text-muted hover:bg-elevated hover:text-fg"
            >
              <span className="truncate">{p.title}</span>
            </Link>
          ))}
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-bg/90 px-3 backdrop-blur-sm md:ml-rail md:px-8">
        <div className="md:hidden">
          <Logo />
        </div>
        <form onSubmit={onSearch} className="mx-auto w-full max-w-xl">
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search songs, albums, artists, playlists"
              className="h-10 w-full rounded-full bg-chip pr-4 pl-10 text-sm text-fg placeholder:text-subtle outline-none ring-1 ring-inset ring-transparent focus:ring-ring"
            />
          </label>
        </form>
      </header>

      <main
        className={cn(
          "md:ml-rail",
          hasTrack ? "pb-36 md:pb-bar" : "pb-nav md:pb-8",
        )}
      >
        {children}
      </main>

      <nav className="fixed right-0 bottom-0 left-0 z-30 flex h-nav items-stretch border-t border-border bg-bg md:hidden">
        {NAV.map((item) => {
          const active =
            item.to === "/"
              ? pathname === "/"
              : pathname === item.to || pathname.startsWith(`${item.to}/`);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
                active ? "text-fg" : "text-muted",
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <PlayerBar />
      <QueuePanel />
      <NowPlaying />

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent title="New playlist">
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              const id = createPlaylist(title || "New playlist");
              setTitle("");
              setNewOpen(false);
              void navigate({ to: "/playlist/$id", params: { id } });
            }}
          >
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Playlist title"
              autoFocus
            />
            <Button type="submit" className="w-full">
              Create
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
