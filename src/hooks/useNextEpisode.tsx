
import { useState, useEffect } from 'react';
import { AnimeMedia } from "@/types/anime";

export function useNextEpisode(anime: AnimeMedia) {
  const [nextEpisodeFormatted, setNextEpisodeFormatted] = useState<string | null>(null);
  
  useEffect(() => {
    if (anime.nextAiringEpisode) {
      const { timeUntilAiring, episode } = anime.nextAiringEpisode;
      
      // Converti i secondi in giorni e ore
      const days = Math.floor(timeUntilAiring / 86400);
      const hours = Math.floor((timeUntilAiring % 86400) / 3600);
      
      let timeText = "";
      if (days > 0) {
        timeText += `${days} ${days === 1 ? 'giorno' : 'giorni'}`;
      }
      
      if (hours > 0 || days === 0) {
        if (days > 0) timeText += ' e ';
        timeText += `${hours} ${hours === 1 ? 'ora' : 'ore'}`;
      }
      
      setNextEpisodeFormatted(`L'episodio ${episode} va in onda tra ${timeText}`);
    } else {
      setNextEpisodeFormatted(null);
    }
  }, [anime.nextAiringEpisode]);

  return nextEpisodeFormatted;
}
