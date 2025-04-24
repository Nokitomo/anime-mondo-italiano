
import { AnimeListItem } from "@/services/supabase-service";

export const useAnimeStats = (animeList: AnimeListItem[] | undefined) => {
  if (!animeList) {
    return {
      totalAnime: 0,
      watching: 0,
      completed: 0,
      planned: 0,
      averageScore: 0
    };
  }

  return {
    totalAnime: animeList.length,
    watching: animeList.filter(a => a.status === "IN_CORSO").length,
    completed: animeList.filter(a => a.status === "COMPLETATO").length,
    planned: animeList.filter(a => a.status === "PIANIFICATO").length,
    averageScore: animeList.length > 0 
      ? Math.round(animeList.reduce((acc, curr) => acc + (curr.score || 0), 0) / animeList.length)
      : 0
  };
};
