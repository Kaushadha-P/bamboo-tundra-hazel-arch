import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { ErrorState, FeedSkeleton, Page } from "@/components/music/page";
import { TrackRow } from "@/components/music/track-row";
import { Button } from "@/components/ui/button";
import { getRadio } from "@/lib/music/api";
import { usePlayer } from "@/lib/music/player-store";

export const Route = createFileRoute("/radio/$id")({ component: RadioPage });

function RadioPage() {
  const { id } = Route.useParams();
  const playTracks = usePlayer((s) => s.playTracks);
  const q = useQuery({
    queryKey: ["radio", id],
    queryFn: () => getRadio({ data: { id } }),
  });

  if (q.isLoading) return <FeedSkeleton />;
  if (q.isError || !q.data) {
    return <ErrorState message="This station couldn't be loaded." onRetry={() => void q.refetch()} />;
  }

  const { radio, tracks } = q.data;

  return (
    <Page>
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end">
        <img
          src={radio.pictureLg || radio.picture}
          alt=""
          className="cover size-40 rounded-full object-cover sm:size-52"
        />
        <div>
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Radio</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {radio.title}
          </h1>
          <p className="mt-2 text-sm text-muted">Endless mix · Premium, no ads</p>
          <Button className="mt-4" onClick={() => playTracks(tracks, 0)} disabled={!tracks.length}>
            <Play className="size-4 fill-current" style={{ marginLeft: 1 }} />
            Play radio
          </Button>
        </div>
      </div>
      <div>
        {tracks.map((t, i) => (
          <TrackRow key={t.id} track={t} queue={tracks} index={i} numbered />
        ))}
      </div>
    </Page>
  );
}
