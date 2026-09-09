import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { ErrorState, FeedSkeleton, Page, PageHeader } from "@/components/music/page";
import { TrackRow } from "@/components/music/track-row";
import { Button } from "@/components/ui/button";
import { searchMood } from "@/lib/music/api";
import { usePlayer } from "@/lib/music/player-store";
import { MOODS } from "@/lib/music/types";

export const Route = createFileRoute("/mood/$id")({ component: MoodPage });

function MoodPage() {
  const { id } = Route.useParams();
  const mood = MOODS.find((m) => m.id === id);
  const playTracks = usePlayer((s) => s.playTracks);
  const q = useQuery({
    queryKey: ["mood", mood?.query ?? id],
    enabled: Boolean(mood),
    queryFn: () => searchMood({ data: { query: mood!.query } }),
  });

  if (!mood) return <ErrorState message="That mix isn't available." />;
  if (q.isLoading) return <FeedSkeleton />;
  if (q.isError || !q.data) {
    return <ErrorState message="Couldn't load this mix." onRetry={() => void q.refetch()} />;
  }

  return (
    <Page>
      <PageHeader
        kicker="Mood mix"
        title={mood.title}
        subtitle="A station built from the worldwide catalog."
        actions={
          <Button onClick={() => playTracks(q.data, 0)} disabled={!q.data.length}>
            <Play className="size-4 fill-current" style={{ marginLeft: 1 }} />
            Play mix
          </Button>
        }
      />
      <div>
        {q.data.map((t, i) => (
          <TrackRow key={t.id} track={t} queue={q.data} index={i} numbered />
        ))}
      </div>
    </Page>
  );
}
