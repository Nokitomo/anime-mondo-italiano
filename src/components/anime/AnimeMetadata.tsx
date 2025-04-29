
import { Badge } from "@/components/ui/badge";
import { Calendar, FileVideo } from "lucide-react";
import { AnimeMedia, formatLabels } from "@/types/anime";

interface AnimeMetadataProps {
  anime: AnimeMedia;
  nextEpisodeFormatted?: string | null;
}

export const AnimeMetadata = ({ anime, nextEpisodeFormatted }: AnimeMetadataProps) => {
  const formatType = formatLabels[anime.format] || anime.format;
  
  // Formatta l'informazione sul prossimo episodio
  const getNextEpisodeText = () => {
    if (!anime.nextAiringEpisode) return null;
    
    // Converti i secondi in varie unità di tempo
    const { timeUntilAiring, episode } = anime.nextAiringEpisode;
    const months = Math.floor(timeUntilAiring / (86400 * 30));
    const days = Math.floor((timeUntilAiring % (86400 * 30)) / 86400);
    const hours = Math.floor((timeUntilAiring % 86400) / 3600);
    
    let timeText = "";
    let episodeText = "";
    
    // Determina se è un episodio o un film basandosi sul formato dell'anime
    if (anime.format === "MOVIE") {
      episodeText = "il film";
    } else if (episode === 1) {
      episodeText = "l'episodio 1";
    } else {
      episodeText = `l'episodio ${episode}`;
    }
    
    // Crea un testo leggibile per il tempo rimanente
    if (months > 0) {
      timeText += `${months} ${months === 1 ? 'mese' : 'mesi'}`;
      if (days > 0) timeText += ` e ${days} ${days === 1 ? 'giorno' : 'giorni'}`;
    } else if (days > 0) {
      timeText += `${days} ${days === 1 ? 'giorno' : 'giorni'}`;
      if (hours > 0) timeText += ` e ${hours} ${hours === 1 ? 'ora' : 'ore'}`;
    } else {
      timeText += `${hours} ${hours === 1 ? 'ora' : 'ore'}`;
    }
    
    return `${episodeText} va in onda tra ${timeText}`;
  };
  
  const nextEpisodeText = getNextEpisodeText();
  
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="bg-white/10 backdrop-blur-sm">
          {anime.type === "ANIME" ? formatType : "Manga"}
        </Badge>
        {anime.episodes && (
          <Badge variant="outline" className="bg-white/10 backdrop-blur-sm">
            <FileVideo className="w-3 h-3 mr-1" />
            {anime.episodes} episodi
          </Badge>
        )}
        {anime.nextAiringEpisode && anime.status === "RELEASING" && (
          <Badge variant="outline" className="bg-white/10 backdrop-blur-sm">
            <Calendar className="w-3 h-3 mr-1" />
            Ep. {anime.nextAiringEpisode.episode}
          </Badge>
        )}
        {anime.averageScore > 0 && (
          <Badge variant="outline" className="bg-white/10 backdrop-blur-sm">
            ⭐ {anime.averageScore}%
          </Badge>
        )}
      </div>
      
      {nextEpisodeText && (
        <div className="text-sm py-1 px-2 bg-anime-primary/20 inline-block rounded-md">
          {nextEpisodeText}
        </div>
      )}
    </div>
  );
};
