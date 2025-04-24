
import { StatsCard } from "./StatsCard";
import { useAnimeStats } from "@/hooks/useAnimeStats";
import { AnimeListItem } from "@/services/supabase-service";

interface ProfileStatsProps {
  animeList: AnimeListItem[] | undefined;
}

export const ProfileStats = ({ animeList }: ProfileStatsProps) => {
  const stats = useAnimeStats(animeList);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard title="Totale Anime" value={stats.totalAnime} />
      <StatsCard title="In Corso" value={stats.watching} />
      <StatsCard title="Completati" value={stats.completed} />
      <StatsCard title="Da Vedere" value={stats.planned} />
      <StatsCard title="Voto Medio" value={`${stats.averageScore}/10`} />
    </div>
  );
};
